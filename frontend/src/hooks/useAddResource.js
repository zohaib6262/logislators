// src/hooks/useAddResource.js
import BASE_URL from "@/lib/utils";
import { useState } from "react";

const useAddResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addResource = async (resourceData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(resourceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addResource, loading, error, success };
};

export default useAddResource;
