import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../axios";

/* =====================================================
   AGENT DASHBOARD (PRO VERSION)
===================================================== */
const AgentDashboard = () => {
  const { token } = useSelector((state) => state.user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ASSIGNED PARCELS ================= */
  useEffect(() => {
    if (!token) return;

    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/api/v1/agent/my-jobs");
        setJobs(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load assigned parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [token]);

  /* ================= LIVE LOCATION TRACKING ================= */
  useEffect(() => {
    if (!token || jobs.length === 0) return;

    // 🔥 Only track active parcel
    const activeJob = jobs.find(
      (j) => j.status === "picked_up" || j.status === "in_transit"
    );

    if (!activeJob) return;

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          await api.post("/api/v1/agent/update-location", {
            parcelId: activeJob._id,
            lat: latitude,
            lng: longitude,
          });

          console.log("📍 Location sent:", latitude, longitude);
        } catch (err) {
          console.error(err);
        }
      },
      (err) => {
        console.error("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [jobs, token]);

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (parcelId, status) => {
    try {
      await api.put("/api/v1/agent/update-status", {
        parcelId,
        status,
      });

      toast.success("Status updated");

      setJobs((prev) =>
        prev.map((job) =>
          job._id === parcelId ? { ...job, status } : job
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading Agent Dashboard...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer position="top-center" />

      <h1 className="text-3xl font-bold mb-6">🚚 Agent Dashboard</h1>

      {jobs.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No assigned parcels yet
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-600">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Update Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="p-4 font-semibold">
                    {job.senderId?.firstName}
                  </td>

                  <td className="p-4 text-sm">
                    {job.recipientAddress}
                  </td>

                  <td className="p-4 capitalize font-semibold">
                    {job.status.replace("_", " ")}
                  </td>

                  <td className="p-4">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
