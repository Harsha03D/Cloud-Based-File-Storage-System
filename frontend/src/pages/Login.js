// src/pages/Login.js

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

const defaultConfig = {
  welcome_title: "Welcome back to CloudSafe",
  welcome_subtitle: "Sign in to access your files securely",
  email_label: "Email Address",
  password_label: "Password",
  login_button: "Login",
  forgot_password: "Forgot password?",
  signup_text: "Don't have an account?",
  signup_link: "Sign up",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  text_color: "#1e293b",
  font_family: "Inter",
  font_size: 16,
};

function Login() {
  const navigate = useNavigate();
  const [config] = useState(defaultConfig);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    primary_color,
    secondary_color,
    text_color,
    font_size,
    font_family,
  } = config;

  // Apply gradient background
  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${primary_color}, ${secondary_color}, #7dd3fc)`;
    document.body.style.fontFamily = `${font_family}, sans-serif`;
  }, []);

  // 1️⃣ LOGIN FUNCTION — connects to your Cognito login Lambda
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });

      // Store Cognito JWT token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid email or password"
      );
    }

    setIsLoading(false);
  };

  const handleSignup = () => navigate("/signup");
  const handleHome = () => navigate("/");
  const handleBack = () => navigate(-1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          fontSize: "80px",
          opacity: 0.1,
        }}
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          fontSize: "100px",
          opacity: 0.1,
        }}
      >
        📁
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "60%",
          left: "15%",
          fontSize: "60px",
          opacity: 0.1,
        }}
      >
        🔒
      </motion.div>

      {/* Home / Back */}
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
          onClick={handleBack}
          style={{
            background: "#ffffff",
            border: `2px solid ${primary_color}`,
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            color: primary_color,
            fontWeight: 600,
          }}
        >
          🔙 Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={handleHome}
          style={{
            background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: "48px",
          maxWidth: "480px",
          width: "100%",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            boxShadow: `0 10px 30px ${primary_color}40`,
          }}
        >
          ☁️
        </motion.div>

        <h1
          style={{
            fontSize: `${font_size * 2}px`,
            fontWeight: 700,
            color: text_color,
            marginBottom: "8px",
          }}
        >
          {config.welcome_title}
        </h1>

        <p
          style={{
            fontSize: `${font_size}px`,
            color: text_color,
            opacity: 0.6,
            marginBottom: "32px",
          }}
        >
          {config.welcome_subtitle}
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            textAlign: "left",
          }}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ fontWeight: 600, color: text_color, display: "block" }}
            >
              {config.email_label}
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: `2px solid ${text_color}20`,
                borderRadius: "12px",
                color: text_color,
                fontSize: font_size,
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ fontWeight: 600, color: text_color, display: "block" }}
            >
              {config.password_label}
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingRight: "48px",
                  border: `2px solid ${text_color}20`,
                  borderRadius: "12px",
                  color: text_color,
                  fontSize: font_size,
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <p
              style={{
                color: "red",
                fontWeight: 600,
                fontSize: "0.9rem",
                marginTop: "-10px",
              }}
            >
              {errorMessage}
            </p>
          )}

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: `${font_size * 1.125}px`,
              fontWeight: 700,
              color: "white",
              background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
              border: "none",
              borderRadius: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Logging in..." : config.login_button}
          </motion.button>

          {/* Signup Link */}
          <div
            style={{
              textAlign: "center",
              fontSize: `${font_size * 0.9}px`,
              color: text_color,
              opacity: 0.7,
              marginTop: "8px",
            }}
          >
            {config.signup_text}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSignup();
              }}
              style={{
                color: primary_color,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {config.signup_link}
            </a>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Login;