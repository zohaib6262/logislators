// models/siteSettings.model.js
import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  instagram: { type: String, default: "" },
});

const siteSettingSchema = new mongoose.Schema(
  {
    enableAboutus: { type: Boolean, default: true },
    enableResources: { type: Boolean, default: true },
    siteName: { type: String, required: true },
    siteDescription: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#2A5CAA" },
    footerText: { type: String, default: "" },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
