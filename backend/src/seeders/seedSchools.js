import mongoose from "mongoose";
import dotenv from "dotenv";
import School from "../models/School.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

const sampleSchool = {
  schoolName: "Sample Academy",
  address: "123 Education Way",
  city: "Las Vegas",
  state: "NV",
  zip: "89101",
  website: "https://example.com",
  phone: "(702) 555-0100",
  enrollment: 500,
  averageClassSize: 22,
  gradesMin: 0,
  gradesMax: 8,
  gradesServed: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
  costValue: 5000,
  schoolHighlights: ["STEM focus", "After-school programs"],
  shortDescription: "A sample school for testing search results.",
  schoolType: "public",
  location: {
    type: "Point",
    coordinates: [-115.1398, 36.1699],
  },
};

const seedSchools = async () => {
  await connectDB();
  const existing = await School.findOne({ schoolName: sampleSchool.schoolName });
  if (existing) {
    console.log("✅ Sample school already exists.");
  } else {
    await School.create(sampleSchool);
    console.log("✅ Sample school created (near 89101).");
  }
  process.exit(0);
};

seedSchools();
