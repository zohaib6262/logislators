// Cleaned and improved version of AddRepresentative.jsx
import React, { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

import { useAddRepresentative } from "../../hooks/useAddRepresentative";
import { uploadImageToCloudinary } from "../../utils/uploadImageCloudinary";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";

const AddRepresentative = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = lightenColor(primaryColor, 60);

  const {
    addRepresentative,
    loading: saving,
    error,
    setError,
  } = useAddRepresentative();

  const [formData, setFormData] = useState({
    name: "",
    party: "",
    current_role: {
      title: "",
      district: "",
    },
    jurisdiction: {
      name: "",
    },
    extras: {
      phone: "",
      address: "",
      county: "",
      biography: "",
      grade: 0,
      votingRecords: [],
      extraPoints: {
        bills: "",
        points: 0,
        description: "",
      },
      highlights: {
        session: "",
        keyTakeaways: "",
        badgeNum: 0,
      },
    },
    image: "",
    email: "",
    openstates_url: "",
  });

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (name === "extras.grade") {
      let gradeValue = parseFloat(value);

      if (isNaN(gradeValue)) gradeValue = 0;

      // Round to 2 decimals
      gradeValue = parseFloat(gradeValue.toFixed(2));

      if (gradeValue > 100) {
        setError("Grade cannot be more than 100");
      } else if (gradeValue < 0) {
        setError("Grade cannot be negative");
      } else {
        setError("");
      }

      // Update formData
      setFormData((prev) => ({
        ...prev,
        extras: {
          ...prev.extras,
          grade: gradeValue,
        },
      }));
      return; // prevent double update in nested handler
    }

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      const uploadedUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      return;
    }

    const fieldPath = name.split(".");
    const updatedData = { ...formData };
    let temp = updatedData;

    for (let i = 0; i < fieldPath.length - 1; i++) {
      temp = temp[fieldPath[i]];
    }

    temp[fieldPath[fieldPath.length - 1]] =
      name === "extras.grade" ? Number(value) : value;
    setFormData(updatedData);
  };

  const handleVotingRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.extras.votingRecords];
    updatedRecords[index] = { ...updatedRecords[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        votingRecords: updatedRecords,
      },
    }));
  };

  const handleAddVotingRecord = () => {
    setFormData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        votingRecords: [
          ...prev.extras.votingRecords,
          { area: "", notableBills: "", score: "" },
        ],
      },
    }));
  };

  const handleRemoveVotingRecord = (index) => {
    setFormData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        votingRecords: prev.extras.votingRecords.filter((_, i) => i !== index),
      },
    }));
  };

  const handleExtraPointsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        extraPoints: {
          ...prev.extras.extraPoints,
          [field]: field === "points" ? Number(value) : value,
        },
      },
    }));
  };

  const handleHighlightsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        highlights: {
          ...prev.extras.highlights,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.current_role.title) {
      setError("Name and Position are required");
      return;
    }
    await addRepresentative(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Representative
        </h1>

        <Link
          to="/admin/representatives"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to List
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Add the representative's basic details.
            </p>
          </div>
          <div className="sm:col-span-6 flex flex-col items-center mt-3">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Profile Photo
            </label>
            <div className="relative group">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-32 rounded-full object-cover border shadow"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-100 border shadow flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => document.getElementById("photoInput").click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l12-12a2.828 2.828 0 00-4-4L5 17v4z"
                  />
                </svg>
              </button>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                name="image"
                className="hidden"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Name Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Party Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Party
                </label>
                <select
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a party</option>
                  <option value="Democratic">Democratic Party</option>
                  <option value="Republican">Republican Party</option>
                  <option value="Independent">Independent</option>
                  <option value="Libertarian">Libertarian Party</option>
                  <option value="Green">Green Party</option>
                </select>
              </div>

              {/* Position Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  name="current_role.title"
                  value={formData.current_role.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* District Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  type="text"
                  name="current_role.district"
                  value={formData.current_role.district}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Jurisdiction Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  name="jurisdiction.name"
                  value={formData.jurisdiction.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* County Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  County
                </label>
                <input
                  type="text"
                  name="extras.county"
                  value={formData.extras.county}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Grade Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Grade (1-100)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="extras.grade"
                  min="0"
                  max="100"
                  value={formData.extras.grade}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Contact Information
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Email Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="extras.phone"
                  value={formData.extras.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Website Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="openstates_url"
                  value={formData.openstates_url}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="extras.address"
                  value={formData.extras.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Biography
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <textarea
              rows="5"
              name="extras.biography"
              value={formData.extras.biography}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Voting Record Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Voting Record
              </h3>
              <button
                type="button"
                onClick={handleAddVotingRecord}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                style={{
                  background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
                }}
              >
                <Plus size={16} className="mr-1" />
                Add Record
              </button>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {formData.extras.votingRecords.map((record, index) => (
              <div
                key={index}
                className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Record #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveVotingRecord(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Area
                    </label>
                    <input
                      type="text"
                      value={record.area}
                      onChange={(e) =>
                        handleVotingRecordChange(index, "area", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notable Bills
                    </label>
                    <input
                      type="text"
                      value={record.notableBills}
                      onChange={(e) =>
                        handleVotingRecordChange(
                          index,
                          "notableBills",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Score
                    </label>
                    <input
                      type="text"
                      value={record.score}
                      onChange={(e) =>
                        handleVotingRecordChange(index, "score", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Points Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Extra Points
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bills
                </label>
                <input
                  type="text"
                  value={formData.extras.extraPoints.bills}
                  onChange={(e) =>
                    handleExtraPointsChange("bills", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.extras.extraPoints.description}
                  onChange={(e) =>
                    handleExtraPointsChange("description", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.extras.extraPoints.points}
                  onChange={(e) =>
                    handleExtraPointsChange("points", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Highlights
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Session
                </label>
                <input
                  type="text"
                  value={formData.extras.highlights.session}
                  onChange={(e) =>
                    handleHighlightsChange("session", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Takeaways
                </label>
                <input
                  type="text"
                  value={formData.extras.highlights.keyTakeaways}
                  onChange={(e) =>
                    handleHighlightsChange("keyTakeaways", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Badge Num
                </label>
                <input
                  type="number"
                  value={formData.extras.highlights.badgeNum}
                  onChange={(e) =>
                    handleHighlightsChange("badgeNum", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/representatives")}
            className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
            }}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Add Representative
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRepresentative;
