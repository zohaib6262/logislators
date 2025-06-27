import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, RefreshCw } from "lucide-react";
import FeatureCard from "./Feature/FeatureCard";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useFeatures } from "../../hooks/Feature/useFeature";
import { useHeaderFeature } from "@/hooks/Feature/useHeaderFeature";

const Feature = () => {
  const { features, loading, error, deleteFeature, refreshFeatures } =
    useFeatures();
  const { headerError, header, refreshHeader, updateHeader } =
    useHeaderFeature();

  const [localHeader, setLocalHeader] = useState(header);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Sync local header when header changes
  useEffect(() => {
    setLocalHeader(header);
  }, [header]);

  const handleHeaderUpdate = async () => {
    try {
      const result = await updateHeader(localHeader);
      if (result.success) {
        showNotification("success", "Header updated successfully");
        await refreshHeader();
        setIsEditingHeader(false);
      } else {
        showNotification("error", result.error || "Failed to update header");
      }
    } catch (error) {
      showNotification("error", "An unexpected error occurred");
    }
  };

  const handleDeleteConfirm = async () => {
    if (featureToDelete) {
      try {
        const result = await deleteFeature(featureToDelete);
        if (result.success) {
          showNotification("success", "Feature deleted successfully");
          await refreshFeatures();
        } else {
          showNotification("error", result.error || "Failed to delete feature");
        }
      } catch (err) {
        showNotification("error", "An unexpected error occurred");
      } finally {
        setFeatureToDelete(null);
      }
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="cmin-h-screen bg-white py-8 mt-18">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-around mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
              Manage Features
            </h1>

            <p className="text-gray-600">
              Manage the feature cards that appear on your website's homepage.
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin/features/new")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus size={18} className="mr-2" />
              Add New Feature
            </button>
          </div>
        </div>

        {/* Header Editor Section */}
        {isEditingHeader ? (
          <div className="mb-8 bg-white p-4 rounded-lg shadow">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="feature-header"
                  className="text-sm font-medium text-gray-700"
                >
                  Feature Section Header
                </label>
                <input
                  id="feature-header"
                  type="text"
                  value={localHeader}
                  onChange={(e) => setLocalHeader(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter header text"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditingHeader(false);
                    setLocalHeader(header);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHeaderUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={!localHeader.trim() || localHeader === header}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">{header}</h2>
            <button
              onClick={() => setIsEditingHeader(true)}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit header"
            >
              <Edit size={18} />
            </button>
          </div>
        )}

        {/* Error and Notification Display */}
        {/* {headerError && (
          <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 animate-fadeIn">
            {headerError}
          </div>
        )} */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            } animate-fadeIn`}
          >
            {notification.message}
          </div>
        )}

        {/* Features Grid */}
        {loading && features.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading features...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">{error}</div>
        ) : features.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No features found.</p>
            <button
              onClick={() => navigate("/admin/features/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Your First Feature
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature._id}
                feature={feature}
                onEdit={() => navigate(`/admin/features/${feature._id}`)}
                onDelete={(id) => setFeatureToDelete(id)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {featureToDelete && (
          <DeleteConfirmationModal
            ref={modalRef}
            isOpen={!!featureToDelete}
            onClose={() => setFeatureToDelete(null)}
            onConfirm={handleDeleteConfirm}
            isDeleting={loading}
            featureName={
              features.find((f) => f._id === featureToDelete)?.title || ""
            }
          />
        )}
      </div>
    </div>
  );
};

export default Feature;
