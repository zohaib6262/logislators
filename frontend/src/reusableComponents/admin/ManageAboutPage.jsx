import React, { useState, useEffect } from "react";
import { Save, Trash2, Plus, Loader2 } from "lucide-react";
import FormSection from "./ManageAboutPage/FormSection";
import {
  useFetchAboutPage,
  useUpdateAboutPage,
} from "../../hooks/aboutPage/useAboutPage";
import Button from "../../UI/Button";
import { Switch } from "@headlessui/react";

function ManageAboutPage() {
  const { aboutData, isLoading, error } = useFetchAboutPage();
  const { updateAboutPage, isUpdating, updateError, updateMessage } =
    useUpdateAboutPage();

  const [formData, setFormData] = useState({
    enableAboutusHeader: true,
    title: "",
    description: "",
    labelMission: "",
    labelWhatWeDo: "",
    labelKeyPoints: "",
    labelDataInfo: "",
    labelPrivacy: "",
    labelGetInvolved: "",
    labelEmail: "",
    mission: "",
    whatWeDo: "",
    bulletPoints: [],
    dataInfo: "",
    privacy: "",
    getInvolved: "",
    email: "",
  });

  // Sync fetched data into formData
  useEffect(() => {
    if (aboutData) {
      setFormData({
        enableAboutusHeader: aboutData.enableAboutusHeader ?? true,
        title: aboutData.title ?? "",
        description: aboutData.description ?? "",
        labelMission: aboutData.labelMission ?? "",
        labelWhatWeDo: aboutData.labelWhatWeDo ?? "",
        labelKeyPoints: aboutData.labelKeyPoints ?? "",
        labelDataInfo: aboutData.labelDataInfo ?? "",
        labelPrivacy: aboutData.labelPrivacy ?? "",
        labelGetInvolved: aboutData.labelGetInvolved ?? "",
        labelEmail: aboutData.labelEmail ?? "",
        mission: aboutData.mission ?? "",
        whatWeDo: aboutData.whatWeDo ?? "",
        bulletPoints: aboutData.bulletPoints ?? [],
        dataInfo: aboutData.dataInfo ?? "",
        privacy: aboutData.privacy ?? "",
        getInvolved: aboutData.getInvolved ?? "",
        email: aboutData.email ?? "",
      });
    }
  }, [aboutData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleLabelChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleBulletPointChange = (index, value) => {
    const newBulletPoints = [...formData.bulletPoints];
    newBulletPoints[index] = value;
    setFormData((prev) => ({ ...prev, bulletPoints: newBulletPoints }));
  };

  const addBulletPoint = () => {
    setFormData((prev) => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, ""],
    }));
  };

  const removeBulletPoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAboutPage(formData);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage About Page
        </h1>
        {isLoading && (
          <div className="flex justify-center py-10 text-blue-600 animate-pulse">
            <Loader2 className="mr-2 animate-spin" />
            Loading About us Settings
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
                htmlFor="enableAboutusHeader"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enable About Us Page
              </label>
              <p className="text-xs text-gray-500">
                Toggle to show/hide the About Us page header
              </p>
            </div>
            <Switch
              checked={formData.enableAboutusHeader}
              onChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  enableAboutusHeader: checked,
                }));
              }}
              className={`${
                formData.enableAboutusHeader ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  formData.enableAboutusHeader
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

            <FormSection
              label={formData.labelMission}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelMission", value)
              }
            >
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection
              label={formData.labelWhatWeDo}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelWhatWeDo", value)
              }
            >
              <textarea
                name="whatWeDo"
                value={formData.whatWeDo}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection
              label={formData.labelKeyPoints}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelKeyPoints", value)
              }
            >
              <div className="space-y-3">
                {formData.bulletPoints.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) =>
                        handleBulletPointChange(index, e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                    <button
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-700 font-semibold rounded-lg px-2 py-2"
                      onClick={() => removeBulletPoint(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addBulletPoint}
                  className="mt-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Point</span>
                </Button>
              </div>
            </FormSection>

            <FormSection
              label={formData.labelDataInfo}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelDataInfo", value)
              }
            >
              <textarea
                name="dataInfo"
                value={formData.dataInfo}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection
              label={formData.labelPrivacy}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelPrivacy", value)
              }
            >
              <textarea
                name="privacy"
                value={formData.privacy}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection
              label={formData.labelGetInvolved}
              isEditable
              onLabelChange={(value) =>
                handleLabelChange("labelGetInvolved", value)
              }
            >
              <textarea
                name="getInvolved"
                value={formData.getInvolved}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </FormSection>

            <FormSection label="Contact Email">
              <input
                type="email"
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

export default ManageAboutPage;
