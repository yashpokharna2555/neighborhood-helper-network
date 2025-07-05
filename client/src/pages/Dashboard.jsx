import React, { useEffect, useState, useContext } from "react";
import HelpForm from "../components/HelpForm";
import HelpCard from "../components/HelpCard";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket"; // 👈 socket client

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [nearby, setNearby] = useState([]);

  const fetchNearby = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/help/nearby?lng=77.5946&lat=12.9716`
      );
      const filtered = res.data.filter(
        (request) => request.requesterId?._id !== user?._id
      );
      setNearby(filtered);
    } catch (err) {
      console.error("Error fetching nearby requests", err);
    }
  };

  useEffect(() => {
    fetchNearby();

    // ✅ Listen for socket connection
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    // Optional: show disconnection
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <HelpForm onRequestCreated={fetchNearby} />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            📍 Nearby Help Requests
          </h2>
          {nearby.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No nearby requests yet.
            </p>
          ) : (
            nearby.map((req) => <HelpCard key={req._id} help={req} />)
          )}
        </div>
      </div>
    </div>
  );
}
