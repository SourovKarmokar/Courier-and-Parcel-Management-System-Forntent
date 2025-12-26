import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../socket";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-purple-100 text-purple-700",
    picked_up: "bg-blue-100 text-blue-700",
    in_transit: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

const MyParcels = () => {
  const { token } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD PARCELS =================
  useEffect(() => {
    if (!token) return;

    const loadOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/customer/my-parcels",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load parcels", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  // ================= REALTIME UPDATE =================
  useEffect(() => {
    socket.on("parcel-status-updated", (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.parcelId
            ? { ...order, status: data.status }
            : order
        )
      );
    });

    return () => socket.off("parcel-status-updated");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your parcels...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📦 My Parcels</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            You have no parcel bookings yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Delivery Agent</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">
                      {o.recipientName}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {o.recipientAddress}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>

                    <td className="p-4 text-sm">
                      {o.deliveryManId ? (
                        <span className="font-medium">
                          {o.deliveryManId.firstName}{" "}
                          {o.deliveryManId.lastName || ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Not Assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;
