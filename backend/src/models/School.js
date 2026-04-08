import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const schoolSchema = new mongoose.Schema(
  {
    ncessch: { type: String, sparse: true, unique: true }, // NCES school ID for upserts
    schoolName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    website: String,
    phone: String,
    enrollment: Number,
    averageClassSize: Number,
    gradesMin: Number,
    gradesMax: Number,
    gradesServed: { type: [String], default: [] },
    costValue: Number,
    costText: String,
    schoolHighlights: { type: [String], default: [] },
    shortDescription: String,
    logoUrl: String,
    videoUrl: String,
    schoolType: {
      type: String,
      enum: ["public", "private", "charter", "homeschool", "other"],
      default: "public",
    },
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
  { timestamps: true, collection: "sf_schools" }
);

schoolSchema.index({ location: "2dsphere" });
// ncessch index is created by field option: unique: true, sparse: true

const School = mongoose.model("School", schoolSchema);
export default School;
