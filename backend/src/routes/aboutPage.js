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
        title: "About Nevada Rep Finder",
        description:
          "Discover who represents you in government and access resources to stay informed and engaged",
        labelMission: "Mission Statement",
        labelWhatWeDo: "What We Do",
        labelKeyPoints: "Key Points",
        labelDataInfo: "Data Information",
        labelPrivacy: "Privacy Statement",
        labelGetInvolved: "Get Involved",
        labelEmail: "Contact Email",
        mission:
          "Nevada Rep Finder is dedicated to making government more accessible to all Nevada residents. We believe that an informed citizenry is essential to a functioning democracy, and that begins with knowing who represents you in government and how to contact them",
        whatWeDo:
          "Our platform provides a simple way for Nevada residents to find their elected officials at all levels of government by simply entering their address. We provide comprehensive information about:",
        bulletPoints: [
          "Federal Representatives (Senators and House Members)",
          "State Officials (Governor, State Senators, Assembly Members)",
          "Local Officials (County and City)",
          "Contact information and official resources",
          "Enhanced information about representatives' backgrounds and positions",
        ],
        dataInfo:
          "We use the Google Civic Information API to accurately match addresses to districts and representatives. We supplement this data with additional information curated by our team to provide a more comprehensive view of your elected officials",
        privacy:
          "We take your privacy seriously. While we need your address to find your correct representatives, we only store this information with your explicit consent. We never share your personal data with third parties without your permission",
        getInvolved:
          "We take your privacy seriously. While we need your address to find your correct representatives, we only store this information with your explicit consent. We never share your personal data with third parties without your permission",
        email: "eric@nevadapolicy.org",
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
