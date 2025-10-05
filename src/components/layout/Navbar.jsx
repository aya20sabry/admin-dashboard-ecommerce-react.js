// src/components/layout/Navbar.jsx
import { Bell, User, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between bg-white shadow px-4 sm:px-6 py-3">
      {/* Mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-md hover:bg-gray-100 sm:hidden"
          aria-label="Open sidebar"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Admin Dashboard</h1>
      </div>

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
