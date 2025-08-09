import React from 'react';

const ProjectDetails = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {project?.title || 'Untitled Project'}
          </h3>
          <p className="text-gray-600 mt-1">
            {project?.description || 'No description available.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project?.type && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {project.type}
              </span>
            )}
            {project?.department && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {project.department}
              </span>
            )}
            {project?.semester && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {project.semester}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:text-right">
          {project?.supervisor && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">Mentor:</span> {project.supervisor}
            </div>
          )}
          {project?.dueDate && (
            <div className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Due Date:</span> {project.dueDate}
            </div>
          )}
          {project?.status && (
            <div className="mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Team Members</h4>
        <div className="flex flex-wrap gap-3">
          {(project?.teamMembers || []).map((member, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-50 px-3 py-2 rounded-lg"
            >
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                {member?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium">{member?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{member?.role || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
