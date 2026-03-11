import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ZipCentroid from "../models/ZipCentroid.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedZipCentroids = async () => {
  await connectDB();
  const path = join(__dirname, "../../data/zip-centroids.json");
  const raw = readFileSync(path, "utf-8");
  const data = JSON.parse(raw);
  let count = 0;
  for (const row of data) {
    const zip = (row.zip || row.zipCode || "").toString().trim();
    if (!zip) continue;
    const lat = Number(row.lat);
    const lng = Number(row.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
    const update = { zip, zipCode: zip, location: { type: "Point", coordinates: [lng, lat] } };
    await ZipCentroid.findOneAndUpdate(
      { $or: [{ zip }, { zipCode: zip }] },
      update,
      { upsert: true, new: true }
    );
    count++;
  }
  console.log(`✅ Zip centroids seeded: ${count} records`);
  process.exit(0);
};

seedZipCentroids();
