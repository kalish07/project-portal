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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-4 sm:px-6 pt-4 pb-3 text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-1">Mentor Management</h3>
        <p className="text-indigo-100 text-sm sm:text-base">
          Connect with experienced mentors for guidance
        </p>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col space-y-4">
        {/* Pending Request */}
        {mentorRequestStatus === "pending" &&
        selectedMentor &&
        selectedMentorData ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 shadow mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600"
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
                <div className="flex flex-col text-sm sm:text-base">
                  <p className="font-semibold text-amber-800">
                    Mentor Request Sent
                  </p>
                  <p className="text-amber-600 truncate">
                    Waiting for response from {selectedMentorData.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => withdrawMentorRequest(selectedMentorData.id)}
                disabled={withdrawingMentorId === selectedMentorData?.id}
                className={`mt-2 sm:mt-0 w-full sm:w-auto rounded-lg font-medium text-sm sm:text-base transition px-4 py-2 flex items-center justify-center ${
                  withdrawingMentorId === selectedMentorData?.id
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
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
                  "Withdraw"
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
          <>
            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
                className={`w-full pl-10 pr-3 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition shadow-sm text-sm sm:text-base ${
                  isMentorLocked ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isMentorLocked}
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => {
                  const isDisabled = isMentorLocked || !mentor.available;
                  return (
                    <div
                      key={mentor.id}
                      className={`bg-white border border-gray-100 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200 ${
                        isDisabled ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {mentor.profile_pic ? (
                          <img
                            src={mentor.profile_pic}
                            alt={mentor.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-indigo-600 font-semibold">
                              {getInitials(mentor.name)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {mentor.name || "Unnamed Mentor"}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {mentor.email || "No email"}
                          </p>
                          {mentor.specialized_in ? (
                            <div className="mt-1 sm:mt-2">
                              <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium border border-indigo-200">
                                {mentor.specialized_in}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic mt-1">
                              No specialization
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => requestMentor(mentor.id)}
                        disabled={isDisabled || requestingMentorId !== null}
                        className={`mt-2 sm:mt-0 w-full sm:w-auto rounded-lg font-medium text-sm sm:text-base transition px-4 py-2 flex items-center justify-center ${
                          requestingMentorId === mentor.id
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow hover:shadow-lg"
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
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {mentorSearchQuery
                    ? "No matching mentors found"
                    : "No mentors available"}
                </div>
              )}
            </div>
          </>
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