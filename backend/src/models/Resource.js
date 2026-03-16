import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
    url: { type: String },
    category: { type: String, required: true },
    customFields: [{ key: String, value: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { collection: "sf_resources" }
);

export default mongoose.model("Resource", ResourceSchema);
