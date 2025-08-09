import React from 'react';

const EnrollmentChart = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Student Enrollment Trend</h3>
        <div className="bg-gray-100 rounded-md px-3 py-1 text-sm">
          Last 6 months
        </div>
      </div>
      <div id="studentChart" className="w-full h-64"></div>
    </div>
  );
};

export default EnrollmentChart;