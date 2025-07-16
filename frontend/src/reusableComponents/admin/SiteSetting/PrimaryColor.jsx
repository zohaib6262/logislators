import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import usePrimaryColor from "@/hooks/primaryColor/usePrimaryColor";

const PrimaryColor = () => {
  const [showColorPreview, setShowColorPreview] = useState(false);
  const { primaryColor, loading, error, updatePrimaryColor } =
    usePrimaryColor();

  const handleColorChange = (color) => {
    updatePrimaryColor(color); // ✅ save new color to backend
  };

  const currentColor = primaryColor || "#3b82f6";

  return (
    <>
      {/* Color Customization Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label
            htmlFor="primaryBgColor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Primary Color
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Choose the primary color for your site's background and elements
          </p>
        </div>
        <button
          onClick={() => setShowColorPreview(!showColorPreview)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {showColorPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-1" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Color Preview */}
      {showColorPreview && (
        <div className="mb-4 p-3 rounded-lg border border-gray-200 bg-white">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Color Preview
          </p>
          <div
            className="w-full h-12 rounded-lg border border-gray-300 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: currentColor }}
          >
            {currentColor}
          </div>
        </div>
      )}

      {/* Custom Color Input */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <label
            htmlFor="customColorInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom Color
          </label>
          <input
            type="color"
            id="customColorInput"
            value={currentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="colorHexInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hex Value
          </label>
          <input
            type="text"
            id="colorHexInput"
            value={currentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#3b82f6"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>
      </div>
    </>
  );
};

export default PrimaryColor;
