import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureForm from "./FeatureForm";
import { useFeatures, initialFeature } from "../../../hooks/Feature/useFeature";

const AddFeature = () => {
  const navigate = useNavigate();
  const { createFeature } = useFeatures();
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (feature) => {
    try {
      const result = await createFeature(feature);
      if (result.success) {
        setNotification({
          type: "success",
          message: "Feature created successfully",
        });
        setTimeout(() => navigate("/admin/features"), 1500);
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to create feature",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "An unexpected error occurred",
      });
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
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

        <FeatureForm
          feature={initialFeature}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/features")}
        />
      </div>
    </div>
  );
};

export default AddFeature;
