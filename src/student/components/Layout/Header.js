// src/components/Layout/Header.js
import React from "react";
import { useLocation } from "react-router-dom";

const Header = ({ profile }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/invites":
        return "Invite Centre";
      case "/submissions":
        return "Project Submissions";
      case "/teams":
        return "My Teams & Progress";
      default:
        return "";
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 space-y-2 md:space-y-0">
        {/* Title */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h1>

        {/* Search Input (show only on md and above) */}
        <div className="w-full md:max-w-md hidden md:block">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search projects, teams, resources..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-2 self-end md:self-center">
          <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium text-sm">
            {getInitials(profile?.student_name)}
          </div>
          <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
            {profile?.student_name || "Student"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
