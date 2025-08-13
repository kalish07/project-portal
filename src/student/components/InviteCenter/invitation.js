import React from "react";

const InvitationListMobile = ({ invitations = [], type = "incoming", onApprove, onReject, onWithdraw }) => {
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
                <div className="flex items-center space-x-3 mb-3 sm:mb-0 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg font-semibold text-indigo-600">
                      {type === "incoming"
                        ? inv.sender?.name?.split(" ").map(w => w[0]).join("").slice(0, 2)
                        : inv.recipient?.name?.split(" ").map(w => w[0]).join("").slice(0, 2)}
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

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {type === "incoming" ? (
                    <>
                      <button
                        onClick={() => onApprove(inv.id)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(inv.id)}
                        className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onWithdraw(inv.id)}
                      className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-all"
                    >
                      Withdraw
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