import React, { useState } from "react";
import ProjectStats from "./ProjectStats";
import UpcomingDeadlines from "./UpcomingDeadlines";

const ProjectManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("");

  const getTypeColor = (type) => {
    switch (type) {
      case "Abstract":
        return { bg: "blue-100", text: "blue-800" };
      case "Progress Report":
        return { bg: "purple-100", text: "purple-800" };
      case "Prototype Demo":
        return { bg: "green-100", text: "green-800" };
      case "Final Report":
        return { bg: "indigo-100", text: "indigo-800" };
      default:
        return { bg: "pink-100", text: "pink-800" };
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Project Management</h1>
      </div>

      <ProjectStats>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 shadow-md rounded-lg p-5 animate-pulse"
            >
              <div className="h-5 w-1/2 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </ProjectStats>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, team, or status..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <select
                value={projectTypeFilter}
                onChange={(e) => setProjectTypeFilter(e.target.value)}
                className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm"
              >
                <option value="">All Project Types</option>
                <option value="PT-1">PT1</option>
                <option value="PT-2">PT 2</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>
            <div className="relative">
              <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center justify-between w-full md:w-auto">
                <span>Project Status</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
            <button className="bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
              <i className="fas fa-filter mr-2"></i>
              More Filters
            </button>
          </div>
        </div>
      </div>

      <UpcomingDeadlines 
        searchQuery={searchQuery} 
        projectTypeFilter={projectTypeFilter}
        getTypeColor={getTypeColor}
      />
    </div>
  );
};

export default ProjectManagement;