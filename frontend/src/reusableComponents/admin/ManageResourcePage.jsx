import React, { useState, useEffect } from "react";
import { Save, Trash2, Plus, Loader2 } from "lucide-react";
import FormSection from "./ManageAboutPage/FormSection";

import { Switch } from "@headlessui/react";
import {
  useFetchResourcePage,
  useUpdateResourcePage,
} from "@/hooks/manageResourcePage/useManageResourcePage";

function ManageResourcePage() {
  const { resourceData, isLoading, error } = useFetchResourcePage();
  const { updateResourcePage, isUpdating, updateError, updateMessage } =
    useUpdateResourcePage();
  const [formData, setFormData] = useState({
    enableResourceHeader: true,
    title: "",
    description: "",
    email: "",
  });

  // Sync fetched data into formData
  useEffect(() => {
    if (resourceData) {
      setFormData({
        enableResourceHeader: resourceData.enableResourceHeader ?? true,
        title: resourceData.title ?? "",
        description: resourceData.description ?? "",
        email: resourceData.email ?? "",
      });
    }
  }, [resourceData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateResourcePage(formData);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Resource Page
        </h1>
        {isLoading && (
          <div className="flex justify-center py-10 text-blue-600 animate-pulse">
            <Loader2 className="mr-2 animate-spin" />
            Loading Resource Settings
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 shadow-sm rounded-lg p-6 "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <label
                htmlFor="enableResourceHeader"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enable Resources Page Header
              </label>
              <p className="text-xs text-gray-500">
                Toggle to show/hide the Resources page header
              </p>
            </div>
            <Switch
              checked={formData.enableResourceHeader}
              onChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  enableResourceHeader: checked,
                }));
              }}
              className={`${
                formData.enableResourceHeader ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  formData.enableResourceHeader
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Page Content
            </h2>
            <FormSection label="Page Title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>
            <FormSection label="Page Description">
              <textarea
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection label="Conatct Email">
              <textarea
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>
          </div>

          <div className="mt-6 flex flex-col items-end gap-4">
            {(updateMessage || updateError) && (
              <div
                className={`w-full p-3 rounded-md ${
                  updateMessage
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {updateMessage || updateError}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || isUpdating}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
            >
              {isLoading || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageResourcePage;
