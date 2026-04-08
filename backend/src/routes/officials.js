import express from "express";
import Official from "../models/Official.js";
import VotingRecord from "../models/VotingRecord.js";

const router = express.Router();

// Get all officials with their voting records
router.get("/", async (req, res) => {
  try {
    const officials = await Official.find().lean();

    // Get voting records for each official
    const officialsWithRecords = await Promise.all(
      officials.map(async (official) => {
        const votingRecord = await VotingRecord.findOne({
          officialId: official._id,
        }).lean();
        return {
          ...official,
          votingRecord,
        };
      })
    );

    res.json(officialsWithRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single official by ID
router.get("/:id", async (req, res) => {
  try {
    const official = await Official.findById(req.params.id).lean();
    const votingRecord = await VotingRecord.findOne({
      officialId: official._id,
    }).lean();

    res.json({
      ...official,
      votingRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new official
router.post("/", async (req, res) => {
  try {
    const official = new Official(req.body);
    const savedOfficial = await official.save();

    if (req.body.votingRecord) {
      const votingRecord = new VotingRecord({
        ...req.body.votingRecord,
        officialId: savedOfficial._id,
      });
      await votingRecord.save();
    }

    res.status(201).json(savedOfficial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update official
router.put("/:id", async (req, res) => {
  try {
    const official = await Official.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (req.body.votingRecord) {
      await VotingRecord.findOneAndUpdate(
        { officialId: official._id },
        { ...req.body.votingRecord, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json(official);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete official
router.delete("/:id", async (req, res) => {
  try {
    await Official.findByIdAndDelete(req.params.id);
    await VotingRecord.deleteOne({ officialId: req.params.id });
    res.json({ message: "Official deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
