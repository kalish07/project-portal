// src/data/mockData.js
export const students = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@university.edu",
    phone: "919876543210",
    skills: ["Machine Learning", "Data Analysis"],
    registerNo: "2020CS101",
    department: "Computer Science",
    specialization: "AI & ML",
    year: "4th Year",
  },
  // ... rest of the students data
];

export const mentors = [
  {
    id: 1,
    name: "Dr. Robert Smith",
    email: "r.smith@university.edu",
    phone: "919876543310",
    expertise: ["Artificial Intelligence", "Machine Learning"],
    availability: "High",
  },
  // ... rest of the mentors data
];


export const incomingInvitesState = [
  {
    id: 1,
    name: "Oliver Thompson",
    email: "o.thompson@university.edu",
    skills: ["Data Science", "Python"],
  },
  // ... rest of the invites data
];

export const documents = [
  {
    id: 1,
    projectId: 3,
    type: "Abstract",
    version: 2,
    state: "In Review",
    timestamp: "2025-06-14T14:30:00",
    reviewer: "Dr. Robert Smith"
  },
  {
    id: 2,
    projectId: 3,
    type: "Report",
    version: 1,
    state: "Draft",
    timestamp: "2025-06-10T09:15:00",
    reviewer: null
  },
  {
    id: 3,
    projectId: 3,
    type: "Slide Deck",
    version: 3,
    state: "Changes Requested",
    timestamp: "2025-06-12T16:45:00",
    reviewer: "Prof. Lisa Wang"
  },
  {
    id: 4,
    projectId: 3,
    type: "Demo Video",
    version: 2,
    state: "Approved",
    timestamp: "2025-06-13T11:20:00",
    reviewer: "Dr. David Miller"
  },
  {
    id: 5,
    projectId: 1,
    type: "Proposal",
    version: 1,
    state: "Approved",
    timestamp: "2025-01-15T10:00:00",
    reviewer: "Dr. Sarah Johnson"
  }
];
export const documentTypes = ["Abstract", "Report", "Slide Deck", "Demo Video"];

export const projects = [
  {
    id: 1,
    type: "pt1",
    title: "PT1 Research Proposal",
    description: "Initial research proposal and literature review",
    department: "Computer Science",
    semester: "Fall 2025",
    supervisor: "Dr. Sarah Johnson",
    dueDate: "October 15, 2025",
    status: "In Progress",
    teamMembers: [
      { name: "Alex Johnson", role: "Team Lead", email: "alex@university.edu" },
      { name: "Maria Garcia", role: "Researcher", email: "maria@university.edu" }
    ],
    documents: [
      {
        id: "pt1-abstract",
        type: "Abstract",
        version: 2,
        state: "Approved",
        timestamp: "2025-09-10T14:30:00",
        reviewer: "Dr. Sarah Johnson",
        comments: "Good work, approved with minor revisions"
      },
      {
        id: "pt1-report",
        type: "Report",
        version: 1,
        state: "In Review",
        timestamp: "2025-09-28T10:15:00",
        reviewer: "Dr. Sarah Johnson"
      },
      {
        id: "pt1-slides",
        type: "Slide Deck",
        version: 1,
        state: "Draft"
      }
      // Demo Video not submitted yet
    ]
  },
  {
    id: 2,
    type: "pt2",
    title: "PT2 Prototype Implementation",
    description: "Functional prototype with core features implemented",
    department: "Computer Science",
    semester: "Spring 2026",
    supervisor: "Dr. Michael Chen",
    dueDate: "March 20, 2026",
    status: "Not Started",
    teamMembers: [
      { name: "Alex Johnson", role: "Team Lead", email: "alex@university.edu" },
      { name: "Maria Garcia", role: "Developer", email: "maria@university.edu" },
      { name: "James Wilson", role: "UI Designer", email: "james@university.edu" }
    ],
    documents: [
      {
        id: "pt2-abstract",
        type: "Abstract",
        version: 1,
        state: "Changes Requested",
        timestamp: "2026-02-15T16:45:00",
        reviewer: "Dr. Michael Chen",
        comments: "Please expand the methodology section"
      }
      // Other documents not submitted yet
    ]
  },
  {
    id: 3,
    type: "finalyearproject",
    title: "AI-Powered Educational Platform",
    description: "Final year project developing an adaptive learning system using machine learning",
    department: "Computer Science",
    semester: "Fall 2026",
    supervisor: "Prof. Robert Smith",
    dueDate: "November 30, 2026",
    status: "In Progress",
    teamMembers: [
      { name: "Alex Johnson", role: "Team Lead", email: "alex@university.edu" },
      { name: "Maria Garcia", role: "ML Engineer", email: "maria@university.edu" },
      { name: "James Wilson", role: "Frontend Dev", email: "james@university.edu" },
      { name: "Sarah Chen", role: "Backend Dev", email: "sarah@university.edu" }
    ],
    documents: [
      {
        id: "final-abstract",
        type: "Abstract",
        version: 3,
        state: "Approved",
        timestamp: "2026-09-05T11:20:00",
        reviewer: "Prof. Robert Smith"
      },
      {
        id: "final-report",
        type: "Report",
        version: 2,
        state: "In Review",
        timestamp: "2026-10-15T14:00:00",
        reviewer: "Prof. Robert Smith"
      },
      {
        id: "final-slides",
        type: "Slide Deck",
        version: 4,
        state: "Approved",
        timestamp: "2026-11-10T09:45:00",
        reviewer: "Dr. Lisa Wang"
      },
      {
        id: "final-demo",
        type: "Demo Video",
        version: 1,
        state: "Changes Requested",
        timestamp: "2026-11-15T16:30:00",
        reviewer: "Dr. David Miller",
        comments: "Please add voiceover explanation"
      }
    ]
  }
];