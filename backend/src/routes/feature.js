import express from "express";
import { Feature, FeatureHeader } from "../models/Feature.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Feature Header Routes
// Get feature header
router.get("/header", async (req, res) => {
  try {
    let header = await FeatureHeader.findOne();
    if (!header) {
      header = await FeatureHeader.create({
        header: "Why Use Nevada Rep Finder?",
      });
      return res.status(201).json(header);
    }
    // 201: created
    return res.status(200).json(header);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update feature header
router.put("/header", protect, async (req, res) => {
  try {
    const { header } = req.body;

    if (typeof header !== "string") {
      return res.status(400).json({
        error: "Feature header must be a string value",
      });
    }

    const updated = await FeatureHeader.findOneAndUpdate(
      {},
      { header },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    handleErrors(res, err);
  }
});

// Get all features
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new feature
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const newFeature = new Feature({ title, description, icon });
    const savedFeature = await newFeature.save();
    res.status(201).json(savedFeature);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a feature
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Feature.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a feature
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Feature.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.json({ message: "Feature deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
