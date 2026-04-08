import { useState, useEffect, useCallback } from "react";

import BASE_URL from "@/lib/utils";
const API_BASE_URL = `${BASE_URL}/features`;
export function useHeaderFeature() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState("");

  // Fetch header
  const fetchHeader = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/header`);
      if (!res.ok) throw new Error("Failed to fetch header");
      const data = await res.json();
      setHeader(data.header);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch header");
      return { header: "Default Features" };
    }
  }, []);

  // Update header
  const updateHeader = useCallback(async (headerText) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await fetch(`${API_BASE_URL}/header`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ header: headerText }),
      });

      if (!res.ok) throw new Error("Failed to update header");

      const updated = await res.json();
      setHeader(updated.header);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to update header");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchHeader();
  }, [fetchHeader]);
  return {
    headerError: error,
    header,
    refreshHeader: fetchHeader,
    updateHeader,
  };
}
export default useHeaderFeature;
