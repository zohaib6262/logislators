import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";
export function useFetchAboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAboutPage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/about`);
      setAboutData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch about page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutPage();
  }, []);

  return { aboutData, isLoading, error };
}

export function useUpdateAboutPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const updateAboutPage = async (data) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.put(`${BASE_URL}/about`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUpdateMessage("About page updated successfully!");
      return response.data;
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || "Failed to update about page"
      );
      throw err;
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  return { updateAboutPage, isUpdating, updateError, updateMessage };
}
