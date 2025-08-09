import React from "react";

const TeamRequestList = ({ pendingTeamRequests, handleTeamRequest }) => {
  return (
    <div className="space-y-4">
      {pendingTeamRequests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group relative"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-plus text-indigo-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {request.name}
                </h3>
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
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-full top-0 ml-4 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-200 z-10">
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
                      <p className="text-sm font-medium text-gray-800">
                        {member.name}
                      </p>
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
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => handleTeamRequest(request.id, false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors !rounded-button"
              >
                <i className="fas fa-times mr-2"></i>
                Reject
              </button>
              <button
                onClick={() => handleTeamRequest(request.id, true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors !rounded-button"
              >
                <i className="fas fa-check mr-2"></i>
                Approve
              </button>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{request.description}</p>
        </div>
      ))}
      {pendingTeamRequests.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <i className="fas fa-check text-gray-400 text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Pending Requests
          </h2>
          <p className="text-gray-500">
            You have no pending team requests at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamRequestList;
