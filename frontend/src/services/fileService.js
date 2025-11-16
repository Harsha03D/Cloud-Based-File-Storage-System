// src/services/fileService.js

import { ENDPOINTS } from "./api";

// 🟦 1. GET FILE LIST (DynamoDB)
export const listFiles = async () => {
  const res = await fetch(ENDPOINTS.LIST_FILES);
  return res.json();
};

// 🟩 2. GET DOWNLOAD URL (S3 Signed URL)
export const getDownloadUrl = async (key) => {
  const res = await fetch(`${ENDPOINTS.DOWNLOAD_FILE}?key=${encodeURIComponent(key)}`);
  return res.json();
};

// 🟨 3. GET UPLOAD URL (S3 Signed URL)
export const getUploadUrl = async (fileName) => {
  const res = await fetch(ENDPOINTS.UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName })
  });
  return res.json();
};

// 🟥 4. DELETE FILE (S3 + DynamoDB)
export const deleteFile = async (key) => {
  const res = await fetch(`${ENDPOINTS.DELETE_FILE}?key=${encodeURIComponent(key)}`, {
    method: "DELETE"
  });
  return res.json();
};