import { Bell, MessageSquare, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || savedUser;

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      {/* Search */}
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search product"
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Icons + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button>
          <MessageSquare size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium">
              {currentUser?.userName || "Guest User"}
            </p>
            <p className="text-gray-400 text-xs capitalize">
              {currentUser?.role || "user"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
