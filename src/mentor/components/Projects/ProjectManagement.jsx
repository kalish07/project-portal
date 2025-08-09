import React, { useEffect, useState } from "react";
import ProjectTimeline from "./ProjectTimeline";
import MentorReviewsSection from "../Reviews/MentorReviewsSection";
import {
  fetchTeams,
  fetchProjectDocs,
  respondToDocAction,
  respondToProjectRequest,
} from "../../api/mentorApi";

const ProjectManagement = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [projectDocs, setProjectDocs] = useState({});
  const [selectedProjectType, setSelectedProjectType] = useState("PT1");

  const [zerothReview, setZerothReview] = useState(null);
  const [firstReview, setFirstReview] = useState(null);
  const [secondReview, setSecondReview] = useState(null);
  const [editingZeroth, setEditingZeroth] = useState(false);
  const [submittingZeroth, setSubmittingZeroth] = useState(false);
  const [editingFirst, setEditingFirst] = useState(false);
  const [submittingFirst, setSubmittingFirst] = useState(false);
  const [editingSecond, setEditingSecond] = useState(false);
  const [submittingSecond, setSubmittingSecond] = useState(false);

  const projectPhases = ["PT1", "PT2", "FINAL"];

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamList = await fetchTeams();
        setTeams(teamList);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    loadTeams();
  }, []);

  useEffect(() => {
    const loadProjectDocs = async () => {
      if (selectedTeam) {
        try {
          const docs = await fetchProjectDocs(selectedTeam);
          setProjectDocs(docs);
        } catch (err) {
          console.error("Error fetching project documents:", err);
        }
      }
    };
    loadProjectDocs();
  }, [selectedTeam]);

  const handleDocAction = async (docId, action) => {
    try {
      await respondToDocAction(docId, action);
      const docs = await fetchProjectDocs(selectedTeam);
      setProjectDocs(docs);
    } catch (err) {
      console.error("Failed to update document:", err);
    }
  };

  const handleProjectAction = async (action, teamId) => {
    const selectedProject = projectDocs?.[selectedProjectType];
    if (!selectedProject) return;

    try {
      await respondToProjectRequest(selectedProject.id, action, teamId);
      const docs = await fetchProjectDocs(selectedTeam);
      setProjectDocs(docs);
    } catch (err) {
      console.error("Failed to respond to project request:", err);
      alert("Project action failed.");
    }
  };

  const getDocumentsForTimeline = (project) => {
    if (!project) return [];
    
    const documents = [];
    
    // Abstract is always required
    documents.push({
      id: project.id,
      title: "Abstract",
      key: "ABSTRACT",
      link_url: project.abstract_url,
      created_at: project.createdAt,
      icon: "fas fa-file-alt",
      color: "blue"
    });
    
    // Add report if exists
    if (project.report_pdf_url) {
      documents.push({
        id: project.id,
        title: "Report",
        key: "REPORT",
        link_url: project.report_pdf_url,
        created_at: project.updatedAt,
        icon: "fas fa-file-pdf",
        color: "red"
      });
    }
    
    // Add PPT if exists
    if (project.ppt_url) {
      documents.push({
        id: project.id,
        title: "Presentation",
        key: "PPT",
        link_url: project.ppt_url,
        created_at: project.updatedAt,
        icon: "fas fa-file-powerpoint",
        color: "green"
      });
    }
    
    return documents;
  };

  const selectedProject = projectDocs?.[selectedProjectType] || null;
  const timelineDocuments = selectedProject ? getDocumentsForTimeline(selectedProject) : [];

  return (
    <div className="flex h-full animate-fadeIn">
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Teams</h2>
        <div className="space-y-2">
          {teams.map((team) => (
            <button
              key={team.id}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedTeam === team.id
                  ? "bg-indigo-100 text-indigo-800"
                  : "hover:bg-gray-100 text-gray-700"
              } cursor-pointer whitespace-nowrap`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <div className="flex items-center">
                <i
                  className={`fas fa-users ${
                    selectedTeam === team.id
                      ? "text-indigo-600"
                      : "text-gray-400"
                  } mr-3`}
                ></i>
                <span className="relative group cursor-pointer">
                  {team.members?.length > 0
                    ? `${team.members.map((m) => m.student_name).join(", ")} - team`
                    : team.name}
                  {team.members?.length > 0 && (
                    <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 mt-2 w-max whitespace-nowrap bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
                      {team.members
                        .map((m) => `${m.student_name}: ${m.reg_number}`)
                        .join(" | ")}
                    </span>
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        {selectedTeam ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {teams.find((t) => t.id === selectedTeam)?.name || "Select a Team"}
                </h1>
                <p className="text-gray-500 mt-1">
                  Project timeline and document management
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  value={selectedProjectType}
                  onChange={(e) => setSelectedProjectType(e.target.value)}
                >
                  {projectPhases.map((type) => (
                    <option key={type} value={type}>
                      {type} Project
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProject ? (
              selectedProject.approved_status === "pending" ? (
                <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
                  <h2 className="text-xl font-semibold text-yellow-600 mb-2">Project Request Pending</h2>
                  <p className="text-gray-700 mb-4">
                    This project has been submitted and is awaiting mentor approval.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{selectedProject.title}</h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Domain:</strong> {selectedProject.domain}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Abstract:</strong>{" "}
                      <a
                        href={selectedProject.abstract_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Abstract
                      </a>
                    </p>
                    <p className="text-gray-600 mb-4">
                      <strong>Status:</strong>{" "}
                      <span className="text-yellow-700 capitalize">{selectedProject.approved_status}</span>
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleProjectAction("approve", selectedTeam)} // Pass the team ID here
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProjectAction("reject", selectedTeam)} // Pass the team ID here
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Project Approved</h2>
                    <p className="text-gray-700 mb-3">
                      <strong>Title:</strong> {selectedProject.title}
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Description:</strong> {selectedProject.description}
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Domain:</strong> {selectedProject.domain}
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Abstract:</strong>{" "}
                      <a
                        href={selectedProject.abstract_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Abstract
                      </a>
                    </p>
                  </div>

                  <ProjectTimeline
                    projectDocs={timelineDocuments}
                    handleDocAction={handleDocAction}
                    isIdeaApproved={selectedProject.approved_status === "approved"}
                  />
                  <MentorReviewsSection
                    zerothReview={zerothReview}
                    setZerothReview={setZerothReview}
                    firstReview={firstReview}
                    setFirstReview={setFirstReview}
                    secondReview={secondReview}
                    setSecondReview={setSecondReview}
                    editingZeroth={editingZeroth}
                    setEditingZeroth={setEditingZeroth}
                    submittingZeroth={submittingZeroth}
                    setSubmittingZeroth={setSubmittingZeroth}
                    editingFirst={editingFirst}
                    setEditingFirst={setEditingFirst}
                    submittingFirst={submittingFirst}
                    setSubmittingFirst={setSubmittingFirst}
                    editingSecond={editingSecond}
                    setEditingSecond={setEditingSecond}
                    submittingSecond={submittingSecond}
                    setSubmittingSecond={setSubmittingSecond}
                  />
                </>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <i className="fas fa-folder-open text-gray-400 text-2xl"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No Project Found
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  No project request or record exists for the selected phase.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <i className="fas fa-folder-open text-gray-400 text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Team Selected
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Please select a team from the sidebar to view its projects and documents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
