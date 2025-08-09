// src/api/studentApi.js\
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/students";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getStudentProfile = async () => {
  const studentId = Cookies.get("studentId");
  const response = await fetch(`${BASE_URL}/profile/${studentId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch student profile");
  return response.json();
};

export const getStudentProjects = async (semester) => {
  const response = await fetch(`${BASE_URL}/team-projects/user`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch student projects");
  const data = await response.json();
  return data;
};

export const getStudentAnnouncements = async (semester, department) => {
  const response = await fetch(`${BASE_URL}/announcements?semester=${semester}&department=${department}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch announcements");
  return response.json();
};

export const getStudentInvitations = async () => {
  const response = await fetch(`${BASE_URL}/invitations`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch invitations");
  return response.json();
};

export const acceptInvitation = async (invitationId) => {
  const response = await fetch(`${BASE_URL}/invitations/${invitationId}/accept`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to accept invitation");
};

export const rejectInvitation = async (invitationId) => {
  const response = await fetch(`${BASE_URL}/invitations/${invitationId}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to reject invitation");
};
