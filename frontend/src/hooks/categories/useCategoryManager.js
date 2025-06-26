import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import BASE_URL from "@/lib/utils";

const API_BASE_URL = `${BASE_URL}/categories`;

const useCategoryManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Memoized fetch function with authorization
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_BASE_URL, getAuthHeaders());
      setCategories(data);
    } catch (error) {
      handleApiError(error, "Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Centralized error handler
  const handleApiError = (error, defaultMessage) => {
    console.error("API Error:", error);

    const errorMessage =
      error.response?.data?.message || error.message || defaultMessage;

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      // Optionally redirect to login
      // navigate('/login');
    } else {
      toast.error(errorMessage);
    }
  };

  // Add/Update category with better error handling
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { name: categoryName };

      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/${editingCategory._id}`,
          payload,
          getAuthHeaders()
        );
        toast.success("Category updated successfully");
      } else {
        await axios.post(API_BASE_URL, payload, getAuthHeaders());
        toast.success("Category added successfully");
      }

      await fetchCategories();
      closeModal();
    } catch (error) {
      handleApiError(
        error,
        editingCategory ? "Failed to update category" : "Failed to add category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category with confirmation
  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/${categoryId}`, getAuthHeaders());
      toast.success("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      handleApiError(error, "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal handlers
  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    categoryName,
    setCategoryName,
    editingCategory,
    handleAddCategory,
    handleDeleteCategory,
    openEditModal,
    isDeleting,
    isSubmitting,
    closeModal,
  };
};

export default useCategoryManager;
