// School Finder uses isolated sf_ collections (School Search Section cards).
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "sf_votings" }
);

export const Voting = mongoose.model("Voting", featureSchema);
