import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
const router = express.Router();

router.post("/login", authUser);

router.post(
  "/reset-password",
  protect,
  asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Get user from auth middleware
    const email = "dara@nevadapolicy.org";
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Check new password is different
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password must be different" });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  })
);

router.post("/", registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
