import React from "react";

const InvitationListMobile = ({
  invitations = [],
  type = "incoming",
  onApprove,
  onReject,
  onWithdraw,
  acceptingInviteId = null,
  rejectingInviteId = null,
  withdrawingInviteId = null,
}) => {
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-6 pb-4 text-white">
        <h3 className="text-2xl font-bold mb-2">
          {type === "incoming" ? "Incoming Invitations" : "Sent Invitations"}
        </h3>
        <p className="text-indigo-100 text-sm">
          {type === "incoming"
            ? "Manage invitations sent to you"
            : "View invitations you sent"}
        </p>
      </div>

      <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
        {invitations.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-all duration-200"
              >
                {/* Avatar & Info */}
                <div className="flex items-center space-x-3 mb-3 sm:mb-0 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg font-semibold text-indigo-600">
                      {type === "incoming"
                        ? getInitials(inv.sender?.name)
                        : getInitials(inv.recipient?.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {type === "incoming" ? inv.sender?.name : inv.recipient?.name}
                    </p>
                    <p className="text-gray-600 text-xs truncate">
                      {type === "incoming" ? inv.sender?.email : inv.recipient?.email}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {type === "incoming" ? (
                    <>
                      {/* Approve Button */}
                      <button
                        onClick={() => onApprove(inv.id)}
                        disabled={acceptingInviteId === inv.id}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                          acceptingInviteId === inv.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {acceptingInviteId === inv.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white mx-auto"
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
                          "Approve"
                        )}
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => onReject(inv.id)}
                        disabled={rejectingInviteId === inv.id}
                        className={`w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-xl transition-all ${
                          rejectingInviteId === inv.id
                            ? "bg-gray-200 cursor-not-allowed text-gray-500"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {rejectingInviteId === inv.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-gray-600 mx-auto"
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
                          "Reject"
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onWithdraw(inv.id)}
                      disabled={withdrawingInviteId === inv.id}
                      className={`w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-all ${
                        withdrawingInviteId === inv.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {withdrawingInviteId === inv.id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white mx-auto"
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
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M6.938 21h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-500 mb-2">
              {type === "incoming" ? "No incoming invitations." : "No sent invitations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationListMobile;