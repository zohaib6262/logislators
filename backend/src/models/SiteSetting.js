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
    enableLegislators: { type: Boolean, default: true },
    siteName: { type: String },
    siteDescription: { type: String },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#2A5CAA" },
    footerText: { type: String, default: "" },
    contactEmail: { type: String },
    contactPhone: { type: String },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
