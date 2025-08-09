// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { motion } from "framer-motion";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatsProvider } from "./admin/context/StatsContext";

// Student Pages
import StudentDashboard from "./student/pages/Dashboard/Dashboard";
import InviteCenter from "./student/pages/InviteCenter/InviteCenter";
import ProjectSubmissions from "./student/pages/ProjectSubmissions/ProjectSubmissions";
import StudentLayout from "./student/components/Layout/Layout";

// Mentor Pages
import TeamManagementDashboard from "./mentor/pages/TeamManagementDashboard";
import MentorLogin from "./mentor/pages/MentorLogin";
import AdminLogin from "./admin/adminlogin";

// Admin Layout
import AdminLayout from "./admin/AdminLayout";
import StudentManagement from "./admin/components/students/StudentManagement";
import MentorManagement from "./admin/components/mentors/MentorManagement";
import ProjectManagement from "./admin/components/projects/ProjectManagement";
import AdminDashboard from "./admin/components/dashboard/Dashboard";
import TeamManagement from "./admin/components/teams/TeamManagement";
import Announcements from "./admin/components/announcements/Announcements";
// Common
import Login from "./student/pages/Login/Login";
import AdminRoutes from "./admin/AdminRoutes";


import Landing from "./LandingPage.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(Cookies.get("role"));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("studentId");
    Cookies.remove("regNumber");
    Cookies.remove("studentName");
    Cookies.remove("mentorId");
    Cookies.remove("mentorName");
    Cookies.remove("role");

    setIsAuthenticated(false);
    setRole(null);
  };

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Login */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                role === "student" ? (
                  <Navigate to="/" replace />
                ) : role === "mentor" ? (
                  <Navigate to="/mentor" replace />
                ) : (
                  <Navigate to="/admin" replace />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Mentor Login */}
          <Route
            path="/mentor-login"
            element={
              isAuthenticated && role === "mentor" ? (
                <Navigate to="/mentor" replace />
              ) : (
                <MentorLogin onLogin={handleLogin} />
              )
            }
          />
          {/* Admin Login */}
          <Route
            path="/admin-login"
            element={
              isAuthenticated && role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />
          
          {/* Admin Routes */}
          {isAuthenticated && role === "admin" && (
            <Route path="/admin/*" element={
              <StatsProvider>
                <AdminLayout onLogout={handleLogout} />
              </StatsProvider>
            }>
              <Route path="*" element={<AdminRoutes />} />
            </Route>
          )}

          {/* Mentor Routes */}
          {isAuthenticated && (role === "mentor" || role === "admin")&& (
            <>
              <Route path="/mentor" element={<TeamManagementDashboard />} />
              <Route path="*" element={<Navigate to="/mentor" replace />} />
            </>
          )}

          {/* Student Routes */}
          {isAuthenticated && role === "student" && (
            <Route
              path="/"
              element={
                <StudentLayout
                  onLogout={handleLogout}
                  showChangePassword={showChangePassword}
                  setShowChangePassword={setShowChangePassword}
                  passwordError={passwordError}
                  setPasswordError={setPasswordError}
                />
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="invites" element={<InviteCenter />} />
              <Route path="submissions" element={<ProjectSubmissions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}

          {/* Fallback */}
          {!isAuthenticated && (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </QueryClientProvider>
  );
};

export default App;
