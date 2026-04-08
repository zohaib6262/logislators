import React, { useRef, useState, useContext } from "react";
import { Upload, Loader2, AlertTriangle, FileSpreadsheet, PlusCircle } from "lucide-react";
import BASE_URL from "@/lib/utils";
import { TokenContext } from "@/store/TokenContextProvider";
import Button from "@/UI/Button";

async function postImportCsv(endpointSuffix, file) {
  const token = localStorage.getItem("token");
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE_URL}/adminSchoolFinderFeeds/${endpointSuffix}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function ResultBlock({ title, result, error }) {
  if (error) {
    return (
      <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        {error}
      </div>
    );
  }
  if (!result) return null;
  const r = result;
  return (
    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
      <p className="font-semibold mb-2">{title}</p>
      <ul className="space-y-1 font-mono text-xs">
        <li>mode: {r.mode ?? "—"}</li>
        <li>totalRows: {r.totalRows ?? "—"}</li>
        {r.importedCount != null && <li>importedCount: {r.importedCount}</li>}
        {r.addedCount != null && <li>addedCount: {r.addedCount}</li>}
        <li>updatedCount: {r.updatedCount ?? "—"}</li>
        <li>duplicateCount: {r.duplicateCount ?? "—"}</li>
        <li>skippedCount: {r.skippedCount ?? "—"}</li>
        <li>collectionAffected: {r.collectionAffected ?? "—"}</li>
      </ul>
      {r.skippedReasons && Object.keys(r.skippedReasons).length > 0 && (
        <div className="mt-2">
          <p className="font-medium text-gray-700">skippedReasons:</p>
          <ul className="mt-1 space-y-0.5 text-xs">
            {Object.entries(r.skippedReasons).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ImportCard({
  title,
  description,
  helperReplace,
  helperAppend,
  expectedColumns,
  endpointReplace,
  endpointAppend,
  replaceButtonLabel,
  appendButtonLabel,
  primaryColor,
}) {
  const inputRef = useRef(null);
  const [loadingMode, setLoadingMode] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runImport = async (mode) => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a CSV file first.");
      setResult(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file.");
      setResult(null);
      return;
    }

    const endpointSuffix = mode === "replace" ? endpointReplace : endpointAppend;
    const confirmMessage =
      mode === "replace"
        ? "This will remove all existing records in the target collection and replace them with valid rows from this CSV. Continue?"
        : "This will keep existing records and insert only new rows (duplicates are skipped). Continue?";

    if (!window.confirm(confirmMessage)) return;

    setLoadingMode(mode);
    setError(null);
    setResult(null);
    try {
      const { ok, data } = await postImportCsv(endpointSuffix, file);
      if (!ok) {
        setError(data?.message || `Import failed (${data?.collectionAffected || "unknown collection"}).`);
        setResult(data);
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e?.message || "Network error during import.");
    } finally {
      setLoadingMode(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const busy = loadingMode !== null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <FileSpreadsheet className="w-8 h-8 shrink-0 text-slate-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 mb-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Replace</p>
          <p>{helperReplace}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900 mb-4">
        <PlusCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Add data</p>
          <p>{helperAppend}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">Expected columns (header row):</p>
      <p className="text-xs font-mono bg-gray-100 rounded p-2 mb-4 break-all">{expectedColumns}</p>

      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200"
        />
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => runImport("replace")}
            disabled={busy}
            className="whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {loadingMode === "replace" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {replaceButtonLabel}
          </Button>
          <button
            type="button"
            onClick={() => runImport("append")}
            disabled={busy}
            className="whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loadingMode === "append" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            {appendButtonLabel}
          </button>
        </div>
      </div>

      <ResultBlock title="Last result" result={result} error={error} />
    </div>
  );
}

export default function DataImportPage() {
  const { primaryColor } = useContext(TokenContext);

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data import</h1>
        <p className="text-gray-600 mb-8">
          Upload CSV files in memory only — nothing is stored on disk. Use <strong className="font-medium">Replace</strong>{" "}
          to wipe and reload a collection, or <strong className="font-medium">Add data</strong> to keep existing MongoDB
          records and insert only new ones (duplicates skipped). Collections:{" "}
          <code className="text-sm bg-gray-200 px-1 rounded">sf_schools</code>,{" "}
          <code className="text-sm bg-gray-200 px-1 rounded">sf_zipcentroids</code>.
        </p>

        <div className="space-y-8">
          <ImportCard
            title="Schools CSV import"
            description="Import schools with coordinates. Invalid rows are skipped. Replace clears the collection; Add keeps current schools and inserts only new records."
            helperReplace="Removes all documents in sf_schools, then inserts every valid CSV row. If no row is valid, existing data is left unchanged."
            helperAppend="Keeps all existing schools. New rows are matched by normalized school name, address, city, state, and ZIP; rows that already exist are skipped (not updated)."
            expectedColumns="school_name, school_type, grades_served, email, address, city, state, zip_code, latitude, longitude, phone, website"
            endpointReplace="import/schools"
            endpointAppend="import/schools/append"
            replaceButtonLabel="Replace schools data"
            appendButtonLabel="Add schools data"
            primaryColor={primaryColor}
          />

          <ImportCard
            title="ZIP CSV import"
            description="Import ZIP centroids for radius search. Duplicate ZIP codes in the same file keep the first occurrence only."
            helperReplace="Removes all documents in sf_zipcentroids, then inserts every valid CSV row. If no row is valid, existing data is left unchanged."
            helperAppend="Keeps existing ZIP centroids. Only ZIP codes that are not already in the database are inserted; existing ZIPs are skipped (not updated)."
            expectedColumns="zip_code, city, state, latitude, longitude"
            endpointReplace="import/zip-centroids"
            endpointAppend="import/zip-centroids/append"
            replaceButtonLabel="Replace ZIP data"
            appendButtonLabel="Add ZIP data"
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </div>
  );
}
