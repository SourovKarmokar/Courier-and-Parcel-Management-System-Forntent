import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import socket from "../socket";

const LiveTracking = ({ parcelId }) => {
  const [position, setPosition] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    socket.on("live-location", (data) => {
      if (data.parcelId === parcelId) {
        setPosition({ lat: data.lat, lng: data.lng });
      }
    });

    return () => socket.off("live-location");
  }, [parcelId]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      zoom={14}
      center={position || { lat: 23.8103, lng: 90.4125 }}
      mapContainerStyle={{ width: "100%", height: "300px" }}
    >
      {position && <Marker position={position} />}
    </GoogleMap>
  );
};

export default LiveTracking;
