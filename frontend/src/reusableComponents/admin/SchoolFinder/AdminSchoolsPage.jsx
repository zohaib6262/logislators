import { TokenContext } from "@/store/TokenContextProvider";
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Building2,
  Loader2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  useAdminSchoolsList,
  useAdminSchool,
  usePatchAdminSchool,
  useDeleteAdminSchool,
} from "@/hooks/useAdminSchools";
import { buildPaginationPages } from "./buildPaginationPages";

const lightenColor = (color, percent) => {
  if (!color) return "#93c5fd";
  color = color.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const lighten = (value) =>
    Math.min(255, value + Math.round(255 * (percent / 100)));
  return `#${[
    lighten(r).toString(16).padStart(2, "0"),
    lighten(g).toString(16).padStart(2, "0"),
    lighten(b).toString(16).padStart(2, "0"),
  ].join("")}`;
};

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSchoolsPage() {
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = lightenColor(primaryColor, 30);

  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [jumpInput, setJumpInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    schools,
    total,
    totalPages,
    page: resolvedPage,
    limit: activeLimit,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminSchoolsList({ page, limit: pageSize, search: debouncedSearch });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  const lastResolvedPageRef = useRef(null);
  const { school: viewSchool } = useAdminSchool(viewId);
  const { school: editSchool, isLoading: isEditSchoolLoading, error: editSchoolError } = useAdminSchool(editId);
  const { patch, isLoading: isPatching } = usePatchAdminSchool();
  const { deleteSchool, isLoading: isDeleting } = useDeleteAdminSchool();

  useEffect(() => {
    if (isFetching || error) return;
    if (lastResolvedPageRef.current === resolvedPage) return;
    lastResolvedPageRef.current = resolvedPage;
    if (resolvedPage !== page) setPage(resolvedPage);
  }, [isFetching, error, resolvedPage, page]);

  useEffect(() => {
    if (page > totalPages && totalPages >= 1) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    setJumpInput(String(page));
  }, [page]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchool(id);
      showNotification("School deleted.");
      setDeleteId(null);
      refetch();
    } catch {
      showNotification("Failed to delete school.", "error");
    }
  };

  const handleEditSave = async (id, updates) => {
    try {
      await patch(id, updates);
      showNotification("School updated.");
      setEditId(null);
      refetch();
    } catch {
      showNotification("Failed to update school.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4"
            size={48}
            style={{ color: primaryColor }}
          />
          <p className="text-gray-600 font-medium">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error && schools.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <AlertCircle className="mx-auto mb-4" size={48} style={{ color: primaryColor }} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 text-white rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div
        className="py-12 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-6 -mt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-white">Schools</h1>
          </div>
          <p className="text-white/90 text-center text-lg">
            Manage approved schools that appear in public search
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Schools ({total})</h2>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium whitespace-nowrap">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-medium text-gray-800 min-w-[5rem]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>

          <div className="p-4 sm:p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by school name, city, ZIP, website, phone, or school type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base"
                  style={{ outlineColor: primaryColor }}
                />
              </div>
            </div>
          </div>

          {error && schools.length > 0 && (
            <div className="mx-4 sm:mx-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => refetch()}
                className="shrink-0 px-4 py-2 rounded-lg font-semibold text-white text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Retry
              </button>
            </div>
          )}

          <div className="relative max-w-full overflow-x-auto" aria-busy={isFetching && schools.length > 0}>
            <table className="w-full table-fixed sm:table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 w-[32%] sm:w-auto max-w-[min(280px,40vw)]">
                    School Name
                  </th>
                  <th className="hidden sm:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    City
                  </th>
                  <th className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    State
                  </th>
                  <th className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    ZIP
                  </th>
                  <th className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Website
                  </th>
                  <th className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Updated
                  </th>
                  <th className="min-w-[10rem] px-1 py-2 text-right text-xs sm:text-sm font-semibold text-gray-700 align-middle whitespace-nowrap sticky right-0 bg-gray-100 z-[1] shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.12)]">
                    <span className="inline-flex items-center gap-1.5 justify-end w-full">
                      Actions
                      {isFetching && schools.length > 0 ? (
                        <Loader2 className="animate-spin shrink-0 text-gray-500" size={14} aria-hidden />
                      ) : null}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schools.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td
                      className="px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm font-medium text-gray-900 align-top"
                      title={row.schoolName || undefined}
                    >
                      <span className="line-clamp-2 sm:line-clamp-none break-words">{row.schoolName || "—"}</span>
                    </td>
                    <td className="hidden sm:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top">
                      {row.city || "—"}
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top">
                      {row.state || "—"}
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top">
                      {row.zip || "—"}
                    </td>
                    <td className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 capitalize align-top">
                      {row.schoolType || "—"}
                    </td>
                    <td className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top">
                      {row.website ? (
                        <a href={row.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Link
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top break-all">
                      {row.phone || "—"}
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm text-gray-600 align-top whitespace-nowrap">
                      {formatDate(row.updatedAt)}
                    </td>
                    <td className="min-w-[10rem] px-1 py-2 align-middle whitespace-nowrap sticky right-0 bg-white z-[1] shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.08)]">
                      <div className="flex flex-nowrap items-center justify-end gap-0.5">
                        <button
                          type="button"
                          onClick={() => setViewId(row._id)}
                          className="inline-flex shrink-0 items-center justify-center p-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          aria-label="View school"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditId(row._id)}
                          className="inline-flex shrink-0 items-center justify-center p-1.5 rounded-md bg-orange-600 text-white hover:bg-orange-700"
                          aria-label="Edit school"
                          title="Edit"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(row._id)}
                          className="inline-flex shrink-0 items-center justify-center p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                          aria-label="Delete school"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isFetching && schools.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Building2 size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No schools found</p>
              </div>
            )}
          </div>

          {total > 0 && (
            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-4">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                {(() => {
                  const start = (page - 1) * activeLimit + 1;
                  const end = Math.min(page * activeLimit, total);
                  return (
                    <>
                      Showing <span className="font-semibold text-gray-800">{start}</span>–
                      <span className="font-semibold text-gray-800">{end}</span> of{" "}
                      <span className="font-semibold text-gray-800">{total}</span>
                      <span className="hidden sm:inline">
                        {" "}
                        · Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
                        <span className="font-semibold text-gray-800">{totalPages}</span>
                      </span>
                    </>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-between gap-3">
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    type="button"
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1 flex-wrap justify-center px-1">
                    {buildPaginationPages(page, totalPages).map((item, idx) =>
                      item === "ellipsis" ? (
                        <span key={`e-${idx}`} className="px-2 text-gray-400 select-none">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          disabled={isFetching}
                          onClick={() => setPage(Number(item))}
                          className={`min-w-[2.25rem] px-2 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-40 ${
                            item === page
                              ? "text-white border-transparent"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                          style={item === page ? { backgroundColor: primaryColor } : undefined}
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>

                <form
                  className="flex items-center gap-2 justify-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const n = parseInt(jumpInput, 10);
                    if (Number.isFinite(n) && n >= 1) setPage(Math.min(totalPages, n));
                    else setJumpInput(String(page));
                  }}
                >
                  <label htmlFor="admin-schools-jump-page" className="text-sm text-gray-700 whitespace-nowrap">
                    Go to page
                  </label>
                  <input
                    id="admin-schools-jump-page"
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center font-medium text-gray-800"
                  />
                  <button
                    type="submit"
                    disabled={isFetching}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewId && (
        <ViewSchoolModal
          school={viewSchool}
          isLoading={!viewSchool}
          onClose={() => setViewId(null)}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
        />
      )}

      {editId && isEditSchoolLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={40} style={{ color: primaryColor }} />
            <p className="text-gray-600">Loading school…</p>
          </div>
        </div>
      )}

      {editId && !isEditSchoolLoading && editSchoolError && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <p className="text-gray-800 mb-4">{editSchoolError}</p>
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editId && !isEditSchoolLoading && editSchool && editSchool._id === editId && (
        <EditSchoolModal
          key={editId}
          school={editSchool}
          onClose={() => setEditId(null)}
          onSave={(updates) => handleEditSave(editId, updates)}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
          isSaving={isPatching}
        />
      )}

      {deleteId && (
        <DeleteSchoolModal
          schoolName={schools.find((s) => s._id === deleteId)?.schoolName || "this school"}
          onClose={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

function ViewSchoolModal({ school, isLoading, onClose, primaryColor, lighterPrimary }) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} style={{ color: primaryColor }} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!school) return null;

  const FieldRow = ({ label, value, link }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 shrink-0 sm:w-36">{label}</span>
      <span className="text-gray-900 text-sm">
        {link && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 break-all">
            {String(value).length > 50 ? String(value).slice(0, 50) + "…" : value} <ExternalLink size={14} />
          </a>
        ) : (
          value ?? "—"
        )}
      </span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div
          className="sticky top-0 z-10 px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <div className="flex items-center gap-3">
            <Building2 className="text-white" size={28} />
            <h3 className="text-2xl font-bold text-white">School Details</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {school.logoUrl && (
            <Section title="Logo">
              <img
                src={school.logoUrl}
                alt="School logo"
                className="max-h-28 w-auto object-contain rounded-lg bg-white border border-gray-200 p-2"
              />
            </Section>
          )}

          <Section title="School info">
            <div className="space-y-0">
              <FieldRow label="School Name" value={school.schoolName} />
              <FieldRow label="School Type" value={school.schoolType} />
              <FieldRow label="Enrollment" value={school.enrollment} />
              <FieldRow label="Average Class Size" value={school.averageClassSize} />
              <FieldRow label="Grades Served" value={Array.isArray(school.gradesServed) ? school.gradesServed.join(", ") : ""} />
              <FieldRow label="Cost (value)" value={school.costValue} />
              <FieldRow label="Cost (text)" value={school.costText} />
            </div>
          </Section>

          <Section title="Contact & location">
            <div className="space-y-0">
              <FieldRow label="Address" value={school.address} />
              <FieldRow label="City" value={school.city} />
              <FieldRow label="State" value={school.state} />
              <FieldRow label="ZIP" value={school.zip} />
              <FieldRow label="Website" value={school.website} link />
              <FieldRow label="Phone" value={school.phone} />
            </div>
          </Section>

          {(school.shortDescription || (Array.isArray(school.schoolHighlights) && school.schoolHighlights.length > 0)) && (
            <Section title="Details">
              <div className="space-y-3">
                {school.shortDescription && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Short Description</p>
                    <p className="text-gray-900 text-sm leading-relaxed">{school.shortDescription}</p>
                  </div>
                )}
                {Array.isArray(school.schoolHighlights) && school.schoolHighlights.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">School Highlights</p>
                    <ul className="list-disc list-inside text-gray-900 text-sm space-y-1">
                      {school.schoolHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}

          {(school.logoUrl || school.videoUrl) && (
            <Section title="Media">
              <div className="space-y-0">
                {school.logoUrl && <FieldRow label="Logo URL" value={school.logoUrl} link />}
                {school.videoUrl && <FieldRow label="Video URL" value={school.videoUrl} link />}
              </div>
            </Section>
          )}

          <Section title="Record">
            <div className="space-y-0">
              <FieldRow label="Updated At" value={formatDate(school.updatedAt)} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function schoolToForm(school) {
  const loc = school?.location?.coordinates;
  return {
    schoolName: school?.schoolName ?? "",
    address: school?.address ?? "",
    city: school?.city ?? "",
    state: school?.state ?? "",
    zip: school?.zip ?? "",
    website: school?.website ?? "",
    phone: school?.phone ?? "",
    schoolType: school?.schoolType ?? "public",
    enrollment: school?.enrollment ?? "",
    averageClassSize: school?.averageClassSize ?? "",
    gradesServed: Array.isArray(school?.gradesServed) ? school.gradesServed.join(", ") : "",
    costValue: school?.costValue ?? "",
    costText: school?.costText ?? "",
    schoolHighlights: Array.isArray(school?.schoolHighlights) ? school.schoolHighlights.join(", ") : "",
    shortDescription: school?.shortDescription ?? "",
    logoUrl: school?.logoUrl ?? "",
    videoUrl: school?.videoUrl ?? "",
    latitude: loc && loc[1] != null ? loc[1] : "",
    longitude: loc && loc[0] != null ? loc[0] : "",
  };
}

function EditSchoolModal({ school, onClose, onSave, primaryColor, lighterPrimary, isSaving }) {
  const [form, setForm] = useState(() => schoolToForm(school));

  useEffect(() => {
    setForm(schoolToForm(school));
  }, [school]);

  const handleClose = () => {
    setForm(schoolToForm(null));
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      schoolName: form.schoolName,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      website: form.website,
      phone: form.phone,
      schoolType: form.schoolType,
      enrollment: form.enrollment === "" ? undefined : Number(form.enrollment),
      averageClassSize: form.averageClassSize === "" ? undefined : Number(form.averageClassSize),
      gradesServed: form.gradesServed ? form.gradesServed.split(",").map((s) => s.trim()).filter(Boolean) : [],
      costValue: form.costValue === "" ? undefined : Number(form.costValue),
      costText: form.costText || undefined,
      schoolHighlights: form.schoolHighlights ? form.schoolHighlights.split(",").map((s) => s.trim()).filter(Boolean) : [],
      shortDescription: form.shortDescription || undefined,
      logoUrl: form.logoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      lat: form.latitude === "" ? undefined : Number(form.latitude),
      lng: form.longitude === "" ? undefined : Number(form.longitude),
    };
    onSave(payload);
  };

  const fieldList = [
    ["schoolName", "School Name"],
    ["address", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["zip", "ZIP"],
    ["website", "Website"],
    ["phone", "Phone"],
    ["schoolType", "School Type"],
    ["enrollment", "Enrollment"],
    ["averageClassSize", "Average Class Size"],
    ["gradesServed", "Grades Served (comma-separated)"],
    ["costValue", "Cost (number)"],
    ["costText", "Cost (text)"],
    ["schoolHighlights", "School Highlights (comma-separated)"],
    ["shortDescription", "Short Description"],
    ["logoUrl", "Logo URL"],
    ["videoUrl", "Video URL"],
    ["latitude", "Latitude"],
    ["longitude", "Longitude"],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div
          className="px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <h3 className="text-2xl font-bold text-white">Edit School</h3>
          <button type="button" onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fieldList.map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              {key === "videoUrl" && (
                <p className="text-xs text-gray-500 mb-1">YouTube, Vimeo, or other video link.</p>
              )}
              {key === "schoolType" ? (
                <select
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="public">public</option>
                  <option value="private">private</option>
                  <option value="charter">charter</option>
                  <option value="homeschool">homeschool</option>
                  <option value="other">other</option>
                </select>
              ) : (
                <input
                  type={key === "videoUrl" ? "url" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteSchoolModal({ schoolName, onClose, onConfirm, primaryColor, lighterPrimary, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div
          className="px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <h3 className="text-2xl font-bold text-white">Delete School</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">Are you sure you want to delete <strong>{schoolName}</strong>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
