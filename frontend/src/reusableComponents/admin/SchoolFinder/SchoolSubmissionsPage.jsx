import { TokenContext } from "@/store/TokenContextProvider";
import React, { useState, useContext, useEffect } from "react";
import {
  Search,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Building2,
  Loader2,
  AlertCircle,
  X,
  ExternalLink,
  FileText,
} from "lucide-react";
import {
  useAdminSchoolSubmissionsList,
  useAdminSchoolSubmission,
  usePatchAdminSchoolSubmission,
  useApproveAdminSchoolSubmission,
} from "@/hooks/useAdminSchoolSubmissions";

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

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

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

export default function SchoolSubmissionsPage() {
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = lightenColor(primaryColor, 30);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [notification, setNotification] = useState(null);

  const { list, isLoading, error, refetch } =
    useAdminSchoolSubmissionsList(statusFilter);
  const { submission: detailSubmission, refetch: refetchDetail } =
    useAdminSchoolSubmission(detailId);
  const { patch, isLoading: isPatching } = usePatchAdminSchoolSubmission();
  const { approve, isLoading: isApproving } =
    useApproveAdminSchoolSubmission();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (detailId) refetchDetail();
  }, [detailId, refetchDetail]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredList = list.filter((item) => {
    const term = (searchTerm || "").toLowerCase().trim();
    if (!term) return true;
    const school = (item.schoolName || "").toLowerCase();
    const contact = (item.contactName || "").toLowerCase();
    const email = (item.contactEmail || "").toLowerCase();
    const city = (item.city || "").toLowerCase();
    return (
      school.includes(term) ||
      contact.includes(term) ||
      email.includes(term) ||
      city.includes(term)
    );
  });

  const pendingCount = list.filter((s) => s.status === "pending").length;
  const approvedCount = list.filter((s) => s.status === "approved").length;
  const rejectedCount = list.filter((s) => s.status === "rejected").length;

  const handleApprove = async (id) => {
    try {
      await approve(id);
      showNotification("Submission approved and school created.");
      setDetailId(null);
      refetch();
    } catch {
      showNotification(
        "Failed to approve. It may already be approved.",
        "error"
      );
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await patch(rejectId, { status: "rejected", adminNotes: rejectNotes });
      showNotification("Submission rejected.");
      setRejectId(null);
      setRejectNotes("");
      setDetailId(null);
      refetch();
    } catch {
      showNotification("Failed to reject.", "error");
    }
  };

  const handleEditSave = async (id, updates) => {
    try {
      await patch(id, updates);
      showNotification("Submission updated.");
      setEditId(null);
      setDetailId(null);
      refetch();
      if (detailId === id) refetchDetail();
    } catch {
      showNotification("Failed to update submission.", "error");
    }
  };

  if (isLoading && list.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4"
            size={48}
            style={{ color: primaryColor }}
          />
          <p className="text-gray-600 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error && list.length === 0) {
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
        <div className="fixed top-4 right-4 z-50 animate-slideDown">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
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
            <h1 className="text-4xl font-bold text-white">School Submissions</h1>
          </div>
          <p className="text-white/90 text-center text-lg">
            Review and approve or reject school submissions from the public form
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
                <p className="text-3xl font-bold text-gray-800">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
                <p className="text-3xl font-bold text-gray-800">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b">
            <h2 className="text-2xl font-bold text-gray-800">All Submissions</h2>
          </div>

          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by school, contact, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: primaryColor }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white cursor-pointer"
                style={{ outlineColor: primaryColor }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value || "all"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">School Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ZIP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">School Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[260px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredList.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.schoolName || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.contactName || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.contactEmail || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.city || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.state || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.zipCode || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{row.schoolType || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          row.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : row.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row.createdAt)}</td>
                    <td className="px-6 py-4 min-w-[260px]">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <button
                          onClick={() => setDetailId(row._id)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-gray-300 text-gray-700 hover:bg-gray-50"
                          title="View"
                        >
                          <Eye size={16} /> View
                        </button>
                        {row.status === "pending" && (
                          <>
                            <button
                              onClick={() => setEditId(row._id)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-orange-600 text-white hover:bg-orange-700"
                              title="Edit"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleApprove(row._id)}
                              disabled={isApproving}
                              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {isApproving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Approve
                            </button>
                            <button
                              onClick={() => { setRejectId(row._id); setRejectNotes(row.adminNotes || ""); }}
                              disabled={isPatching}
                              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle size={16} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Building2 size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No submissions found</p>
                <p className="text-sm">Try adjusting filters or search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail drawer/modal */}
      {detailId && (
        <DetailDrawer
          submission={detailSubmission}
          isLoading={detailId && !detailSubmission && !error}
          onClose={() => setDetailId(null)}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
          onEdit={() => { setEditId(detailId); setDetailId(null); }}
          onApprove={() => handleApprove(detailId)}
          onReject={() => { setRejectId(detailId); setRejectNotes(detailSubmission?.adminNotes || ""); setDetailId(null); }}
          isApproving={isApproving}
        />
      )}

      {/* Edit modal */}
      {editId && (
        <EditSubmissionModal
          submissionId={editId}
          initialData={list.find((s) => s._id === editId) || detailSubmission}
          onClose={() => setEditId(null)}
          onSave={handleEditSave}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
          isSaving={isPatching}
        />
      )}

      {/* Reject confirmation modal */}
      {rejectId && (
        <RejectModal
          onClose={() => { setRejectId(null); setRejectNotes(""); }}
          onConfirm={handleReject}
          rejectNotes={rejectNotes}
          setRejectNotes={setRejectNotes}
          primaryColor={primaryColor}
          lighterPrimary={lighterPrimary}
          isRejecting={isPatching}
        />
      )}
    </div>
  );
}

function DetailDrawer({
  submission,
  isLoading,
  onClose,
  primaryColor,
  lighterPrimary,
  onEdit,
  onApprove,
  onReject,
  isApproving,
}) {
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
  if (!submission) return null;

  const statusBadgeClass =
    submission.status === "approved"
      ? "bg-green-100 text-green-700"
      : submission.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

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
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div
          className="sticky top-0 z-10 px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <div className="flex items-center gap-3">
            <FileText className="text-white" size={28} />
            <h3 className="text-2xl font-bold text-white">Submission Details</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submission.logoUrl && (
            <Section title="Logo">
              <img
                src={submission.logoUrl}
                alt="School logo"
                className="max-h-28 w-auto object-contain rounded-lg bg-white border border-gray-200 p-2"
              />
            </Section>
          )}

          <Section title="School info">
            <div className="space-y-0">
              <FieldRow label="School Name" value={submission.schoolName} />
              <FieldRow label="School Type" value={submission.schoolType} />
              <FieldRow label="Enrollment" value={submission.enrollment} />
              <FieldRow label="Average Class Size" value={submission.averageClassSize} />
              <FieldRow label="Grades Served" value={Array.isArray(submission.gradesServed) ? submission.gradesServed.join(", ") : submission.gradesServed} />
              <FieldRow label="Cost" value={submission.cost != null ? String(submission.cost) : ""} />
            </div>
          </Section>

          <Section title="Contact">
            <div className="space-y-0">
              <FieldRow label="Contact Name" value={submission.contactName} />
              <FieldRow label="Contact Email" value={submission.contactEmail} />
              <FieldRow label="Contact Phone" value={submission.contactPhone} />
              <FieldRow label="Website" value={submission.website} link />
            </div>
          </Section>

          <Section title="Location">
            <div className="space-y-0">
              <FieldRow label="Street Address" value={submission.streetAddress} />
              <FieldRow label="City" value={submission.city} />
              <FieldRow label="State" value={submission.state} />
              <FieldRow label="ZIP Code" value={submission.zipCode} />
              <FieldRow label="Latitude" value={submission.latitude} />
              <FieldRow label="Longitude" value={submission.longitude} />
            </div>
          </Section>

          {(submission.shortDescription || (Array.isArray(submission.schoolHighlights) && submission.schoolHighlights.length > 0)) && (
            <Section title="Details">
              <div className="space-y-3">
                {submission.shortDescription && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Short Description</p>
                    <p className="text-gray-900 text-sm leading-relaxed">{submission.shortDescription}</p>
                  </div>
                )}
                {Array.isArray(submission.schoolHighlights) && submission.schoolHighlights.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">School Highlights</p>
                    <ul className="list-disc list-inside text-gray-900 text-sm space-y-1">
                      {submission.schoolHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}

          {(submission.logoUrl || submission.videoUrl) && (
            <Section title="Media">
              <div className="space-y-0">
                {submission.logoUrl && <FieldRow label="Logo URL" value={submission.logoUrl} link />}
                {submission.videoUrl && <FieldRow label="Video URL" value={submission.videoUrl} link />}
              </div>
            </Section>
          )}

          <Section title="Status & notes">
            <div className="space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500 shrink-0 sm:w-36">Status</span>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full w-fit ${statusBadgeClass}`}>
                  {submission.status || "pending"}
                </span>
              </div>
              <FieldRow label="Submitted At" value={formatDate(submission.createdAt)} />
              {submission.adminNotes && (
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Admin Notes</p>
                  <p className="text-gray-900 text-sm leading-relaxed">{submission.adminNotes}</p>
                </div>
              )}
            </div>
          </Section>
        </div>

        {submission.status === "pending" && (
          <div className="p-6 border-t bg-gray-50 flex flex-wrap items-center gap-3">
            <button
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={18} /> Edit
            </button>
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isApproving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Approve
            </button>
            <button
              onClick={onReject}
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <XCircle size={18} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EditSubmissionModal({
  submissionId,
  initialData,
  onClose,
  onSave,
  primaryColor,
  lighterPrimary,
  isSaving,
}) {
  const [form, setForm] = useState(() => ({
    schoolName: initialData?.schoolName ?? "",
    contactName: initialData?.contactName ?? "",
    contactEmail: initialData?.contactEmail ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    website: initialData?.website ?? "",
    streetAddress: initialData?.streetAddress ?? "",
    city: initialData?.city ?? "",
    state: initialData?.state ?? "",
    zipCode: initialData?.zipCode ?? "",
    latitude: initialData?.latitude ?? "",
    longitude: initialData?.longitude ?? "",
    schoolType: initialData?.schoolType ?? "public",
    enrollment: initialData?.enrollment ?? "",
    averageClassSize: initialData?.averageClassSize ?? "",
    gradesServed: Array.isArray(initialData?.gradesServed) ? initialData.gradesServed.join(", ") : "",
    cost: initialData?.cost != null ? String(initialData.cost) : "",
    schoolHighlights: Array.isArray(initialData?.schoolHighlights) ? initialData.schoolHighlights.join(", ") : "",
    shortDescription: initialData?.shortDescription ?? "",
    logoUrl: initialData?.logoUrl ?? "",
    videoUrl: initialData?.videoUrl ?? "",
    adminNotes: initialData?.adminNotes ?? "",
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      enrollment: form.enrollment === "" ? undefined : Number(form.enrollment),
      averageClassSize: form.averageClassSize === "" ? undefined : Number(form.averageClassSize),
      latitude: form.latitude === "" ? undefined : Number(form.latitude),
      longitude: form.longitude === "" ? undefined : Number(form.longitude),
      gradesServed: form.gradesServed ? form.gradesServed.split(",").map((s) => s.trim()).filter(Boolean) : [],
      schoolHighlights: form.schoolHighlights ? form.schoolHighlights.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    onSave(submissionId, payload);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div
          className="px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <h3 className="text-2xl font-bold text-white">Edit Submission</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {[
            ["schoolName", "School Name"],
            ["contactName", "Contact Name"],
            ["contactEmail", "Contact Email"],
            ["contactPhone", "Contact Phone"],
            ["website", "Website"],
            ["streetAddress", "Street Address"],
            ["city", "City"],
            ["state", "State"],
            ["zipCode", "ZIP Code"],
            ["latitude", "Latitude"],
            ["longitude", "Longitude"],
            ["schoolType", "School Type"],
            ["enrollment", "Enrollment"],
            ["averageClassSize", "Average Class Size"],
            ["gradesServed", "Grades Served (comma-separated)"],
            ["cost", "Cost"],
            ["schoolHighlights", "School Highlights (comma-separated)"],
            ["shortDescription", "Short Description"],
            ["logoUrl", "Logo URL"],
            ["videoUrl", "Video URL"],
            ["adminNotes", "Admin Notes"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
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
                  type={key === "contactEmail" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
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

function RejectModal({
  onClose,
  onConfirm,
  rejectNotes,
  setRejectNotes,
  primaryColor,
  lighterPrimary,
  isRejecting,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div
          className="px-6 py-5 rounded-t-2xl flex justify-between items-center"
          style={{ background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})` }}
        >
          <div className="flex items-center gap-3">
            <XCircle className="text-white" size={28} />
            <h3 className="text-2xl font-bold text-white">Reject Submission</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Admin notes (optional)</label>
          <textarea
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Reason for rejection..."
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isRejecting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRejecting ? <Loader2 size={20} className="animate-spin" /> : null}
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
