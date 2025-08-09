// src/components/Layout/Layout.js
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PasswordModal from "./PasswordModal";
import { Menu } from "lucide-react";
import { getStudentProfile } from "../../api/studentApi";

const Layout = ({
  onLogout,
  showChangePassword,
  setShowChangePassword,
  passwordError,
  setPasswordError,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-md">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <div className="w-6" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed z-50 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static md:shadow-none
          `}
        >
          <div className="h-full flex flex-col">
            <Sidebar
              onLogout={onLogout}
              setShowChangePassword={setShowChangePassword}
              onClose={() => setIsSidebarOpen(false)}
              profile={profile}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-h-screen overflow-hidden bg-[#F8FAFC]">
          {/* Header for Desktop */}
          <div className="hidden md:block">
            <Header profile={profile} />
          </div>

          {/* Page Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
      />
    </div>
  );
};

export default Layout;
