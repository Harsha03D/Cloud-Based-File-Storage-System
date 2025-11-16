// src/pages/Upload.js

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

const defaultConfig = {
  page_title: "Upload Files",
  page_subtitle: "Drag and drop files or click to browse",
  upload_button: "Upload Files",
  drop_zone_text: "Drop files here",
  browse_text: "or click to browse",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  font_family: "Inter",
};

function UploadPage() {
  const navigate = useNavigate();
  const [config] = useState(defaultConfig);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    primary_color,
    secondary_color,
    surface_color,
    text_color,
    font_family,
  } = config;

  // 🔐 Protect page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (!token || !email) navigate("/login");
  }, [navigate]);

  // Headers with Cognito JWT + email
  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-user-id": localStorage.getItem("email"),
    },
  });

  useEffect(() => {
    document.body.style.background =
      `linear-gradient(135deg, ${primary_color}, ${secondary_color}, #7dd3fc)`;
    document.body.style.fontFamily = `${font_family}, sans-serif`;
  }, []);

  // Select files
  const handleFileSelect = (files) => {
    const validFiles = Array.from(files);
    const withIds = validFiles.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size,
    }));

    setSelectedFiles((prev) => [...prev, ...withIds]);
  };

  const removeFile = (id) =>
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));

  // ⭐ Main upload handler
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (let f of selectedFiles) {
        // 1️⃣ Request pre-signed URL
        const res = await axios.post(
          `${API_BASE}/upload-url`,
          {
            fileName: f.name,
            fileType: f.file.type,
          },
          authHeaders()
        );

        const uploadUrl = res.data.uploadUrl;
        const key = res.data.key; // backend returns this

        // 2️⃣ Upload file to S3
        await axios.put(uploadUrl, f.file, {
          headers: { "Content-Type": f.file.type },
        });

        // 3️⃣ Save metadata in DynamoDB
        await axios.post(
          `${API_BASE}/save-file`,
          {
            key: key,
            size: f.file.size,
            uploadedAt: new Date().toISOString(),
            userEmail: localStorage.getItem("email"),
          },
          authHeaders()
        );
      }

      alert("Upload successful!");
      setSelectedFiles([]);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check logs.");
    }

    setIsUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "10%",
          left: "6%",
          fontSize: "90px",
          opacity: 0.1,
        }}
      >
        ☁️
      </motion.div>

      {/* Home & Back */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate(-1)}
          style={{
            background: "#fff",
            border: `2px solid ${primary_color}`,
            borderRadius: "8px",
            padding: "8px 16px",
            color: primary_color,
            fontWeight: 600,
          }}
        >
          🔙 Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/")}
          style={{
            background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "white",
            fontWeight: 600,
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          marginTop: "80px",
          color: text_color,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
          {config.page_title}
        </h1>
        <p style={{ opacity: 0.7 }}>{config.page_subtitle}</p>
      </motion.div>

      {/* Drop Zone UI — unchanged */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        whileHover={{ scale: 1.02 }}
        animate={{
          boxShadow: isDragging
            ? `0 0 25px ${primary_color}50`
            : "0 10px 30px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.3 }}
        style={{
          margin: "50px auto",
          maxWidth: "700px",
          backgroundColor: surface_color,
          border: `3px dashed ${
            isDragging ? primary_color : text_color + "30"
          }`,
          borderRadius: "24px",
          padding: "60px 40px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          style={{
            fontSize: "80px",
            color: primary_color,
            marginBottom: "16px",
          }}
        >
          ☁️
        </motion.div>

        <h2 style={{ color: primary_color, fontWeight: 600 }}>
          {config.drop_zone_text}
        </h2>
        <p style={{ color: text_color, opacity: 0.7 }}>
          {config.browse_text}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: "none" }}
        />
      </motion.div>

      {/* Selected Files List */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              backgroundColor: surface_color,
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: text_color, fontWeight: "600" }}>
              Selected Files ({selectedFiles.length})
            </h3>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                marginTop: "12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isUploading ? "Uploading..." : config.upload_button}
            </motion.button>

            <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
              {selectedFiles.map((file) => (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#f9fafb",
                    borderRadius: "10px",
                    padding: "10px 16px",
                  }}
                >
                  <div>
                    📄 <strong>{file.name}</strong>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    style={{
                      backgroundColor: "#fee2e2",
                      border: "none",
                      borderRadius: "8px",
                      color: "#dc2626",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✖ Remove
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UploadPage;