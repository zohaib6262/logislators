import React from "react";

const SocialMediaSettings = ({ settings, onChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-lg font-medium text-gray-800 mb-4">
      Social Media Links
    </h2>

    <div className="space-y-4">
      <div>
        <label
          htmlFor="socialLinks.facebook"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Facebook URL
        </label>
        <input
          type="url"
          name="socialLinks.facebook"
          id="socialLinks.facebook"
          value={settings?.socialLinks?.facebook || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="socialLinks.twitter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Twitter URL
        </label>
        <input
          type="url"
          name="socialLinks.twitter"
          id="socialLinks.twitter"
          value={settings?.socialLinks?.twitter || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="socialLinks.instagram"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Instagram URL
        </label>
        <input
          type="url"
          name="socialLinks.instagram"
          id="socialLinks.instagram"
          value={settings?.socialLinks?.instagram || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
);

export default SocialMediaSettings;
