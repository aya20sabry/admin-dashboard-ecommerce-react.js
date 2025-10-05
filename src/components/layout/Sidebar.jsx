// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";

export default function Sidebar({ isOpen = false, onClose }) {
  const [isProductOpen, setIsProductOpen] = useState(true);

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  const baseItemClasses =
    "flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors";
  const activeItemClasses = "bg-blue-50 text-blue-600 hover:bg-blue-50";

  return (
    <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-200 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}
    >
      {/* Brand */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="brand logo" className="h-8 w-auto" />
        </div>
        {/* Company card */}
        <div className="mt-3 p-3 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <img src="/logo1.png" alt="company logo" className="h-8 w-8 rounded-md object-contain" />
            <div>
              <div className="text-xs text-gray-500">Company</div>
              <div className="mt-0.5 text-sm font-medium text-gray-800">Kanky Store</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <nav className="px-3 flex-1 overflow-y-auto">
        <div className="px-1 text-[11px] font-semibold text-gray-400 tracking-wide mb-2">GENERAL</div>

        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
          }
          onClick={handleNavigate}
        >
          <FiHome className="shrink-0" />
          <span>Dashboard</span>
        </NavLink>

        {/* Product (collapsible) */}
        <button
          type="button"
          onClick={() => setIsProductOpen((v) => !v)}
          className={`${baseItemClasses} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <FiBox className="shrink-0" />
            <span>Product</span>
          </span>
          <FiChevronDown
            className={`transition-transform ${isProductOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isProductOpen && (
          <div className="ml-9 mt-1 mb-2 space-y-1 text-sm">
            <Link to="/product/sneakers" onClick={handleNavigate} className="block px-3 py-1.5 rounded hover:bg-gray-100">
              Sneakers
            </Link>
            <Link to="/product/jacket" onClick={handleNavigate} className="block px-3 py-1.5 rounded hover:bg-gray-100">
              Jacket
            </Link>
            <Link to="/product/tshirt" onClick={handleNavigate} className="block px-3 py-1.5 rounded hover:bg-gray-100">
              T-Shirt
            </Link>
            <Link to="/product/bag" onClick={handleNavigate} className="block px-3 py-1.5 rounded hover:bg-gray-100">
              Bag
            </Link>
          </div>
        )}

        {/* Other general items */}
        <NavLink to="/transaction" onClick={handleNavigate} className={({isActive})=>`${baseItemClasses} ${isActive?activeItemClasses:""}`}>
          <FiBarChart2 />
          <span>Transaction</span>
          <span className="ml-auto text-xs rounded-md bg-gray-100 text-gray-600 px-2 py-0.5">
            641
          </span>
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
          }
          onClick={handleNavigate}
        >
          <FiUsers />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/sales-report" onClick={handleNavigate} className={({isActive})=>`${baseItemClasses} ${isActive?activeItemClasses:""}`}>
          <FiFileText />
          <span>Sales Report</span>
        </NavLink>

        {/* Tools */}
        <div className="mt-4 px-1 text-[11px] font-semibold text-gray-400 tracking-wide mb-2">
          TOOLS
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
          }
          onClick={handleNavigate}
        >
          <FiSettings />
          <span>Account & Settings</span>
        </NavLink>
        <Link to="#" className={baseItemClasses}>
          <FiHelpCircle />
          <span>Help</span>
        </Link>

        <div className="mt-1 flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 text-gray-700">
            <FiMoon />
            <span>Dark Mode</span>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" />
            <span className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors" />
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transform transition-transform peer-checked:translate-x-4" />
          </label>
        </div>
      </nav>

      {/* Bottom user card */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
          <span className="flex items-center gap-3">
            <img
              src="https://imgs.search.brave.com/50_JhKdhlZ-nt554BOP7RBUKWRUt2nnEsf-uaOHrloQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC9k/NGQxZDUxNjg5NzAy/OTUuNjQ0NGIzN2Uw/OWMxNy5qcGc"
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">aboda</span>
              <span className="block text-xs text-gray-500">Admin</span>
            </span>
          </span>
          <FiChevronDown className="text-gray-500" />
        </button>
      </div>
    </aside>
    </>
  );
}
