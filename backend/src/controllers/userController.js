// import asyncHandler from "express-async-handler";
// import User from "../models/User.js";
// import { generateToken } from "../utils/generateToken.js";
// import dotenv from "dotenv";

// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// import bcrypt from "bcryptjs";

// export const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required",
//     });
//   }

//   // Find user by email
//   const user = await User.findOne({ email: email.trim() });
//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }

//   // Compare password
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }

//   // Success: return user info with token
//   return res.json({
//     success: true,
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin || false,
//     token: generateToken({
//       id: user._id,
//       isAdmin: user.isAdmin || false,
//     }),
//   });
// });

// export const authUser1 = asyncHandler(async (req, res) => {
//   const { email, password, name } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required",
//     });
//   }
//   // ✅ Check in database
//   const user = await User.findOne({ email: email.trim() });
//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }
//   // ✅ Compare password
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }
//   // ✅ Success
//   return res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin || false,
//     token: generateToken({
//       id: user._id,
//       isAdmin: user.isAdmin || false,
//     }),
//   });
//   // if (
//   //   email.trim() === process.env.ADMIN_EMAIL.trim() &&
//   //   password.trim() === process.env.ADMIN_PASSWORD.trim()
//   // ) {
//   //   return res.json({
//   //     _id: "admin",
//   //     email: process.env.ADMIN_EMAIL.trim(),
//   //     isAdmin: true,
//   //     token: generateToken({
//   //       id: "admin",
//   //       isAdmin: true,
//   //     }),
//   //   });
//   // }
//   // return res.status(401).json({
//   //   success: false,
//   //   message: "Invalid email or password",
//   // });
// });

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public
// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, address } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   // Create user in MongoDB
//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   // Create contact in Keap CRM

//   if (user) {
//     try {
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         token: generateToken(user._id),
//       });
//     } catch (error) {
//       // If Keap integration fails, still return user data but log the error
//       console.error("Keap integration failed:", error);
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         token: generateToken(user._id),
//         keapError: "Contact created but CRM sync failed",
//       });
//     }
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// export const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendAdminInviteEmail } from "../utils/emailService.js";
import { generateRandomPassword } from "../utils/passwordGenerator.js";

// Login
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if this is first login after invitation
  if (user.isPending && !user.firstLoginAt) {
    user.isPending = false;
    user.firstLoginAt = new Date();
    await user.save();
  }

  return res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
    isPending: user.isPending,
    token: generateToken({
      id: user._id,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    }),
  });
});

// Invite Admin
export const inviteAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.trim() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Generate random password
  const randomPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // Create new admin user
  const newAdmin = await User.create({
    email: email.trim(),
    password: hashedPassword,
    isAdmin: true,
    isSuperAdmin: false,
    isPending: true, // Will be false after first login
    invitedBy: req.user._id,
    invitedAt: new Date(),
  });

  // Send invitation email
  const emailResult = await sendAdminInviteEmail(
    email,
    randomPassword,
    req.user.name || req.user.email
  );

  if (!emailResult.success) {
    // Delete the user if email fails
    await User.findByIdAndDelete(newAdmin._id);
    return res.status(500).json({
      success: false,
      message: "Failed to send invitation email",
    });
  }

  res.status(201).json({
    success: true,
    message: "Admin invitation sent successfully",
    admin: {
      _id: newAdmin._id,
      email: newAdmin.email,
      isAdmin: newAdmin.isAdmin,
      isPending: newAdmin.isPending,
    },
  });
});

// Get All Admins
export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ isAdmin: true })
    .select("-password")
    .populate("invitedBy", "name email");

  res.json({
    success: true,
    admins,
  });
});

// Delete Admin (Super Admin Only)
export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userToDelete = await User.findById(id);

  if (!userToDelete) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent deleting super admin
  if (userToDelete.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: "Cannot delete Super Admin",
    });
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Admin deleted successfully",
  });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different",
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});
