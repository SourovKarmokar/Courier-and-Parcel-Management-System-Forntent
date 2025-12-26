import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../redux/userSlice";

/* ================= LEAFLET ================= */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ================= FIX MARKER ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= MAP CONFIG ================= */
const mapCenter = [23.8103, 90.4125]; // Dhaka
const mapStyle = {
  height: "320px",
  width: "100%",
  borderRadius: "16px",
};

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CourierPro</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">
            Hello, {currentUser?.firstName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto mt-10 p-6 space-y-10">

        {/* ================= ACTION CARDS ================= */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            User Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Parcel */}
            <Link to="/book-parcel">
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-blue-600">
                  📦 Book a Parcel
                </h3>
                <p className="text-gray-500 mt-2">
                  Click here to send a new parcel.
                </p>
              </div>
            </Link>

            {/* My Bookings */}
            <Link to="/my-parcels">
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-green-500 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-green-600">
                  📋 My Bookings
                </h3>
                <p className="text-gray-500 mt-2">
                  View your order history & live tracking.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ================= MAP SECTION ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📍 Delivery Coverage Area
          </h3>

          <MapContainer
            center={mapCenter}
            zoom={12}
            style={mapStyle}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            <Marker position={mapCenter} />
          </MapContainer>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Live delivery tracking will be shown here after booking a parcel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
