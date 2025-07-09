import React, { useContext } from "react";
import { Loader2, Save, Upload } from "lucide-react";
import useUpdateSiteSettings from "../../hooks/siteSettingHooks/useUpdateSiteSettings";

import useGetSiteSettings from "../../hooks/siteSettingHooks/useGetSiteSettings";
import GeneralSettings from "./SiteSetting/GeneralSettings";
import LogoSettings from "./SiteSetting/LogoSettings";
import ContactSettings from "./SiteSetting/ContactSettings";
import SocialMediaSettings from "./SiteSetting/SocialMediaSettings";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";

export default function SiteSettings() {
  const { settings, setSettings, loading, error } = useGetSiteSettings();
  const {
    saveSettings,
    isSaving,
    savedMessage,
    error: saveError,
  } = useUpdateSiteSettings();
  const { primaryColor } = useContext(TokenContext);

  const lighterPrimary = newLightnerColor(primaryColor, 30);
  // if (error) return <p className="text-red-600">{error}</p>;
  // if (!settings) return <p>No settings found.</p>;

  // Helper for nested updates (supports socialLinks too)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox/toggle inputs
    const inputValue = type === "checkbox" ? checked : value;

    setSettings((prev) => {
      const keys = name.split(".");
      if (keys.length === 1) return { ...prev, [name]: inputValue };

      // Deep update
      const [first, second] = keys;
      return {
        ...prev,
        [first]: {
          ...prev[first],
          [second]: inputValue,
        },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings(settings);
  };
  const handleFileUpload = (logoUrl) => {
    setSettings((prev) => ({
      ...prev,
      logoUrl,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
        Site Settings{" "}
      </h1>
      {loading && (
        <div
          className="flex justify-center py-10 animate-pulse"
          style={{ color: primaryColor }}
        >
          <Loader2 className="mr-2 animate-spin" />
          Loading Site Settings
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <GeneralSettings settings={settings} onChange={handleChange} />
        <LogoSettings
          settings={settings}
          onChange={handleChange}
          onFileUpload={handleFileUpload}
        />

        <ContactSettings settings={settings} onChange={handleChange} />
        <SocialMediaSettings settings={settings} onChange={handleChange} />

        <div className="pt-4 border-t border-gray-200 flex items-center space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 disabled:opacity-50 text-white text-sm font-medium rounded-md"
            style={{
              background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
            }}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} className="mr-1" /> Save Settings
              </>
            )}
          </button>

          {savedMessage && <p className="text-green-600">{savedMessage}</p>}
          {saveError && <p className="text-red-600">{saveError}</p>}
        </div>
      </form>
    </div>
  );
}
