// src/pages/FileManagement.js

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FileManagement.css";

const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

export default function FileManagement() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch files from backend
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/files`);
      setFiles(res.data.files || []);
      setFilteredFiles(res.data.files || []);
      setError(null);
    } catch (err) {
      setError("Failed to load files");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.key?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, files]);

  // Download file
  const handleDownload = async (file) => {
    try {
      const res = await axios.get(`${API_BASE}/download-url?key=${file.key}`);
      const url = res.data.url;

      const link = document.createElement("a");
      link.href = url;
      link.download = file.key;
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  // Delete file
  const handleDelete = async (file) => {
    try {
      await axios.delete(`${API_BASE}/delete-file`, {
        data: { key: file.key },
      });

      setFiles((prev) => prev.filter((f) => f.key !== file.key));
      setConfirmDeleteId(null);
    } catch {
      alert("Delete failed");
    }
  };

  // Icons by file type
  const getFileIcon = (name) => {
    if (!name) return "📁";
    const ext = name.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      docx: "📝",
      xlsx: "📊",
      pptx: "🎥",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      zip: "📦",
      mp4: "🎬",
      mp3: "🎵",
      txt: "📃",
    };
    return icons[ext] || "📁";
  };

  const formatSize = (b) => {
    if (!b) return "--";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    return (b / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "Unknown";

  // Loading screen
  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100"
      >
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">
          Loading files...
        </p>
      </motion.div>
    );

  // Error screen
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-red-50"
      >
        <h2 className="text-2xl text-red-600 font-bold mb-2">
          Error Loading Files
        </h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchFiles}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100"
      style={{ fontFamily: "Inter" }}
    >
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-16 left-10 text-[80px] opacity-10"
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-10 right-10 text-[100px] opacity-10"
      >
        📁
      </motion.div>

      {/* Back & Home */}
      <div className="absolute top-5 left-5 flex gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg font-semibold"
        >
          ← Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-16 mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">File Management</h1>
        <p className="text-gray-600">
          Manage your uploaded files easily
        </p>
      </motion.header>

      {/* Search */}
      <motion.input
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-8 border rounded-lg shadow"
      />

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-xl shadow"
        >
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-800">
            No Files Found
          </h2>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {filteredFiles.map((file, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white rounded-xl shadow p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{getFileIcon(file.key)}</div>
                <div className="truncate">
                  <h3 className="font-semibold text-gray-800 truncate">{file.key}</h3>
                  <p className="text-gray-500 text-sm">{formatSize(file.size)}</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Uploaded: {formatDate(file.lastModified)}
              </div>

              {confirmDeleteId === file.key ? (
                <div className="flex flex-col gap-2">
                  <p className="text-red-500 font-semibold text-sm text-center">
                    Confirm delete?
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(file)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(file.key)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}