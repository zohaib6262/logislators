import express from "express";
import Resource from "../models/Resource.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Server error while fetching resources" });
  }
});

// Get a single resource by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(resource);
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    res.status(400).json({ error: "Invalid resource ID format" });
  }
});

// Create a new resource
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, url, category, customFields, isFeatured } =
      req.body;

    if (!title || !description || !url || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newResource = new Resource({
      title,
      description,
      url,
      category,
      customFields,
      isFeatured,
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Server error while creating resource" });
  }
});

// Update an existing resource
router.put("/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedResource);
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(400).json({ error: "Invalid data or resource ID" });
  }
});

// Delete a resource
router.delete("/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(400).json({ error: "Invalid resource ID format" });
  }
});

export default router;
