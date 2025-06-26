import { useState, useEffect, useCallback } from "react";
import BASE_URL from "@/lib/utils";
const API_BASE_URL = `${BASE_URL}/features`;

// Initial state for a new feature
export const initialFeature = {
  title: "",
  description: "",
  icon: "",
};
export function useFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all features
  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) setError("Failed to fetch features");

      const data = await res.json();
      setFeatures(data);
      setError(null);
    } catch (err) {
      setError({
        statusCode: 500 || err.response?.status,
        message: err.response?.data?.message || "Failed to fetch features",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create feature
  const createFeature = useCallback(async (feature) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feature),
      });

      if (!res.ok) throw new Error("Failed to create feature");

      const newFeature = await res.json();
      setFeatures(newFeature);

      return { success: true, feature: newFeature };
    } catch (err) {
      setError(err.message || "Failed to create feature");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update feature
  const updateFeature = useCallback(async (id, updatedFeature) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFeature),
      });

      if (!res.ok) throw new Error("Failed to update feature");

      const updated = await res.json();
      setFeatures((prev) => prev.map((f) => (f._id === id ? updated : f)));

      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to update feature");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete feature
  const deleteFeature = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete feature");

      // Fixed: Use _id instead of id to filter out the deleted feature
      setFeatures((prev) => prev.filter((f) => f._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete feature");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return {
    features,
    loading,
    error,
    createFeature,
    updateFeature,
    deleteFeature,
    refreshFeatures: fetchFeatures,
  };
}
