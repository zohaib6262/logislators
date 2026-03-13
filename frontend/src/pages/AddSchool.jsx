import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, X } from "lucide-react";
import BASE_URL from "@/lib/utils";
import { TokenContext } from "@/store/TokenContextProvider";
import Label from "@/UI/Label";
import Input from "@/UI/Input";
import Button from "@/UI/Button";
import { uploadImageToCloudinary } from "@/utils/uploadImageCloudinary";

const SCHOOL_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "charter", label: "Charter" },
  { value: "homeschool", label: "Homeschool" },
  { value: "other", label: "Other" },
];

const LOGO_MAX_SIZE_MB = 5;
const LOGO_MAX_BYTES = LOGO_MAX_SIZE_MB * 1024 * 1024;

function isValidEmail(str) {
  if (!str || typeof str !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

function isValidUrl(str) {
  if (!str || typeof str !== "string") return false;
  try {
    new URL(str.trim());
    return true;
  } catch {
    return false;
  }
}

export default function AddSchool() {
  const { primaryColor } = useContext(TokenContext);
  const [formData, setFormData] = useState({
    schoolName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    schoolType: "",
    enrollment: "",
    averageClassSize: "",
    gradesServed: "",
    cost: "",
    schoolHighlights: "",
    shortDescription: "",
    logoUrl: "",
    videoUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (submitError) setSubmitError(null);
  };

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, logoUrl: "Please select an image file (e.g. JPG, PNG)." }));
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setErrors((prev) => ({ ...prev, logoUrl: `Logo must be under ${LOGO_MAX_SIZE_MB} MB.` }));
      return;
    }
    setErrors((prev) => ({ ...prev, logoUrl: null }));
    setLogoUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, logoUrl: "Logo upload failed. Please try again." }));
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const clearLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    const s = (v) => (v != null ? String(v).trim() : "");
    if (!s(formData.schoolName)) e.schoolName = "School name is required.";
    if (!s(formData.contactName)) e.contactName = "Contact name is required.";
    if (!s(formData.contactEmail)) e.contactEmail = "Contact email is required.";
    else if (!isValidEmail(formData.contactEmail)) e.contactEmail = "Invalid email format.";
    if (!s(formData.streetAddress)) e.streetAddress = "Street address is required.";
    if (!s(formData.city)) e.city = "City is required.";
    if (!s(formData.state)) e.state = "State is required.";
    if (!s(formData.zipCode)) e.zipCode = "ZIP code is required.";
    const lat = formData.latitude != null && formData.latitude !== "" ? Number(formData.latitude) : NaN;
    const lng = formData.longitude != null && formData.longitude !== "" ? Number(formData.longitude) : NaN;
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      e.latitude = "Enter a valid latitude (-90 to 90).";
    }
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      e.longitude = "Enter a valid longitude (-180 to 180).";
    }
    if (!s(formData.schoolType)) e.schoolType = "School type is required.";
    else     if (!SCHOOL_TYPES.some((t) => t.value === formData.schoolType.trim().toLowerCase())) {
      e.schoolType = "Select a valid school type.";
    }
    if (s(formData.website) && !isValidUrl(formData.website)) e.website = "Invalid URL format.";
    if (s(formData.videoUrl) && !isValidUrl(formData.videoUrl)) {
      e.videoUrl = "Please enter a valid video URL (e.g. YouTube, Vimeo).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        schoolName: formData.schoolName.trim(),
        contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim(),
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        schoolType: formData.schoolType.trim().toLowerCase(),
      };
      if (formData.contactPhone?.trim()) payload.contactPhone = formData.contactPhone.trim();
      if (formData.website?.trim()) payload.website = formData.website.trim();
      if (formData.enrollment !== "" && formData.enrollment != null) {
        const n = Number(formData.enrollment);
        if (!Number.isNaN(n)) payload.enrollment = n;
      }
      if (formData.averageClassSize !== "" && formData.averageClassSize != null) {
        const n = Number(formData.averageClassSize);
        if (!Number.isNaN(n)) payload.averageClassSize = n;
      }
      if (formData.gradesServed?.trim()) {
        payload.gradesServed = formData.gradesServed
          .split(/\r?\n/)
          .map((x) => x.trim())
          .filter(Boolean);
      }
      if (formData.cost !== "") payload.cost = formData.cost.trim();
      if (formData.schoolHighlights?.trim()) {
        payload.schoolHighlights = formData.schoolHighlights
          .split(/\r?\n/)
          .map((x) => x.trim())
          .filter(Boolean);
      }
      if (formData.shortDescription?.trim()) payload.shortDescription = formData.shortDescription.trim();
      if (formData.logoUrl?.trim()) payload.logoUrl = formData.logoUrl.trim();
      if (formData.videoUrl?.trim()) payload.videoUrl = formData.videoUrl.trim();

      const res = await fetch(`${BASE_URL}/schoolSubmissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Submission failed.");
      }
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div
            className="rounded-lg border-2 p-6 text-center"
            style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}10` }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thanks!</h2>
            <p className="text-gray-700 mb-6">
              Your school has been submitted for review. Our team will review and approve or edit it
              before it goes live.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-medium px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Your School</h1>
          <p className="text-gray-600 mb-6">
            Submit your school information for review. It will not appear in search results until
            approved by our team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="schoolName">School Name<span className="text-red-500">*</span></Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full"
                placeholder="e.g. Lincoln Elementary"
              />
              {errors.schoolName && (
                <p className="text-red-600 text-sm mt-1">{errors.schoolName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name<span className="text-red-500">*</span></Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.contactName && (
                  <p className="text-red-600 text-sm mt-1">{errors.contactName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email<span className="text-red-500">*</span></Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="email@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="streetAddress">Street Address<span className="text-red-500">*</span></Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full"
                placeholder="123 Main St"
              />
              {errors.streetAddress && (
                <p className="text-red-600 text-sm mt-1">{errors.streetAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City<span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State<span className="text-red-500">*</span></Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="e.g. Nevada"
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code<span className="text-red-500">*</span></Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="89101"
                />
                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude<span className="text-red-500">*</span></Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="text"
                  inputMode="decimal"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="36.1699"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for distance-based search. Value between -90 and 90.
                </p>
                {errors.latitude && (
                  <p className="text-red-600 text-sm mt-1">{errors.latitude}</p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude">Longitude<span className="text-red-500">*</span></Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="text"
                  inputMode="decimal"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="-115.1398"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for distance-based search. Value between -180 and 180.
                </p>
                {errors.longitude && (
                  <p className="text-red-600 text-sm mt-1">{errors.longitude}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="schoolType">School Type<span className="text-red-500">*</span></Label>
              <select
                id="schoolType"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select type</option>
                {SCHOOL_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.schoolType && (
                <p className="text-red-600 text-sm mt-1">{errors.schoolType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full"
                placeholder="https://..."
              />
              {errors.website && <p className="text-red-600 text-sm mt-1">{errors.website}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enrollment">Enrollment</Label>
                <Input
                  id="enrollment"
                  name="enrollment"
                  type="number"
                  min="0"
                  value={formData.enrollment}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="averageClassSize">Average Class Size</Label>
                <Input
                  id="averageClassSize"
                  name="averageClassSize"
                  type="number"
                  min="0"
                  value={formData.averageClassSize}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gradesServed">Grades Served</Label>
              <Input
                id="gradesServed"
                name="gradesServed"
                value={formData.gradesServed}
                onChange={handleChange}
                className="w-full"
                placeholder="e.g. K, 1, 2, 3 or one per line"
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full"
                placeholder="e.g. 0 or Tuition-based"
              />
            </div>

            <div>
              <Label htmlFor="schoolHighlights">School Highlights</Label>
              <textarea
                id="schoolHighlights"
                name="schoolHighlights"
                value={formData.schoolHighlights}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                placeholder="One highlight per line"
              />
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <Label>Logo Upload</Label>
              <p className="text-xs text-gray-500 mb-2">Image only (e.g. JPG, PNG). Max {LOGO_MAX_SIZE_MB} MB.</p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFile}
                disabled={logoUploading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
              />
              {logoUploading && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-600">Uploading logo…</span>
                </div>
              )}
              {formData.logoUrl && !logoUploading && (
                <div className="mt-3 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="h-16 w-16 shrink-0 object-contain rounded-md border border-gray-200 bg-white"
                  />
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <p className="text-sm font-medium text-gray-700">Logo added</p>
                    <a
                      href={formData.logoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Open link
                    </a>
                    <button
                      type="button"
                      onClick={clearLogo}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {errors.logoUrl && <p className="text-red-600 text-sm mt-1">{errors.logoUrl}</p>}
            </div>

            <div>
              <Label htmlFor="videoUrl">Video Link</Label>
              <p className="text-xs text-gray-500 mb-2">Paste a YouTube, Vimeo, or other video URL.</p>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full"
              />
              {errors.videoUrl && <p className="text-red-600 text-sm mt-1">{errors.videoUrl}</p>}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{submitError}</p>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto py-3 px-6">
                {loading ? "Submitting…" : "Submit for Review"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
