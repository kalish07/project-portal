// adminApi.js
import Cookies from "js-cookie";

const API =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API) ||
  process.env.REACT_APP_API ||
  "https://project-portal-backend-xtrf.onrender.com/api";

export const adminLogin = async ({ email, password }) => {
  const res = await fetch(`https://project-portal-backend-xtrf.onrender.com/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Login failed");
  }

  const data = await res.json();

  // Save credentials in cookies
  Cookies.set("token", data.token);
  Cookies.set("role", data.role || "admin");
  Cookies.set("adminId", data.userId || ""); // optional, if you add more info
  Cookies.set("name",data.name || "")
  Cookies.set("email",data.email || "")


  return data;
};


// Helper for auth header
const authHdr = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
});

// --- Fetch All Students (Admin) ---
export const fetchAllStudents = async () => {
  const res = await fetch(`${API}/admin/students`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHdr(),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch students");
  }

  return await res.json();
};

// Create student
export const createStudent = async (studentData) => {
  const res = await fetch(`${API}/admin/createstudent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(studentData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create student");
  }

  return await res.json();
};

// Edit student
export const updateStudent = async (id, studentData) => {
  const res = await fetch(`${API}/admin/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(studentData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update student");
  }

  return await res.json();
};

// Delete student
export const deleteStudent = async (id) => {
  const res = await fetch(`${API}/admin/students/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete student");
  }

  return await res.json();
};



// --- Fetch All Mentors (Admin) ---
export const fetchAllMentors = async () => {
  const res = await fetch(`${API}/admin/mentors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch mentors");
  }

  return await res.json();
};

// --- Create Mentor ---
export const createMentor = async (mentorData) => {
  const res = await fetch(`${API}/admin/creatementor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(mentorData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create mentor");
  }

  return await res.json();
};

// --- Update Mentor ---
export const updateMentor = async (id, mentorData) => {
  const res = await fetch(`${API}/admin/mentors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(mentorData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update mentor");
  }

  return await res.json();
};

// --- Delete Mentor ---
export const deleteMentor = async (id) => {
  const res = await fetch(`${API}/admin/mentors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete mentor");
  }

  return await res.json();
};



// --- Change Mentor Password ---
export const changeMentorPassword = async (id, newPassword) => {
  const res = await fetch(`${API}/admin/mentors/${id}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to change password");
  }

  return await res.json();
};

// --- Fetch All Teams with Progress (Admin) ---
export const fetchAllTeamsWithProgress = async () => {
  const res = await fetch(`${API}/admin/all-teams`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch teams with progress");
  }

  return await res.json();
};

// --- Unassign Specific Team (Admin) ---
export const unassignTeam = async (teamId, payload) => {
  const res = await fetch(`${API}/admin/team/${teamId}/unassign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(payload), // e.g., { removeStudent1: true, removeStudent2: true, removeMentor: true }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to unassign team");
  }

  return await res.json();
};

// --- Unassign All Teams by Semester (Admin) ---
export const unassignAllTeamsInSemester = async (semester) => {
  const res = await fetch(`${API}/admin/teams/unassign-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ semester }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to unassign all teams");
  }

  return await res.json();
};

// --- Fetch Unassigned Students (Admin) ---
export const fetchUnassignedStudents = async () => {
  const res = await fetch(`${API}/admin/unassigned-students`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch unassigned students");
  }

  return await res.json();
};

// --- Force Pair Two Students (Admin) ---
export const forcePairStudents = async ({ student1_id, student2_id }) => {
  const res = await fetch(`${API}/admin/teams/force-pair`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ student1_id, student2_id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.log(err)
    throw new Error(err.error || "Failed to force pair students");
  }

  return await res.json();
};








// --- Fetch All Projects (Admin) ---
export const fetchAllProjects = async () => {
  const res = await fetch(`${API}/admin/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch projects");
  }

  return await res.json();
};

// --- Clear Specific Project Files (Admin) ---
export const clearProjectFiles = async (projectType, projectId, clearFlags) => {
  const res = await fetch(`${API}/admin/projects/${projectType}/${projectId}/clear-files`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(clearFlags), // e.g., { abstract: true, ppt: true }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to clear project files");
  }

  return await res.json();
};


// --- Delete Project (Admin) ---
export const deleteProject = async (projectType, projectId) => {
  const res = await fetch(`${API}/admin/projects/${projectType}/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete project");
  }

  return await res.json();
};







// --- Fetch Available Mentors by Project Type (Admin) ---
export const fetchAvailableMentorsByProjectType = async (projectType) => {
  const res = await fetch(`${API}/admin/mentors/available?projectType=${projectType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch available mentors");
  }

  return await res.json();
};

// --- Fetch Teams Without Mentor (Admin) ---
export const fetchTeamsWithoutMentor = async (projectType) => {
  const res = await fetch(`${API}/admin/teams/unassigned?projectType=${projectType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch unassigned teams");
  }

  return await res.json();
};

// --- Assign Mentor to Team (Admin) ---
export const assignMentorToTeam = async ({ teamId, mentorId }) => {
  const res = await fetch(`${API}/admin/teams/${teamId}/assign-mentor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ mentorId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to assign mentor");
  }

  return await res.json();
};


// --- Change Mentor for a Team (Admin) ---
export const changeMentorForTeam = async (teamId, newMentorId) => {
  const res = await fetch(`${API}/admin/teams/${teamId}/change-mentor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ newMentorId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to change mentor for the team");
  }

  return await res.json();
};


// --- Shift All Students Down One Semester (Admin) ---
export const shiftAllStudents = async () => {
  const res = await fetch(`${API}/admin/shift/students`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to shift students");
  }

  return await res.json();
};




// --- Reset Student Password to Default (Admin) ---
export const resetStudentPassword = async (id) => {
  const res = await fetch(`${API}/admin/students/${id}/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to reset student password");
  }

  return await res.json();
};
// --- Update Mentor Capacity by Project Type (Admin) ---
export const updateMentorCapacity = async ({ mentorId, type, value }) => {
  const res = await fetch(`${API}/admin/mentors/${mentorId}/capacity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ type, value }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update mentor capacity");
  }

  return await res.json();
};



//---update all mentors capacity-------
export const updateAllMentorsCapacity = async (type, value) => {
  const res = await fetch(`${API}/admin/mentors/capacity/update-all`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ type, value }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update mentor capacities");
  }

  return await res.json();
};
// --- Change Admin Password ---
export const changeAdminPassword = async ({ email, currentPassword, newPassword, confirmPassword }) => {
  const res = await fetch(`${API}/admin/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ email, currentPassword, newPassword, confirmPassword }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Admin password change failed:", err);
    throw new Error(err.error || "Failed to change admin password");
  }

  return await res.json();
};


// --- Dashboard Statistics (Admin) ---
export const fetchDashboardStats = async () => {
  const res = await fetch(`${API}/admin/dashboard/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch dashboard statistics");
  }

  return await res.json();
};