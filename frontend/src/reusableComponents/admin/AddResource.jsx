import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Plus, Loader2 } from "lucide-react";
import useAddResource from "../../hooks/useAddResource";
import useGetCategories from "../../hooks/categories/useGetCategories";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";
import useGetResources from "@/hooks/useGetRecources";

const AddResource = () => {
  const [resource, setResource] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
    customFields: [],
    isFeatured: false,
  });
  const { resources } = useGetResources();
  const { addResource, loading, error } = useAddResource();
  const { categories: allCategories, loading: categoriesLoading } =
    useGetCategories();
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = newLightnerColor(primaryColor, 30);
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const lightShade = lightenColor(primaryColor, 50); // soft pastel background
  const veryLightShade = lightenColor(primaryColor, 85); // faint background
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    const updatedFields = [...resource.customFields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setResource((prev) => ({ ...prev, customFields: updatedFields }));
  };

  const handleAddCustomField = () => {
    setResource((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { key: "", value: "" }],
    }));
  };

  const handleRemoveCustomField = (index) => {
    setResource((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };
  const alreadyFeatured = resources?.some((res) => res.isFeatured);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addResource(resource);
      navigate("/admin/resources");
    } catch (err) {
      console.error("Failed to add resource:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Resource</h1>
        <Link
          to="/admin/resources"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={resource.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={resource.description}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={resource.url}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={resource.category}
              onChange={handleChange}
              required
              disabled={categoriesLoading}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {allCategories?.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Fields */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Custom Fields
              </h3>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Field
              </button>
            </div>

            {resource.customFields.map((field, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={field.key}
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
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!alreadyFeatured && (
            <div
              className="flex items-center gap-3 p-4 rounded-lg mt-6"
              style={{ background: lightShade }}
            >
              <input
                type="checkbox"
                id="featured"
                checked={resource.isFeatured || false}
                onChange={(e) =>
                  setResource((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-900"
              >
                Set as Featured Resource (only one resource can be featured at a
                time)
              </label>
            </div>
          )}
          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || categoriesLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Resource
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddResource;
