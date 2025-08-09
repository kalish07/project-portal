import React from 'react';

const ProjectHeader = ({
  projectType,
  setProjectType,
  searchQuery,
  setSearchQuery,
  allowedTypes = [],
}) => {
  const projectOptions = [
    { value: 'pt1', label: 'PT1 Project' },
    { value: 'pt2', label: 'PT2 Project' },
    { value: 'finalyearproject', label: 'Final Year Project' },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Project Submissions</h2>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {/* Project Type Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {projectOptions.map(({ value, label }) => (
              <option
                key={value}
                value={value}
                disabled={!allowedTypes.includes(value)}
              >
                {label}
                {!allowedTypes.includes(value) ? ' (Not Allowed)' : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
            <i className="fas fa-chevron-down text-sm"></i>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
