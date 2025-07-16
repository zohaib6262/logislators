import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  enableHomeHeader: { type: Boolean, default: true },
  pageTitle: {
    type: String,
    trim: true,
  },
  pageDescription: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  imageTitle: {
    type: String,
    trim: true,
  },
  imageDescription: {
    type: String,
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
