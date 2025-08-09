import React from "react";

const TeamInfo = ({ team }) => {
  if (!team) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Team Information</h3>
        <p className="text-gray-600">No team joined yet.</p>
      </div>
    );
  }

  const mentor = team.mentor;
  const members = team.members || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Team Information</h3>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Team Members:</p>
        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center bg-gray-50 p-3 rounded-lg"
              >
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-700 font-semibold">
                    {member.student_name?.charAt(0) || "S"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {member.student_name}{" "}
                    {member.isCurrentUser && (
                      <span className="text-xs text-indigo-500">(You)</span>
                    )}
                  </p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                  <p className="text-gray-400 text-xs">{member.reg_number}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No members in this team yet.</p>
        )}
      </div>

      <div>
        <p className="text-gray-600 mb-2">Mentor:</p>
        {mentor ? (
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="text-indigo-700 font-medium">
                {mentor.name?.charAt(0) || "M"}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{mentor.name}</p>
              <p className="text-gray-500 text-sm">{mentor.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No mentor assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default TeamInfo;
