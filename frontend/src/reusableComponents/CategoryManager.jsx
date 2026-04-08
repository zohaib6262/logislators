import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const { data } = await axios.post("/api/categories", {
        name: newCategory,
      });
      setCategories([...categories, data]);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  // Start editing
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  // Save edited category
  const saveEdit = async (id) => {
    try {
      const { data } = await axios.put(`/api/categories/${id}`, {
        name: editValue,
      });
      setCategories(categories.map((cat) => (cat._id === id ? data : cat)));
      setEditingId(null);
      toast.success("Category updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin h-5 w-5" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      {/* Add Category Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No categories found</p>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex justify-between items-center p-3 border rounded"
            >
              {editingId === category._id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => saveEdit(category._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-medium">{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(category._id, category.name)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
