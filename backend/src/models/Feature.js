// School Finder uses isolated sf_ collections; users remains shared.
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "sf_features" }
);

const featureHeaderSchema = new mongoose.Schema(
  {
    header: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "sf_featureheaders" }
);

export const Feature = mongoose.model("Feature", featureSchema);
export const FeatureHeader = mongoose.model(
  "FeatureHeader",
  featureHeaderSchema
);
