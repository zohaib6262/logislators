import React from "react";
import ConfirmModal from "./ConfirmModal";
import useResourceActions from "../hooks/useRescourceActions";

const ResourceList = ({ resources, refreshResources }) => {
  const {
    loading,
    error,
    deleteResource,
    openDeleteModal,
    isModalOpen,
    closeDeleteModal,
    resourceToDelete,
  } = useResourceActions();

  const handleDeleteClick = (resource) => {
    openDeleteModal(resource);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteResource();
    if (success && refreshResources) {
      refreshResources();
    }
  };

  return (
    <div>
      {error && (
        <p className="text-red-600 mb-4 font-semibold">Error: {error}</p>
      )}
      {resources.length === 0 && (
        <p className="text-gray-600">No resources available.</p>
      )}

      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex justify-between items-center bg-white rounded shadow p-4 mb-4"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {resource.title}
            </h3>
            <p className="text-gray-600">{resource.description}</p>
          </div>
          <button
            onClick={() => handleDeleteClick(resource)}
            disabled={loading}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ))}

      {/* ✅ Modal rendered properly in component */}
      <ConfirmModal
        isOpen={isModalOpen}
        message={`Are you sure you want to delete "${resourceToDelete?.title}"?`}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ResourceList;
