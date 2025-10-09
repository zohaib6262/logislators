import express from "express";
import LegislatorsHeaderPage from "../models/LegislatorsHeaderPage.js";
// Logislators Header Page Routes
// GET /api/about - Fetch About Page Data
const router = express.Router();

router.get("/header", async (req, res) => {
  try {
    let legislatorsPage = await LegislatorsHeaderPage.findOne();
    console.log(" Retrieved legislators page:", legislatorsPage);

    if (!legislatorsPage) {
      legislatorsPage = new LegislatorsHeaderPage({
        enableLegislatorsHeader: true,
        title: "Nevada Legislators Page",
        description:
          "Comprehensive voting records and policy positions for Nevada's state legislators",
      });
      await legislatorsPage.save();
    }
    res.status(200).json(legislatorsPage);
  } catch (error) {
    console.error("Error fetching Legislators page:", error);
    res.status(500).json({
      message: "Server error while fetching Legislators page",
      error: error.message,
    });
  }
});
// PUT /api/about - Update About Page
router.put("/header", async (req, res) => {
  try {
    const data = req.body;
    const updatedLegislatorsHeader =
      await LegislatorsHeaderPage.findOneAndUpdate({}, data, {
        new: true,
        upsert: true,
      });
    res.status(200).json(updatedLegislatorsHeader);
  } catch (error) {
    console.error("Error updating Legislators Header page:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error while updating Legislators Header page",
      error: error.message,
    });
  }
});
export default router;
