import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar() {
    const { token, setToken, setUser } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                🤝 N-Hub
            </h1>
            <div className="flex items-center gap-4">
                <Link
                    to="/dashboard"
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mr-4"
                >
                    Dashboard
                </Link>
                <Link
                    to="/my-requests"
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                    My Requests
                </Link>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                </button>
                <Link
                    to="/profile"
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                    Profile
                </Link>


                {token && (
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
