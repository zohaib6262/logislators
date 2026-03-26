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
    const DEBUG =
      process.env.DEBUG_SCHOOL_FINDER === "1" ||
      process.env.DEBUG_SCHOOL_FINDER === "true";

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

    const [searchLng, searchLat] = centroid.location.coordinates;
    const searchCenter =
      typeof searchLat === "number" &&
      typeof searchLng === "number" &&
      !Number.isNaN(searchLat) &&
      !Number.isNaN(searchLng) &&
      searchLat >= -90 &&
      searchLat <= 90 &&
      searchLng >= -180 &&
      searchLng <= 180
        ? { lat: searchLat, lng: searchLng }
        : null;

    const radiusMilesRaw = Number(req.query.radiusMiles);
    const radiusMiles = Number.isNaN(radiusMilesRaw) || radiusMilesRaw <= 0
      ? 10
      : Math.min(100, radiusMilesRaw);
    const maxDistanceMeters = radiusMiles * MILES_TO_METERS;

    const grade = (req.query.grade || "").toString().trim();
    const schoolTypeRaw = (req.query.schoolType ?? req.query.schooltype ?? "").toString();
    const schoolType = schoolTypeRaw.trim().toLowerCase();
    const maxCostRaw = (req.query.maxCost ?? req.query.maxcost ?? "").toString().trim();
    const maxCost =
      maxCostRaw !== "" && !Number.isNaN(Number(maxCostRaw)) ? Number(maxCostRaw) : null;

    if (DEBUG) {
      console.log("[userSchoolFinder/search] incoming query:", req.query);
      console.log("[userSchoolFinder/search] normalized:", {
        zipCode,
        radiusMiles,
        grade,
        parsedGrade: parseGradeToNumber(grade),
        schoolTypeRaw,
        schoolTypeApplied: !!(schoolType && ["public", "private", "charter", "homeschool", "other"].includes(schoolType)),
        maxCostRaw,
        maxCostApplied: maxCost,
      });
    }

    // Pagination params
    const pageRaw = Number(req.query.page) || 1;
    const page = pageRaw < 1 ? 1 : pageRaw;
    const pageSizeRaw = Number(req.query.pageSize) || 7;
    const pageSize = Math.max(1, Math.min(50, pageSizeRaw));
    const skip = (page - 1) * pageSize;

    const matchStage = {};
    const allowedSchoolTypes = ["public", "private", "charter", "homeschool", "other"];
    const applySchoolType = !!(schoolType && allowedSchoolTypes.includes(schoolType));
    if (applySchoolType) matchStage.schoolType = schoolType;

    const gradeNum = parseGradeToNumber(grade);

    // Grade filtering:
    // Historically this route used `gradesMin`/`gradesMax`. Some imports only populate
    // `gradesServed` with values like "11-12", "K-5", "K-12", etc.
    // We now filter using a robust match that checks whether the selected grade
    // falls within any served range, with normalization (K => 0, trim, uppercase,
    // support hyphen ranges and comma-separated/mixed values).
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

    const gradeMatchStage =
      gradeNum != null
        ? {
            // NOTE: Uses MongoDB $function for robust grade range matching against `gradesServed`.
            // Expected examples (selected -> matches if served contains):
            // - 12 -> "11-12", "9-12", "K-12"
            // - 11 -> "11-12", "9-12", "K-12"
            // - 5  -> "3-5", "K-5", "K-12"
            // - K  -> "K", "K-5", "K-12"
            $match: {
              $expr: {
                $function: {
                  lang: "js",
                  args: [
                    gradeNum,
                    { $ifNull: ["$gradesMin", null] },
                    { $ifNull: ["$gradesMax", null] },
                    { $ifNull: ["$gradesServed", []] },
                  ],
                  body: `
                    function normalizeGradeToken(t) {
                      if (t === null || t === undefined) return null;
                      const raw = String(t).trim().toUpperCase();
                      if (!raw) return null;
                      if (raw === "K") return 0;
                      const n = parseInt(raw, 10);
                      return Number.isNaN(n) ? null : n;
                    }

                    function parseRangeToken(token) {
                      if (!token) return null;
                      const s = String(token).trim().toUpperCase().replace(/\\s+/g, "");
                      if (!s) return null;

                      if (s.includes("-")) {
                        const parts = s.split("-").map(x => x.trim()).filter(Boolean);
                        if (parts.length < 2) return null;
                        const a = normalizeGradeToken(parts[0]);
                        const b = normalizeGradeToken(parts[1]);
                        if (a === null || b === null) return null;
                        const lo = Math.min(a, b);
                        const hi = Math.max(a, b);
                        return { lo, hi };
                      }

                      const g = normalizeGradeToken(s);
                      if (g === null) return null;
                      return { lo: g, hi: g };
                    }

                    function selectedInServedRanges(selectedGrade, servedArrOrStr) {
                      // Some data can be stored inconsistently:
                      // - Array: ["11-12", "K-5"]
                      // - String: "11-12, K-5"
                      // - Single token: "K-11"
                      // We'll normalize everything into an array of entries.
                      if (servedArrOrStr === null || servedArrOrStr === undefined) return false;
                      const servedAsArray = Array.isArray(servedArrOrStr) ? servedArrOrStr : [servedArrOrStr];
                      for (const entry of servedAsArray) {
                        if (entry === null || entry === undefined) continue;
                        const entryStr = String(entry);
                        // Support comma-separated/mixed values if they exist inside a single array element.
                        const parts = entryStr.split(/[,;|]/).map(x => x.trim()).filter(Boolean);
                        for (const part of parts) {
                          const r = parseRangeToken(part);
                          if (!r) continue;
                          if (selectedGrade >= r.lo && selectedGrade <= r.hi) return true;
                        }
                      }
                      return false;
                    }

                    const selected = Number(arguments[0]);
                    const docMin = normalizeGradeToken(arguments[1]);
                    const docMax = normalizeGradeToken(arguments[2]);
                    const servedArr = arguments[3];

                    if (docMin !== null && docMax !== null) {
                      const lo = Math.min(docMin, docMax);
                      const hi = Math.max(docMin, docMax);
                      if (selected >= lo && selected <= hi) return true;
                    }

                    return selectedInServedRanges(selected, servedArr);
                  `,
                },
              },
            },
          }
        : null;

    // Debug counts (geo -> grade -> schoolType -> maxCost) without changing the real result pipeline.
    // Runs only when DEBUG_SCHOOL_FINDER=1 to avoid overhead.
    if (DEBUG) {
      const geoNearOnly = {
        near: geoNear.near,
        distanceField: geoNear.distanceField,
        maxDistance: geoNear.maxDistance,
        spherical: geoNear.spherical,
      };

      const buildCountPipeline = (queryForGeoNear) => {
        const geoStage = { ...geoNearOnly };
        if (queryForGeoNear && Object.keys(queryForGeoNear).length) {
          geoStage.query = queryForGeoNear;
        }
        const stages = [{ $geoNear: geoStage }];
        if (gradeMatchStage) stages.push(gradeMatchStage);
        stages.push({ $count: "count" });
        return stages;
      };

      // Counts are approximate but match the same logical order as the main pipeline.
      // afterGeo: distance only (no grade/schoolType/maxCost).
      const afterGeo = await School.aggregate([{ $geoNear: geoNearOnly }, { $count: "count" }]);
      // afterGrade: distance + grade (if selected).
      const afterGrade = await School.aggregate(buildCountPipeline({}));

      const afterSchoolType = await School.aggregate(buildCountPipeline(applySchoolType ? { schoolType } : {}));
      const afterMaxCost = await School.aggregate(buildCountPipeline(Object.keys(matchStage).length ? matchStage : {}));

      const countAfterGeo = afterGeo[0]?.count ?? 0;
      const countAfterGrade = afterGrade[0]?.count ?? 0;
      const countAfterSchoolType = afterSchoolType[0]?.count ?? 0;
      const countAfterMaxCost = afterMaxCost[0]?.count ?? 0;

      console.log("[userSchoolFinder/search][debug] counts:", {
        afterGeo: countAfterGeo,
        afterGrade: countAfterGrade,
        afterSchoolType: countAfterSchoolType,
        afterMaxCost: countAfterMaxCost,
      });
    }

    const pipeline = [
      { $geoNear: geoNear },
      {
        $addFields: {
          distanceMiles: { $divide: ["$distanceMeters", MILES_TO_METERS] },
        },
      },
      ...(gradeMatchStage ? [gradeMatchStage] : []),
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
                location: 1,
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
          total: [{ $count: "count" }],
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
      ...(searchCenter ? { searchCenter } : {}),
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
