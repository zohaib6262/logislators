// ============================================
// API ROUTES WITH MONGODB/MONGOOSE
// ============================================

import express from "express";
import Legislator from "../models/Legislators.js";

const router = express.Router();

// ============================================
// FILTER LEGISLATORS (Move before /:id)
// ============================================
router.get("/filter", async (req, res) => {
  try {
    const { party, chamber, recommendation, minScore, maxScore, category } =
      req.query;

    const filter = {};

    if (party) filter.party = party;
    if (chamber) filter.chamber = chamber;
    if (recommendation) filter.recommendation = recommendation;
    if (category) filter["bills.category"] = category;

    if (minScore || maxScore) {
      filter.score_percentage = {};
      if (minScore) filter.score_percentage.$gte = Number(minScore);
      if (maxScore) filter.score_percentage.$lte = Number(maxScore);
    }

    const legislators = await Legislator.find(filter).sort({
      score_percentage: -1,
    });

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering legislators",
      error: error.message,
    });
  }
});

// ============================================
// GET STATISTICS (Move before /:id)
// ============================================
router.get("/stats", async (req, res) => {
  try {
    const totalCount = await Legislator.countDocuments();
    const avgScore = await Legislator.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score_percentage" } } },
    ]);

    const partyStats = await Legislator.aggregate([
      {
        $group: {
          _id: "$party",
          count: { $sum: 1 },
          avgScore: { $avg: "$score_percentage" },
        },
      },
    ]);

    const chamberStats = await Legislator.aggregate([
      {
        $group: {
          _id: "$chamber",
          count: { $sum: 1 },
          avgScore: { $avg: "$score_percentage" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLegislators: totalCount,
        averageScore: avgScore[0]?.avgScore || 0,
        byParty: partyStats,
        byChamber: chamberStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
});

// ============================================
// GET TOP SCORING LEGISLATORS (Move before /:id)
// ============================================
router.get("/top/:limit", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const legislators = await Legislator.find()
      .sort({ score_percentage: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top legislators",
      error: error.message,
    });
  }
});

// ============================================
// SEARCH LEGISLATORS BY NAME (Move before /:id)
// ============================================
router.get("/search/:name", async (req, res) => {
  try {
    const legislators = await Legislator.find({
      name: { $regex: req.params.name, $options: "i" },
    }).sort({ score_percentage: -1 });

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching legislators",
      error: error.message,
    });
  }
});

// ============================================
// GET LEGISLATORS BY PARTY (Move before /:id)
// ============================================
router.get("/party/:party", async (req, res) => {
  try {
    const legislators = await Legislator.find({
      party: req.params.party,
    }).sort({ score_percentage: -1 });

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching legislators by party",
      error: error.message,
    });
  }
});

// ============================================
// GET LEGISLATORS BY CHAMBER (Move before /:id)
// ============================================
router.get("/chamber/:chamber", async (req, res) => {
  try {
    const legislators = await Legislator.find({
      chamber: req.params.chamber,
    }).sort({ score_percentage: -1 });

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching legislators by chamber",
      error: error.message,
    });
  }
});

// ============================================
// GET ALL LEGISLATORS
// ============================================
router.get("/", async (req, res) => {
  try {
    const legislators = await Legislator.find();

    res.status(200).json({
      success: true,
      count: legislators.length,
      data: legislators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching legislators",
      error: error.message,
    });
  }
});

// ============================================
// GET SINGLE LEGISLATOR BY ID
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const legislator = await Legislator.findById(req.params.id);

    if (!legislator) {
      return res.status(404).json({
        success: false,
        message: "Legislator not found",
      });
    }

    res.status(200).json({
      success: true,
      data: legislator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching legislator",
      error: error.message,
    });
  }
});

// ============================================
// CREATE NEW LEGISLATOR
// ============================================
router.post("/", async (req, res) => {
  try {
    const legislator = await Legislator.create(req.body);

    res.status(201).json({
      success: true,
      message: "Legislator created successfully",
      data: legislator,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating legislator",
      error: error.message,
    });
  }
});

// ============================================
// BULK CREATE LEGISLATORS
// ============================================
router.post("/bulk", async (req, res) => {
  try {
    const legislators = await Legislator.insertMany(req.body);

    res.status(201).json({
      success: true,
      message: `${legislators.length} legislators created successfully`,
      data: legislators,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating legislators",
      error: error.message,
    });
  }
});

// ============================================
// UPDATE LEGISLATOR
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const legislator = await Legislator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!legislator) {
      return res.status(404).json({
        success: false,
        message: "Legislator not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Legislator updated successfully",
      data: legislator,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating legislator",
      error: error.message,
    });
  }
});

// ============================================
// BULK UPDATE LEGISLATORS
// ============================================
router.put("/bulk", async (req, res) => {
  try {
    const updates = req.body; // Array of { id, data }
    const promises = updates.map((update) =>
      Legislator.findByIdAndUpdate(update.id, update.data, {
        new: true,
        runValidators: true,
      })
    );

    const results = await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: `${results.length} legislators updated successfully`,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating legislators",
      error: error.message,
    });
  }
});

// ============================================
// PATCH LEGISLATOR (Partial Update)
// ============================================
router.patch("/:id", async (req, res) => {
  try {
    const legislator = await Legislator.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!legislator) {
      return res.status(404).json({
        success: false,
        message: "Legislator not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Legislator updated successfully",
      data: legislator,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating legislator",
      error: error.message,
    });
  }
});

// ============================================
// DELETE LEGISLATOR
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const legislator = await Legislator.findByIdAndDelete(req.params.id);

    if (!legislator) {
      return res.status(404).json({
        success: false,
        message: "Legislator not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Legislator deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting legislator",
      error: error.message,
    });
  }
});

export default router;
