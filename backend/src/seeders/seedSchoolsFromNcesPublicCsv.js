/**
 * Seed School collection from NCES Public School Locations CSV.
 * Uses streaming CSV parsing + bulkWrite; does not change routes or search logic.
 *
 * Usage:
 *   npm run seed:schools:nces
 *   NCES_SCHOOLS_CSV_PATH=/path/to/file.csv npm run seed:schools:nces
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createReadStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import csv from "csv-parser";
import School from "../models/School.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BATCH_SIZE = 1000;
const PROGRESS_INTERVAL = 5000;

const DEFAULT_CSV_PATH = join(
  __dirname,
  "../../country-metadata/Public_School_Locations_-_Current.csv"
);

function normalizeZip(value) {
  const s = String(value ?? "")
    .trim()
    .padStart(5, "0")
    .slice(0, 5);
  return s || null;
}

function isValidLat(lat) {
  const n = Number(lat);
  return !Number.isNaN(n) && n >= -90 && n <= 90;
}

function isValidLng(lng) {
  const n = Number(lng);
  return !Number.isNaN(n) && n >= -180 && n <= 180;
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
    process.env.NCES_SCHOOLS_CSV_PATH?.trim() || DEFAULT_CSV_PATH;
  console.log(`📂 CSV path: ${csvPath}`);

  let batch = [];
  let totalUpserted = 0;
  let rowNumber = 0;

  let writing = false;
  let streamEnded = false;

  const flushRemainingAndResolve = async (resolve, reject) => {
    try {
      if (batch.length > 0) {
        await School.bulkWrite(batch, { ordered: false });
        totalUpserted += batch.length;
        batch.length = 0;
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  };

  await new Promise((resolve, reject) => {
    const stream = createReadStream(csvPath, { encoding: "utf8" }).pipe(csv());

    stream.on("data", (row) => {
      rowNumber++;
      const ncessch = (row.NCESSCH ?? "").toString().trim();
      if (!ncessch) return;

      const latRaw = row.LAT != null ? row.LAT : row.Y;
      const lngRaw = row.LON != null ? row.LON : row.X;
      const lat = Number(latRaw);
      const lng = Number(lngRaw);
      if (!isValidLat(lat) || !isValidLng(lng)) return;

      const zip = normalizeZip(row.ZIP);
      const street = (row.STREET ?? "").toString().trim();
      const city = (row.CITY ?? "").toString().trim();
      const state = (row.STATE ?? "").toString().trim();
      const fullAddress = [street, city, state, zip].filter(Boolean).join(", ");
      const schoolName = (row.NAME ?? "").toString().trim() || "School";

      batch.push({
        updateOne: {
          filter: { ncessch },
          update: {
            $set: {
              ncessch,
              schoolName,
              address: fullAddress || street,
              city,
              state,
              zip: zip || undefined,
              schoolType: "public",
              gradesMin: 0,
              gradesMax: 12,
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
        stream.pause();
        const batchToWrite = batch.splice(0, batch.length);
        writing = true;
        School.bulkWrite(batchToWrite, { ordered: false })
          .then(() => {
            totalUpserted += batchToWrite.length;
            if (totalUpserted % PROGRESS_INTERVAL < BATCH_SIZE) {
              console.log(`   … ${totalUpserted} rows processed`);
            }
            writing = false;
            if (streamEnded) {
              flushRemainingAndResolve(resolve, reject);
            } else {
              stream.resume();
            }
          })
          .catch((e) => {
            stream.destroy(e);
            reject(e);
          });
      }
    });

    stream.on("end", () => {
      streamEnded = true;
      if (!writing) {
        flushRemainingAndResolve(resolve, reject);
      }
    });

    stream.on("error", reject);
  }).catch((err) => {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  });

  console.log(`✅ Schools from NCES CSV seeded: ${totalUpserted} records`);

  const count = await School.countDocuments();
  console.log(`   db.schools.countDocuments() => ${count}`);

  await mongoose.connection.close();
  process.exit(0);
};

run();
