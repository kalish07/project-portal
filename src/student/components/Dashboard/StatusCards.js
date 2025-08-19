import React from "react";
import { FaChartLine, FaFolderOpen, FaThumbsUp } from "react-icons/fa";

const StatusCards = ({ semester, projects }) => {
  const approvedProjects = projects?.filter(p => p.approved_status === "approved") || [];
  const pendingProjects = projects?.filter(p => p.approved_status !== "approved") || [];
  const totalProjects = projects?.length || 0;

  const cards = [
  {
    title: "Current Semester",
    value: semester || "N/A",
    subtitle: "Semester Progress",
    icon: <FaChartLine className="text-white text-lg sm:text-xl" />,
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    title: "Projects",
    value: totalProjects,
    subtitle: "Total Registered",
    icon: <FaFolderOpen className="text-white text-lg sm:text-xl" />,
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    title: "Approval Status",
    value: `${approvedProjects.length}/${totalProjects}`,
    subtitle: `${approvedProjects.length} Approved, ${pendingProjects.length} Pending`,
    icon: <FaThumbsUp className="text-white text-lg sm:text-xl" />,
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
  },
];

  return (
    <>
      {/* Mobile Grid (no scroll) */}
      {/* Mobile Compact Pills */}
<div className="lg:hidden flex flex-wrap gap-3 mb-6">
  {cards.map((card, idx) => (
    <div
      key={idx}
      className={`flex flex-col justify-center items-center px-4 py-3 rounded-xl text-center text-white shadow-md flex-1 min-w-[100px] ${card.gradient}`}
    >
      <div className="mb-1">{card.icon}</div>
      <p className="text-lg font-bold">{card.value}</p>
      <p className="text-xs text-white/80">{card.title}</p>
    </div>
  ))}
</div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 mb-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 text-white shadow-md transition-transform duration-300 ${card.gradient}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold truncate">{card.title}</h3>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">{card.value}</p>
            <p className="text-white/80 text-sm truncate">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatusCards;