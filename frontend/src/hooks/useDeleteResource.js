import BASE_URL from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

const useDeleteResource = (refetch) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const deleteResource = async (id) => {
    try {
      setDeleting(true);

      const token = localStorage.getItem("token");
      if (!token) setError("No token found");

      await axios.delete(`${BASE_URL}/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (refetch) refetch();
    } catch (error) {
      setError(error.error || "Error deleting resource");
    } finally {
      setDeleting(false);
    }
  };

  return { deleteResource, deleting, error };
};

export default useDeleteResource;
