import express from "express";
import dotenv from "dotenv";
import {
  createOrUpdateContact,
  ensureTagExists,
  applyTagToContact,
} from "../utils/keapService.js";

dotenv.config();
const router = express.Router();

const EDUCATION_GUIDE_TAG = "Education Guide";

function isValidEmail(str) {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * POST /api/homeLead
 * Captures homepage "Find Your School" lead into Keap immediately (non-blocking for search UX).
 *
 * Does NOT modify users collection.
 * Does NOT delete old data.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    const firstName = (body.firstName ?? "").toString().trim();
    const lastName = (body.lastName ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const street = (body.street ?? "").toString().trim();
    const city = (body.city ?? "").toString().trim();
    const state = (body.state ?? "").toString().trim();
    const zipcode = (body.zipcode ?? body.zip ?? "").toString().trim();

    // Homepage validates these already, but keep server-side safety.
    if (!firstName) {
      return res.status(400).json({ success: false, message: "First name is required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }
    if (!zipcode) {
      return res.status(400).json({ success: false, message: "ZIP code is required." });
    }

    const accessToken = process.env.KEAP_ACCESS_TOKEN;
    if (!accessToken || !accessToken.trim()) {
      console.warn("Keap sync skipped: KEAP_ACCESS_TOKEN not set.");
      return res.status(200).json({
        success: false,
        message: "Keap not configured (missing KEAP_ACCESS_TOKEN).",
      });
    }

    const { contactId, isNewContact } = await createOrUpdateContact(accessToken, {
      email,
      given_name: firstName,
      family_name: lastName,
      street,
      city,
      state,
      zipcode,
    });

    const tag = await ensureTagExists(accessToken, EDUCATION_GUIDE_TAG);
    await applyTagToContact(accessToken, contactId, tag.id);

    res.status(201).json({
      success: true,
      contactId,
      isNewContact,
      tagApplied: EDUCATION_GUIDE_TAG,
    });
  } catch (err) {
    console.error("Keap sync for homepage lead failed:", err?.message || err);
    res.status(500).json({
      success: false,
      message: "Keap sync failed for homepage lead.",
      error: err?.message || err,
    });
  }
});

export default router;
