import mongoose from "mongoose";

const resourcePageSchema = new mongoose.Schema({
  enableResourceHeader: { type: Boolean, default: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },

  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const ManageResourcePage = mongoose.model(
  "ManageResourcePage",
  resourcePageSchema
);

export default ManageResourcePage;
