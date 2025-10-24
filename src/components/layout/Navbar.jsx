// src/components/layout/Navbar.jsx

import { Bell, MessageSquare, Search, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Navbar({ onMenuClick, isMobile }) {
  const { user } = useSelector((state) => state.auth);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || savedUser;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-fixed flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 md:px-6"
      role="banner"
    >
      {/* Left section: Menu button (mobile) + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <Menu size={20} className="text-gray-700" aria-hidden="true" />
        </button>

        {/* Search - Responsive */}
        <div className="flex-1 max-w-full sm:max-w-md lg:max-w-lg">
          {/* Desktop search */}
          <div className="hidden sm:block relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent"
              aria-label="Search products"
            />
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isSearchOpen}
          >
            {isSearchOpen ? (
              <X size={20} className="text-gray-700" aria-hidden="true" />
            ) : (
              <Search size={20} className="text-gray-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Right section: Notifications + Profile */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Notification button */}
        <button
          className="relative inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
          aria-label="Notifications (1 unread)"
        >
          <Bell size={20} className="text-gray-600" aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
            aria-hidden="true"
          ></span>
          <span className="sr-only">1 unread notification</span>
        </button>

        {/* Messages button */}
        <button
          className="hidden sm:inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
          aria-label="Messages"
        >
          <MessageSquare
            size={20}
            className="text-gray-600"
            aria-hidden="true"
          />
        </button>

        {/* User profile */}
        <button
          className="flex items-center gap-2 min-h-touch pl-2 pr-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
          aria-label={`User menu for ${currentUser?.userName || "Guest User"}`}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0"
            aria-hidden="true"
          />
          {/* User info - Hidden on very small screens */}
          <div className="hidden xs:block text-left">
            <p className="font-medium text-sm leading-tight truncate max-w-[100px] sm:max-w-[150px]">
              {currentUser?.userName || "Guest User"}
            </p>
            <p className="text-gray-400 text-xs capitalize leading-tight">
              {currentUser?.role || "user"}
            </p>
          </div>
        </button>
      </div>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-3 shadow-lg">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent"
              aria-label="Search products"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
