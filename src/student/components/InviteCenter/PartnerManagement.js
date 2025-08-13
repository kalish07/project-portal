import React from "react";
import PartnerDetails from "./PartnerDetails";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map(word => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const PartnerManagement = ({
  inviteStatus = "none",
  selectedPartner = null,
  filteredStudents = [],
  searchQuery = "",
  setSearchQuery = () => {},
  sendPartnerInvite = () => {},
  withdrawPartnerInvite = () => {},
  goSolo = () => {},
  teammate = null,
  sentInvitations = [],
  setInviteTab = () => {}
}) => {
  const selectedStudent = filteredStudents.find((s) => s.id === Number(selectedPartner));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-6 pb-4 text-white">
        <h3 className="text-2xl font-bold mb-2">Partner Management</h3>
        <p className="text-indigo-100">Collaborate with your teammate or work solo</p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Partner Details if teammate exists */}
        {teammate ? (
          <PartnerDetails 
            partner={teammate} 
            setSelectedPartner={() => {}} 
            setInviteTab={setInviteTab}
          />
        ) : inviteStatus === "outgoing" ? (
          // Outgoing invite card
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-800">Invitation Sent</p>
                  <p className="text-amber-600">
                    Waiting for response from {selectedStudent?.student_name || "selected student"}
                  </p>
                </div>
              </div>
              <button
                onClick={withdrawPartnerInvite}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
              >
                <span className="relative">Withdraw</span>
              </button>
            </div>
          </div>
        ) : (
          // No team and no invite - search & list students
          <>
            {/* Search */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Students list */}
            <div className="mb-4 sm:mb-6 max-h-96 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {filteredStudents.map((student) => {
                    const hasSentInvite = sentInvitations.some(inv => inv.recipient.id === student.id);

                    return (
                      <div
                        key={student.id}
                        className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
                      >
                        {/* Avatar + Info */}
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0 mb-3 sm:mb-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-md">
                            <span className="text-lg sm:text-xl font-semibold text-indigo-600">
                              {getInitials(student.student_name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
                              {student.student_name || "Unknown"}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm truncate mb-2">
                              {student.email || "No email"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium border border-indigo-100">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1 sm:mr-2"></span>
                                Reg: {student.reg_number || "______"}
                              </span>
                              <span className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium border border-gray-200">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1 sm:mr-2"></span>
                                Dept: {student.department_name || "__________"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Invite button */}
                        <button
                          onClick={() => sendPartnerInvite(student.id)}
                          disabled={hasSentInvite}
                          className={`w-full sm:w-auto sm:ml-4 group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base ${
                            hasSentInvite
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25"
                          }`}
                        >
                          {hasSentInvite ? "Invite Sent" : "Send Invite"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500 mb-2">
                    {searchQuery ? "No matching students found" : "No students available"}
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium">
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Proceed Solo */}
            <button
              onClick={goSolo}
              className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 mt-4"
            >
              <span className="relative flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Proceed Solo</span>
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerManagement;