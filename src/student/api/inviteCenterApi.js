import Cookies from 'js-cookie';
import axios from "axios";

axios.defaults.baseURL = "https://project-portal-backend-xtrf.onrender.com/api"; 
axios.defaults.headers.common["Content-Type"] = "application/json";

const BASE_URL = "https://project-portal-backend-xtrf.onrender.com/api";

const getAuthHeaders = () => ({
  "Authorization": `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

// ==================== STUDENT-RELATED API CALLS ====================

export const fetchPartnerCandidates = async () => {
  const res = await fetch(`${BASE_URL}/students/getstudents`, { 
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error("Failed to fetch partner candidates");
  return res.json();
};

// Combined endpoint for all invitations
export const fetchAllInvitations = async () => {
  const res = await fetch(`${BASE_URL}/students/invitations`, { 
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error("Failed to fetch invitations");
  const resp = await res.json();
  const data = resp.data;
  
  return {
    sentInvitations: data.sentInvitations || [],
    incomingInvitations: data.incomingInvitations || []
  };
};

// solo invite api
export const createSoloTeam = async () => {
  const token = Cookies.get("token"); // if you are using auth tokens
  const response = await axios.post(
    "/team/solo",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};




export const sendPartnerInvite = async (recipientId) => {
  const res = await fetch(`${BASE_URL}/students/send-invitation`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ recipientId })
  });
  if (!res.ok) throw new Error("Failed to send invite");
  return res.json();
};

export const acceptPartnerInvite = async (invitationId) => {
  const res = await fetch(`${BASE_URL}/students/invitations/${invitationId}/accept`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to accept invite");
  return res.json();
};

export const rejectPartnerInvite = async (invitationId) => {
  const res = await fetch(`${BASE_URL}/students/invitations/${invitationId}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to reject invite");
  return res.json();
};

export const withdrawPartnerInvite = async (invitationId) => {
  const res = await fetch(`${BASE_URL}/students/invitations/${invitationId}/withdraw`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to withdraw invite");
  return res.json();
};

// ==================== MENTOR-RELATED API CALLS ====================

export const fetchMentors = async () => {
  const res = await fetch(`${BASE_URL}/students/mentors`, { 
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error("Failed to fetch mentors");
  return res.json();
};

export const requestMentor = async (mentorId, teamId = null) => {
  const res = await fetch(`${BASE_URL}/students/request-mentor`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ mentorId, teamId })
  });
  if (!res.ok) throw new Error("Failed to request mentor");
  return res.json();
};

export const withdrawMentorRequest = async () => {
  const res = await fetch(`${BASE_URL}/students/mentor-request/withdraw`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to withdraw mentor request");
  return res.json();
};

// ==================== TEAM-RELATED API CALLS ====================

export const fetchTeamDetails = async (teamId) => {
  const res = await fetch(`${BASE_URL}/team/${teamId}`, { 
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error("Failed to fetch team details");
  return res.json();
};

export const fetchUserTeams = async () => {
  const res = await fetch(`${BASE_URL}/students/teams`, { 
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error("Failed to fetch user teams");
  return res.json();
};

export const fetchTeamAndProjectsByUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/students/team-projects/user`, {
      headers: getAuthHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    return data;
  } catch (error) {
    alert("Something went wrong while fetching team and projects data");
    return null;
  }
};


export const fetchMentorById = async (mentorId) => {
  try {
    const response = await fetch(`${BASE_URL}/mentors/${mentorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch mentor details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching mentor by ID:", error);
    throw error;
  }
};

// ==================== PROJECT DOCUMENT UPLOAD & LINK SUBMIT ====================

export const uploadProjectDocument = async (documentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/documents/${documentId}/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Cookies.get("token")}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
};

// Function to submit a project document link
export const submitProjectDocumentLink = async (documentId, link) => {
  const res = await fetch(`${BASE_URL}/students/documents/${documentId}/submit-link`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      link
    }),
  });

  if (!res.ok) throw new Error("Failed to submit document link");

  return res.json();
};



// ==================== PROJECT REQUEST ====================

export const requestNewProject = async ({ title, description, domain, abstract_url, project_type }) => {
  const res = await fetch(`${BASE_URL}/students/request-project`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      description,
      domain,
      abstract_url,
      project_type
    })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to submit project request");
  }
  const data = await res.json();
  return data;
};

export const withdrawProjectRequest = async (projectId, projectType) => {
  const res = await fetch(
    `${BASE_URL}/students/projects/${projectId}/withdraw?projectType=${projectType}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to withdraw project request");
  return res.json();
};
