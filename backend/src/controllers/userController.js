import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import dotenv from "dotenv";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
import bcrypt from "bcryptjs";

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find user by email
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Success: return user info with token
  return res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin || false,
    token: generateToken({
      id: user._id,
      isAdmin: user.isAdmin || false,
    }),
  });
});

export const authUser1 = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }
  // ✅ Check in database
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  // ✅ Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  // ✅ Success
  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin || false,
    token: generateToken({
      id: user._id,
      isAdmin: user.isAdmin || false,
    }),
  });
  // if (
  //   email.trim() === process.env.ADMIN_EMAIL.trim() &&
  //   password.trim() === process.env.ADMIN_PASSWORD.trim()
  // ) {
  //   return res.json({
  //     _id: "admin",
  //     email: process.env.ADMIN_EMAIL.trim(),
  //     isAdmin: true,
  //     token: generateToken({
  //       id: "admin",
  //       isAdmin: true,
  //     }),
  //   });
  // }
  // return res.status(401).json({
  //   success: false,
  //   message: "Invalid email or password",
  // });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user in MongoDB
  const user = await User.create({
    name,
    email,
    password,
  });

  // Create contact in Keap CRM

  if (user) {
    try {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } catch (error) {
      // If Keap integration fails, still return user data but log the error
      console.error("Keap integration failed:", error);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        keapError: "Contact created but CRM sync failed",
      });
    }
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
