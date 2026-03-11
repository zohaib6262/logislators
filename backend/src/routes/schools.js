import express from "express";
import School from "../models/School.js";
import ZipCentroid from "../models/ZipCentroid.js";

const router = express.Router();

const MILES_TO_METERS = 1609.34;

/**
 * GET /api/schools/search
 * Query: zipCode (required), radiusMiles, grade, schoolType, maxCost
 * Uses ZipCentroids for origin (no third-party APIs). 2dsphere radius, sorted by nearest.
 */
router.get("/search", async (req, res) => {
  try {
    const zipCode = (req.query.zipCode || "").toString().trim();
    if (!zipCode) {
      return res.status(400).json({ message: "ZIP Code is required for school search." });
    }

    const centroid = await ZipCentroid.findOne({ zipCode });
    if (!centroid) {
      return res.status(400).json({ message: "Zip not supported yet." });
    }

    const radiusMiles = Math.min(100, Math.max(0, Number(req.query.radiusMiles) || 10));
    const maxDistanceMeters = radiusMiles * MILES_TO_METERS;
    const grade = (req.query.grade || "").toString().trim();
    const schoolType = (req.query.schoolType || "").toString().trim().toLowerCase();
    const maxCost = req.query.maxCost != null && req.query.maxCost !== "" ? Number(req.query.maxCost) : null;

    const matchStage = {};
    if (schoolType && ["public", "private", "charter", "homeschool", "other"].includes(schoolType)) {
      matchStage.schoolType = schoolType;
    }
    if (grade) {
      matchStage.gradesServed = { $in: [grade] };
    }
    if (maxCost != null && !Number.isNaN(maxCost)) {
      matchStage.$or = [
        { cost: { $lte: maxCost } },
        { cost: null },
        { cost: { $exists: false } },
      ];
    }

    const geoNear = {
      near: {
        type: "Point",
        coordinates: [centroid.lng, centroid.lat],
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
      { $sort: { distanceMeters: 1 } },
      {
        $project: {
          schoolName: 1,
          address: 1,
          website: 1,
          phone: 1,
          enrollment: 1,
          averageClassSize: 1,
          gradesServed: 1,
          cost: 1,
          schoolHighlights: 1,
          shortDescription: 1,
          logo: 1,
          video: 1,
          distanceMiles: 1,
          distanceMeters: 1,
        },
      },
    ];

    const schools = await School.aggregate(pipeline);

    const cleaned = schools.map((s) => {
      const out = { ...s };
      delete out.distanceMeters;
      return out;
    });

    res.json({ schools: cleaned });
  } catch (err) {
    console.error("Schools search error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
