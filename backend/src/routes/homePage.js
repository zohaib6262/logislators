import express from "express";
import HomePage from "../models/HomePage.js";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async () => "png",
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// GET /api/home
router.get("/", async (req, res) => {
  try {
    let existing = await HomePage.findOne();
    if (!existing) {
      existing = new HomePage({
        enableHomeHeader: true,
        enableZipCode: true,
        enableCity: true,
        enableStreetAddress: true,
        pageTitle: "Find Your Nevada Representatives",
        pageDescription:
          "Discover who represents you in government and access resources to stay informed and engaged",
        image:
          "https://res.cloudinary.com/dlb6fup90/image/upload/v1752698699/pxfqs1izpu3aqcssxqcb.jpg",
        imageTitle: "Find Your Voice in Nevada",
        imageDescription:
          "Connect with your representatives and make your voice heard in our democracy",
      });
      await existing.save();
    }
    res.status(200).json(existing);
  } catch (error) {
    console.error("Error fetching Home page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/home
router.put("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      enableHomeHeader = true,
      enableZipCode = true,
      enableCity = true,
      enableStreetAddress = true,
      pageTitle = "",
      pageDescription = "",
      imageTitle = "",
      imageDescription = "",
      image: imageFromBody = "",
    } = req.body;

    const imagePath = req.file?.path || imageFromBody || "";

    const updateData = {
      enableHomeHeader,
      enableZipCode,
      enableCity,
      enableStreetAddress,
      pageTitle,
      pageDescription,
      image: imagePath,
      imageTitle,
      imageDescription,
    };

    const updatedHome = await HomePage.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.status(200).json({ message: "Home page updated", data: updatedHome });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

export default router;
