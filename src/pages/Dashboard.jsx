import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Role based dashboards
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import AgentDashboard from "./AgentDashboard";

const Dashboard = () => {
  const { currentUser, token } = useSelector((state) => state.user);

  // 🔐 Not logged in
  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Courier Management System
            </h1>
            <p className="text-sm text-gray-500">
              Welcome, {currentUser.firstName}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : role === "agent"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
          >
            {role.toUpperCase()}
          </span>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {role === "admin" && <AdminDashboard />}
        {role === "customer" && <UserDashboard />}
        {role === "agent" && <AgentDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
