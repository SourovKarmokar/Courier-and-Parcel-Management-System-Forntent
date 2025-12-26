import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  /* ================= AUTO REDIRECT IF LOGGED IN ================= */
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/authentication/login`,
        formData
      );

      if (res.data.success) {
        const payload = {
          user: res.data.user,
          token: res.data.accessToken,
          role: res.data.user.role,
        };

        dispatch(loginSuccess(payload));

        toast.success("Login Successful!");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        toast.error(res.data.error || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid Email or Password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sign in to manage your parcels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-500 transition"
          >
            Sign In
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
