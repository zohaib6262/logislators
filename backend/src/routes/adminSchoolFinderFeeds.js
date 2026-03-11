import express from "express";
import School from "../models/School.js";
import ZipCentroid from "../models/ZipCentroid.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const SCHOOL_TYPE_ENUM = ["public", "private", "charter", "homeschool", "other"];

function buildLocation(lat, lng, locationBody) {
  if (locationBody && locationBody.type === "Point" && Array.isArray(locationBody.coordinates)) {
    const [lngVal, latVal] = locationBody.coordinates;
    if (typeof latVal !== "number" || typeof lngVal !== "number") return null;
    if (latVal < -90 || latVal > 90 || lngVal < -180 || lngVal > 180) return null;
    return { type: "Point", coordinates: [lngVal, latVal] };
  }
  if (lat != null && lng != null) {
    const la = Number(lat);
    const ln = Number(lng);
    if (Number.isNaN(la) || Number.isNaN(ln)) return null;
    if (la < -90 || la > 90 || ln < -180 || ln > 180) return null;
    return { type: "Point", coordinates: [ln, la] };
  }
  return null;
}

function toNum(v) {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function toStr(v) {
  if (v == null) return undefined;
  return typeof v === "string" ? v.trim() || undefined : String(v);
}

function toStrArray(v) {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.map((x) => (x != null ? String(x).trim() : "")).filter(Boolean);
  return undefined;
}

/** Build address string from body (fullAddress, or address, or street + city + state + zip). */
function buildAddressString(body) {
  const full = toStr(body.fullAddress);
  if (full) return full;
  const addr = toStr(body.address) || toStr(body.street);
  const city = toStr(body.city);
  const state = toStr(body.state);
  const zip = toStr(body.zip);
  const parts = [addr, city, state, zip].filter(Boolean);
  return parts.length ? parts.join(", ") : addr;
}

/**
 * Build full school document for POST. Validates location, schoolType, numerics.
 */
function buildSchoolDoc(body) {
  const lat = body.lat ?? body.latitude;
  const lng = body.lng ?? body.longitude ?? body.lng;
  const location = buildLocation(lat, lng, body.location);
  if (!location) {
    throw new Error("Valid location required: provide lat/lng (lat in [-90,90], lng in [-180,180]) or GeoJSON Point.");
  }
  const schoolType = toStr(body.schoolType);
  if (schoolType && !SCHOOL_TYPE_ENUM.includes(schoolType.toLowerCase())) {
    throw new Error(`schoolType must be one of: ${SCHOOL_TYPE_ENUM.join(", ")}`);
  }
  const addressStr = buildAddressString(body);
  const ncessch = toStr(body.ncessch);
  const doc = {
    schoolName: toStr(body.schoolName),
    address: addressStr,
    city: toStr(body.city),
    state: toStr(body.state),
    zip: toStr(body.zip),
    website: toStr(body.website),
    phone: toStr(body.phone),
    enrollment: toNum(body.enrollment),
    averageClassSize: toNum(body.averageClassSize),
    gradesMin: toNum(body.gradesMin),
    gradesMax: toNum(body.gradesMax),
    gradesServed: toStrArray(body.gradesServed),
    costValue: toNum(body.costValue),
    costText: toStr(body.costText),
    schoolHighlights: toStrArray(body.schoolHighlights),
    shortDescription: toStr(body.shortDescription),
    logoUrl: toStr(body.logoUrl),
    videoUrl: toStr(body.videoUrl),
    schoolType: schoolType ? schoolType.toLowerCase() : "public",
    location,
  };
  if (ncessch) doc.ncessch = ncessch;
  // Omit undefined so Mongoose doesn't set them
  return Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));
}

/**
 * Build partial update for PATCH: only keys that are present in body (do not set undefined).
 */
function buildPatchUpdates(body) {
  const updates = {};
  if (body.schoolName !== undefined) updates.schoolName = toStr(body.schoolName);
  const addressVal = body.fullAddress !== undefined ? toStr(body.fullAddress)
    : body.address !== undefined ? toStr(body.address)
    : body.street !== undefined ? toStr(body.street)
    : undefined;
  if (addressVal !== undefined) updates.address = addressVal;
  if (body.city !== undefined) updates.city = toStr(body.city);
  if (body.state !== undefined) updates.state = toStr(body.state);
  if (body.zip !== undefined) updates.zip = toStr(body.zip);
  if (body.website !== undefined) updates.website = toStr(body.website);
  if (body.phone !== undefined) updates.phone = toStr(body.phone);
  if (body.enrollment !== undefined) updates.enrollment = toNum(body.enrollment);
  if (body.averageClassSize !== undefined) updates.averageClassSize = toNum(body.averageClassSize);
  if (body.gradesMin !== undefined) updates.gradesMin = toNum(body.gradesMin);
  if (body.gradesMax !== undefined) updates.gradesMax = toNum(body.gradesMax);
  if (body.gradesServed !== undefined) updates.gradesServed = toStrArray(body.gradesServed);
  if (body.costValue !== undefined) updates.costValue = toNum(body.costValue);
  if (body.costText !== undefined) updates.costText = toStr(body.costText);
  if (body.schoolHighlights !== undefined) updates.schoolHighlights = toStrArray(body.schoolHighlights);
  if (body.shortDescription !== undefined) updates.shortDescription = toStr(body.shortDescription);
  if (body.logoUrl !== undefined) updates.logoUrl = toStr(body.logoUrl);
  if (body.videoUrl !== undefined) updates.videoUrl = toStr(body.videoUrl);
  if (body.schoolType !== undefined) {
    const st = toStr(body.schoolType);
    if (st && !SCHOOL_TYPE_ENUM.includes(st.toLowerCase())) {
      throw new Error(`schoolType must be one of: ${SCHOOL_TYPE_ENUM.join(", ")}`);
    }
    if (st) updates.schoolType = st.toLowerCase();
  }
  if (body.lat != null || body.lng != null || body.location) {
    const lat = body.lat ?? body.latitude;
    const lng = body.lng ?? body.longitude ?? body.lng;
    const location = buildLocation(lat, lng, body.location);
    if (!location) {
      throw new Error("Valid location required: lat/lng in valid ranges or GeoJSON Point.");
    }
    updates.location = location;
  }
  return updates;
}

/** Allowed enrichment fields for bulk update (no location/address identity). */
const BULK_ENRICHMENT_KEYS = [
  "schoolName", "address", "city", "state", "zip", "website", "phone",
  "enrollment", "averageClassSize", "gradesMin", "gradesMax", "gradesServed",
  "costValue", "costText", "schoolHighlights", "shortDescription", "logoUrl", "videoUrl", "schoolType",
];

router.use(protect);
router.use(adminOnly);

// ---------- Schools CRUD ----------

// Bulk enrichment (must be before /schools/:id so /schools/bulk matches first)
router.post("/schools/bulk", async (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body?.items || [];
    let matched = 0;
    let modified = 0;
    let skipped = 0;
    for (const item of list) {
      const ncessch = item.ncessch != null ? String(item.ncessch).trim() : null;
      const id = item._id;
      if (!ncessch && !id) {
        skipped++;
        continue;
      }
      const filter = ncessch ? { ncessch } : { _id: id };
      const school = await School.findOne(filter);
      if (!school) {
        skipped++;
        continue;
      }
      matched++;
      const $set = {};
      for (const key of BULK_ENRICHMENT_KEYS) {
        if (item[key] === undefined) continue;
        if (key === "schoolHighlights" || key === "gradesServed") {
          const arr = toStrArray(item[key]);
          if (arr) $set[key] = arr;
        } else if (["enrollment", "averageClassSize", "gradesMin", "gradesMax", "costValue"].includes(key)) {
          const n = toNum(item[key]);
          if (n !== undefined) $set[key] = n;
        } else if (key === "schoolType") {
          const st = toStr(item[key]);
          if (st && SCHOOL_TYPE_ENUM.includes(st.toLowerCase())) $set[key] = st.toLowerCase();
        } else {
          const s = toStr(item[key]);
          if (s !== undefined) $set[key] = s;
        }
      }
      if (Object.keys($set).length > 0) {
        await School.updateOne(filter, { $set });
        modified++;
      }
    }
    res.json({ success: true, matched, modified, skipped });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error in bulk update" });
  }
});

router.post("/schools", async (req, res) => {
  try {
    const body = req.body || {};
    const doc = buildSchoolDoc(body);
    const school = await School.create(doc);
    res.status(201).json({ success: true, data: school });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error creating school" });
  }
});

router.get("/schools", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const [schools, total] = await Promise.all([
      School.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      School.countDocuments(),
    ]);
    res.json({ success: true, data: schools, total, page, limit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Error fetching schools" });
  }
});

router.get("/schools/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });
    res.json({ success: true, data: school });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Error fetching school" });
  }
});

router.patch("/schools/:id", async (req, res) => {
  try {
    const body = req.body || {};
    const updates = buildPatchUpdates(body);
    if (Object.keys(updates).length === 0) {
      const school = await School.findById(req.params.id);
      if (!school) return res.status(404).json({ success: false, message: "School not found" });
      return res.json({ success: true, data: school });
    }
    const school = await School.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!school) return res.status(404).json({ success: false, message: "School not found" });
    res.json({ success: true, data: school });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error updating school" });
  }
});

router.delete("/schools/:id", async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: "School not found" });
    res.json({ success: true, message: "School deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Error deleting school" });
  }
});

// ---------- ZipCentroids ----------
router.post("/zip-centroids/bulk", async (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body?.items || [];
    let count = 0;
    for (const row of list) {
      const zip = (row.zip || row.zipCode || "").toString().trim();
      if (!zip) continue;
      const lat = Number(row.lat);
      const lng = Number(row.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;
      await ZipCentroid.findOneAndUpdate(
        { zip },
        { zip, location: { type: "Point", coordinates: [lng, lat] } },
        { upsert: true, new: true }
      );
      count++;
    }
    res.json({ success: true, message: `${count} zip centroid(s) upserted` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error upserting zip centroids" });
  }
});

router.get("/zip-centroids/:zip", async (req, res) => {
  try {
    const zip = (req.params.zip || "").toString().trim();
    const centroid = await ZipCentroid.findOne({ zip });
    if (!centroid) return res.status(404).json({ success: false, message: "Zip not found" });
    res.json({ success: true, data: centroid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Error fetching zip" });
  }
});

export default router;
