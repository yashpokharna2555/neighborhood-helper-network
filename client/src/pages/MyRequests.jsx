import React, { useEffect, useState } from "react";
import axios from "axios";
import HelpCard from "../components/HelpCard";
import Navbar from "../components/Navbar";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/help/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching my requests", err);
    }
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === filter.toLowerCase());

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            📜 My Help Requests
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No {filter.toLowerCase()} help requests found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <HelpCard key={req._id} help={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
