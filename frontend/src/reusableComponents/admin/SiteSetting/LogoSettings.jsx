import { Save, Upload } from "lucide-react";
import React from "react";
import { uploadImageToCloudinary } from "../../../utils/uploadImageCloudinary";

const LogoSettings = ({ settings, onChange, onFileUpload }) => {
  const fileInputRef = React.useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadImageToCloudinary(file);
    onFileUpload(uploadedUrl);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Logo & Branding
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="logoUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Logo URL
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="logoUrl"
              id="logoUrl"
              readOnly
              value={settings?.logoUrl || ""}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter logo URL or upload"
            />
            <button
              type="button"
              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleFileButtonClick}
            >
              <Upload size={16} className="mr-1" />
              Upload
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
          </div>
        </div>

        <div className="mt-4">
          {settings?.logoUrl ? (
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Logo Preview
              </p>
              <img
                src={settings.logoUrl}
                alt="Site Logo"
                className="h-16 object-contain border border-gray-200 rounded-md p-2"
              />
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No logo set. Default text logo will be used.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LogoSettings;
