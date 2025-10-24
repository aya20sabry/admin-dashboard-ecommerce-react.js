// src/components/layout/Sidebar.jsx

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiTag,
  FiList,
  FiHelpCircle,
  FiChevronDown,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";
import axiosInstance from "../../Api/axiosInstance";
import { logout } from "../../store/slices/authSlice";

export default function Sidebar({ isOpen = false, onClose, isMobile }) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sidebarRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role || JSON.parse(localStorage.getItem("user"))?.role;

  // Handle swipe to close on mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left to close
      if (isMobile && onClose) onClose();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && isMobile && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isMobile, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && isMobile && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      firstElement?.focus();

      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen, isMobile]);

  const handleNavigate = () => {
    if (isMobile && onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/logout");
      const message =
        response?.data?.data?.message || "Logged out successfully";

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());

      await Swal.fire({
        icon: "success",
        title: "Logout Successful",
        text: message,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const baseItemClasses =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500";
  const activeItemClasses = "bg-blue-50 text-blue-600 hover:bg-blue-100";

  return (
    <>
      {/* Backdrop overlay - Mobile only */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-modal-backdrop backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed inset-y-0 left-0 z-modal
          w-[280px] sm:w-[300px] lg:w-72
          transform transition-transform duration-300 ease-out
          bg-white border-r border-gray-200
          flex flex-col
          ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0
          overflow-hidden
        `}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={isMobile && !isOpen}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 lg:justify-start">
          <div className="flex items-center gap-3 flex-1">
            <img
              src="/logo.png"
              alt="Kanky Store logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Close button - Mobile only */}
          {isMobile && (
            <button
              onClick={onClose}
              className="lg:hidden inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation"
              aria-label="Close navigation menu"
            >
              <FiX size={20} className="text-gray-700" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Company Info Card */}
        <div className="px-4 pb-3">
          <div className="p-3 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <img
                src="/logo1.png"
                alt="Kanky Store company icon"
                className="h-8 w-8 rounded-md object-contain flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500">Company</div>
                <div className="mt-0.5 text-sm font-medium text-gray-800 truncate">
                  Kanky Store
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav
          className="px-3 flex-1 overflow-y-auto scrollbar-thin pb-4"
          aria-label="Main menu"
        >
          {/* Product List */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
            }
            onClick={handleNavigate}
          >
            <FiBox size={20} aria-hidden="true" />
            <span>Product List</span>
          </NavLink>

          {/* Admin-only sections */}
          {role === "admin" && (
            <>
              <div className="px-1 pt-4 pb-2 text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                General
              </div>

              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiHome size={20} aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/transaction"
                onClick={handleNavigate}
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
              >
                <FiBarChart2 size={20} aria-hidden="true" />
                <span>Transaction</span>
              </NavLink>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiUsers size={20} aria-hidden="true" />
                <span>Customers</span>
              </NavLink>

              <NavLink
                to="/sales-report"
                onClick={handleNavigate}
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
              >
                <FiFileText size={20} aria-hidden="true" />
                <span>Sales Report</span>
              </NavLink>

              <div className="px-1 pt-4 pb-2 text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                Tools
              </div>

              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiTag size={20} aria-hidden="true" />
                <span>Categories</span>
              </NavLink>

              <NavLink
                to="/subcategories"
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiList size={20} aria-hidden="true" />
                <span>Subcategories</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiSettings size={20} aria-hidden="true" />
                <span>Account & Settings</span>
              </NavLink>

              <Link
                to="#"
                className={baseItemClasses}
                onClick={(e) => e.preventDefault()}
              >
                <FiHelpCircle size={20} aria-hidden="true" />
                <span>Help</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Logout - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 space-y-2 bg-white">
          {/* User Profile Card */}
          <button
            className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="User profile menu"
          >
            <span className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src="https://i.pravatar.cc/40"
                alt=""
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-gray-800 truncate">
                  {user?.userName || "User"}
                </span>
                <span className="block text-xs text-gray-500 capitalize truncate">
                  {role}
                </span>
              </span>
            </span>
            <FiChevronDown
              className="text-gray-500 flex-shrink-0"
              aria-hidden="true"
            />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Logout from account"
          >
            <FiLogOut size={20} aria-hidden="true" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
