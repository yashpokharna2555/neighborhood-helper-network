// src/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:5000", {
  transports: ["websocket"],       // 🔧 Forces WebSocket instead of polling
  withCredentials: false,          // 🔧 No cookies or CORS issues
  autoConnect: true,               // Optional: connect immediately
});

export default socket;
