// scripts/updateDaraToSuperAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../backend/src/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const superAdminEmail = "zohaibbinashraaf@gmail.com";
    const superAdminPassword = "zohaib123"; // Change this

    const existingUser = await User.findOne({ email: superAdminEmail });

    if (existingUser) {
      existingUser.isSuperAdmin = true;
      existingUser.isAdmin = true;
      await existingUser.save();
      console.log("✅ Existing user updated to Super Admin");
    } else {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true,
        isPending: false,
      });
      console.log("✅ Super Admin created successfully");
    }

    console.log("Email:", superAdminEmail);
    console.log("Password:", superAdminPassword);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createSuperAdmin();
