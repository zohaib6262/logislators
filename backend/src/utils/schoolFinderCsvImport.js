/**
 * In-memory CSV parsing and helpers for admin School Finder bulk import.
 * No file persistence — buffers only.
 */
import { Readable } from "stream";
import csv from "csv-parser";
import mongoose from "mongoose";

export function normalizeCsvHeader(h) {
  return String(h ?? "")
    .replace(/^\ufeff/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

export function parseCsvFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer)
      .pipe(csv({ mapHeaders: ({ header }) => normalizeCsvHeader(header) }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

export function normalizeZipCode(value) {
  const s = String(value ?? "")
    .trim()
    .replace(/\D/g, "")
    .padStart(5, "0")
    .slice(0, 5);
  return s || "";
}

export function bumpReasons(map, reasons) {
  for (const r of reasons) {
    map[r] = (map[r] || 0) + 1;
  }
}

function isValidEmail(s) {
  if (!s || typeof s !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

const SCHOOL_TYPES = ["public", "private", "charter", "homeschool", "other"];

const SCHOOL_HEADERS_REQUIRED = [
  "school_name",
  "school_type",
  "grades_served",
  "email",
  "address",
  "city",
  "state",
  "zip_code",
  "latitude",
  "longitude",
  "phone",
  "website",
];

const ZIP_HEADERS_REQUIRED = [
  "zip_code",
  "city",
  "state",
  "latitude",
  "longitude",
];

export function validateSchoolCsvHeaders(sampleRow) {
  if (!sampleRow || typeof sampleRow !== "object") {
    return { ok: false, missing: SCHOOL_HEADERS_REQUIRED };
  }
  const keys = new Set(Object.keys(sampleRow));
  const missing = SCHOOL_HEADERS_REQUIRED.filter((h) => !keys.has(h));
  return { ok: missing.length === 0, missing };
}

export function validateZipCsvHeaders(sampleRow) {
  if (!sampleRow || typeof sampleRow !== "object") {
    return { ok: false, missing: ZIP_HEADERS_REQUIRED };
  }
  const keys = new Set(Object.keys(sampleRow));
  const missing = ZIP_HEADERS_REQUIRED.filter((h) => !keys.has(h));
  return { ok: missing.length === 0, missing };
}

/**
 * Map one school CSV row to a plain object for School.create / insertMany.
 * Skips with reason string if invalid.
 */
export function mapSchoolCsvRow(row, rowIndex) {
  const reasons = [];
  const schoolName = String(row.school_name ?? "").trim();
  if (!schoolName) reasons.push("missing_school_name");

  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) reasons.push("invalid_latitude");
  if (Number.isNaN(lng) || lng < -180 || lng > 180) reasons.push("invalid_longitude");

  const stRaw = String(row.school_type ?? "").trim().toLowerCase();
  if (!stRaw) reasons.push("missing_school_type");
  else if (!SCHOOL_TYPES.includes(stRaw)) reasons.push("invalid_school_type");

  const address = String(row.address ?? "").trim();
  const city = String(row.city ?? "").trim();
  const state = String(row.state ?? "").trim();
  const zip = normalizeZipCode(row.zip_code);
  if (!address) reasons.push("missing_address");
  if (!city) reasons.push("missing_city");
  if (!state) reasons.push("missing_state");
  if (!zip) reasons.push("missing_or_invalid_zip_code");

  const emailRaw = String(row.email ?? "").trim();
  if (emailRaw && !isValidEmail(emailRaw)) reasons.push("invalid_email");

  if (reasons.length) {
    return { ok: false, rowIndex, reasons };
  }

  const gradesServed = String(row.grades_served ?? "")
    .split(/[,;|]/)
    .map((g) => g.trim())
    .filter(Boolean);

  const phone = String(row.phone ?? "").trim() || undefined;
  const website = String(row.website ?? "").trim() || undefined;

  let shortDescription;
  if (emailRaw) {
    shortDescription = `Contact: ${emailRaw}`;
  }

  const doc = {
    schoolName,
    address,
    city,
    state,
    zip,
    schoolType: stRaw,
    location: { type: "Point", coordinates: [lng, lat] },
    gradesServed: gradesServed.length ? gradesServed : [],
    phone,
    website,
  };
  if (shortDescription) doc.shortDescription = shortDescription;

  return { ok: true, doc, rowIndex };
}

export function mapZipCsvRow(row, rowIndex, seenZips) {
  const reasons = [];
  const zip = normalizeZipCode(row.zip_code);
  if (!zip) reasons.push("missing_or_invalid_zip_code");

  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) reasons.push("invalid_latitude");
  if (Number.isNaN(lng) || lng < -180 || lng > 180) reasons.push("invalid_longitude");

  const city = String(row.city ?? "").trim();
  const state = String(row.state ?? "").trim();
  if (!city) reasons.push("missing_city");
  if (!state) reasons.push("missing_state");

  if (reasons.length) {
    return { ok: false, rowIndex, reasons };
  }

  if (seenZips.has(zip)) {
    return { ok: false, rowIndex, reasons: ["duplicate_zip_in_file"] };
  }
  seenZips.add(zip);

  return {
    ok: true,
    doc: {
      zip,
      zipCode: zip,
      location: { type: "Point", coordinates: [lng, lat] },
    },
    rowIndex,
  };
}

function transactionUnsupportedError(err) {
  const msg = (err && err.message) || "";
  return (
    err?.code === 20 ||
    err?.codeName === "IllegalOperation" ||
    /replica set|transaction/i.test(msg)
  );
}

/**
 * Replace all documents in a collection with validated docs.
 * Uses a transaction when supported; otherwise deleteMany + insertMany (logged).
 */
/**
 * Normalized fingerprint for duplicate detection (school_name + address + city + state + zip).
 * Trimming + lowercase; collapses internal whitespace.
 */
export function schoolFingerprintFromDoc(doc) {
  const norm = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  return `${norm(doc.schoolName)}|${norm(doc.address)}|${norm(doc.city)}|${norm(doc.state)}|${norm(doc.zip)}`;
}

/**
 * Append schools: insert only rows that are valid and whose fingerprint is not already in DB or this CSV batch.
 */
export async function appendSchoolDocuments(School, rows) {
  const skippedReasons = {};
  const validDocs = [];
  for (let i = 0; i < rows.length; i++) {
    const out = mapSchoolCsvRow(rows[i], i + 2);
    if (!out.ok) {
      bumpReasons(skippedReasons, out.reasons);
      continue;
    }
    validDocs.push(out.doc);
  }

  const skippedCount = rows.length - validDocs.length;

  const fingerprintSet = new Set();
  const cursor = School.find().select("schoolName address city state zip").lean().cursor();
  for await (const s of cursor) {
    fingerprintSet.add(schoolFingerprintFromDoc(s));
  }

  let duplicateCount = 0;
  const toInsert = [];
  for (const doc of validDocs) {
    const fp = schoolFingerprintFromDoc(doc);
    if (fingerprintSet.has(fp)) {
      duplicateCount++;
      continue;
    }
    fingerprintSet.add(fp);
    toInsert.push(doc);
  }

  if (toInsert.length > 0) {
    await School.insertMany(toInsert, { ordered: false });
  }

  return {
    totalRows: rows.length,
    addedCount: toInsert.length,
    updatedCount: 0,
    skippedCount,
    duplicateCount,
    skippedReasons,
  };
}

/**
 * Append ZIP centroids: insert only zips not already in DB and not duplicate within the CSV (first row wins).
 */
export async function appendZipDocuments(ZipCentroid, rows) {
  const skippedReasons = {};
  const seenZips = new Set();
  const validDocs = [];
  for (let i = 0; i < rows.length; i++) {
    const out = mapZipCsvRow(rows[i], i + 2, seenZips);
    if (!out.ok) {
      bumpReasons(skippedReasons, out.reasons);
      continue;
    }
    validDocs.push(out.doc);
  }

  const skippedCount = rows.length - validDocs.length;
  const fileDuplicateCount = skippedReasons.duplicate_zip_in_file || 0;

  const zips = validDocs.map((d) => d.zip);
  const existing = await ZipCentroid.find({ zip: { $in: zips } }).select("zip").lean();
  const dbSet = new Set(existing.map((e) => e.zip));

  let dbDuplicateCount = 0;
  const toInsert = [];
  for (const doc of validDocs) {
    if (dbSet.has(doc.zip)) {
      dbDuplicateCount++;
      continue;
    }
    toInsert.push(doc);
  }

  if (toInsert.length > 0) {
    await ZipCentroid.insertMany(toInsert, { ordered: false });
  }

  const duplicateCount = fileDuplicateCount + dbDuplicateCount;

  return {
    totalRows: rows.length,
    addedCount: toInsert.length,
    updatedCount: 0,
    skippedCount,
    duplicateCount,
    skippedReasons,
  };
}

export async function replaceCollectionDocuments(Model, docs, logLabel) {
  const prevCount = await Model.countDocuments();
  console.log(
    `[${logLabel}] Replace import: previous document count = ${prevCount}, new valid rows = ${docs.length}`
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Model.deleteMany({}, { session });
    if (docs.length > 0) {
      await Model.insertMany(docs, { session, ordered: true });
    }
    await session.commitTransaction();
    console.log(`[${logLabel}] Transaction committed.`);
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    if (transactionUnsupportedError(err)) {
      console.warn(
        `[${logLabel}] MongoDB transaction not available or failed; using sequential delete + insert:`,
        err.message
      );
      await Model.deleteMany({});
      if (docs.length > 0) {
        await Model.insertMany(docs, { ordered: true });
      }
    } else {
      throw err;
    }
  } finally {
    session.endSession();
  }
}
