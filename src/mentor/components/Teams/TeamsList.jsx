import React from "react";
import TeamCard from "./TeamCard";

const TeamsList = ({
  teams = [],
  selectedTeam,
  setSelectedTeam,
  setActiveTab,
  showPendingRequests,
  setShowPendingRequests,
  submissionFilter,
  setSubmissionFilter,
  pendingTeamRequests = [],
  handleTeamRequest,
}) => {
  const filteredTeams = teams.filter((team) => {
    const semester = parseInt(team.current_semester);
    if (submissionFilter === "PT-1" && semester === 5) return true;
    if (submissionFilter === "PT-2" && semester === 6) return true;
    if (submissionFilter === "Final Year" && (semester === 7 || semester === 8)) return true;
    return false;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">My Teams</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all your team memberships</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          {/* Dropdown */}
          <div className="relative w-full sm:w-40 md:w-48">
            <select
              value={submissionFilter}
              onChange={(e) => setSubmissionFilter(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PT-1">PT-1</option>
              <option value="PT-2">PT-2</option>
              <option value="Final Year">Final Year</option>
            </select>
            <i className="fas fa-chevron-down pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Toggle Buttons */}
          <div className="flex flex-col sm:flex-row sm:gap-2 gap-2 w-full sm:w-auto">
            <button
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                !showPendingRequests
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setShowPendingRequests(false)}
            >
              My Teams
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                showPendingRequests
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setShowPendingRequests(true)}
            >
              Pending Requests
            </button>
          </div>
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 gap-6">
        {!showPendingRequests ? (
          filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                selectedTeam={selectedTeam}
                setSelectedTeam={(id) => {
                  setSelectedTeam(id);
                  setActiveTab("projects");
                }}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No teams found for <span className="font-semibold">{submissionFilter}</span>.
            </div>
          )
        ) : (
          <div className="space-y-4">
            {Array.isArray(pendingTeamRequests) && pendingTeamRequests.length > 0 ? (
              pendingTeamRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 transition-all relative"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user-plus text-indigo-600 text-lg"></i>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{request.name}</h3>
                        <p className="text-sm text-gray-500">
                          Requested by {request.requestedBy} on{" "}
                          {new Date(request.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleTeamRequest(request.id, false)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-times mr-1"></i> Reject
                      </button>
                      <button
                        onClick={() => handleTeamRequest(request.id, true)}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                      >
                        <i className="fas fa-check mr-1"></i> Approve
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-3">{request.description}</p>

                  {/* Member Tooltip (Desktop Only) */}
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 absolute left-full top-0 ml-4 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-all z-10">
                    <h4 className="font-semibold text-gray-800 mb-3">Team Members</h4>
                    <div className="space-y-3">
                      {request.members?.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{member.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{member.regNo}</span>
                              <span>•</span>
                              <span>{member.dept}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-check text-gray-400 text-xl"></i>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  No Pending Requests
                </h2>
                <p className="text-sm text-gray-500">You have no pending team requests at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
