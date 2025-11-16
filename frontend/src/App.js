// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UserInfo from "./pages/UserInfo";
import FileManagement from "./pages/FileManagement";
import Analytics from "./pages/Analytics";
import Activities from "./pages/Activities";
import Upload from "./pages/Upload";
import About from "./pages/About";
import ErrorPage from "./pages/Error";
import ConfirmSignUp from "./pages/ConfirmSignUP";

// -----------------------------------------------------
// 🔐 Private Route Wrapper
// -----------------------------------------------------
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/confirm" element={<ConfirmSignUp />} />

        {/* 🔐 Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/userinfo"
          element={
            <PrivateRoute>
              <UserInfo />
            </PrivateRoute>
          }
        />

        <Route
          path="/files"
          element={
            <PrivateRoute>
              <FileManagement />
            </PrivateRoute>
          }
        />

        {/* OLD upload path (kept safe) */}
        <Route
          path="/files/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        {/* NEW upload path (Dashboard button navigates here) */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        <Route
          path="/files/:fileId"
          element={
            <PrivateRoute>
              <FileManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <PrivateRoute>
              <Activities />
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />

        {/* ⛔ 404 Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}