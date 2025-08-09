import React from "react";

const InvitationList = ({ pendingInvitations, handleInvitationResponse }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Invitations
        </h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          {pendingInvitations.length} New
        </span>
      </div>
      {pendingInvitations.length > 0 ? (
        <div className="space-y-4">
          {pendingInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-md"
            >
              <div>
                <h3 className="font-medium text-gray-800">
                  {invitation.teamName || "Team"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Invited by {invitation.invitedBy || "Unknown"} on{" "}
                  {new Date(invitation.date || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="flex items-center mt-4 md:mt-0 space-x-3">
                <button
                  onClick={() => handleInvitationResponse(invitation.id, false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 !rounded-button cursor-pointer whitespace-nowrap"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleInvitationResponse(invitation.id, true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 !rounded-button cursor-pointer whitespace-nowrap"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-check text-gray-400 text-xl"></i>
          </div>
          <h3 className="text-gray-800 font-medium">No pending invitations</h3>
          <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default InvitationList;
