import express from "express";
const router = express.Router();
import Representative from "../models/Representative.js";

import { protect } from "../middleware/authMiddleware.js";

// GET all representatives
router.get("/", async (req, res) => {
  try {
    const reps = await Representative.find();
    res.status(200).json(reps);
  } catch (err) {
    console.error("Error fetching representatives:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching representatives" });
  }
});
//Search on address
router.get("/search", async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res
      .status(400)
      .json({ error: "Address query parameter is required." });
  }

  try {
    const regex = new RegExp(address, "i"); // case-insensitive match

    const results = await Representative.find({
      "contactInfo.address": regex,
    });

    console.log("Results", results.length);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No representatives found for this address." });
    }

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error during search." });
  }
});

// GET one representative
router.get("/:id", async (req, res) => {
  try {
    const rep = await Representative.findById(req.params.id);
    if (!rep)
      return res.status(404).json({ error: "Representative not found" });
    res.status(200).json(rep);
  } catch (err) {
    console.error("Error fetching representative:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching representative" });
  }
});

// POST create a new representative
// POST /api/representatives/bulk-save
router.post("/", protect, async (req, res) => {
  const incomingReps = req.body;

  if (!Array.isArray(incomingReps) || incomingReps.length === 0) {
    return res.status(400).json({ error: "No representatives to save" });
  }

  try {
    const existingIds = await Representative.find({
      id: { $in: incomingReps.map((rep) => rep.id) },
    }).distinct("id");

    const newReps = incomingReps.filter((rep) => !existingIds.includes(rep.id));

    if (newReps.length > 0) {
      await Representative.insertMany(newReps);
    }

    res
      .status(201)
      .json({ message: "Saved successfully", saved: newReps.length });
  } catch (err) {
    console.error("Bulk save error:", err);
    res.status(500).json({ error: "Failed to save representatives" });
  }
});

// PUT update a representative
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Representative.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Representative not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating representative:", err);
    res
      .status(400)
      .json({ error: "Invalid data or failed to update representative" });
  }
});

// DELETE a representative
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Representative.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Representative not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting representative:", err);
    res
      .status(500)
      .json({ error: "Server error while deleting representative" });
  }
});

// POST /api/representatives/by-ids
router.post("/by-ids", protect, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided" });
  }

  try {
    const reps = await Representative.find({ id: { $in: ids } });
    res.status(200).json(reps);
  } catch (err) {
    console.error("Error fetching representatives by IDs:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching representatives" });
  }
});

export default router;
