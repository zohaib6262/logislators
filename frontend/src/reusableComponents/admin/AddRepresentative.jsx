import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useAddRepresentative } from "../../hooks/useAddRepresentative";

const AddRepresentative = () => {
  const navigate = useNavigate();
  const {
    addRepresentative,
    loading: saving,
    error,
    setError,
  } = useAddRepresentative();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    district: "",
    county: "",
    party: "",
    photoUrl: "",
    rating: 0,
    biography: "",
    contactInfo: {
      phone: "",
      email: "",
      website: "",
      address: "",
    },
    votingRecords: [],
    extraPoints: {
      bills: "",
      points: 0,
      description: "",
    },
    highlights: {
      title: "",
      session: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "rating") {
      if (value > 5) {
        setError("Rating cannot be more than 5");
      } else if (value < 0) {
        setError("Rating cannot be negative");
      } else {
        setError("");
      }
    }
    if (type === "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result,
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVotingRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.votingRecords];
    updatedRecords[index] = { ...updatedRecords[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      votingRecords: updatedRecords,
    }));
  };

  const handleExtraPointsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      extraPoints: {
        ...prev.extraPoints,
        [field]: field === "points" ? Number(value) : value,
      },
    }));
  };

  const handleHighlightsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [field]: value,
      },
    }));
  };

  const handleAddVotingRecord = () => {
    setFormData((prev) => ({
      ...prev,
      votingRecords: [
        ...prev.votingRecords,
        { area: "", bills: "", score: "" },
      ],
    }));
  };

  const handleRemoveVotingRecord = (index) => {
    setFormData((prev) => ({
      ...prev,
      votingRecords: prev.votingRecords.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.position) {
      return;
    }

    await addRepresentative(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Add New Representative
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
          {/* Basic Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Basic Information
              </h3>
            </div>
            <div className="sm:col-span-6 flex flex-col items-center mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="relative group">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="h-32 w-32 rounded-full object-cover border shadow"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-100 border shadow flex items-center justify-center text-gray-400">
                    Select Image
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
                  name="photoUrl"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    County
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

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
                    <option value="Democratic Party">Democratic Party</option>
                    <option value="Republican Party">Republican Party</option>
                    <option value="Independent">Independent</option>
                    <option value="Libertarian Party">Libertarian Party</option>
                    <option value="Green Party">Green Party</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Ratings
                  </label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Ratings(1-5)"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleContactChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleContactChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleContactChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleContactChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Biography
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <textarea
                rows="5"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter representative's biography..."
              />
            </div>
          </div>

          {/* Voting Record */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Voting Record
                </h3>
                <button
                  type="button"
                  onClick={handleAddVotingRecord}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Record
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {formData.votingRecords.map((record, index) => (
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
                          handleVotingRecordChange(
                            index,
                            "area",
                            e.target.value
                          )
                        }
                        placeholder="Education, Labor, etc."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bills
                      </label>
                      <input
                        type="text"
                        value={record.bills}
                        onChange={(e) =>
                          handleVotingRecordChange(
                            index,
                            "bills",
                            e.target.value
                          )
                        }
                        placeholder="AB 233, SB 344"
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
                          handleVotingRecordChange(
                            index,
                            "score",
                            e.target.value
                          )
                        }
                        placeholder="10/22"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Points */}
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
                    value={formData.extraPoints.bills}
                    onChange={(e) =>
                      handleExtraPointsChange("bills", e.target.value)
                    }
                    placeholder="AB 399, AJR 5"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.extraPoints.description}
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
                    min="0"
                    max="5"
                    value={formData.extraPoints.points}
                    onChange={(e) =>
                      handleExtraPointsChange("points", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Highlights
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.highlights.title}
                    onChange={(e) =>
                      handleHighlightsChange("title", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Session
                  </label>
                  <input
                    type="text"
                    value={formData.highlights.session}
                    onChange={(e) =>
                      handleHighlightsChange("session", e.target.value)
                    }
                    placeholder="83rd legislative session"
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
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
                  Save Representative
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepresentative;
