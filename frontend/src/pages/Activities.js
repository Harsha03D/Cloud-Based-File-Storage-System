import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/activities`, {
        headers: { Authorization: token }
      });

      setActivities(res.data.activities || []);
    } catch (err) {
      setError("Failed to load activity history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "Unknown";

  const filteredAndSorted = useMemo(() => {
    let filtered = [...activities];

    if (dateFrom)
      filtered = filtered.filter(a => new Date(a.timestamp) >= new Date(dateFrom));

    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.timestamp) <= end);
    }

    if (actionFilter !== "all")
      filtered = filtered.filter(a => a.action === actionFilter);

    filtered.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === "date-asc") return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === "name-asc") return (a.fileName || "").localeCompare(b.fileName || "");
      if (sortBy === "name-desc") return (b.fileName || "").localeCompare(a.fileName || "");
      return 0;
    });

    return filtered;
  }, [activities, dateFrom, dateTo, actionFilter, sortBy]);

  const stats = {
    total: filteredAndSorted.length,
    uploads: filteredAndSorted.filter(a => a.action === "upload").length,
    downloads: filteredAndSorted.filter(a => a.action === "download").length,
    deletes: filteredAndSorted.filter(a => a.action === "delete").length,
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="mt-3">Loading activities…</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="mb-3">{error}</p>
        <button
          onClick={fetchActivities}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative"
    >
      {/* Floating Icons */}
      <div className="absolute top-10 left-10 text-[80px] opacity-10">☁️</div>
      <div className="absolute bottom-10 right-10 text-[100px] opacity-10">📁</div>
      <div className="absolute top-1/2 left-12 text-[60px] opacity-10">🔒</div>

      {/* Header + Buttons */}
      <div className="absolute top-5 left-5 flex gap-3">
        <button onClick={() => navigate(-1)} className="bg-white px-4 py-2 border border-indigo-500 rounded-lg">
          ← Back
        </button>
        <button onClick={() => navigate("/")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          🏠 Home
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 mt-16">File Activities</h1>
      <p className="text-gray-500 mb-8">Track your file usage history</p>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">Total: {stats.total}</div>
        <div className="bg-white p-4 rounded-lg shadow">Uploads: {stats.uploads}</div>
        <div className="bg-white p-4 rounded-lg shadow">Downloads: {stats.downloads}</div>
        <div className="bg-white p-4 rounded-lg shadow">Deletes: {stats.deletes}</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-5 overflow-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Action</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Size</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((a, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.fileName}</td>
                  <td className="p-3 capitalize">{a.action}</td>
                  <td className="p-3">{formatDate(a.timestamp)}</td>
                  <td className="p-3">{formatFileSize(a.size)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No activities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Activities;