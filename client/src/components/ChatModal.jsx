import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import socket from "../socket";
import axios from "axios";

export default function ChatModal({ isOpen, onClose, requestId, user, requestStatus }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/chat/${requestId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  useEffect(() => {
    if (!isOpen || !requestId) return;

    fetchMessages();
    socket.emit("joinRoom", { requestId });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [isOpen, requestId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const message = { requestId, sender: user?.name || "Anonymous", text };

    // emit for real-time
    socket.emit("sendMessage", message);

    // optimistically update
    // setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
    setText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg z-50 border border-gray-300 dark:border-gray-600">

      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Live Chat</h2>

        <div className="h-60 overflow-y-auto border p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm space-y-2 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md ${
                msg.sender === user?.name ? "bg-indigo-100 ml-auto text-right" : "bg-white dark:bg-gray-600"
              }`}
            >
              <p className="font-semibold text-xs">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-[10px] text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-md text-black dark:text-white dark:bg-gray-700"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={requestStatus === "completed"}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            onClick={sendMessage}
            disabled={requestStatus === "completed"}
          >
            Send
          </button>
        </div>

        {requestStatus === "completed" && (
          <p className="text-xs text-red-400 mt-2">Chat disabled for completed request</p>
        )}
      </div>
    </div>
  );
}
