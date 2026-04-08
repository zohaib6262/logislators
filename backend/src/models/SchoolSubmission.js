import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared (ref: User).
const schoolSubmissionSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: String,
    website: String,
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    schoolType: {
      type: String,
      enum: ["public", "private", "charter", "homeschool", "other"],
      required: true,
    },
    enrollment: Number,
    averageClassSize: Number,
    gradesServed: { type: [String], default: [] },
    cost: mongoose.Schema.Types.Mixed,
    schoolHighlights: { type: [String], default: [] },
    shortDescription: String,
    logoUrl: String,
    videoUrl: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    approvedSchoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  },
  { timestamps: true, collection: "sf_schoolsubmissions" }
);

schoolSubmissionSchema.index({ location: "2dsphere" });
schoolSubmissionSchema.index({ status: 1 });

const SchoolSubmission = mongoose.model("SchoolSubmission", schoolSubmissionSchema);
export default SchoolSubmission;
