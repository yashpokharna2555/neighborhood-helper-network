import { BadgeCheck, Clock, Tag } from "lucide-react";

export default function HelpCard({ help }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{help.title}</h3>
        <span className="text-xs text-green-600 font-medium capitalize">{help.status}</span>
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
    </div>
  );
}
