// src/components/layout/Layout.jsx

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile when resizing
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Hidden on mobile by default, shown on desktop */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={openSidebar} isMobile={isMobile} />

        {/* Main content with safe area padding for mobile notches */}
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8"
          role="main"
          aria-label="Main content"
        >
          {/* Content wrapper with max-width for large screens */}
          <div className="w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
