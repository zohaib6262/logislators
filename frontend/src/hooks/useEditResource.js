import BASE_URL from "@/lib/utils";
import { useState } from "react";

const useEditResource = () => {
  const [error, setError] = useState("");
  const updateResource = async (id, data) => {
    try {
      const res = await fetch(`${BASE_URL}/resources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError(res.error || "Failed to update resource");
      }

      return await res.json();
    } catch (error) {
      setError(error.error || "Update error");
    }
  };

  return { updateResource, updateDataError: error };
};

export default useEditResource;
