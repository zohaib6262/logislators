// Writes to shared users collection (User model unchanged for School Finder isolation).
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

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

const seedAdminUser = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running seed:admin.");
    process.exit(1);
  }

  const passwordLooksLikeBcrypt = (p) =>
    typeof p === "string" && /^\$2[aby]\$\d{2}\$/.test(p);

  const forceReset =
    process.env.ADMIN_RESET_PASSWORD === "1" ||
    process.env.ADMIN_RESET_PASSWORD === "true";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    const needsLegacyFix =
      !passwordLooksLikeBcrypt(existingAdmin.password) || forceReset;
    if (needsLegacyFix) {
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log(
        forceReset
          ? "✅ Admin password updated from ADMIN_PASSWORD (ADMIN_RESET_PASSWORD set)."
          : "✅ Admin had a legacy plain-text password; re-hashed to match login (bcrypt)."
      );
    } else {
      console.log("✅ Admin user already exists (password unchanged).");
      console.log(
        "   To set password from .env: ADMIN_RESET_PASSWORD=1 npm run seed:admin"
      );
    }
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully.");
  }

  process.exit();
};

seedAdminUser();
