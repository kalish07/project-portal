import React from 'react';

const ProjectStatusChart = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Project Status Overview</h3>
        <div className="bg-gray-100 rounded-md px-3 py-1 text-sm">
          Current semester
        </div>
      </div>
      <div id="projectChart" className="w-full h-64"></div>
    </div>
  );
};

export default ProjectStatusChart;