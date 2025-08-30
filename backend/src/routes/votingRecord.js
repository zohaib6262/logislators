import express from "express";
import VotingRecord from "../models/VotingRecord.js";

const router = express.Router();

// Get all voting records
router.get("/", async (req, res) => {
  try {
    const records = await VotingRecord.find().populate("officialId");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get voting record by official ID
router.get("/official/:officialId", async (req, res) => {
  try {
    const record = await VotingRecord.findOne({
      officialId: req.params.officialId,
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create voting record
router.post("/", async (req, res) => {
  try {
    const record = new VotingRecord(req.body);
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update voting record
router.put("/:id", async (req, res) => {
  try {
    const record = await VotingRecord.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete voting record
router.delete("/:id", async (req, res) => {
  try {
    await VotingRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Voting record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
