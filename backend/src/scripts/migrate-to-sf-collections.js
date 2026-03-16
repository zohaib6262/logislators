/**
 * One-time migration: copy existing School Finder data from old collections
 * into the new sf_ prefixed collections. Safe to rerun (idempotent, upsert by _id).
 *
 * Collections migrated:
 *   schools           -> sf_schools
 *   schoolsubmissions  -> sf_schoolsubmissions
 *   zipcentroids      -> sf_zipcentroids
 *
 * Does NOT touch: users (shared).
 * Does NOT delete old collections.
 *
 * Usage (from backend directory):
 *   node src/scripts/migrate-to-sf-collections.js
 *   npm run migrate:sf-collections
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set. Set it in .env and try again.");
  process.exit(1);
}

const BATCH_SIZE = 500;

const MIGRATIONS = [
  { source: "schools", target: "sf_schools" },
  { source: "schoolsubmissions", target: "sf_schoolsubmissions" },
  { source: "zipcentroids", target: "sf_zipcentroids" },
];

async function collectionExists(db, name) {
  const cols = await db.listCollections({ name }).toArray();
  return cols.length > 0;
}

async function migrateCollection(db, sourceName, targetName) {
  const source = db.collection(sourceName);
  const target = db.collection(targetName);

  const exists = await collectionExists(db, sourceName);
  if (!exists) {
    console.log(`   ⏭️  Source collection "${sourceName}" does not exist. Skipping.`);
    return { found: 0, inserted: 0, modified: 0, skipped: true };
  }

  const found = await source.countDocuments();
  if (found === 0) {
    console.log(`   📭 Source "${sourceName}" has 0 documents. Nothing to copy.`);
    return { found: 0, inserted: 0, modified: 0, skipped: false };
  }

  console.log(`   📂 Source: ${sourceName} (${found} documents)`);
  console.log(`   📁 Target: ${targetName}`);

  let inserted = 0;
  let modified = 0;
  const cursor = source.find({});
  let batch = [];
  let processed = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) break;
    batch.push(doc);
    if (batch.length >= BATCH_SIZE) {
      const ops = batch.map((d) => ({
        replaceOne: {
          filter: { _id: d._id },
          replacement: d,
          upsert: true,
        },
      }));
      const result = await target.bulkWrite(ops, { ordered: false });
      inserted += result.upsertedCount ?? 0;
      modified += result.modifiedCount ?? 0;
      processed += batch.length;
      console.log(`   … processed ${processed}/${found}`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    const ops = batch.map((d) => ({
      replaceOne: {
        filter: { _id: d._id },
        replacement: d,
        upsert: true,
      },
    }));
    const result = await target.bulkWrite(ops, { ordered: false });
    inserted += result.upsertedCount ?? 0;
    modified += result.modifiedCount ?? 0;
  }

  return { found, inserted, modified, skipped: false };
}

async function run() {
  console.log("\n🔄 School Finder migration: old collections → sf_ collections\n");
  console.log("   (users collection is not touched.)\n");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

  const db = mongoose.connection.db;

  for (const { source, target } of MIGRATIONS) {
    console.log(`\n--- ${source} → ${target} ---`);
    try {
      const { found, inserted, modified, skipped } = await migrateCollection(
        db,
        source,
        target
      );
      if (!skipped) {
        console.log(
          `   ✅ Done. Found: ${found} | Inserted (new): ${inserted} | Modified (already existed): ${modified}`
        );
      }
    } catch (err) {
      console.error(`   ❌ Error migrating ${source} → ${target}:`, err.message);
    }
  }

  console.log("\n✅ Migration finished.\n");
  console.log("   Old collections were NOT deleted. You can drop them manually after verification.\n");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
