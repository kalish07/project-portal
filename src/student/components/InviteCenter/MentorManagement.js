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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Mentor Management
      </h3>

      {mentorRequestStatus === "pending" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Mentor Request Sent</p>
              <p className="text-gray-600">
                Waiting for response from{" "}
                {selectedMentorData?.name || "selected mentor"}
              </p>
            </div>
            <button
              onClick={withdrawMentorRequest}
              className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}

      {mentorRequestStatus === "none" && (
        <>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isMentorLocked}
            />
          </div>
          <div
            className={`space-y-4 max-h-96 overflow-y-auto ${
              isMentorLocked ? "opacity-60" : ""
            }`}
          >
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 truncate">
                      {mentor.name || "Unnamed Mentor"}
                      {isMentorLocked && (
                        <span className="ml-2 text-gray-500 inline-flex items-center">
                          <svg
                            className="w-3 h-3"
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
                        </span>
                      )}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        mentor.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mentor.available ? "Available" : "Full"} Mentor
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 truncate">
                    {mentor.email || "No email provided"}
                  </p>

                  <div className="flex flex-wrap mb-2">
                    {(mentor.expertise || []).map((exp, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {exp}
                      </span>
                    ))}
                    {(!mentor.expertise || mentor.expertise.length === 0) && (
                      <span className="text-gray-400 text-xs">
                        No expertise listed
                      </span>
                    )}
                  </div>

                  {mentor.seats_left && (
                    <div className="mt-2 text-sm text-gray-600">
                      {typeof mentor.seats_left === "object" ? (
                        <>
                          <p className="mb-1">Slots Left:</p>
                          <ul className="list-disc list-inside text-sm">
                            {Object.entries(mentor.seats_left).map(
                              ([type, seats]) => (
                                <li key={type}>
                                  {type.toUpperCase()}: {seats} slot
                                  {seats !== 1 ? "s" : ""}
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      ) : (
                        <p>
                          Slots Left: {mentor.seats_left} slot
                          {mentor.seats_left !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => requestMentor(mentor.id)}
                    disabled={isMentorLocked || !mentor.available}
                    className={`w-full px-4 py-2 rounded-md mt-3 transition-colors ${
                      isMentorLocked || !mentor.available
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isMentorLocked ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Select Partner First
                      </span>
                    ) : mentor.available ? (
                      "Request Mentor"
                    ) : (
                      "Unavailable"
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">
                  {mentorSearchQuery
                    ? "No matching mentors found"
                    : "No mentors available"}
                </p>
                {mentorSearchQuery && (
                  <button
                    onClick={() => setMentorSearchQuery("")}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            {isMentorLocked && (
              <div className="mt-4 text-center text-sm text-gray-500">
                <svg
                  className="inline w-4 h-4 mr-2"
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
                Mentor selection will unlock after partner acceptance
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
