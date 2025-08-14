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

router.post("/", async (req, res) => {
  const representativeData = req.body;
  console.log("Incoming representative:", representativeData);

  // Agar array hai to har element save karo
  if (Array.isArray(representativeData)) {
    try {
      const savedReps = [];
      for (const rep of representativeData) {
        if (rep && typeof rep === "object") {
          // Duplicate check
          const exists = await Representative.findOne({ id: rep.id });
          if (exists) {
            console.log(`Skipping duplicate representative: ${rep.id}`);
            continue; // Skip agar already hai
          }

          const newRepresentative = new Representative(rep);
          const savedRep = await newRepresentative.save();
          savedReps.push(savedRep);
        }
      }

      return res.status(201).json({
        message: "Representatives saved successfully",
        data: savedReps,
      });
    } catch (err) {
      console.error("Error saving representatives:", err);
      return res.status(500).json({
        error: "Failed to save representatives",
        details: err.message,
      });
    }
  }

  // Agar single object hai to usko save karo
  if (!representativeData || typeof representativeData !== "object") {
    return res
      .status(400)
      .json({ error: "Request body must be a valid representative object" });
  }

  try {
    // Duplicate check
    const exists = await Representative.findOne({ id: representativeData.id });
    if (exists) {
      return res.status(200).json({
        message: "Representative already exists",
        data: exists,
      });
    }

    const newRepresentative = new Representative(representativeData);
    const savedRep = await newRepresentative.save();

    res.status(201).json({
      message: "Representative saved successfully",
      data: savedRep,
    });
  } catch (err) {
    console.error("Error saving representative:", err);
    res.status(500).json({
      error: "Failed to save representative",
      details: err.message,
    });
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
router.post("/by-ids", async (req, res) => {
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
