import Cookies from 'js-cookie';
import React from 'react';

const TopNavigation = ({ sidebarExpanded, toggleSidebar, activeTab }) => {
  const adminName = Cookies.get('name') || 'Admin';
  const initials = adminName.split(' ').map(word => word[0]).join('').toUpperCase();
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'students': return 'Student Management';
      case 'mentors': return 'Mentor Management';
      case 'teams': return 'Team Management';
      case 'projects': return 'Project Management';
      case 'announcements': return 'Announcements';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg font-medium text-gray-800">
            {getTitle()}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 relative">
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-2">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{adminName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;