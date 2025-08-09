import React from "react";
import Cookies from "js-cookie";

const Sidebar = ({
  activeTab,
  setActiveTab,
  showProfileMenu,
  setShowProfileMenu,
  setShowPasswordModal,
  mentorName,
}) => {
  const handleLogout = () => {
    const allCookies = Cookies.get();
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
    window.location.assign("/");
  };

  return (
    <div className="w-20 md:w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col transition-all duration-300 ease-in-out min-h-screen">
      {/* Logo */}
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center">
          <i className="fas fa-project-diagram text-indigo-800 text-xl"></i>
        </div>
        <h1 className="hidden md:block ml-3 text-xl font-bold">TeamFlow</h1>
      </div>

      {/* Navigation */}
      <div className="mt-6 md:mt-8 flex-1">
        <nav className="space-y-1">
          {[
            { tab: "dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
            { tab: "teams", icon: "fas fa-users", label: "My Teams" },
            { tab: "projects", icon: "fas fa-tasks", label: "Project Management" },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-center md:justify-start p-4 md:px-6 ${
                activeTab === tab
                  ? "bg-indigo-700 border-l-4 border-white"
                  : "hover:bg-indigo-700/50"
              } transition-all duration-200 cursor-pointer whitespace-nowrap`}
            >
              <i className={`${icon} text-lg`}></i>
              <span className="hidden md:block ml-4">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile / Settings */}
      <div className="p-4 md:p-6 relative">
        <div
          className="flex items-center justify-center md:justify-start cursor-pointer"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <i className="fas fa-user text-indigo-800"></i>
          </div>
          <div className="hidden md:block ml-3">
            <p className="text-sm font-medium">{mentorName || "Mentor"}</p>
            <p className="text-xs text-indigo-200">College Professor</p>
          </div>
        </div>

        {showProfileMenu && (
          <div className="absolute bottom-full left-4 md:left-0 mb-3 w-52 rounded-lg bg-white shadow-xl border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <i className="fas fa-key mr-2"></i>
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
