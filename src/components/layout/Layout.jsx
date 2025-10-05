// src/components/layout/Layout.jsx

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Right section: navbar on top, content below */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar onMenuClick={openSidebar} />
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
