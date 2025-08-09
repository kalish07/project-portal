import React from "react";
import PropTypes from "prop-types";

const PartnerManagement = ({
  inviteStatus = "none",
  selectedPartner = null,
  filteredStudents = [],
  searchQuery = "",
  setSearchQuery = () => {},
  sendPartnerInvite = () => {},
  withdrawPartnerInvite = () => {},
  goSolo = () => {},
  students = [],
  teammate = null
}) => {
  const selectedStudent = students.find((s) => s.id === Number(selectedPartner));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Partner Management</h3>

      {/* ✅ Show fixed teammate if already in a team */}
      {teammate ? (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
          <h4 className="text-green-800 font-semibold mb-2">Your Team Partner</h4>
          <div className="flex items-start space-x-4">
            {teammate.profile_pic_url && (
              <img
                src={teammate.profile_pic_url}
                alt="Teammate"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-gray-800 font-medium">{teammate.student_name}</p>
              <p className="text-gray-600 text-sm">{teammate.email}</p>
              <div className="flex flex-wrap mt-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  Reg: {teammate.reg_number || "______"}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  Dept: {teammate.department_name || "__________"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : inviteStatus === "outgoing" ? (
        // ✅ Outgoing invite in progress
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Invitation Sent</p>
              <p className="text-gray-600">
                Waiting for response from {selectedStudent?.student_name || "selected student"}
              </p>
            </div>
            <button
              onClick={withdrawPartnerInvite}
              className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      ) : (
        // ✅ No team and no invite - allow searching partners
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
              placeholder="Search by name, email or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-6 max-h-96 overflow-y-auto">
            {filteredStudents.length > 0 ? (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {student.profile_pic_url && (
                        <img
                          src={student.profile_pic_url}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {student.student_name || "Unknown"}
                        </p>
                        <p className="text-gray-600 text-sm truncate">{student.email || "No email"}</p>
                        <div className="flex flex-wrap mt-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                            Reg: {student.reg_number || "______"}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                            Dept: {student.department_name || "__________"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => sendPartnerInvite(student.id)}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Send Invite
                    </button>
                  </div>
                ))}
              </div>
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
                  {searchQuery ? "No matching students found" : "No students available"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={goSolo}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Proceed Solo
          </button>
        </>
      )}
    </div>
  );
};

PartnerManagement.propTypes = {
  inviteStatus: PropTypes.oneOf(["none", "outgoing", "accepted", "rejected"]),
  selectedPartner: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filteredStudents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      student_name: PropTypes.string,
      email: PropTypes.string,
      reg_number: PropTypes.string,
      department_name: PropTypes.string,
      profile_pic_url: PropTypes.string
    })
  ),
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  sendPartnerInvite: PropTypes.func,
  withdrawPartnerInvite: PropTypes.func,
  goSolo: PropTypes.func,
  students: PropTypes.array,
  teammate: PropTypes.object
};

export default PartnerManagement;
