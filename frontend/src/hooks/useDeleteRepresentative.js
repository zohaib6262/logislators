import BASE_URL from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useDeleteRepresentative = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const deleteRepresentative = async (id) => {
    try {
      setIsDeleting(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${BASE_URL}/representatives/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete representative");
      }

      // Return true to indicate success
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteRepresentative, isDeleting, error };
};
