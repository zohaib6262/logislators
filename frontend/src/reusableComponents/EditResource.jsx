import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import useGetResource from "../hooks/useGetResource";
import useEditResource from "../hooks/useEditResource";
import useGetCategories from "../hooks/categories/useGetCategories";
import { lightenColor } from "@/utils/colorUtils";
import { TokenContext } from "@/store/TokenContextProvider";

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useContext(TokenContext);

  const { resource, loading, fetchDataError } = useGetResource(id);
  const { updateResource, updateDataError } = useEditResource();
  const { categories: allCategories } = useGetCategories();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
    customFields: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const lighterPrimary = lightenColor(primaryColor, 60);
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || "",
        description: resource.description || "",
        category: resource.category || "",
        url: resource.url || "",
        customFields: resource.customFields || [],
      });
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    const updatedFields = [...formData.customFields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFormData((prev) => ({
      ...prev,
      customFields: updatedFields,
    }));
  };

  const handleAddCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { key: "", value: "" }],
    }));
  };

  const handleRemoveCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.category) {
        throw new Error("Title and category are required");
      }

      await updateResource(id, formData);
      navigate("/admin/resources");
    } catch (error) {
      setError(error.message || "Failed to update resource");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (fetchDataError || updateDataError || error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error || fetchDataError || updateDataError}
              </h3>
              <div className="mt-2">
                <Link
                  to="/admin/resources"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Resource</h1>
        <Link
          to="/admin/resources"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to List
        </Link>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={submitting}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={submitting}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={submitting}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {allCategories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Custom Fields */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Custom Fields
              </label>
              <button
                type="button"
                onClick={handleAddCustomField}
                disabled={submitting}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus size={16} className="mr-1" />
                Add Field
              </button>
            </div>

            {formData.customFields.map((field, index) => (
              <div key={index} className="mt-2 grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Key"
                    value={field.key}
                    disabled={submitting}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "key", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    disabled={submitting}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleRemoveCustomField(index)}
                    className="w-full inline-flex justify-center items-center text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
              }}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResource;
