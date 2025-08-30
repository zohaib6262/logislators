import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useFeatures, Feature as FeatureType } from "../../hooks/useFeatures";
import FeatureForm from "./FeatureForm";
import { useFeatures } from "../../../hooks/Feature/useFeature";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";

const EditVoting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { features, updateFeature } = useFeatures();
  const [feature, setFeature] = useState(null);
  const [notification, setNotification] = useState(null);
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60); // 60% lighter
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
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: primaryColor }}
        ></div>
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

export default EditVoting;
