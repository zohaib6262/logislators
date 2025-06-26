import React from "react";
import { Switch } from "@headlessui/react"; // You'll need to install @headlessui/react

const GeneralSettings = ({ settings, onChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-lg font-medium text-gray-800 mb-4">General Settings</h2>

    <div className="space-y-4">
      {/* Add the toggle switches at the top */}
      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="enableAboutus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enable About Us Page
          </label>
          <p className="text-xs text-gray-500">
            Toggle to show/hide the About Us page
          </p>
        </div>
        <Switch
          checked={settings?.enableAboutus || false}
          onChange={(checked) => {
            // Create a synthetic event to match our handleChange pattern
            const syntheticEvent = {
              target: {
                name: "enableAboutus",
                value: checked,
              },
            };
            onChange(syntheticEvent);
          }}
          className={`${
            settings?.enableAboutus ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              settings?.enableAboutus ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="enableResources"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enable Resources Page
          </label>
          <p className="text-xs text-gray-500">
            Toggle to show/hide the Resources page
          </p>
        </div>
        <Switch
          checked={settings?.enableResources || false}
          onChange={(checked) => {
            const syntheticEvent = {
              target: {
                name: "enableResources",
                value: checked,
              },
            };
            onChange(syntheticEvent);
          }}
          className={`${
            settings?.enableResources ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              settings?.enableResources ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Rest of your existing fields */}
      <div>
        <label
          htmlFor="siteName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Site Name
        </label>
        <input
          type="text"
          name="siteName"
          id="siteName"
          value={settings?.siteName || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="siteDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Site Description
        </label>
        <textarea
          name="siteDescription"
          id="siteDescription"
          rows={3}
          value={settings?.siteDescription || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="footerText"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Footer Text
        </label>
        <input
          type="text"
          name="footerText"
          id="footerText"
          value={settings?.footerText || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
);

export default GeneralSettings;
