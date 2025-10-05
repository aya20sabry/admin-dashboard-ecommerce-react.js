// src/components/layout/Sidebar.jsx
import { LayoutDashboard, Users, FileBarChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-80 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Menu
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link
          to="/users"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
        >
          <Users size={20} /> Users
        </Link>
       
        <Link
          to="/settings"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
