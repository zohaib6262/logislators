/**
 * Seed ZipCentroid collection from a CSV (e.g. cityzipcodes.csv).
 * Uses streaming read + bulkWrite; does not change any routes or app flow.
 *
 * Usage:
 *   npm run seed:zips:csv
 *   CITYZIP_CSV_PATH=/path/to/file.csv npm run seed:zips:csv
 *
 * Verification (replace 3000 with your backend port if different, e.g. 8000):
 *   curl http://localhost:3000/api/adminSchoolFinderFeeds/zip-centroids/10001
 *   curl http://localhost:3000/api/adminSchoolFinderFeeds/zip-centroids/90210
 *   curl "http://localhost:3000/api/userSchoolFinder/search?zipCode=10001&radiusMiles=5"
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createReadStream } from "fs";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ZipCentroid from "../models/ZipCentroid.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BATCH_SIZE = 1000;
const PROGRESS_INTERVAL = 5000;

/** Default path relative to backend root (where package.json lives). */
const DEFAULT_CSV_PATH = join(__dirname, "../../country-metadata/cityzipcodes.csv");

/** Normalize header for case-insensitive match. */
const norm = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, "");

function findColumnIndex(headers, variants) {
  const normalized = headers.map((h) => norm(h));
  for (const v of variants) {
    const key = norm(v);
    const i = normalized.findIndex((h) => h === key);
    if (i !== -1) return i;
  }
  return -1;
}

/** Detect delimiter: pipe or comma. */
function detectDelimiter(line) {
  if (!line) return ",";
  return line.includes("|") ? "|" : ",";
}

/** Zip as 5-char string, preserve leading zeros. Never parse as number. */
function normalizeZip(value) {
  const s = (value ?? "").toString().trim();
  if (!s) return null;
  return s.padStart(5, "0").slice(0, 5);
}

function isValidLat(lat) {
  const n = Number(lat);
  return Number.isNaN(n) === false && n >= -90 && n <= 90;
}

function isValidLng(lng) {
  const n = Number(lng);
  return Number.isNaN(n) === false && n >= -180 && n <= 180;
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  const csvPath =
    process.env.CITYZIP_CSV_PATH?.trim() ||
    DEFAULT_CSV_PATH;

  console.log(`📂 CSV path: ${csvPath}`);

  const stream = createReadStream(csvPath, { encoding: "utf8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let headerLine = null;
  let headers = [];
  let zipIdx = -1;
  let latIdx = -1;
  let lngIdx = -1;
  let delimiter = ",";
  let batch = [];
  let totalUpserted = 0;
  let rowNumber = 0;

  for await (const line of rl) {
    rowNumber++;
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!headerLine) {
      headerLine = trimmed;
      delimiter = detectDelimiter(headerLine);
      headers = headerLine.split(delimiter).map((h) => h.trim());
      zipIdx = findColumnIndex(headers, ["zip", "zipcode", "ZIP", "Zipcode"]);
      latIdx = findColumnIndex(headers, ["lat", "latitude", "LAT", "Latitude"]);
      lngIdx = findColumnIndex(headers, [
        "lng",
        "lon",
        "longitude",
        "LNG",
        "LON",
        "Longitude",
      ]);
      if (zipIdx === -1 || latIdx === -1 || lngIdx === -1) {
        console.error(
          "❌ Could not find zip/lat/lng columns. Headers:",
          headers
        );
        process.exit(1);
      }
      continue;
    }

    const parts = trimmed.split(delimiter);
    const zip = normalizeZip(parts[zipIdx]);
    if (!zip) continue;

    const latRaw = parts[latIdx] != null ? parts[latIdx].trim() : "";
    const lngRaw = parts[lngIdx] != null ? parts[lngIdx].trim() : "";
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!isValidLat(lat) || !isValidLng(lng)) continue;

    batch.push({
      updateOne: {
        filter: { zip },
        update: {
          $set: {
            zip,
            zipCode: zip,
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        },
        upsert: true,
      },
    });

    if (batch.length >= BATCH_SIZE) {
      await ZipCentroid.bulkWrite(batch, { ordered: false });
      totalUpserted += batch.length;
      if (totalUpserted % PROGRESS_INTERVAL < BATCH_SIZE) {
        console.log(`   … ${totalUpserted} rows processed`);
      }
      batch = [];
    }
  }

  if (batch.length > 0) {
    await ZipCentroid.bulkWrite(batch, { ordered: false });
    totalUpserted += batch.length;
  }

  console.log(`✅ Zip centroids from CSV seeded: ${totalUpserted} records`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seeder error:", err);
  process.exit(1);
});
