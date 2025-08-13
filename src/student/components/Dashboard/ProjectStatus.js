// src/components/Dashboard/ProjectStatus.js
import React from "react";
import { FiFileText, FiFile, FiFileMinus, FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";

const getDocumentState = (url) => {
  if (!url) return "Not Uploaded";
  return "Approved"; // Adjust if you want more granular logic
};

const getStateDetails = (state) => {
  const states = {
    Draft: {
      color: "bg-gray-100 text-gray-700",
      icon: <FiFileText className="text-gray-500" />,
      badgeColor: "text-gray-600 bg-gray-100",
    },
    "In Review": {
      color: "bg-yellow-50 text-yellow-700",
      icon: <FiClock className="text-yellow-500" />,
      badgeColor: "text-yellow-600 bg-yellow-50",
    },
    "Changes Requested": {
      color: "bg-orange-50 text-orange-700",
      icon: <FiAlertCircle className="text-orange-500" />,
      badgeColor: "text-orange-600 bg-orange-50",
    },
    Approved: {
      color: "bg-green-50 text-green-700",
      icon: <FiCheckCircle className="text-green-500" />,
      badgeColor: "text-green-600 bg-green-50",
    },
    "Not Uploaded": {
      color: "bg-red-50 text-red-700",
      icon: <FiFileMinus className="text-red-500" />,
      badgeColor: "text-red-600 bg-red-50",
    },
    default: {
      color: "bg-blue-50 text-blue-700",
      icon: <FiFile className="text-blue-500" />,
      badgeColor: "text-blue-600 bg-blue-50",
    },
  };
  return states[state] || states.default;
};

const DocumentCard = ({ type, state, version }) => {
  const stateDetails = getStateDetails(state);
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${stateDetails.badgeColor}`}>{stateDetails.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{type}</h4>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${stateDetails.badgeColor}`}>
              {state}
            </span>
            <span className="text-xs text-gray-500">v{version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectStatus = ({ projects = [], semester }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Project Status <span className="text-indigo-600">Semester {semester}</span>
        </h3>
        <span className="text-sm text-gray-500">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <FiFileMinus className="mx-auto text-3xl text-gray-400 mb-2" />
          <p className="text-gray-500">No projects found for this semester</p>
          <p className="text-sm text-gray-400 mt-1">Upload your project documents to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => {
            const docs = [
              {
                id: `${project.id}-abstract`,
                type: "Abstract",
                state: getDocumentState(project.project?.abstract_url),
                version: 1,
              },
              {
                id: `${project.id}-report`,
                type: "Report",
                state: getDocumentState(project.project?.report_pdf_url),
                version: 1,
              },
              {
                id: `${project.id}-ppt`,
                type: "Presentation",
                state: getDocumentState(project.project?.ppt_url),
                version: 1,
              },
            ];

            return (
              <div
                key={project.id}
                className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                  {project.project?.title || "Untitled Project"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <DocumentCard key={doc.id} type={doc.type} state={doc.state} version={doc.version} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;