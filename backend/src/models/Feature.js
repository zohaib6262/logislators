// In your Feature.js model file
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const featureHeaderSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Feature = mongoose.model("Feature", featureSchema);
export const FeatureHeader = mongoose.model(
  "FeatureHeader",
  featureHeaderSchema
);
