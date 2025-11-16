import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

const Analytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const trendChartRef = useRef(null);
  const storageChartRef = useRef(null);
  const trendChartInstance = useRef(null);
  const storageChartInstance = useRef(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/analytics`, {
        headers: { Authorization: token }
      });

      setAnalyticsData(res.data);
    } catch (err) {
      setError("Unable to load analytics data");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analyticsData) renderCharts();

    return () => {
      if (trendChartInstance.current) trendChartInstance.current.destroy();
      if (storageChartInstance.current) storageChartInstance.current.destroy();
    };
  }, [analyticsData]);

  const renderCharts = () => {
    if (!analyticsData) return;

    if (trendChartInstance.current) trendChartInstance.current.destroy();
    if (storageChartInstance.current) storageChartInstance.current.destroy();

    const trendCtx = trendChartRef.current.getContext("2d");
    trendChartInstance.current = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: analyticsData.uploadTrend.map((i) =>
          new Date(i.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "Uploads",
            data: analyticsData.uploadTrend.map((i) => i.uploads),
            borderColor: "#6366f1",
            backgroundColor: "#6366f133",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Downloads",
            data: analyticsData.uploadTrend.map((i) => i.downloads),
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf633",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: "#1e293b" } } },
        scales: {
          x: { ticks: { color: "#1e293b" } },
          y: { ticks: { color: "#1e293b" }, beginAtZero: true },
        },
      },
    });

    const storageCtx = storageChartRef.current.getContext("2d");
    storageChartInstance.current = new Chart(storageCtx, {
      type: "pie",
      data: {
        labels: analyticsData.storageByType.map((i) => i.type),
        datasets: [
          {
            data: analyticsData.storageByType.map((i) => i.size),
            backgroundColor: [
              "#6366f1",
              "#8b5cf6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
            ],
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: "#1e293b" } } },
      },
    });
  };

  const formatSize = (mb) => {
    if (!mb) return "0 MB";
    return mb.toFixed(2) + " MB";
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <p className="mb-4">{error}</p>
        <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg" onClick={fetchAnalytics}>
          Retry
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100"
    >
      {/* Back / Home */}
      <div className="absolute top-5 left-5 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-white px-4 py-2 border border-indigo-500 rounded-lg"
        >
          ← Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          🏠 Home
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2 text-gray-800">Analytics Dashboard</h1>
      <p className="text-gray-600 mb-8">Monitor your cloud statistics</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-indigo-500 text-white p-6 rounded-xl shadow-lg">
          <p>Total Storage</p>
          <h2 className="text-3xl font-bold">
            {formatSize(analyticsData.totalStorageUsed)}
          </h2>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
          <p>Total Files</p>
          <h2 className="text-3xl font-bold">{analyticsData.totalFiles}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg">
          <p>Downloads</p>
          <h2 className="text-3xl font-bold">{analyticsData.totalDownloads}</h2>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
          <p>Active Users</p>
          <h2 className="text-3xl font-bold">{analyticsData.activeUsers}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Upload & Download Trends
          </h3>
          <canvas ref={trendChartRef}></canvas>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Storage by File Type
          </h3>
          <canvas ref={storageChartRef}></canvas>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;