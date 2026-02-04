export async function uploadDataUrlToCloudinary(
  dataUrl: string,
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary config missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)",
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const form = new FormData();
  form.append("file", blob, "signature.png");
  form.append("upload_preset", uploadPreset);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }
  const json = await res.json();

  if (!json?.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }

  return json.secure_url as string;
}

export async function uploadFileToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary config missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)",
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }
  const data = await res.json();
  if (!data?.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }
  return data.secure_url as string;
}
