// hooks/useUpdateSiteSettings.js
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

const useUpdateSiteSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  const saveSettings = async (settings) => {
    setIsSaving(true);
    setError("");
    setSavedMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.put(`${BASE_URL}/settings`, settings, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSavedMessage("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSavedMessage(""), 2000);
    }
  };

  return { saveSettings, isSaving, savedMessage, error };
};

export default useUpdateSiteSettings;
