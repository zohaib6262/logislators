import express from "express";
import mongoose from "mongoose";
import School from "../models/School.js";
import ZipCentroid from "../models/ZipCentroid.js";

const router = express.Router();
const MILES_TO_METERS = 1609.344;

// Quick check that this router is mounted (GET /api/userSchoolFinder)
router.get("/", (req, res) => res.json({ ok: true, route: "userSchoolFinder" }));
router.get("/health", (req, res) => res.json({ ok: true }));

function parseGradeToNumber(grade) {
  if (!grade || typeof grade !== "string") return null;
  const g = grade.trim();
  if (g.toUpperCase() === "K") return 0;
  const n = parseInt(g, 10);
  return Number.isNaN(n) ? null : n;
}

/**
 * GET /api/userSchoolFinder/search
 * Query: zipCode (required), radiusMiles (required), grade (optional), schoolType (optional), maxCost (optional)
 * No third-party APIs; origin from ZipCentroids. 2dsphere geo, nearest first.
 */
router.get("/search", async (req, res) => {
  try {
    const zipCodeRaw = (req.query.zipCode ?? req.query.zipcode ?? "").toString().trim();
    const zipCode = zipCodeRaw.replace(/\s+/g, "");
    if (!zipCode) {
      return res.status(400).json({ message: "ZIP Code is required for school search." });
    }

    const centroid = await ZipCentroid.findOne({
      $or: [
        { zip: zipCode },
        { zipCode: zipCode },
        { zip: zipCode.padStart(5, "0") },
        { zipCode: zipCode.padStart(5, "0") },
      ],
    });
    if (!centroid || !centroid.location || !centroid.location.coordinates) {
      return res.status(400).json({
        message:
          "This ZIP code is not in our database yet. Add it via Admin → School Finder Feeds → Zip Centroids, or run: npm run seed:zips",
      });
    }

    const radiusMilesRaw = Number(req.query.radiusMiles);
    const radiusMiles = Number.isNaN(radiusMilesRaw) || radiusMilesRaw <= 0
      ? 10
      : Math.min(100, radiusMilesRaw);
    const maxDistanceMeters = radiusMiles * MILES_TO_METERS;

    const grade = (req.query.grade || "").toString().trim();
    const schoolType = (req.query.schoolType || "").toString().trim().toLowerCase();
    const maxCost = req.query.maxCost != null && req.query.maxCost !== ""
      ? Number(req.query.maxCost)
      : null;

    // Pagination params
    const pageRaw = Number(req.query.page) || 1;
    const page = pageRaw < 1 ? 1 : pageRaw;
    const pageSizeRaw = Number(req.query.pageSize) || 7;
    const pageSize = Math.max(1, Math.min(50, pageSizeRaw));
    const skip = (page - 1) * pageSize;

    const matchStage = {};
    if (schoolType && ["public", "private", "charter", "homeschool", "other"].includes(schoolType)) {
      matchStage.schoolType = schoolType;
    }
    const gradeNum = parseGradeToNumber(grade);
    if (gradeNum != null) {
      matchStage.gradesMin = { $lte: gradeNum };
      matchStage.gradesMax = { $gte: gradeNum };
    }
    if (maxCost != null && !Number.isNaN(maxCost)) {
      matchStage.$or = [
        { costValue: { $lte: maxCost } },
        { costValue: null },
        { costValue: { $exists: false } },
      ];
    }

    const geoNear = {
      near: {
        type: "Point",
        coordinates: centroid.location.coordinates,
      },
      distanceField: "distanceMeters",
      maxDistance: maxDistanceMeters,
      spherical: true,
      ...(Object.keys(matchStage).length ? { query: matchStage } : {}),
    };

    const pipeline = [
      { $geoNear: geoNear },
      {
        $addFields: {
          distanceMiles: { $divide: ["$distanceMeters", MILES_TO_METERS] },
        },
      },
      {
        $facet: {
          results: [
            { $sort: { distanceMeters: 1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                schoolName: 1,
                address: 1,
                city: 1,
                state: 1,
                zip: 1,
                website: 1,
                phone: 1,
                enrollment: 1,
                averageClassSize: 1,
                gradesMin: 1,
                gradesMax: 1,
                gradesServed: 1,
                costValue: 1,
                costText: 1,
                schoolHighlights: 1,
                shortDescription: 1,
                logoUrl: 1,
                videoUrl: 1,
                schoolType: 1,
                distanceMiles: 1,
              },
            },
          ],
          total: [
            { $count: "count" },
          ],
        },
      },
    ];

    const aggResult = await School.aggregate(pipeline);
    const agg = aggResult[0] || { results: [], total: [] };
    const schools = agg.results || [];
    const totalCount = Array.isArray(agg.total) && agg.total[0]?.count ? agg.total[0].count : 0;
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

    res.json({
      schools,
      totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (err) {
    console.error("userSchoolFinder search error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/userSchoolFinder/schools/:id
 * Public: fetch a single school by Mongo _id for the detail page.
 */
router.get("/schools/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid school ID." });
    }
    const school = await School.findById(id)
      .select(
        "schoolName address city state zip website phone enrollment averageClassSize gradesMin gradesMax gradesServed costValue costText schoolHighlights shortDescription logoUrl videoUrl schoolType location"
      )
      .lean();
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }
    res.json(school);
  } catch (err) {
    console.error("userSchoolFinder school by id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
