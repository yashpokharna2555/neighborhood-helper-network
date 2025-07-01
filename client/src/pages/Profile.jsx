import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setUpdatingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/api/auth/update-location`,
            { coordinates: coords },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProfile((prev) => ({ ...prev, location: res.data.location }));
          toast.success("📍 Location updated successfully");
        } catch (err) {
          toast.error("Failed to update location");
        } finally {
          setUpdatingLocation(false);
        }
      },
      (err) => {
        toast.error("Failed to fetch geolocation");
        setUpdatingLocation(false);
      }
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-6">
            <img
              src="https://www.gravatar.com/avatar/?d=mp"
              alt="User"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{profile.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Karma Points: <strong>{profile.karmaPoints}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                📍 Location: [{profile.location?.coordinates?.[1]}, {profile.location?.coordinates?.[0]}]
              </p>
            </div>
          </div>

          <button
            onClick={updateLocation}
            disabled={updatingLocation}
            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {updatingLocation ? "Updating..." : "Update My Location"}
          </button>
        </div>
      </div>
    </div>
  );
}