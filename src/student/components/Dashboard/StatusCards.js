import React from "react";
import { FaChartLine, FaFolderOpen, FaThumbsUp } from "react-icons/fa";

const StatusCards = ({ semester, projects }) => {
  const approvedProjects = projects?.filter((p) => p.approved_status === "approved") || [];
  const pendingProjects = projects?.filter((p) => p.approved_status !== "approved") || [];

  const totalProjects = projects?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Semester */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Semester</h3>
          <FaChartLine className="text-white/80 text-xl" />
        </div>
        <p className="text-3xl font-bold mb-2">{semester || "N/A"}</p>
        <p className="text-blue-100">Semester Progress</p>
      </div>

      {/* Total Projects */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <FaFolderOpen className="text-white/80 text-xl" />
        </div>
        <p className="text-3xl font-bold mb-2">{totalProjects}</p>
        <p className="text-purple-100">Total Registered</p>
      </div>

      {/* Approval Status */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Approval Status</h3>
          <FaThumbsUp className="text-white/80 text-xl" />
        </div>
        <p className="text-3xl font-bold mb-2">
          {approvedProjects.length}/{totalProjects}
        </p>
        <p className="text-green-100">
          {approvedProjects.length} Approved, {pendingProjects.length} Pending
        </p>
      </div>
    </div>
  );
};

export default StatusCards;
