export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "my_upload_presets");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dy910ughf/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};
