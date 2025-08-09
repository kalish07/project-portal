import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/dashboard/Dashboard";
import StudentManagement from "./components/students/StudentManagement";
import ProjectManagement from "./components/projects/ProjectManagement";
import TeamManagement from "./components/teams/TeamManagement";
import MentorManagement from "./components/mentors/MentorManagement";
import Announcements from "./components/announcements/Announcements";

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="students" element={<StudentManagement />} />
    <Route path="projects" element={<ProjectManagement />} />
    <Route path="teams" element={<TeamManagement />} />
    <Route path="mentors" element={<MentorManagement />} />
    <Route path="announcements" element={<Announcements />} />
    <Route path="*" element={<Navigate to="/admin" />} />
  </Routes>
);

export default AdminRoutes;