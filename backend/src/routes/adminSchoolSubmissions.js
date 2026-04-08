import express from "express";
import mongoose from "mongoose";
import SchoolSubmission from "../models/SchoolSubmission.js";
import School from "../models/School.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";
import { sendSchoolSubmissionApproved, sendSchoolSubmissionRejected } from "../utils/emailService.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

/**
 * GET /api/adminSchoolSubmissions
 * Query: status (optional) - filter by pending|approved|rejected
 */
router.get("/", async (req, res) => {
  try {
    const status = (req.query.status || "").toString().trim().toLowerCase();
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }
    const list = await SchoolSubmission.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("adminSchoolSubmissions list error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error." });
  }
});

/**
 * GET /api/adminSchoolSubmissions/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID." });
    }
    const doc = await SchoolSubmission.findById(id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("adminSchoolSubmissions get one error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error." });
  }
});

/**
 * PATCH /api/adminSchoolSubmissions/:id
 * Update submission fields, status, adminNotes.
 */
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID." });
    }
    const body = req.body || {};
    const updates = {};
    const allowed = [
      "schoolName", "contactName", "contactEmail", "contactPhone", "website",
      "streetAddress", "city", "state", "zipCode", "latitude", "longitude",
      "schoolType", "enrollment", "averageClassSize", "gradesServed", "cost",
      "schoolHighlights", "shortDescription", "logoUrl", "videoUrl",
      "status", "adminNotes",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "gradesServed" || key === "schoolHighlights") {
          updates[key] = Array.isArray(body[key])
            ? body[key].map((x) => String(x).trim()).filter(Boolean)
            : body[key];
        } else if (key === "latitude" || key === "longitude") {
          const n = Number(body[key]);
          if (!Number.isNaN(n)) updates[key] = n;
        } else {
          updates[key] = body[key];
        }
      }
    }
    if (updates.latitude != null || updates.longitude != null) {
      const lat = updates.latitude ?? (await SchoolSubmission.findById(id).select("latitude").lean())?.latitude;
      const lng = updates.longitude ?? (await SchoolSubmission.findById(id).select("longitude").lean())?.longitude;
      if (lat != null && lng != null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updates.location = { type: "Point", coordinates: [lng, lat] };
      }
    }
    const doc = await SchoolSubmission.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    if (updates.status === "rejected" && doc.contactEmail) {
      sendSchoolSubmissionRejected(
        doc.contactEmail,
        doc.contactName,
        doc.schoolName,
        doc.adminNotes || ""
      ).catch((err) => console.error("School submission rejected email failed:", err));
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("adminSchoolSubmissions patch error:", err);
    res.status(400).json({ success: false, message: err.message || "Server error." });
  }
});

/**
 * POST /api/adminSchoolSubmissions/:id/approve
 * Create School from submission, mark submission approved, set reviewedAt/reviewedBy/approvedSchoolId.
 */
router.post("/:id/approve", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID." });
    }
    const sub = await SchoolSubmission.findById(id);
    if (!sub) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    if (sub.status === "approved") {
      return res.status(400).json({ success: false, message: "Submission already approved." });
    }

    const addressStr = [sub.streetAddress, sub.city, sub.state, sub.zipCode]
      .filter(Boolean)
      .join(", ");

    let costValue;
    let costText;
    if (sub.cost != null && sub.cost !== "") {
      if (typeof sub.cost === "number" && !Number.isNaN(sub.cost)) {
        costValue = sub.cost;
      } else {
        costText = String(sub.cost);
      }
    }

    const schoolDoc = {
      schoolName: sub.schoolName,
      address: addressStr,
      city: sub.city,
      state: sub.state,
      zip: sub.zipCode,
      website: sub.website,
      phone: sub.contactPhone,
      enrollment: sub.enrollment,
      averageClassSize: sub.averageClassSize,
      gradesServed: Array.isArray(sub.gradesServed) ? sub.gradesServed : [],
      costValue,
      costText,
      schoolHighlights: Array.isArray(sub.schoolHighlights) ? sub.schoolHighlights : [],
      shortDescription: sub.shortDescription,
      logoUrl: sub.logoUrl,
      videoUrl: sub.videoUrl,
      schoolType: sub.schoolType,
      location: sub.location,
    };

    const school = await School.create(schoolDoc);

    sub.status = "approved";
    sub.reviewedAt = new Date();
    sub.reviewedBy = req.user._id;
    sub.approvedSchoolId = school._id;
    await sub.save();

    sendSchoolSubmissionApproved(sub.contactEmail, sub.contactName, sub.schoolName).catch((err) =>
      console.error("School submission approved email failed:", err)
    );

    res.json({
      success: true,
      message: "Submission approved and school created.",
      data: { submission: sub, school },
    });
  } catch (err) {
    console.error("adminSchoolSubmissions approve error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error." });
  }
});

export default router;
