import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/", registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
