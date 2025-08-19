import React, { useRef } from "react";

const TeamInfo = ({ team, cardHeight }) => {
  const scrollRef = useRef(null);

  // Use passed cardHeight or default
  const heightClass = cardHeight ? "" : "h-80";

  if (!team) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 flex flex-col justify-center items-center ${heightClass}`}
        style={cardHeight ? { minHeight: `${cardHeight}px` } : {}}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Team Information</h3>
        <p className="text-gray-600 text-center">
          You haven't joined a team yet.
        </p>
      </div>
    );
  }

  const { members = [], mentor } = team;

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 ${heightClass}`}
      style={cardHeight ? { minHeight: `${cardHeight}px` } : {}}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Team Information</h3>

      {/* Team Members */}
      <div className="mb-6">
        {members.length > 0 ? (
          <>
            {/* Mobile horizontal carousel */}
            <div 
              ref={scrollRef} 
              className="flex lg:hidden space-x-4 overflow-x-auto pb-3 scrollbar-hide"
            >
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-3 shadow-sm hover:bg-gray-100 transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-2 overflow-hidden mx-auto">
                    {member.profile_pic_url ? (
                      <img
                        src={member.profile_pic_url}
                        alt={member.student_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-700 font-bold text-lg">
                        {member.student_name?.charAt(0).toUpperCase() || "S"}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-center truncate">
                    {member.student_name} {member.isCurrentUser && "(You)"}
                  </p>
                  <p className="text-gray-500 text-xs text-center truncate">{member.email}</p>
                  <p className="text-gray-400 text-xs text-center truncate">{member.reg_number}</p>
                </div>
              ))}
            </div>

            {/* Desktop vertical list */}
            <div className="hidden lg:flex flex-col space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mr-4 overflow-hidden shrink-0">
                    {member.profile_pic_url ? (
                      <img
                        src={member.profile_pic_url}
                        alt={member.student_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-700 font-bold text-lg">
                        {member.student_name?.charAt(0).toUpperCase() || "S"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {member.student_name} {member.isCurrentUser && "(You)"}
                    </p>
                    <p className="text-gray-500 text-sm truncate">{member.email}</p>
                    <p className="text-gray-400 text-xs truncate">{member.reg_number}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm text-center">No members in this team yet.</p>
        )}
      </div>
    </div>
  );
};

export default TeamInfo;