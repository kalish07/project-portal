// mentorApi.js
import Cookies from "js-cookie";

const API =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API) ||
  process.env.REACT_APP_API ||
  "https://project-portal-backend-xtrf.onrender.com/api";

const authHdr = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
});

// --- Mentor Login ---
export const mentorLogin = async ({ email, password }) => {
  const res = await fetch(`${API}/mentor/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Login failed");
  }

  const data = await res.json();
  Cookies.set("token", data.token);
  Cookies.set("role", "mentor");
  Cookies.set("mentorId", data.mentor.id);
  Cookies.set("mentorName", data.mentor.name);

  return data;
};

// --- Fetch Mentor Profile ---
export const fetchMentorDetails = async () => {
  const res = await fetch(`${API}/mentor/profile`, { headers: authHdr() });
  if (!res.ok) throw new Error("Failed to fetch mentor profile");
  return await res.json();
};

// --- Fetch Teams ---
export const fetchTeams = async () => {
  const res = await fetch(`${API}/mentor/teams`, { headers: authHdr() });
  if (!res.ok) throw new Error("Failed to fetch teams");
  const data = await res.json();
  return data.my_teams;
};

// --- Fetch Team Projects ---
export const fetchTeamProjects = async (teamId) => {
  const res = await fetch(`${API}/mentor/team/${teamId}/projects`, {
    headers: authHdr(),
  });
  if (!res.ok) throw new Error("Failed to fetch team projects");
  return await res.json();
};

// --- Fetch Invites ---
export const fetchPendingInvites = async () => {
  const res = await fetch(`${API}/mentor/invites`, { headers: authHdr() });
  if (!res.ok) throw new Error("Failed to fetch invites");
  const data = await res.json();
  return data.pending_teams;
};

// --- Respond to Team Invite ---
export const respondToInvitation = async (id, action) => {
  const res = await fetch(`${API}/mentor/invites/${id}/respond`, {
    method: "POST",
    headers: {
      ...authHdr(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to respond to invitation");
  return await res.json();
};

// --- Reset Mentor Password ---
export const resetMentorPassword = async ({ oldPassword, newPassword }) => {
  const res = await fetch(`${API}/mentor/reset-password`, {
    method: "POST",
    headers: {
      ...authHdr(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_password: oldPassword,
      new_password: newPassword,
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || errData.msg || "Password reset failed");
  }
};

// --- Fetch Project Docs by Team ---
export const fetchProjectDocs = async (teamId) => {
  const res = await fetch(`${API}/mentor/team/${teamId}/projects`, {
    headers: authHdr(),
  });
  if (!res.ok) return {};
  return await res.json();
};

// --- Document Action (approve/reject) ---

// --- Respond to Project Request (approve/reject) ---
export const respondToProjectRequest = async (requestId, action,teamId) => {
  const res = await fetch(`${API}/mentor/project-requests/${requestId}/respond`, {
    method: "POST",
    headers: {
      ...authHdr(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action , teamId}),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || errData.msg || "Failed to respond to project request");
  }

  return await res.json();
};



export const respondToDocAction = async (docId, action) => {
  const res = await fetch(`${API}/documents/${docId}/action`, {
    method: "PATCH",
    headers: {
      ...authHdr(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to update document");
  return await res.json();
};
