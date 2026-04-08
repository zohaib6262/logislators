import express from "express";
import PrimaryColor from "../models/PrimaryColor.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc Get the primary color or create default if not exists
router.get(
  "/",
  asyncHandler(async (req, res) => {
    let color = await PrimaryColor.findOne();

    // If not found, create with default value
    if (!color) {
      color = await PrimaryColor.create({
        primaryBgColor: "#3b82f6", // default Tailwind blue-500
      });
    }

    res.json(color);
  })
);

// @desc Update or create the primary color
router.put(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { primaryBgColor } = req.body;

    if (!primaryBgColor) {
      res.status(400);
      throw new Error("Primary background color is required");
    }

    let color = await PrimaryColor.findOne();

    if (color) {
      color.primaryBgColor = primaryBgColor;
      color.lastUpdated = Date.now();
      await color.save();
    } else {
      color = await PrimaryColor.create({ primaryBgColor });
    }

    res.json(color);
  })
);

export default router;
