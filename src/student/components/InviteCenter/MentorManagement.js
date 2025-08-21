import React from "react";
import PropTypes from "prop-types";
import MentorDetails from "./MentorDetails";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const MentorManagement = ({
  mentorRequestStatus = "", // "none", "pending", "approved", "rejected"
  selectedMentor = null,
  mentors = [],
  mentorSearchQuery = "",
  setMentorSearchQuery = () => {},
  requestMentor = () => {},
  withdrawMentorRequest = () => {},
  isMentorLocked = false,
  mentorDetails = null,
  requestingMentorId = null,
  withdrawingMentorId = null,
}) => {
  const filteredMentors = mentors.filter((mentor) => {
    const query = mentorSearchQuery.toLowerCase();
    return (
      (mentor.name || "").toLowerCase().includes(query) ||
      (mentor.email || "").toLowerCase().includes(query) ||
      (mentor.specialized_in || "").toLowerCase().includes(query)
    );
  });

  const selectedMentorData =
    mentors.find((m) => m.id === Number(selectedMentor)) || mentorDetails;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-6 pb-4 text-white">
        <h3 className="text-2xl font-bold mb-2">Mentor Management</h3>
        <p className="text-indigo-100">
          Connect with experienced mentors for guidance
        </p>
      </div>

      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Pending Request */}
        {mentorRequestStatus === "pending" &&
        selectedMentor &&
        selectedMentorData ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 shadow-lg mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-800">
                    Mentor Request Sent
                  </p>
                  <p className="text-amber-600">
                    Waiting for response from {selectedMentorData.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => withdrawMentorRequest(selectedMentorData.id)}
                disabled={withdrawingMentorId === selectedMentorData?.id}
                className={`w-full sm:w-auto group relative inline-flex items-center justify-center px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                  withdrawingMentorId === selectedMentorData?.id
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25"
                }`}
              >
                {withdrawingMentorId === selectedMentorData?.id ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <span className="relative">Withdraw</span>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* Approved Mentor */}
        {mentorRequestStatus === "approved" && selectedMentorData && (
          <MentorDetails
            mentor={selectedMentorData}
            withdrawMentorRequest={withdrawMentorRequest}
            teamApproved={true}
          />
        )}

        {/* Search & Mentor List */}
        {(mentorRequestStatus === "none" ||
          (mentorRequestStatus === "pending" && !selectedMentorData)) && (
          <div className="flex flex-col flex-1">
            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                placeholder="Search mentors by name, email or specialization..."
                value={mentorSearchQuery}
                onChange={(e) => setMentorSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-sm ${
                  isMentorLocked ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isMentorLocked}
              />
            </div>

            {/* List */}
            <div className="flex-1 max-h-[32rem] overflow-y-auto">
              {filteredMentors.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {filteredMentors.map((mentor) => {
                    const isDisabled = isMentorLocked || !mentor.available;
                    return (
                      <div
                        key={mentor.id}
                        className={`bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200 ${
                          isDisabled ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0 mb-3 sm:mb-0">
                          {mentor.profile_pic ? (
                            <img
                              src={mentor.profile_pic}
                              alt={mentor.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-md">
                              <span className="text-lg sm:text-xl font-semibold text-indigo-600">
                                {getInitials(mentor.name)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
                              {mentor.name || "Unnamed Mentor"}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm truncate mb-2">
                              {mentor.email || "No email"}
                            </p>
                            {mentor.specialized_in ? (
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium border border-indigo-100">
                                  {mentor.specialized_in}
                                </span>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">
                                No specialization
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => requestMentor(mentor.id)}
                          disabled={isDisabled || requestingMentorId !== null}
                          className={`w-full sm:w-auto sm:ml-4 inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                            (isDisabled || requestingMentorId !== null)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                          }`}
                        >
                          {requestingMentorId === mentor.id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          ) : (
                            "Request Mentor"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {mentorSearchQuery
                    ? "No matching mentors found"
                    : "No mentors available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MentorManagement.propTypes = {
  mentorRequestStatus: PropTypes.oneOf([
    "none",
    "pending",
    "approved",
    "rejected",
  ]),
  selectedMentor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mentors: PropTypes.array,
  mentorSearchQuery: PropTypes.string,
  setMentorSearchQuery: PropTypes.func,
  requestMentor: PropTypes.func,
  withdrawMentorRequest: PropTypes.func,
  isMentorLocked: PropTypes.bool,
  mentorDetails: PropTypes.object,
  requestingMentorId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  withdrawingMentorId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default MentorManagement;