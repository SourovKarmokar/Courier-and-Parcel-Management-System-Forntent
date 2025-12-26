import { io } from "socket.io-client";

// আপনার ব্যাকএন্ড সার্ভারের ঠিকানা
const URL = "http://localhost:3000";

const socket = io(URL, {
  transports: ["websocket"], // পোলিং বাদ দিয়ে সরাসরি ওয়েব-সকেট ব্যবহার করবে (Fast)
  autoConnect: true,         // অটোমেটিক কানেক্ট হবে
  reconnection: true,        // লাইন কেটে গেলে আবার রিকানেক্ট চেষ্টা করবে
  reconnectionAttempts: 5    // সর্বোচ্চ ৫ বার চেষ্টা করবে
});

export default socket;