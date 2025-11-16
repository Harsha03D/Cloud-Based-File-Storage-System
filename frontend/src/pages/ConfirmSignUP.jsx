import React, { useState } from "react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

export default function ConfirmSignUp() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleConfirm = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      setMsg("🎉 User confirmed! You can now log in.");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email });
      setMsg("A new verification code has been sent!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Confirm Your Email</h2>

      <input
        type="text"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", margin: "10px 0" }}
      />

      <input
        type="text"
        placeholder="Enter OTP code"
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", margin: "10px 0" }}
      />

      <button onClick={handleConfirm} style={{ width: "100%", marginTop: "10px" }}>
        Confirm
      </button>

      <button onClick={handleResend} style={{ width: "100%", marginTop: "10px" }}>
        Resend Code
      </button>

      <p>{msg}</p>
    </div>
  );
}