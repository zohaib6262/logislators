import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";
export function useFetchLegislatorPage() {
  const [legislatorData, setLegislatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLegislatorPage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/legislator/header`);
      console.log(" Fetched legislator page data:", response.data);
      setLegislatorData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch resource page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLegislatorPage();
  }, []);

  return { legislatorData, isLoading, error };
}

export function useUpdateLegislatorPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const updateLegislatorPage = async (data) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.put(`${BASE_URL}/legislator/header`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUpdateMessage("Legislator Header updated successfully!");
      return response.data;
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || "Failed to update legislator Header page"
      );
      throw err;
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  return { updateLegislatorPage, isUpdating, updateError, updateMessage };
}
