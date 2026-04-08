import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const resourcePageSchema = new mongoose.Schema(
  {
    enableResourceHeader: { type: Boolean, default: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },

    email: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "sf_manageresourcepages" }
);

const ManageResourcePage = mongoose.model(
  "ManageResourcePage",
  resourcePageSchema
);

export default ManageResourcePage;
