import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/userSlice";

/* ===== Recharts ===== */
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =====================================================
   ADMIN DASHBOARD WITH CHARTS (PRO VERSION)
===================================================== */
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("reports");
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ADMIN DATA ================= */
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const [parcelRes, agentRes, userRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/admin/parcels", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/v1/admin/agents", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/v1/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setParcels(parcelRes.data || []);
        setAgents(agentRes.data || []);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("Admin load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  /* ================= ASSIGN AGENT ================= */
  const handleAssignAgent = async (parcelId, agentId) => {
    if (!agentId) return;

    await axios.put(
      "http://localhost:3000/api/v1/admin/assign-agent",
      { parcelId, agentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setParcels((prev) =>
      prev.map((p) =>
        p._id === parcelId
          ? {
              ...p,
              status: "assigned",
              deliveryManId: agents.find((a) => a._id === agentId),
            }
          : p
      )
    );
  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(
      `http://localhost:3000/api/v1/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  /* ================= EXPORT CSV / PDF ================= */
  const handleExport = async (type) => {
    const url =
      type === "csv"
        ? "http://localhost:3000/api/v1/admin/export/csv"
        : "http://localhost:3000/api/v1/admin/export/pdf";

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download =
      type === "csv" ? "parcel-report.csv" : "parcel-report.pdf";
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold mb-10">🚚 Admin Panel</h2>

        <ul className="space-y-3 flex-1">
          <SidebarItem label="📊 Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
          <SidebarItem label="📦 Parcels" active={activeTab === "parcels"} onClick={() => setActiveTab("parcels")} />
          <SidebarItem label="👥 Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
        </ul>

        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6">
        {activeTab === "reports" && (
          <ReportsTab parcels={parcels} onExport={handleExport} />
        )}

        {activeTab === "parcels" && (
          <ParcelsTab parcels={parcels} agents={agents} onAssign={handleAssignAgent} />
        )}

        {activeTab === "users" && (
          <UsersTab users={users} onDelete={handleDeleteUser} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

/* =====================================================
   SIDEBAR ITEM
===================================================== */
const SidebarItem = ({ label, active, onClick }) => (
  <li
    onClick={onClick}
    className={`cursor-pointer px-4 py-2 rounded transition
      ${active ? "bg-slate-700 text-white" : "text-gray-300 hover:bg-slate-800"}`}
  >
    {label}
  </li>
);

/* =====================================================
   REPORTS TAB WITH CHARTS
===================================================== */
const ReportsTab = ({ parcels, onExport }) => {
  const totalParcels = parcels.length;
  const delivered = parcels.filter((p) => p.status === "delivered").length;
  const pending = parcels.filter((p) => p.status === "pending").length;

  const totalAmount = parcels.reduce(
    (sum, p) => sum + (p.deliveryCharge || 0),
    0
  );

  /* ===== Chart Data ===== */
  const statusData = [
    { name: "Delivered", value: delivered },
    { name: "Pending", value: pending },
    { name: "Others", value: totalParcels - delivered - pending },
  ];

  const amountData = [
    { name: "Revenue", amount: totalAmount },
  ];

  const COLORS = ["#22c55e", "#facc15", "#94a3b8"];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Business Reports</h1>

        <div className="flex gap-3">
          <button onClick={() => onExport("csv")} className="bg-green-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>
          <button onClick={() => onExport("pdf")} className="bg-red-600 text-white px-4 py-2 rounded">
            Export PDF
          </button>
        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ReportCard title="Total Parcels" value={totalParcels} />
        <ReportCard title="Delivered" value={delivered} />
        <ReportCard title="Pending" value={pending} />
        <ReportCard title="💰 Total Amount" value={`${totalAmount} Tk`} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE CHART */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Parcel Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

/* =====================================================
   REPORT CARD
===================================================== */
const ReportCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

/* =====================================================
   PARCELS TAB
===================================================== */
const ParcelsTab = ({ parcels, agents, onAssign }) => (
  <>
    <h1 className="text-3xl font-bold mb-6">📦 Parcels</h1>

    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Address</th>
            <th className="p-4">Status</th>
            <th className="p-4">Agent</th>
            <th className="p-4">Assign</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="p-4">{p.senderName}</td>
              <td className="p-4">{p.recipientAddress}</td>
              <td className="p-4 capitalize">{p.status}</td>
              <td className="p-4">{p.deliveryManId?.firstName || "—"}</td>
              <td className="p-4">
                {p.status === "pending" && (
                  <select
                    onChange={(e) => onAssign(p._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Select Agent</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.firstName}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

/* =====================================================
   USERS TAB
===================================================== */
const UsersTab = ({ users, onDelete }) => (
  <>
    <h1 className="text-3xl font-bold mb-6">👥 Users</h1>

    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-4">{u.firstName} {u.lastName}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">
                {u.role === "admin" ? (
                  <span className="text-gray-400">Protected</span>
                ) : (
                  <button onClick={() => onDelete(u._id)} className="text-red-600">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);
