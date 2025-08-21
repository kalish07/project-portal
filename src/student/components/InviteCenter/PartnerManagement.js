import React, { useState } from "react";
import PartnerDetails from "./PartnerDetails";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

const PartnerManagement = ({
  selectedPartner = null,
  filteredStudents = [],
  searchQuery = "",
  setSearchQuery = () => {},
  sendPartnerInvite = () => {},
  withdrawPartnerInvite = () => {},
  goSolo = () => {},
  teammate = null,
  sentInvitations = [],
  setInviteTab = () => {},
}) => {
  const [sendingId, setSendingId] = useState(null); // ✅ Track which invite is being sent
  const [withdrawing, setWithdrawing] = useState(false);

  const handleSendInvite = async (studentId) => {
    try {
      setSendingId(studentId); // start loading
      await sendPartnerInvite(studentId); // wait for API
    } catch (err) {
      console.error("Error sending invite:", err);
    } finally {
      setSendingId(null); // reset state
    }
  };

  const selectedStudent = filteredStudents.find(
    (s) => s.id === Number(selectedPartner)
  );
  const hasSentInvitations = sentInvitations.length > 0;


  const handleWithdraw = async (invitationId) => {
  try {
    setWithdrawing(true);
    await withdrawPartnerInvite(invitationId); // API call
  } catch (err) {
    console.error("Error withdrawing invite:", err);
  } finally {
    setWithdrawing(false);
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-6 pb-4 text-white">
        <h3 className="text-2xl font-bold mb-2">Partner Management</h3>
        <p className="text-indigo-100">
          Collaborate with your teammate or work solo
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Partner Details */}
        {teammate ? (
          <PartnerDetails
            partner={teammate}
            setSelectedPartner={() => {}}
            setInviteTab={setInviteTab}
          />
        ) : hasSentInvitations ? (
          // Outgoing invite card
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 shadow-lg">
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
                    Invitation Sent
                  </p>
                  <p className="text-amber-600">
                    Waiting for response from{" "}
                    {sentInvitations[0]?.recipient?.name ||
                      selectedStudent?.student_name ||
                      "selected student"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleWithdraw(sentInvitations[0]?.id)}
                disabled={withdrawing}
                className={`w-full sm:w-auto group relative inline-flex items-center justify-center px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                  withdrawing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25"
                }`}
              >
                {withdrawing ? (
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
        ) : (
          <>
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
                    const hasSentInvite = sentInvitations.some(
                      (inv) => inv.recipient.id === student.id
                    );
                    const isLoading = sendingId === student.id;

                    return (
                      <div
                        key={student.id}
                        className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
                      >
                        {/* Info */}
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
                                Reg: {student.reg_number || "______"}
                              </span>
                              <span className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium border border-gray-200">
                                Dept: {student.department_name || "__________"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Invite button with loader */}
                        {/* Invite button with loader */}
                        <button
                          onClick={() => handleSendInvite(student.id)}
                          disabled={hasSentInvite || sendingId !== null}   // ✅ disable ALL buttons while sending
                          className={`w-full sm:w-auto sm:ml-4 inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                            hasSentInvite || sendingId !== null
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                          }`}
                        >
                          {sendingId === student.id ? ( // ✅ spinner only for the clicked one
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
                          ) : hasSentInvite ? (
                            "Invite Sent"
                          ) : (
                            "Send Invite"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery
                    ? "No matching students found"
                    : "No students available"}
                </div>
              )}
            </div>

            {/* Proceed Solo */}
            <button
              onClick={goSolo}
              className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 mt-4"
            >
              Proceed Solo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerManagement;