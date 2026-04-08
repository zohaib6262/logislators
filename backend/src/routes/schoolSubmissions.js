import express from "express";
import SchoolSubmission from "../models/SchoolSubmission.js";
import { sendSchoolSubmissionConfirmation } from "../utils/emailService.js";
import {
  createOrUpdateContact,
  ensureTagExists,
  applyTagToContact,
} from "../utils/keapService.js";

const router = express.Router();

const SCHOOL_TYPES = ["public", "private", "charter", "homeschool", "other"];

const EDUCATION_GUIDE_TAG = "Education Guide";
const PENDING_SCHOOL_SUBMISSION_TAG = "Pending School Submission";

/**
 * Sync a school submission to Keap: create/update contact and apply Education Guide (+ optional Pending School Submission) tag.
 * Does not throw; callers should .catch() to log. Used at form submission time, not at approval time.
 */
async function syncSchoolSubmissionToKeap(data) {
  const accessToken = process.env.KEAP_ACCESS_TOKEN;
  if (!accessToken || !accessToken.trim()) {
    console.warn("Keap sync skipped: KEAP_ACCESS_TOKEN not set.");
    return;
  }

  const nameParts = (data.contactName || "").trim().split(/\s+/);
  const given_name = nameParts[0] || "";
  const family_name = nameParts.slice(1).join(" ") || "";

  const payload = {
    email: data.contactEmail,
    given_name,
    family_name,
    street: data.streetAddress,
    city: data.city,
    state: data.state,
    zipcode: data.zipCode,
    phone: data.contactPhone || undefined,
    company: data.schoolName ? `${data.schoolName}${data.schoolType ? ` (${data.schoolType})` : ""}` : undefined,
  };

  const { contactId } = await createOrUpdateContact(accessToken, payload);

  const tagNames = [EDUCATION_GUIDE_TAG, PENDING_SCHOOL_SUBMISSION_TAG];
  for (const tagName of tagNames) {
    const tag = await ensureTagExists(accessToken, tagName);
    await applyTagToContact(accessToken, contactId, tag.id);
  }

  console.log("Keap sync OK for school submission:", data.contactEmail, "contactId:", contactId);
}

function isValidEmail(str) {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidUrl(str) {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

function parseHighlights(value) {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  const str = String(value || "");
  return str
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * POST /api/schoolSubmissions
 * Public: submit a school for admin review. Stored as pending; not shown in live search.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    const schoolName = (body.schoolName ?? "").toString().trim();
    const contactName = (body.contactName ?? "").toString().trim();
    const contactEmail = (body.contactEmail ?? "").toString().trim();
    const streetAddress = (body.streetAddress ?? body.street ?? "").toString().trim();
    const city = (body.city ?? "").toString().trim();
    const state = (body.state ?? "").toString().trim();
    const zipCode = (body.zipCode ?? body.zip ?? "").toString().trim();
    const latRaw = body.latitude != null ? Number(body.latitude) : NaN;
    const lngRaw = body.longitude != null ? Number(body.longitude) : NaN;
    const schoolType = (body.schoolType ?? "").toString().trim().toLowerCase();

    if (!schoolName) {
      return res.status(400).json({ success: false, message: "School name is required." });
    }
    if (!contactName) {
      return res.status(400).json({ success: false, message: "Contact name is required." });
    }
    if (!contactEmail) {
      return res.status(400).json({ success: false, message: "Contact email is required." });
    }
    if (!isValidEmail(contactEmail)) {
      return res.status(400).json({ success: false, message: "Invalid contact email format." });
    }
    if (!streetAddress) {
      return res.status(400).json({ success: false, message: "Street address is required." });
    }
    if (!city) {
      return res.status(400).json({ success: false, message: "City is required." });
    }
    if (!state) {
      return res.status(400).json({ success: false, message: "State is required." });
    }
    if (!zipCode) {
      return res.status(400).json({ success: false, message: "ZIP code is required." });
    }
    if (Number.isNaN(latRaw) || latRaw < -90 || latRaw > 90) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude is required (between -90 and 90).",
      });
    }
    if (Number.isNaN(lngRaw) || lngRaw < -180 || lngRaw > 180) {
      return res.status(400).json({
        success: false,
        message: "Valid longitude is required (between -180 and 180).",
      });
    }
    if (!SCHOOL_TYPES.includes(schoolType)) {
      return res.status(400).json({
        success: false,
        message: `School type must be one of: ${SCHOOL_TYPES.join(", ")}.`,
      });
    }

    const contactPhone = (body.contactPhone ?? "").toString().trim() || undefined;
    let website = (body.website ?? "").toString().trim() || undefined;
    if (website && !isValidUrl(website)) {
      return res.status(400).json({ success: false, message: "Invalid website URL format." });
    }
    const enrollment =
      body.enrollment != null && body.enrollment !== ""
        ? Number(body.enrollment)
        : undefined;
    const averageClassSize =
      body.averageClassSize != null && body.averageClassSize !== ""
        ? Number(body.averageClassSize)
        : undefined;
    const gradesServed = Array.isArray(body.gradesServed)
      ? body.gradesServed.map((g) => String(g).trim()).filter(Boolean)
      : parseHighlights(body.gradesServed);
    const cost =
      body.cost != null && body.cost !== ""
        ? typeof body.cost === "number"
          ? body.cost
          : String(body.cost).trim()
        : undefined;
    const schoolHighlights = parseHighlights(body.schoolHighlights);
    const shortDescription = (body.shortDescription ?? "").toString().trim() || undefined;
    let logoUrl = (body.logoUrl ?? "").toString().trim() || undefined;
    if (logoUrl && !isValidUrl(logoUrl)) {
      return res.status(400).json({ success: false, message: "Invalid logo URL format." });
    }
    let videoUrl = (body.videoUrl ?? "").toString().trim() || undefined;
    if (videoUrl && !isValidUrl(videoUrl)) {
      return res.status(400).json({ success: false, message: "Invalid video URL format." });
    }

    const location = {
      type: "Point",
      coordinates: [lngRaw, latRaw],
    };

    const doc = await SchoolSubmission.create({
      schoolName,
      contactName,
      contactEmail,
      contactPhone,
      website,
      streetAddress,
      city,
      state,
      zipCode,
      latitude: latRaw,
      longitude: lngRaw,
      location,
      schoolType,
      enrollment,
      averageClassSize,
      gradesServed,
      cost,
      schoolHighlights,
      shortDescription,
      logoUrl,
      videoUrl,
      status: "pending",
    });

    sendSchoolSubmissionConfirmation(contactEmail, contactName, schoolName).catch((err) =>
      console.error("School submission confirmation email failed:", err)
    );

    // Sync to Keap immediately (do not block or fail the submission if Keap fails)
    syncSchoolSubmissionToKeap({
      contactName,
      contactEmail,
      contactPhone,
      schoolName,
      schoolType,
      streetAddress,
      city,
      state,
      zipCode,
    }).catch((err) =>
      console.error("Keap sync for school submission failed (submission still saved):", err?.message || err)
    );

    res.status(201).json({
      success: true,
      message: "School submitted for review.",
      id: doc._id,
    });
  } catch (err) {
    console.error("schoolSubmissions POST error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error." });
  }
});

export default router;
