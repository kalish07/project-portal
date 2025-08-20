import React from "react";
import { Mail, User, Users, Briefcase } from "lucide-react";

const ProjectDetails = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {project?.title || "Untitled Project"}
          </h3>
          <p className="text-gray-600 mt-2 leading-relaxed max-w-2xl">
            {project?.description || "No description available."}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {project?.type && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                {project.type}
              </span>
            )}
            {project?.department && (
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                {project.department}
              </span>
            )}
            {project?.semester && (
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                Semester {project.semester}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 md:mt-0 md:text-right">
          {project?.status && (
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                project.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {project.status}
            </span>
          )}
        </div>
      </div>

      {/* Mentor Section */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50 border border-indigo-200">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
          <User size={18} /> Mentor Details
        </h4>
        {project?.supervisor === "No Mentor Assigned" ? (
          <p className="text-gray-500 italic">No Mentor Assigned</p>
        ) : (
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-medium">Name:</span> {project.supervisor}
            </p>
            {project?.mentor_email && (
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-500" />
                <a
                  href={`mailto:${project.mentor_email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {project.mentor_email}
                </a>
              </p>
            )}
            {project?.mentor_specialized_in && (
              <p className="flex items-center gap-2">
                <Briefcase size={14} className="text-indigo-500" />
                <span>
                  <span className="font-medium">Specialization:</span>{" "}
                  {project.mentor_specialized_in}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users size={18} /> Team Members
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(project?.teamMembers || []).map((member, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-3">
                {member?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {member?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{member?.role || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;