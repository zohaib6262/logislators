import React, { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import ResourceCard from "../ResourceCard";
import useGetResources from "../../hooks/useGetRecources";
import useCategoryManager from "../../hooks/categories/useCategoryManager";
import { toast } from "react-toastify";

const ResourcesManager = () => {
  // Resource states
  const {
    resources,
    loading,
    error,
    refetch: refetchResources,
  } = useGetResources();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category management using custom hook
  const {
    categories: allCategories,
    loading: categoriesLoading,
    isModalOpen,
    setIsModalOpen,
    categoryName,
    setCategoryName,
    editingCategory,
    setEditingCategory,
    handleAddCategory,
    handleDeleteCategory,
    openEditModal,
  } = useCategoryManager();

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Filter resources
  const filteredResources = resources?.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle delete confirmation
  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsConfirmModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (categoryToDelete) {
      await handleDeleteCategory(categoryToDelete);
      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 py-14 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center">
            Admin Resource Dashboard
          </h1>
          <p className="text-lg text-blue-100 text-center mt-3 max-w-2xl mx-auto">
            Manage, edit, and maintain Nevada's civic resources including
            government, voting, and education tools.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/admin/resources/new"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium rounded-md hover:to-blue-800 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Resource
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Categories
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="All">All Categories</option>
                  {allCategories.length > 0 ? (
                    allCategories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-10 text-blue-600">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading resources...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center bg-red-50 text-red-600 p-4 rounded-lg">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          {!resources ||
            (resources.length === 0 && (
              <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No resources found.</p>
              </div>
            ))}

          {/* Resources List */}
          {!(loading || categoriesLoading) && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    refetch={refetchResources}
                  />
                ))
              ) : resources.length > 0 ? (
                <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">
                    No resources found matching your search. Try adjusting your
                    filters.
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal Container */}
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAddCategory}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>

              {/* Categories List */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-2">
                  Existing Categories
                </h4>
                <div className="space-y-2">
                  {allCategories.length > 0 ? (
                    allCategories.map((category) => (
                      <div
                        key={category._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <span className="text-gray-800">{category.name}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category._id)}
                            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-2">
                      No categories found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            {/* Modal Container */}
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-4">
                <p className="text-gray-700">
                  Are you sure you want to delete this category? This action
                  cannot be undone.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesManager;
