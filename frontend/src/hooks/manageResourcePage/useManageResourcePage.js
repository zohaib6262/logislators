import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

export function useFetchResourcePage() {
  const [resourceData, setResourceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResourcePage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/resource`);
      setResourceData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch resource page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcePage();
  }, []);

  return { resourceData, isLoading, error };
}

export function useUpdateResourcePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const updateResourcePage = async (data) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.put(`${BASE_URL}/resource`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUpdateMessage("Resource page updated successfully!");
      return response.data;
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || "Failed to update resource page"
      );
      throw err;
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  return { updateResourcePage, isUpdating, updateError, updateMessage };
}
