import React, { useState } from "react";
import { BadgeCheck, Clock, Tag, MessageCircle } from "lucide-react";
import ChatModal from "./ChatModal";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HelpCard({ help }) {
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{help.title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full
              ${help.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : help.status === "accepted"
                ? "bg-blue-100 text-blue-700"
                : help.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"}
            `}
          >
            {help.status}
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{help.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <Tag size={14} /> {help.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {help.urgency}
          </span>
          <span className="flex items-center gap-1">
            <BadgeCheck size={14} /> Created: {new Date(help.createdAt).toLocaleDateString()}
          </span>
        </div>

        <button
          className="mt-3 flex items-center gap-2 text-indigo-600 text-sm hover:underline"
          onClick={() => setShowChat(true)}
        >
          <MessageCircle size={16} /> Chat
        </button>
      </div>

      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          requestId={help._id}
          user={user}
           requestStatus={help.status}
        />
      )}
    </>
  );
}
