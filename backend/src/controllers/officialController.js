import asyncHandler from "express-async-handler";
import Official from "../models/Official.js";

// @desc    Get all officials
// @route   GET /api/officials
// @access  Public
export const getOfficials = asyncHandler(async (req, res) => {
  const officials = await Official.find({});
  res.json(officials);
});

// @desc    Get official by ID
// @route   GET /api/officials/:id
// @access  Public
export const getOfficialById = asyncHandler(async (req, res) => {
  const official = await Official.findById(req.params.id);
  if (official) {
    res.json(official);
  } else {
    res.status(404);
    throw new Error("Official not found");
  }
});

// @desc    Create official
// @route   POST /api/officials
// @access  Private/Admin
export const createOfficial = asyncHandler(async (req, res) => {
  const official = new Official(req.body);
  const createdOfficial = await official.save();
  res.status(201).json(createdOfficial);
});

// @desc    Update official
// @route   PUT /api/officials/:id
// @access  Private/Admin
export const updateOfficial = asyncHandler(async (req, res) => {
  const official = await Official.findById(req.params.id);

  if (official) {
    Object.assign(official, req.body);
    const updatedOfficial = await official.save();
    res.json(updatedOfficial);
  } else {
    res.status(404);
    throw new Error("Official not found");
  }
});

// @desc    Delete official
// @route   DELETE /api/officials/:id
// @access  Private/Admin
export const deleteOfficial = asyncHandler(async (req, res) => {
  const official = await Official.findById(req.params.id);

  if (official) {
    await official.deleteOne();
    res.json({ message: "Official removed" });
  } else {
    res.status(404);
    throw new Error("Official not found");
  }
});
