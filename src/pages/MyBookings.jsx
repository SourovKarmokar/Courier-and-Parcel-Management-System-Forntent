import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import socket from "../socket";

/* ================= GOOGLE MAP ================= */
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

/* ================= MAP CONFIG ================= */
const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "14px",
};

// Default fallback (Dhaka)
const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

/* =====================================================
   CUSTOMER – MY BOOKINGS WITH LIVE TRACKING
===================================================== */
const MyBookings = () => {
  const { token, currentUser } = useSelector((state) => state.user);

  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState({});

  /* ================= LOAD GOOGLE MAP ================= */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  /* ================= LOAD MY PARCELS ================= */
  useEffect(() => {
    if (!token) return;

    const loadParcels = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/customer/my-parcels`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setParcels(res.data.data || []);
      } catch (err) {
        console.error("❌ Load parcels failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadParcels();
  }, [token]);

  /* ================= SOCKET REALTIME ================= */
  useEffect(() => {
    if (!currentUser?._id) return;

    const roomId = `customer_${currentUser._id}`;
    socket.emit("join-room", roomId);

    socket.on("parcel-status-updated", (data) => {
      setParcels((prev) =>
        prev.map((p) =>
          p._id === data.parcelId ? { ...p, status: data.status } : p
        )
      );
    });

    socket.on("parcel-location-updated", (data) => {
      setParcels((prev) =>
        prev.map((p) =>
          p._id === data.parcelId
            ? {
                ...p,
                liveLocation: { lat: data.lat, lng: data.lng },
              }
            : p
        )
      );
    });

    return () => {
      socket.off("parcel-status-updated");
      socket.off("parcel-location-updated");
    };
  }, [currentUser]);

  /* ================= CREATE ROUTE ================= */
  const buildRoute = (parcel) => {
    if (!parcel.liveLocation || !window.google || !isLoaded) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: parcel.liveLocation,
        destination: parcel.recipientAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections((prev) => ({
            ...prev,
            [parcel._id]: result,
          }));
        }
      }
    );
  };

  /* ================= LOADING ================= */
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-semibold">
        Loading parcels...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📦 My Parcels</h1>

      {parcels.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center">
          No parcels yet
        </div>
      ) : (
        <div className="space-y-6">
          {parcels.map((p) => {
            const center = p.liveLocation || defaultCenter;

            return (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow p-6 space-y-4"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">
                      {p.recipientName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.recipientAddress}
                    </p>
                  </div>

                  <StatusBadge status={p.status} />
                </div>

                {/* RIDER */}
                <p className="text-sm text-gray-600">
                  🚚 Rider:{" "}
                  {p.deliveryManId
                    ? p.deliveryManId.firstName
                    : "Not Assigned"}
                </p>

                {/* MAP */}
                <div className="relative">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={() => buildRoute(p)}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {p.liveLocation && (
                      <Marker
                        position={p.liveLocation}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                      />
                    )}

                    {directions[p._id] && (
                      <DirectionsRenderer
                        directions={directions[p._id]}
                        options={{
                          suppressMarkers: true,
                          polylineOptions: {
                            strokeColor: "#2563eb",
                            strokeWeight: 5,
                          },
                        }}
                      />
                    )}
                  </GoogleMap>

                  {p.liveLocation && (
                    <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs">
                      🟢 Live Tracking
                    </div>
                  )}
                </div>

                {!p.liveLocation && (
                  <p className="text-xs text-gray-400 text-center">
                    Waiting for rider live location...
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    in_transit: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};
