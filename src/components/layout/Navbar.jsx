// src/components/layout/Navbar.jsx
import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Logo */}
      <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
