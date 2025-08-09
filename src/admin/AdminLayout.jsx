// src/admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import TopNavigation from "./components/common/TopNavigation";
import Dashboard from "./components/dashboard/Dashboard";
import StudentManagement from "./components/students/StudentManagement";
import ProjectManagement from "./components/projects/ProjectManagement";
import TeamManagement from "./components/teams/TeamManagement";
import MentorManagement from "./components/mentors/MentorManagement";
import Announcements from "./components/announcements/Announcements";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768 && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarExpanded, token]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
        currentPath={location.pathname}
      />

      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarExpanded ? "ml-64" : "ml-20"
        } flex-1`}
      >
        <TopNavigation
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
          currentPath={location.pathname}
        />

        <div className="min-h-screen px-4 py-6">
          <Outlet />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLayout;
