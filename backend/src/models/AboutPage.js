import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const aboutPageSchema = new mongoose.Schema(
  {
    enableAboutusHeader: { type: Boolean, default: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    labelMission: { type: String, default: "Mission Statement", trim: true },
    labelWhatWeDo: { type: String, default: "What We Do", trim: true },
    labelKeyPoints: { type: String, default: "Key Points", trim: true },
    labelDataInfo: { type: String, default: "Data Information", trim: true },
    labelPrivacy: { type: String, default: "Privacy Statement", trim: true },
    labelGetInvolved: { type: String, default: "Get Involved", trim: true },
    labelEmail: { type: String, default: "Contact Email", trim: true },
    mission: { type: String, trim: true },
    whatWeDo: { type: String, trim: true },
    bulletPoints: { type: [String], default: [] },
    dataInfo: { type: String, trim: true },
    privacy: { type: String, trim: true },
    getInvolved: { type: String, trim: true },
    email: { type: String, trim: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { collection: "sf_aboutpages" }
);

const AboutPage = mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;
