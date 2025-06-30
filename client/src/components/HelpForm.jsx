import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function HelpForm({ onRequestCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    urgency: "Today",
    coordinates: [],
  });

  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setForm((prev) => ({
            ...prev,
            coordinates: [longitude, latitude], // lng, lat
          }));
          setLoadingLocation(false);
        },
        async (err) => {
          console.warn("Geolocation error:", err);
          toast.error("Failed to get your location, using profile location");

          // Fallback: Get from profile
          try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const coords = res.data.location?.coordinates || [0, 0];
            setForm((prev) => ({
              ...prev,
              coordinates: coords,
            }));
          } catch (profileErr) {
            console.error("Failed to fetch fallback location:", profileErr);
            toast.error("Fallback location also failed");
          } finally {
            setLoadingLocation(false);
          }
        }
      );
    } else {
      toast.error("Geolocation not supported. Using profile location");
      setLoadingLocation(false);
    }
  };

  fetchLocation();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.coordinates.length === 0) {
      toast.error("Please wait, fetching your location...");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/help`, form);
      toast.success("🎉 Help request submitted!");
      onRequestCreated();
      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
      }));
    } catch (err) {
      toast.error("❌ Error creating request");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6 w-full border border-gray-100 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        🤝 Post a Help Request
      </h2>

      {loadingLocation ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">📍 Fetching your location...</p>
      ) : null}

      <input
        type="text"
        name="title"
        placeholder="What do you need help with?"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <textarea
        name="description"
        placeholder="Please provide more details"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="general">General</option>
            <option value="medical">Medical</option>
            <option value="grocery">Grocery</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Urgency
          </label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Immediate">Immediate</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        🚀 Submit Help Request
      </button>
    </form>
  );
}
