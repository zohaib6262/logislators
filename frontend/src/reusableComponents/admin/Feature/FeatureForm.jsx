import React, { useState, useEffect, useContext } from "react";
import { MapPin, Building2, Check, X, ArrowLeft, Upload } from "lucide-react";
import { initialFeature } from "../../../hooks/Feature/useFeature";
import { Link, useParams } from "react-router-dom";
import { uploadImageToCloudinary } from "../../../utils/uploadImageCloudinary";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";

const FeatureForm = ({ feature, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFeature);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { primaryColor } = useContext(TokenContext);
  const { id } = useParams();

  const lighterPrimary = newLightnerColor(primaryColor, 30);

  // Reset form when feature changes
  useEffect(() => {
    if (feature) {
      setFormData(feature);
    } else {
      setFormData(initialFeature);
    }
    setErrors({});
    setTouched({});
  }, [feature]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on change
    validateField(name, value);
  };

  const fileInputRef = React.useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, icon: uploadedUrl }));
      // Clear any previous icon errors
      setErrors((prev) => ({ ...prev, icon: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, icon: "Failed to upload image" }));
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length > 50) {
          newErrors.title = "Title must be less than 50 characters";
        } else {
          delete newErrors.title;
        }
        break;
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.length > 200) {
          newErrors.description =
            "Description must be less than 200 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case "icon":
      case "logo": // Handle both icon and logo fields
        if (!value) {
          newErrors.icon = "Icon is required";
        } else {
          delete newErrors.icon;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    // Check title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 50) {
      newErrors.title = "Title must be less than 50 characters";
    }

    // Check description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    // Check icon
    if (!formData.icon) {
      newErrors.icon = "Icon is required";
    }

    // Mark all fields as touched
    ["title", "description", "icon"].forEach((field) => {
      newTouched[field] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 "
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {id ? "Edit Feature" : "Add New Feature"}
        </h2>
        <Link
          to="/admin/features"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to List
        </Link>
      </div>

      <div className="space-y-4">
        {/* Title field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.title && errors.title
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="Feature title"
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.description && errors.description
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="Feature description"
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Icon selection */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Icon/Image
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="icon"
                id="icon"
                readOnly
                value={formData.icon || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.icon && errors.icon
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                }`}
                placeholder="Enter icon URL or upload"
              />
              <button
                type="button"
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleFileButtonClick}
              >
                <Upload size={16} className="mr-1" />
                Upload
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </div>
            {touched.icon && errors.icon && (
              <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
            )}
          </div>

          <div className="mt-4">
            {formData.icon ? (
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Preview
                </p>
                <img
                  src={formData.icon}
                  alt="Feature Icon"
                  className="h-16 object-contain border border-gray-200 rounded-md p-2"
                />
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No icon set. Please upload an icon.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded-md transition-colors"
          style={{
            background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
          }}
        >
          {id ? "Update Feature" : "Add Feature"}
        </button>
      </div>
    </form>
  );
};

export default FeatureForm;
