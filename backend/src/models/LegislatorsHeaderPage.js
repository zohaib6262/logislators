import mongoose from "mongoose";

const legislatorsPageSchema = new mongoose.Schema({
  enableLegislatorsHeader: { type: Boolean, default: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const LegislatorsHeaderPage = mongoose.model(
  "LegislatorsHeaderPage",
  legislatorsPageSchema
);

export default LegislatorsHeaderPage;
