import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Voting } from "../models/VotingSection.js";
const router = express.Router();

// Get all votings
router.get("/", async (req, res) => {
  try {
    const votings = await Voting.find();
    res.json(votings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new voting
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const newVoting = new Voting({ title, description, icon });
    const savedVoting = await newVoting.save();
    res.status(201).json(savedVoting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a voting
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Voting.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Voting not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a voting
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Voting.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Voting not found" });
    }

    res.json({ message: "Voting deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
