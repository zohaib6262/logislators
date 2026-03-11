import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, Link, useOutletContext } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import BASE_URL from "@/lib/utils";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";
import { useVotingSection } from "@/hooks/VotingSection/useVotingSection";
import SchoolAvatar from "@/reusableComponents/SchoolAvatar";

const RADIUS_OPTIONS = [1, 5, 10, 25];
const SCHOOL_TYPE_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "charter", label: "Charter" },
  { value: "homeschool", label: "Homeschool" },
  { value: "other", label: "Other" },
];
const GRADE_OPTIONS = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const PAGE_SIZE = 7;

const selectClassName =
  "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

/** Sanitize school highlights: drop empty and label-like entries. */
function sanitizeHighlights(arr) {
  if (!Array.isArray(arr)) return [];
  const skip = new Set(["", "School Highlights:", "school highlights"]);
  return arr
    .map((h) => (h != null ? String(h).trim() : ""))
    .filter((h) => h && !skip.has(h));
}

function formatAddressForList(school) {
  const addr = school.address;
  if (addr != null && typeof addr === "object" && !Array.isArray(addr)) {
    if (typeof addr.fullAddress === "string" && addr.fullAddress.trim()) return addr.fullAddress.trim();
    const parts = [addr.street, addr.city, addr.state, addr.zipCode ?? addr.zip].filter(
      (p) => p != null && String(p).trim() !== ""
    );
    return parts.length ? parts.join(", ") : "";
  }
  if (typeof addr === "string" && addr.trim()) return addr.trim();
  const flat = [school.address, school.city, school.state, school.zip].filter(
    (p) => p != null && String(p).trim() !== "" && typeof p !== "object"
  );
  return flat.length ? flat.join(", ") : "";
}

export default function SchoolsResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schools, setSchools] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60);
  const { votingSection } = useVotingSection();
  const { homeData } = useOutletContext() || {};

  const zipCode = (searchParams.get("zipCode") || searchParams.get("zipcode") || "").trim();
  const radiusMiles = searchParams.get("radiusMiles") || searchParams.get("radiusmiles") || "5";
  const grade = searchParams.get("grade") || "";
  const schoolType = searchParams.get("schoolType") || searchParams.get("schooltype") || "";
  const maxCost = searchParams.get("maxCost") || searchParams.get("maxcost") || "";
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize") || searchParams.get("pagesize");
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = Math.max(1, Math.min(50, Number(pageSizeParam) || PAGE_SIZE));

  const [filterRadius, setFilterRadius] = useState(radiusMiles);
  const [filterGrade, setFilterGrade] = useState(grade);
  const [filterSchoolType, setFilterSchoolType] = useState(schoolType);
  const [filterMaxCost, setFilterMaxCost] = useState(maxCost);

  useEffect(() => {
    setFilterRadius(radiusMiles);
    setFilterGrade(grade);
    setFilterSchoolType(schoolType);
    setFilterMaxCost(maxCost);
  }, [radiusMiles, grade, schoolType, maxCost]);

  useEffect(() => {
    if (!zipCode) {
      setError("ZIP Code is required for search.");
      setLoading(false);
      return;
    }

    const effectiveRadius = radiusMiles || "5";
    const effectivePage = Math.max(1, page);
    const effectivePageSize = Math.max(1, Math.min(50, pageSize || PAGE_SIZE));

    const params = new URLSearchParams();
    params.set("zipCode", zipCode);
    params.set("radiusMiles", effectiveRadius);
    params.set("page", String(effectivePage));
    params.set("pageSize", String(effectivePageSize));
    if (grade) params.set("grade", grade);
    if (schoolType) params.set("schoolType", schoolType);
    if (maxCost !== "") params.set("maxCost", maxCost);

    const searchUrl = `${BASE_URL}/userSchoolFinder/search?${params.toString()}`;
    if (import.meta.env.DEV) {
      console.log("[SchoolsResults] fetch", { zipCode, radiusMiles: effectiveRadius, grade, schoolType, maxCost, page: effectivePage, pageSize: effectivePageSize }, searchUrl);
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);
    fetch(searchUrl, { signal: ac.signal })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          let msg = "Search failed.";
          try {
            const d = JSON.parse(text);
            if (d?.message) msg = d.message;
          } catch {
            if (res.status === 404) {
              msg =
                "Search service returned 404. Ensure the backend is running and has the school finder routes. " +
                "For local dev use VITE_BASE_URL=http://localhost:8000/api (backend default port is 8000).";
              if (import.meta.env.DEV) msg += ` Requested: ${searchUrl}`;
            } else {
              msg = "Server returned an error. Please try again later.";
            }
          }
          throw new Error(msg);
        }
        return JSON.parse(text);
      })
      .then((data) => {
        if (ac.signal.aborted) return;
        const list = Array.isArray(data.schools) ? data.schools : [];
        const total = typeof data.totalCount === "number" ? data.totalCount : 0;
        const pages = total > 0 ? Math.ceil(total / effectivePageSize) : 1;
        setSchools(list);
        setTotalCount(total);
        setTotalPages(pages);
        if (import.meta.env.DEV) {
          console.log("[SchoolsResults] response", { totalCount: total, page: data.page, pageSize: data.pageSize, totalPages: pages, schoolsCount: list.length });
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load schools");
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [zipCode, radiusMiles, grade, schoolType, maxCost, page, pageSize]);

  const handleApplyFilters = () => {
    const next = new URLSearchParams();
    next.set("zipCode", zipCode);
    next.set("radiusMiles", filterRadius || "5");
    next.set("grade", filterGrade);
    next.set("schoolType", filterSchoolType);
    next.set("maxCost", filterMaxCost);
    next.set("page", "1");
    next.set("pageSize", String(PAGE_SIZE));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (nextPage) => {
    if (!zipCode?.trim()) return;
    const safeTotalPages = totalPages && totalPages > 0 ? totalPages : 1;
    const target = Math.max(1, Math.min(safeTotalPages, nextPage));
    const next = new URLSearchParams();
    next.set("zipCode", zipCode);
    next.set("radiusMiles", radiusMiles || "5");
    if (grade) next.set("grade", grade);
    if (schoolType) next.set("schoolType", schoolType);
    if (maxCost !== "") next.set("maxCost", maxCost);
    next.set("page", String(target));
    next.set("pageSize", String(pageSize || PAGE_SIZE));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchSummaryParts = [];
  if (zipCode) searchSummaryParts.push(`ZIP ${zipCode}`);
  if (radiusMiles) searchSummaryParts.push(`${radiusMiles} miles`);
  if (grade) searchSummaryParts.push(`Grade ${grade}`);
  if (schoolType) searchSummaryParts.push(schoolType);
  if (maxCost) searchSummaryParts.push(`Max cost $${maxCost}`);
  const searchSummary = searchSummaryParts.length ? searchSummaryParts.join(" · ") : "";

  const resultsQueryString = () => {
    const p = new URLSearchParams();
    p.set("zipCode", zipCode);
    p.set("radiusMiles", radiusMiles || "5");
    if (grade) p.set("grade", grade);
    if (schoolType) p.set("schoolType", schoolType);
    if (maxCost !== "") p.set("maxCost", maxCost);
     p.set("page", String(page));
     p.set("pageSize", String(pageSize || PAGE_SIZE));
    return p.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative">
      <div
        className="py-12 relative"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="absolute left-4 top-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white font-medium px-4 py-2 rounded-lg shadow transition"
              style={{
                color: primaryColor,
                border: `1px solid ${primaryColor}`,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              New search
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mt-3">
            School Search Results
          </h1>
          {searchSummary && (
            <p className="text-xl text-blue-100 text-center mt-4">
              Results for: {searchSummary}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!zipCode?.trim() ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">ZIP Code is required for search.</p>
          </div>
        ) : (
          <>
            {/* Filter UI */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label htmlFor="filter-radius" className="block text-sm font-medium text-gray-700 mb-1">
                    Radius (miles)
                  </label>
                  <select
                    id="filter-radius"
                    value={filterRadius}
                    onChange={(e) => setFilterRadius(e.target.value)}
                    className={selectClassName + " w-full"}
                  >
                    {RADIUS_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? "mile" : "miles"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    id="filter-grade"
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className={selectClassName + " w-full"}
                  >
                    <option value="">Any</option>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-1">
                    School Type
                  </label>
                  <select
                    id="filter-type"
                    value={filterSchoolType}
                    onChange={(e) => setFilterSchoolType(e.target.value)}
                    className={selectClassName + " w-full"}
                  >
                    <option value="">Any</option>
                    {SCHOOL_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-cost" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Cost
                  </label>
                  <input
                    id="filter-cost"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={filterMaxCost}
                    onChange={(e) => setFilterMaxCost(e.target.value)}
                    className={selectClassName + " w-full"}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2 rounded-md font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </div>

            {/* X options line */}
            <p className="text-gray-700 mb-1">
              {loading
                ? "Finding options…"
                : `You have ${totalCount} option${totalCount === 1 ? "" : "s"} in your area`}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Tip: Click a school to view full details.
            </p>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                  style={{ borderColor: primaryColor }}
                />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : schools.length > 0 ? (
              <>
                <ul className="space-y-3">
                  {schools.map((school) => {
                    const addressStr = formatAddressForList(school);
                    const dist =
                      school.distanceMiles != null ? Number(school.distanceMiles).toFixed(1) : null;
                    const highlights = sanitizeHighlights(school.schoolHighlights);
                    return (
                      <li key={school._id}>
                        <Link
                          to={`/schools/${school._id}?${resultsQueryString()}`}
                          className="flex items-center gap-4 bg-white rounded-lg shadow p-4 hover:shadow-lg hover:border-gray-300 border border-gray-100 transition cursor-pointer group"
                        >
                          <SchoolAvatar school={school} size="sm" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:underline">
                              {school.schoolName || "School"}
                            </h3>
                            {addressStr && (
                              <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {addressStr}
                              </p>
                            )}
                            {dist != null && (
                              <p className="text-sm text-gray-500 mt-1">{dist} mi away</p>
                            )}
                            {highlights.length > 0 && (
                              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                                {highlights.slice(0, 3).map((h, i) => (
                                  <li key={i}>{h}</li>
                                ))}
                                {highlights.length > 3 && (
                                  <li key="more">+{highlights.length - 3} more</li>
                                )}
                              </ul>
                            )}
                          </div>
                          <span
                            className="flex items-center gap-1 text-sm font-medium shrink-0 group-hover:underline"
                            style={{ color: primaryColor }}
                          >
                            View details
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {totalPages > 1 && totalCount > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className={`px-3 py-1 rounded border text-sm ${
                        page <= 1
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {Math.min(page, totalPages || 1)} of {totalPages || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= (totalPages || 1)}
                      className={`px-3 py-1 rounded border text-sm ${
                        page >= (totalPages || 1)
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-700">No schools found for your search.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Try a larger radius or fewer filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {homeData?.howLegislatorsScored && (
        <div className="container mx-auto px-4 flex justify-center ">
          <div
            className="border-l-4 p-6 rounded-r-lg container mx-auto px-4 my-10"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: primaryColor,
            }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              How Legislators Are Scored?
            </h3>
            <p className="text-gray-700 mb-4">{homeData.howLegislatorsScored}</p>
            {homeData?.howLegislatorsScoredLink && (
              <a
                href={homeData.howLegislatorsScoredLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      )}
      {!homeData?.howLegislatorsScored && (
        <div className="container mx-auto px-4 flex justify-center ">
          <div
            className="border-l-4 p-6 rounded-r-lg container mx-auto px-4 my-10"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: primaryColor,
            }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              How Schools Are Selected?
            </h3>
            <p className="text-gray-700 mb-4">
              Schools are shown by distance from your ZIP code. Use filters to narrow by grade,
              school type, and max cost.
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 flex justify-center ">
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8 justify-content-around my-5">
          {votingSection.map((feature) => (
            <div
              key={feature._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: lightPrimary }}
              >
                <img src={feature?.icon} alt="Feature Icon" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature?.title || ""}
              </h3>
              <p className="text-gray-600">{feature?.description || ""}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
