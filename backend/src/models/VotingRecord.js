import mongoose from "mongoose";

const VotingRecordItemSchema = new mongoose.Schema({
  area: String,
  notableBills: String,
  score: String,
});

const ExtraPointsSchema = new mongoose.Schema({
  bills: [String],
  points: Number,
  description: String,
});

const VotingRecordSchema = new mongoose.Schema({
  officialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Official",
    required: true,
  },
  sessionReport: String,
  totalScore: String,
  records: [VotingRecordItemSchema],
  extraPoints: ExtraPointsSchema,
  highlights: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export default mongoose.model("VotingRecord", VotingRecordSchema);
