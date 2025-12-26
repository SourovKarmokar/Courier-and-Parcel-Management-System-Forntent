import { useEffect, useState } from "react";
import socket from "../socket";

/* ================= GOOGLE MAP ================= */
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

/* ================= MAP STYLE ================= */
const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 23.8103, // Dhaka
  lng: 90.4125,
};

/* =====================================================
   LIVE TRACKING COMPONENT (CUSTOMER VIEW)
===================================================== */
const LiveTracking = ({ parcelId }) => {
  const [position, setPosition] = useState(null);

  /* ================= LOAD GOOGLE MAP ================= */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!parcelId) return;

    socket.on("parcel-location-updated", (data) => {
      if (data.parcelId === parcelId) {
        setPosition({
          lat: data.lat,
          lng: data.lng,
        });
      }
    });

    return () => {
      socket.off("parcel-location-updated");
    };
  }, [parcelId]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={14}
      center={position || defaultCenter}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {position && (
        <Marker
          position={position}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      )}
    </GoogleMap>
  );
};

export default LiveTracking;
