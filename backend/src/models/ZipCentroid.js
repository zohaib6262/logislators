import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const zipCentroidSchema = new mongoose.Schema(
  {
    zip: { type: String, required: true, unique: true },
    zipCode: { type: String }, // legacy; seeder sets for backward compat with old index
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true, collection: "sf_zipcentroids" }
);

zipCentroidSchema.index({ location: "2dsphere" });

const ZipCentroid = mongoose.model("ZipCentroid", zipCentroidSchema);
export default ZipCentroid;
