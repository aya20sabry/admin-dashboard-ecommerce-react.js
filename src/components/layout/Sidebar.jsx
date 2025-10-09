import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import Swal from "sweetalert2";
import axiosInstance from "../../Api/axiosInstance";
import { logout } from "../../store/slices/authSlice"; // تأكد أن عندك action اسمه logout

export default function Sidebar({ isOpen = false, onClose }) {
  const [isProductOpen, setIsProductOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role || JSON.parse(localStorage.getItem("user"))?.role;

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/logout");
      const message = response?.data?.data?.message || "Logged out successfully";

      // ✅ احذف بيانات المستخدم
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());

      // ✅ أظهر تنبيه نجاح
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
    "flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors";
  const activeItemClasses = "bg-blue-50 text-blue-600 hover:bg-blue-50";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="brand logo" className="h-8 w-auto" />
          </div>
          <div className="mt-3 p-3 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src="/logo1.png"
                alt="company logo"
                className="h-8 w-8 rounded-md object-contain"
              />
              <div>
                <div className="text-xs text-gray-500">Company</div>
                <div className="mt-0.5 text-sm font-medium text-gray-800">
                  Kanky Store
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar content */}
        <nav className="px-3 flex-1 overflow-y-auto">
          {/* Product Section */}
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
              className={`transition-transform ${
                isProductOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProductOpen && (
            <div className="ml-9 mt-1 mb-2 space-y-1 text-sm">
              <Link
                to="/product/sneakers"
                onClick={handleNavigate}
                className="block px-3 py-1.5 rounded hover:bg-gray-100"
              >
                Sneakers
              </Link>
              <Link
                to="/product/jacket"
                onClick={handleNavigate}
                className="block px-3 py-1.5 rounded hover:bg-gray-100"
              >
                Jacket
              </Link>
              <Link
                to="/product/tshirt"
                onClick={handleNavigate}
                className="block px-3 py-1.5 rounded hover:bg-gray-100"
              >
                T-Shirt
              </Link>
              <Link
                to="/product/bag"
                onClick={handleNavigate}
                className="block px-3 py-1.5 rounded hover:bg-gray-100"
              >
                Bag
              </Link>
            </div>
          )}

          {/* Admin-only sections */}
          {role === "admin" && (
            <>
              <div className="px-1 text-[11px] font-semibold text-gray-400 tracking-wide mb-2">
                GENERAL
              </div>

              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
                onClick={handleNavigate}
              >
                <FiHome />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/transaction"
                onClick={handleNavigate}
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
              >
                <FiBarChart2 />
                <span>Transaction</span>
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

              <NavLink
                to="/sales-report"
                onClick={handleNavigate}
                className={({ isActive }) =>
                  `${baseItemClasses} ${isActive ? activeItemClasses : ""}`
                }
              >
                <FiFileText />
                <span>Sales Report</span>
              </NavLink>

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
            </>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
            <span className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  {user?.userName || "User"}
                </span>
                <span className="block text-xs text-gray-500 capitalize">
                  {role}
                </span>
              </span>
            </span>
            <FiChevronDown className="text-gray-500" />
          </button>

          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
