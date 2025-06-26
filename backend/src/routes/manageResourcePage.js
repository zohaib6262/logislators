import express from "express";
import ManageResourcePage from "../models/ManageResourcePage.js";

const router = express.Router();

// GET /api/about - Fetch About Page Data
router.get("/", async (req, res) => {
  try {
    let resourcePage = await ManageResourcePage.findOne();

    if (!resourcePage) {
      resourcePage = new ManageResourcePage({
        enableResourceHeader: true,
        title: "Resource Page",
        description: "",
        email: "naveda@gmail.com",
      });
      await resourcePage.save();
    }
    res.status(200).json(resourcePage);
  } catch (error) {
    console.error("Error fetching Resource page:", error);
    res.status(500).json({
      message: "Server error while fetching Resource page",
      error: error.message,
    });
  }
});

// PUT /api/about - Update About Page
router.put("/", async (req, res) => {
  try {
    const data = req.body;
    const updatedResource = await ManageResourcePage.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating Resource page:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error while updating Resource page",
      error: error.message,
    });
  }
});

export default router;
