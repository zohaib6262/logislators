
import mongoose from "mongoose";

// Each bill entry
const BillSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true }, 
    value: { type: String, default: "" },
    recommendation: { type: String, default: "" },
    category: { type: String, default: "" },
    weighting: { type: Number, default: 0 },
  },
  { _id: false }
);

// Each category score entry
const CategoryScoreSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const LegislatorsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    party: { type: String, required: true },
    chamber: { type: String, required: true },
    points: { type: Number, default: 0 },
    points_possible: { type: Number, default: 0 },
    score_percentage: { type: Number, default: 0 },
    score_with_bonus: { type: Number, default: 0 },
    key_highlights: { type: String, default: "" },

    // All Category Scores as array
    categoryScores: [CategoryScoreSchema],

    // All Bills as array
    bills: [BillSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Legislators", LegislatorsSchema);
