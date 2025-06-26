import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useFeatures, Feature as FeatureType } from "../../hooks/useFeatures";
import FeatureForm from "./FeatureForm";
import { useFeatures } from "../../../hooks/Feature/useFeature";

const EditFeature = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { features, updateFeature } = useFeatures();
  const [feature, setFeature] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const currentFeature = features.find((f) => f._id === id);

    if (currentFeature) {
      setFeature(currentFeature);
    }
  }, [id, features]);

  const handleSubmit = async (updatedFeature) => {
    try {
      const result = await updateFeature(id, updatedFeature);
      if (result.success) {
        setNotification({
          type: "success",
          message: "Feature updated successfully",
        });
        setTimeout(() => navigate("/admin/features"), 1500);
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to update feature",
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

  if (!feature) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading feature...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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
          feature={feature}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/features")}
        />
      </div>
    </div>
  );
};

export default EditFeature;
