// src/components/Layout/Sidebar.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getStudentProfile } from "../../api/studentApi";

const Sidebar = ({ setShowChangePassword, onLogout, onClose }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState({
    student_name: "Student",
    email: "",
    reg_number: "",
    department_name: "",
    current_semester: "",
    profilePic: "/default-profile-pic.jpg",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setStudentProfile({
          student_name: data.student_name || "Student",
          email: data.email || "",
          reg_number: data.reg_number || "",
          department_name: data.department_name || "",
          current_semester: data.current_semester || "",
          profilePic: data.profile_pic_url || "/default-profile-pic.jpg",
        });
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "S";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + (names[1]?.[0]?.toUpperCase() || "");
  };

  return (
    <div className="w-64 bg-[#1E2A3B] text-gray-300 flex flex-col h-full relative">
      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h2 className="text-white text-lg font-semibold">Menu</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-3 p-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
          <i className="fas fa-project-diagram text-white"></i>
        </div>
        <h1 className="text-lg font-semibold text-white">Student Portal</h1>
      </div>

      <nav className="mt-4 px-4 flex-1">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-300 hover:bg-[#2A3A4F]"
              onClick={onClose}
            >
              <i className="fas fa-tachometer-alt mr-3 text-gray-500"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/invites"
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-300 hover:bg-[#2A3A4F]"
              onClick={onClose}
            >
              <i className="fas fa-user-plus mr-3 text-gray-400"></i>
              Invite Centre
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/submissions"
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-300 hover:bg-[#2A3A4F]"
              onClick={onClose}
            >
              <i className="fas fa-file-upload mr-3 text-gray-400"></i>
              Project Submissions
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="px-4 py-3 relative">
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center space-x-3 focus:outline-none"
        >
          {studentProfile.profilePic ? (
            <img
              src={studentProfile.profilePic}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm text-white font-medium">
                {getInitials(studentProfile.student_name)}
              </span>
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-white">
              {studentProfile.student_name}
            </p>
            <p className="text-xs text-gray-400">
              {studentProfile.department_name || "Department"} —{" "}
              Sem {studentProfile.current_semester || "-"}
            </p>
          </div>
          <i
            className={`fas ${
              isProfileMenuOpen ? "fa-chevron-up" : "fa-chevron-down"
            } ml-auto text-gray-400`}
          ></i>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bottom-14 left-4 right-4 bg-white rounded-md shadow-lg text-gray-700 divide-y divide-gray-200 z-50">
            <button
              onClick={() => {
                setShowChangePassword({
                  open: true,
                  student: studentProfile, // ✅ pass full profile here
                });
                setIsProfileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              <i className="fas fa-key mr-2"></i> Change Password
            </button>
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;