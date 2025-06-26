import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

export default function useGetSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/settings`);
        setSettings(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // Auto-create settings
          const defaultSettings = {
            enableAboutus: true,
            enableResources: true,
            siteName: "My Website",
            siteDescription: "This is a default description.",
            primaryColor: "#000000",
            footerText: "© 2025 My Website",
            logoUrl: "",

            // ✅ These must be valid non-empty strings
            contactEmail: "info@mywebsite.com",
            contactPhone: "+1234567890",

            socialLinks: {
              facebook: "",
              twitter: "",
              instagram: "",
            },
          };

          try {
            const createRes = await axios.get(
              `${BASE_URL}/settings`,
              defaultSettings
            );

            setSettings(defaultSettings);
          } catch (postErr) {
            setError("Failed to auto-create settings.");
          }
        } else {
          setError("Failed to load settings.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, setSettings, loading, error };
}
