import { useState, useEffect, useCallback } from "react";
import BASE_URL from "@/lib/utils";
const API_BASE_URL = `${BASE_URL}/features`;

// Initial state for a new feature
export const initialVotingSection = {
  title: "",
  description: "",
  icon: "",
};
export function useVotingSection() {
  const [votingSection, setVotingSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all voting sections
  const fetchVotingSection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) setError("Failed to fetch voting section");

      const data = await res.json();
      setFeatures(data);
      setError(null);
    } catch (err) {
      setError({
        statusCode: 500 || err.response?.status,
        message:
          err.response?.data?.message || "Failed to fetch voting section",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create voting section
  const createVotingSection = useCallback(async (votingSection) => {
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
        body: JSON.stringify(votingSection),
      });

      if (!res.ok) throw new Error("Failed to create voting section");

      const newVotingSection = await res.json();
      setVotingSection(newVotingSection);

      return { success: true, votingSection: newVotingSection };
    } catch (err) {
      setError(err.message || "Failed to create voting section");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update feature
  const updateVotingSection = useCallback(async (id, updatedVotingSection) => {
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
        body: JSON.stringify(updatedVotingSection),
      });

      if (!res.ok) throw new Error("Failed to update voting section");

      const updated = await res.json();
      setVotingSection((prev) => prev.map((f) => (f._id === id ? updated : f)));

      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to update voting section");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete feature
  const deleteVotingSection = useCallback(async (id) => {
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

      if (!res.ok) throw new Error("Failed to delete voting section");

      // Fixed: Use _id instead of id to filter out the deleted voting section
      setVotingSection((prev) => prev.filter((f) => f._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete voting section");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVotingSection();
  }, [fetchVotingSection]);

  return {
    votingSection,
    loading,
    error,
    createVotingSection,
    updateVotingSection,
    deleteVotingSection,
    refreshVotingSection: fetchVotingSection,
  };
}
