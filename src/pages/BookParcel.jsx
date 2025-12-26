import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BookParcel = () => {
  // ✅ ফিক্স ১: Redux থেকে সরাসরি token নিয়ে আসা হচ্ছে
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

  // ✅ ফিক্স ২: handleChange এখন হুকের বাইরে এবং সঠিকভাবে ডিফাইন করা হয়েছে
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/parcel/book",
        formData,
        {
          headers: {
            // ✅ ফিক্স ৩: এখানে সরাসরি token ভেরিয়েবল ব্যবহার করা হয়েছে
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.data.success) {
        toast.success("Parcel Booked Successfully!");
        setFormData({
            recipientName: "",
            recipientPhone: "",
            recipientAddress: "",
            parcelWeight: "",
            parcelType: "Box",
        });
        
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error(error);
      // টোকেন এক্সপায়ারড বা অথেনটিকেশন ফেইল করলে লগইন পেজে পাঠানো
      if(error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session Expired. Please Login Again.");
          setTimeout(() => navigate("/login"), 2000);
      } else {
          toast.error(error.response?.data?.error || "Booking Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ডিবাগিং: কনসোলে চেক করে নিশ্চিত হোন যে টোকেন সঠিক আছে
  console.log("Current User:", currentUser);
  console.log("Current Token:", token);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <ToastContainer position="top-center" />
      
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Book a Parcel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Receiver's Name"
              value={formData.recipientName}
              onChange={handleChange}
            />
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Phone</label>
            <input
              type="text"
              name="recipientPhone"
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="017xxxxxxxx"
              value={formData.recipientPhone}
              onChange={handleChange}
            />
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              name="recipientAddress"
              required
              rows="2"
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="House, Road, Area, City"
              value={formData.recipientAddress}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Parcel Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                name="parcelWeight"
                required
                min="0.1"
                step="0.1"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1.5"
                value={formData.parcelWeight}
                onChange={handleChange}
              />
            </div>

            {/* Parcel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Parcel Type</label>
              <select
                name="parcelType"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.parcelType}
                onChange={handleChange}
              >
                <option value="Box">Box</option>
                <option value="Document">Document</option>
                <option value="Fragile">Fragile (Glass/Electronics)</option>
                <option value="Liquid">Liquid</option>
              </select>
            </div>
          </div>

          {/* Price Estimation Show */}
          {formData.parcelWeight && (
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-600">Estimated Delivery Charge:</p>
              <p className="text-xl font-bold text-blue-600">
                {150 + (parseFloat(formData.parcelWeight) > 1 ? (parseFloat(formData.parcelWeight) - 1) * 100 : 0)} Tk
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Confirming Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookParcel;