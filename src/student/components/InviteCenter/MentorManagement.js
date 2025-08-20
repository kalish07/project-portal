import React from "react";
import PropTypes from "prop-types";
import MentorDetails from "./MentorDetails";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map(word => word[0]?.toUpperCase())
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
  mentorDetails = null
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

  const selectedMentorData =
    mentors.find((m) => m.id === Number(selectedMentor)) || mentorDetails;

  console.log("mentorRequestStatus:", mentorRequestStatus, "mentor:", selectedMentorData);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-4 sm:px-6 pt-4 pb-3 text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-1">Mentor Management</h3>
        <p className="text-indigo-100 text-sm sm:text-base">
          Connect with experienced mentors for guidance
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Pending Request – show amber card only if a mentor exists */}
        {mentorRequestStatus === "pending" && selectedMentorData ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 shadow">
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
                onClick={withdrawMentorRequest}
                className="mt-2 sm:mt-0 w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-red-600 transition"
              >
                Withdraw
              </button>
            </div>
          </div>
        ) : null}

        {/* approved mentor */}
        {mentorRequestStatus === "approved" && selectedMentorData && (
          <MentorDetails
            mentor={selectedMentorData}
            withdrawMentorRequest={withdrawMentorRequest}
            teamApproved={true}
          />
        )}

        {/* Search & List Mentors – shown if no mentor or status is none OR pending but mentor is null */}
        {(mentorRequestStatus === "none" || (mentorRequestStatus === "pending" && !selectedMentorData)) && (
          <>
            <div className="relative">
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
                placeholder="Search mentors by name, email or expertise..."
                value={mentorSearchQuery}
                onChange={(e) => setMentorSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-3 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition shadow-sm text-sm sm:text-base ${
                  isMentorLocked ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isMentorLocked}
              />
            </div>

            <div className="space-y-4 sm:space-y-6 max-h-[28rem] sm:max-h-96 overflow-y-auto">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => {
                  const isDisabled = isMentorLocked || !mentor.available;
                  return (
                    <div
                      key={mentor.id}
                      className={`bg-white border border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
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
                            <p className="text-xs text-gray-400 italic mt-1">No specialization</p>
                          )}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium mt-2 sm:mt-0 bg-indigo-50 text-indigo-700 border border-indigo-200 truncate max-w-[10rem]">
                        {mentor.email || "No email"}
                      </span>

                      <button
                        onClick={() => requestMentor(mentor.id)}
                        disabled={isDisabled}
                        className={`w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition ${
                          isDisabled
                            ? "bg-gray-200 text-gray-500"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow hover:shadow-lg"
                        }`}
                      >
                        Request Mentor
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
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
  mentorRequestStatus: PropTypes.oneOf(["none", "pending", "approved", "rejected"]),
  selectedMentor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mentors: PropTypes.array,
  mentorSearchQuery: PropTypes.string,
  setMentorSearchQuery: PropTypes.func,
  requestMentor: PropTypes.func,
  withdrawMentorRequest: PropTypes.func,
  isMentorLocked: PropTypes.bool,
  mentorDetails: PropTypes.object
};

export default MentorManagement;