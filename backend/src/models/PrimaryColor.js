import mongoose from "mongoose";

const PrimaryColorSchema = new mongoose.Schema({
  primaryBgColor: {
    type: String,
    required: [true, "Primary background color is required"],
    trim: true,
    default: "#3b82f6",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const PrimaryColor = mongoose.model("PrimaryColor", PrimaryColorSchema);

export default PrimaryColor;
