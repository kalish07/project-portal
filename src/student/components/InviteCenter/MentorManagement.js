import React from "react";
import PropTypes from "prop-types";

const MentorManagement = ({
  mentorRequestStatus = "none",
  selectedMentor = null,
  mentors = [],
  mentorSearchQuery = "",
  setMentorSearchQuery = () => {},
  requestMentor = () => {},
  withdrawMentorRequest = () => {},
  isMentorLocked = false,
}) => {
  const filteredMentors = mentors.filter((mentor) => {
    const query = mentorSearchQuery.toLowerCase();
    return (
      (mentor.name || "").toLowerCase().includes(query) ||
      (mentor.email || "").toLowerCase().includes(query) ||
      ((mentor.expertise || []).some((exp) =>
        exp.toLowerCase().includes(query)
      ))
    );
  });

  const selectedMentorData = mentors.find(
    (m) => m.id === Number(selectedMentor)
  );

  // Mock data for demonstration
  const mockMentors = filteredMentors.length > 0 ? filteredMentors : [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      email: "s.mitchell@university.edu",
      expertise: ["Machine Learning", "Data Science", "Python"],
      available: true,
      seats_left: 3
    },
    {
      id: 2,
      name: "Prof. James Rodriguez",
      email: "j.rodriguez@university.edu",
      expertise: ["Web Development", "React", "JavaScript"],
      available: true,
      seats_left: { individual: 2, team: 1 }
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      email: "e.chen@university.edu",
      expertise: ["AI", "Neural Networks"],
      available: false,
      seats_left: 0
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Mentor Management
        </h3>
        <p className="text-gray-600">Find and connect with expert mentors</p>
      </div>

      {/* EXACT SAME LOGIC - Pending mentor request */}
      {mentorRequestStatus === "pending" && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-800">Mentor Request Sent</p>
                <p className="text-amber-700">
                  Waiting for response from{" "}
                  {selectedMentorData?.name || "selected mentor"}
                </p>
              </div>
            </div>
            <button
              onClick={withdrawMentorRequest}
              className="bg-white text-red-600 border border-red-300 px-6 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 font-medium shadow-sm"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}

      {/* EXACT SAME LOGIC - Search and mentor selection */}
      {mentorRequestStatus === "none" && (
        <>
          {/* Enhanced search bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={mentorSearchQuery}
              onChange={(e) => setMentorSearchQuery(e.target.value)}
              placeholder="Search mentors by name, email or expertise..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-sm"
              disabled={isMentorLocked}
            />
            {isMentorLocked && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Mentor cards */}
          <div
            className={`space-y-6 max-h-96 overflow-y-auto ${
              isMentorLocked ? "opacity-60" : ""
            }`}
          >
            {mockMentors.length > 0 ? (
              mockMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group"
                >
                  {/* Header with name and availability */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900 truncate">
                          {mentor.name || "Unnamed Mentor"}
                        </h4>
                        {isMentorLocked && (
                          <div className="flex items-center text-gray-500">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-3">
                        {mentor.email || "No email provided"}
                      </p>
                    </div>
                    
                    {/* Availability badge */}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        mentor.available
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {mentor.available ? "✓ Available" : "✗ Full"}
                    </span>
                  </div>

                  {/* Expertise tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {(mentor.expertise || []).map((exp, i) => (
                        <span
                          key={i}
                          className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium border border-indigo-200"
                        >
                          {exp}
                        </span>
                      ))}
                      {(!mentor.expertise || mentor.expertise.length === 0) && (
                        <span className="text-gray-400 text-sm italic">
                          No expertise listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seats information */}
                  {mentor.seats_left && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <h5 className="font-semibold text-gray-700 text-sm">Available Slots</h5>
                      </div>
                      {typeof mentor.seats_left === "object" ? (
                        <div className="space-y-1">
                          {Object.entries(mentor.seats_left).map(
                            ([type, seats]) => (
                              <div key={type} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">{type}:</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {seats} slot{seats !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total slots:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {mentor.seats_left} slot{mentor.seats_left !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  <button
                    onClick={() => requestMentor(mentor.id)}
                    disabled={isMentorLocked || !mentor.available}
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      isMentorLocked || !mentor.available
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform group-hover:scale-[1.02]"
                    }`}
                  >
                    {isMentorLocked ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Select Partner First</span>
                      </span>
                    ) : mentor.available ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>Request Mentor</span>
                      </span>
                    ) : (
                      "Unavailable"
                    )}
                  </button>
                </div>
              ))
            ) : (
              // Empty state
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-500 mb-2">
                  {mentorSearchQuery
                    ? "No matching mentors found"
                    : "No mentors available"}
                </p>
                {mentorSearchQuery && (
                  <button
                    onClick={() => setMentorSearchQuery("")}
                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Locked message */}
            {isMentorLocked && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Mentor selection will unlock after partner acceptance
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

MentorManagement.propTypes = {
  mentorRequestStatus: PropTypes.oneOf(["none", "pending", "accepted", "rejected"]),
  selectedMentor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mentors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      expertise: PropTypes.arrayOf(PropTypes.string),
      available: PropTypes.bool,
      seats_left: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
      ]),
    })
  ),
  mentorSearchQuery: PropTypes.string,
  setMentorSearchQuery: PropTypes.func,
  requestMentor: PropTypes.func,
  withdrawMentorRequest: PropTypes.func,
  isMentorLocked: PropTypes.bool,
};

export default MentorManagement;