import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Edit2, Save, X } from "lucide-react";

function FormSection({
  label,
  isEditable = false,
  onLabelChange,
  children,
  classNameData = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);

  // Sync local state with prop changes
  useEffect(() => {
    setTempLabel(label);
  }, [label]);

  const handleLabelEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onLabelChange(tempLabel);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLabel(label); // Reset to original label
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`mb-6 ${classNameData}`}>
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold text-gray-800 border border-gray-300 rounded px-2 py-1 flex-1"
              autoFocus
              aria-label="Edit section title"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 p-1"
                title="Save"
                aria-label="Save changes"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 p-1"
                title="Cancel"
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
            {isEditable && (
              <button
                type="button"
                onClick={handleLabelEdit}
                className="text-gray-500 hover:text-gray-700"
                title="Edit"
                aria-label="Edit section title"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export default FormSection;
