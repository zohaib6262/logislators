// hooks/homePage/useUpdateHomePage.js
import { useState } from "react";
import BASE_URL from "@/lib/utils";
const useUpdateHomePage = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const updateHomePage = async (formData) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUpdateError("No authentication token found");
        return;
      }
      const res = await fetch(`${BASE_URL}/home`, {
        method: "PUT",
        body: JSON.stringify(formData),

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUpdateMessage(data.message || "Update successful");
      return data;
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(""), 2000);
    }
  };

  return { updateHomePage, isUpdating, updateError, updateMessage };
};

export default useUpdateHomePage;
