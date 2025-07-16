import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  enableHomeHeader: { type: Boolean, default: true },
  pageTitle: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  pageDescription: {
    type: String,
    required: [true, "Page description is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    trim: true,
  },
  imageTitle: {
    type: String,
    required: [true, "Image title is required"],
    trim: true,
  },
  imageDescription: {
    type: String,
    required: [true, "Image description is required"],
    trim: true,
  },
  enableZipCode: { type: Boolean, default: true },
  enableStreetAddress: { type: Boolean, default: true },
  enableCity: { type: Boolean, default: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const HomePage = mongoose.model("HomePage", homepageSchema);

export default HomePage;
