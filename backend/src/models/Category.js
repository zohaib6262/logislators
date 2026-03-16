import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "sf_categories" }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
