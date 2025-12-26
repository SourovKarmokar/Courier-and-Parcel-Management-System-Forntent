import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../axios";

/* =====================================================
   BOOK PARCEL (CUSTOMER)
===================================================== */
const BookParcel = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    parcelWeight: "",
    parcelType: "Box",
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/v1/parcel/book", formData);

      if (res.data.success) {
        toast.success("Parcel Booked Successfully!");

        setFormData({
          recipientName: "",
          recipientPhone: "",
          recipientAddress: "",
          parcelWeight: "",
          parcelType: "Box",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(error.response?.data?.error || "Booking failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRICE CALC ================= */
  const estimatedPrice =
    formData.parcelWeight
      ? 150 +
        (parseFloat(formData.parcelWeight) > 1
          ? (parseFloat(formData.parcelWeight) - 1) * 100
          : 0)
      : 0;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <ToastContainer position="top-center" />

      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          📦 Book a Parcel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recipient Name
            </label>
            <input
              type="text"
              name="recipientName"
              required
              value={formData.recipientName}
              onChange={handleChange}
              className="input"
              placeholder="Receiver's Name"
            />
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recipient Phone
            </label>
            <input
              type="text"
              name="recipientPhone"
              required
              value={formData.recipientPhone}
              onChange={handleChange}
              className="input"
              placeholder="017xxxxxxxx"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <textarea
              name="recipientAddress"
              rows="2"
              required
              value={formData.recipientAddress}
              onChange={handleChange}
              className="input"
              placeholder="House, Road, Area, City"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                name="parcelWeight"
                min="0.1"
                step="0.1"
                required
                value={formData.parcelWeight}
                onChange={handleChange}
                className="input"
                placeholder="1.5"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parcel Type
              </label>
              <select
                name="parcelType"
                value={formData.parcelType}
                onChange={handleChange}
                className="input"
              >
                <option value="Box">Box</option>
                <option value="Document">Document</option>
                <option value="Fragile">Fragile</option>
                <option value="Liquid">Liquid</option>
              </select>
            </div>
          </div>

          {/* Estimated Price */}
          {formData.parcelWeight && (
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-600">
                Estimated Delivery Charge
              </p>
              <p className="text-xl font-bold text-blue-600">
                {estimatedPrice} Tk
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Confirming Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      {/* Tailwind helper */}
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

export default BookParcel;
