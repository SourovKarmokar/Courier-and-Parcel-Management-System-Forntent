import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

/* =====================================================
   FORGET PASSWORD (EMAIL + OTP + RESET)
===================================================== */
const ForgetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/v1/authentication/forget-password`, {
        email,
      });

      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.error || "Failed to send OTP");
      }
    } catch  {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/v1/authentication/verify-reset-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("OTP verified");
        setStep(3);
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/v1/authentication/reset-password`, {
        email,
        password,
      });

      if (res.data.success) {
        toast.success("Password reset successful");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(res.data.error || "Reset failed");
      }
    } catch {
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-center" />

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2 text-center tracking-widest focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-green-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:bg-purple-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
