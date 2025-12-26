import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgetPassword";
import BookParcel from "./pages/BookParcel";
import MyParcels from "./pages/MyParcels";
import AgentDashboard from "./pages/AgentDashboard";
import MyBookings from "./pages/MyBookings";

import socket from "./socket"; // 🔥 SOCKET IMPORT
import { useSelector } from "react-redux";

function App() {
  // 🔵 SOCKET CONNECT TEST\

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("join-room", `customer_${currentUser._id}`);
      console.log("🔗 Joined socket room:", `customer_${currentUser._id}`);
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-parcel" element={<BookParcel />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-parcels" element={<MyParcels />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
