import { io } from "socket.io-client";

// ✅ Production Backend URL (Render)
const URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(URL, {
  transports: ["websocket"], // Fast websocket only
  autoConnect: true,         // Auto connect
  reconnection: true,        // Auto reconnect
  reconnectionAttempts: 5,   // Max 5 retries
});

export default socket;
