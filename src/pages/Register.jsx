import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/authentication/registration`,
        payload
      );

      if (res.data.message === "Registration Successfull") {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/authentication/verifybyotp`,
        {
          email: formData.email,
          otp,
        }
      );

      if (res.data.success) {
        toast.success("Account verified successfully");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h2>

        <p className="text-center text-sm text-gray-500 mt-2">
          {step === 1
            ? "Register to book and track parcels"
            : `Enter OTP sent to ${formData.email}`}
        </p>

        {/* ================= REGISTER FORM ================= */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                required
                onChange={handleChange}
                className="input"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                required
                onChange={handleChange}
                className="input"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="input"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition disabled:bg-blue-300"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        )}

        {/* ================= OTP FORM ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP"
              className="input text-center text-xl tracking-widest"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transition disabled:bg-green-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>

      {/* ================= INPUT STYLE ================= */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,.2);
        }
      `}</style>
    </div>
  );
};

export default Register;
