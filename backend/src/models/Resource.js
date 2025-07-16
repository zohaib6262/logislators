import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ["Government", "Voting", "Education", "Community", "Health", "Other"],
  },
  customFields: [
    {
      key: String,
      value: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export default mongoose.model("Resource", ResourceSchema);
