import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  // আমরা Redux এর পুরো state.user টা আনছি দেখার জন্য
  const userState = useSelector((state) => state.user);
  const { currentUser } = userState;
  
  // role খোঁজার চেষ্টা (দুই জায়গা থেকেই)
  const role = userState.role || currentUser?.role;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // ✅ ডিবাগিং: কনসোলে প্রিন্ট
  console.log("Redux State:", userState);
  console.log("Detected Role:", role);

  // 👑 Admin
  if (role === "admin") {
    return <AdminDashboard />;
  }

  // 📦 Customer
  if (role === "customer") {
    return <UserDashboard />;
  }

  // 🚚 Agent
  if (role === "agent") {
    return <div className="text-center mt-20">Agent Dashboard Coming Soon...</div>;
  }

  // ❌ যদি রোল না পাওয়া যায়, তাহলে স্ক্রিনে ডাটা দেখাও (যাতে আমরা ফিক্স করতে পারি)
  return (
    <div className="p-10 text-center text-red-600">
      <h1 className="text-3xl font-bold mb-4">Access Denied!</h1>
      <p className="text-xl text-black mb-2">System could not find your Role.</p>
      
      <div className="bg-gray-100 p-4 rounded text-left inline-block mt-4 border border-gray-400">
        <p><strong>Debugging Info:</strong></p>
        <p>Your Name: {currentUser.firstName}</p>
        <p>Your Email: {currentUser.email}</p>
        {/* 👇 এখানে যদি খালি আসে, তার মানে ব্যাকএন্ড রোল পাঠাচ্ছে না */}
        <p className="text-blue-600 font-bold">Your Role: {role || "MISSING in Frontend"}</p>
      </div>
    </div>
  );
};

export default Dashboard;