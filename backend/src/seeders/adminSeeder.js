import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGODB_URI); // Debugging line

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL;

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("✅ Admin user already exists.");
  } else {
    const admin = new User({
      name: "Admin User",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully.");
  }

  process.exit();
};

seedAdminUser();
