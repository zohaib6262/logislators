import express from "express";
import AboutPage from "../models/AboutPage.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET /api/about - Fetch About Page Data
router.get("/", async (req, res) => {
  try {
    let aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      aboutPage = new AboutPage({
        enableAboutusHeader: true,
        title: "About Us",
        description: "",
        labelMission: "Mission Statement",
        labelWhatWeDo: "What We Do",
        labelKeyPoints: "Key Points",
        labelDataInfo: "Data Information",
        labelPrivacy: "Privacy Statement",
        labelGetInvolved: "Get Involved",
        labelEmail: "Contact Email",
        mission: "",
        whatWeDo: "",
        bulletPoints: [],
        dataInfo: "",
        privacy: "",
        getInvolved: "",
        email: "",
      });
      await aboutPage.save();
    }
    res.status(200).json(aboutPage);
  } catch (error) {
    console.error("Error fetching About page:", error);
    res.status(500).json({
      message: "Server error while fetching About page",
      error: error.message,
    });
  }
});

// PUT /api/about - Update About Page
router.put("/", protect, async (req, res) => {
  try {
    const data = req.body;
    const updatedAbout = await AboutPage.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    res.status(200).json(updatedAbout);
  } catch (error) {
    console.error("Error updating About page:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error while updating About page",
      error: error.message,
    });
  }
});

export default router;
