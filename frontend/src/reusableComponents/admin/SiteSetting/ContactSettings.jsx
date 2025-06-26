import React from "react";

const ContactSettings = ({ settings, onChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-lg font-medium text-gray-800 mb-4">
      Contact Information
    </h2>

    <div className="space-y-4">
      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contact Email
        </label>
        <input
          type="email"
          name="contactEmail"
          id="contactEmail"
          value={settings?.contactEmail || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="contactPhone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contact Phone
        </label>
        <input
          type="text"
          name="contactPhone"
          id="contactPhone"
          value={settings?.contactPhone || ""}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
);

export default ContactSettings;
