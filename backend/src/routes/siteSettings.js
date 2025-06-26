import express from "express";
import SiteSetting from "../models/SiteSetting.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const handleError = (res, error, message = "Server error", status = 500) => {
  console.error(error);
  return res.status(status).json({ error: message });
};

// GET current settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();

    if (!settings) {
      // Create default settings
      const defaultSettings = new SiteSetting({
        enableAboutus: true,
        enableResources: true,
        siteName: "My Website",
        siteDescription: "This is a default description.",
        primaryColor: "#000000",
        footerText: "© 2025 My Website",
        logoUrl: "",

        // ✅ These must be valid non-empty strings
        contactEmail: "info@mywebsite.com",
        contactPhone: "+1234567890",

        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
        },
      });

      settings = await defaultSettings.save();
      return res.status(201).json(settings); // 201: created
    }

    res.status(200).json(settings);
  } catch (error) {
    return handleError(res, error);
  }
});

// POST to create settings (optional, usually run once)
router.post("/", protect, async (req, res) => {
  try {
    const data = req.body;

    const existing = await SiteSetting.findOne();

    if (existing) {
      return res
        .status(400)
        .json({ message: "Settings already exist. Use PUT to update." });
    }

    const newSettings = new SiteSetting(data);
    await newSettings.save();

    res.status(201).json({ message: "Settings created successfully!" });
  } catch (error) {
    return handleError(res, error);
  }
});

// PUT to update existing settings
router.put("/", protect, async (req, res) => {
  try {
    if (!req.body.contactEmail || !req.body.contactPhone) {
      return res.status(400).json({
        message: "contactEmail and contactPhone are required fields.",
      });
    }

    const data = req.body;

    await SiteSetting.updateOne({}, data);

    res.status(200).json({ message: "Settings updated successfully!" });
  } catch (error) {
    return handleError(res, error);
  }
});

export default router;
