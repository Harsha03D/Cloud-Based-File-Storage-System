// src/services/api.js

// 👉 Your API Gateway Invoke URL
export const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

// ✔ Endpoints
export const ENDPOINTS = {
  LIST_FILES: `${API_BASE}/files`,         // GET
  DOWNLOAD_FILE: `${API_BASE}/download-url`, // GET ?key=
  UPLOAD_URL: `${API_BASE}/upload-url`,     // POST
  DELETE_FILE: `${API_BASE}/delete-file`    // DELETE ?key=
};