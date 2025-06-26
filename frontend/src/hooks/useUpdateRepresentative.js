import BASE_URL from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUpdateRepresentative = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const updateRepresentative = async (id, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${BASE_URL}/representatives/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update representative");
      }

      const data = await response.json();
      navigate("/admin/representatives"); // Redirect after successful update
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateRepresentative, loading, error, setError };
};
