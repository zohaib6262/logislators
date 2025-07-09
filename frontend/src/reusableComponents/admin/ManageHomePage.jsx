import React, { useState, useEffect, useRef, useContext } from "react";
import { Save, Upload, Loader2 } from "lucide-react";

import FormSection from "./ManageAboutPage/FormSection";
import useUpdateHomePage from "../../hooks/homePage/useUpdateHomePage";
import useFetchHomePage from "../../hooks/homePage/useFetchHomePage";
import { uploadImageToCloudinary } from "../../utils/uploadImageCloudinary";
import { Switch } from "@headlessui/react";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";

function ManageHomePage() {
  const { homeData, isLoading, error } = useFetchHomePage();
  const { updateHomePage, isUpdating, updateError, updateMessage } =
    useUpdateHomePage();

  const [formData, setFormData] = useState({
    enableHomeHeader: true,
    pageTitle: "",
    pageDescription: "",
    imageTitle: "",
    imageDescription: "",
  });
  const { primaryColor } = useContext(TokenContext);

  const lighterPrimary = newLightnerColor(primaryColor, 30);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (homeData) {
      setFormData({
        enableHomeHeader: homeData.enableHomeHeader ?? true,
        pageTitle: homeData.pageTitle || "",
        pageDescription: homeData.pageDescription || "",
        imageTitle: homeData.imageTitle || "",
        imageDescription: homeData.imageDescription || "",
      });
      if (homeData.image) {
        setImagePreview(homeData.image);
      }
    }
  }, [homeData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match("image.*")) {
      setImageError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setImageError("Image size should be less than 5MB");
      return;
    }

    try {
      setImageError("");
      setIsUploadingImage(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setImagePreview(uploadedUrl);
    } catch (error) {
      setImageError("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagePreview) {
      setImageError("Please upload an image");
      return;
    }

    const payload = {
      enableHomeHeader: formData.enableHomeHeader,
      pageTitle: formData.pageTitle,
      pageDescription: formData.pageDescription,
      imageTitle: formData.imageTitle,
      imageDescription: formData.imageDescription,
      image: imagePreview,
    };

    await updateHomePage(payload);
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
          Manage Home Page
        </h1>

        {isLoading ? (
          <div
            className="flex justify-center py-10 animate-pulse"
            style={{ color: primaryColor }}
          >
            <Loader2 className="mr-2 animate-spin" />
            Loading Home Settings
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            Error: {error}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 shadow rounded-lg p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <label
                  htmlFor="enableHomeHeader"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enable Home Page Header
                </label>
                <p className="text-xs text-gray-500">
                  Toggle to show/hide the Home page header
                </p>
              </div>
              <Switch
                checked={formData.enableHomeHeader}
                onChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    enableHomeHeader: checked,
                  }));
                }}
                style={{
                  backgroundColor: formData.enableHomeHeader && primaryColor,
                }}
                className={`${
                  !formData.enableHomeHeader && "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.enableHomeHeader
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
              <FormSection label="Page Title" required>
                <input
                  type="text"
                  name="pageTitle"
                  value={formData.pageTitle}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                />
              </FormSection>

              <FormSection label="Page Description" required>
                <textarea
                  name="pageDescription"
                  rows={4}
                  value={formData.pageDescription}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                />
              </FormSection>

              <FormSection label="Upload Image" required>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    disabled={isUploadingImage}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <Upload size={16} className="mr-1" />
                    )}
                    Choose File
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    hidden
                    disabled={isUploadingImage}
                  />
                </div>

                {imageError && (
                  <p className="mt-2 text-sm text-red-600">{imageError}</p>
                )}

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Image Preview</p>
                    <img
                      src={imagePreview}
                      alt="Home page preview"
                      className="h-24 border border-gray-300 rounded-md p-2 object-contain"
                    />
                  </div>
                )}
              </FormSection>

              <FormSection label="Image Title" required>
                <input
                  type="text"
                  name="imageTitle"
                  value={formData.imageTitle}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                />
              </FormSection>

              <FormSection label="Image Description" required>
                <textarea
                  name="imageDescription"
                  rows={4}
                  value={formData.imageDescription}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                />
              </FormSection>
            </div>
            <div className="flex justify-end items-center gap-4 mt-6">
              {updateMessage && (
                <span className="text-green-600 text-sm">{updateMessage}</span>
              )}
              {updateError && (
                <span className="text-red-600 text-sm">{updateError}</span>
              )}

              <button
                type="submit"
                disabled={isLoading || isUpdating || isUploadingImage}
                className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
                }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ManageHomePage;
