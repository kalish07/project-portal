import React from "react";

const TeamCard = ({ team, selectedTeam, setSelectedTeam }) => {
  const formattedDate = new Date(team.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border ${
        selectedTeam === team.id
          ? "border-indigo-300 ring-2 ring-indigo-100"
          : "border-gray-100"
      } hover:shadow-md transition-all cursor-pointer`}
      onClick={() => setSelectedTeam(team.id)}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-users text-indigo-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">
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
            </h3>
            <p className="text-sm text-gray-500">Created on {formattedDate}</p>

            {team.members?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {team.members.map((member) => (
                  <li key={member.id} className="text-sm text-gray-700">
                    <span className="font-medium">{member.student_name}</span>{" "}
                    <span className="text-gray-400">({member.reg_number})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {team.members?.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                >
                  <i className="fas fa-user text-gray-500 text-xs"></i>
                </div>
              ))}
            </div>
            {team.members?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center ml-1">
                <span className="text-xs text-indigo-600 font-medium">
                  +{team.members.length - 3}
                </span>
              </div>
            )}
            <span className="ml-3 text-sm text-gray-500">
              {team.members?.length || 0} Members
            </span>
          </div>

          <div className="mt-3 md:mt-0 flex items-center">
            <i className="fas fa-folder text-gray-400 mr-2"></i>
            <span className="text-sm text-gray-500">
              {team.projects?.length || 0} Projects
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Active
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          Collaborative
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          Design
        </span>
      </div>
    </div>
  );
};

export default TeamCard;
