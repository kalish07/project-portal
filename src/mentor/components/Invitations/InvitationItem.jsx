import React from "react";

const InvitationItem = ({ invitation, handleInvitationResponse }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-md">
      <div>
        <h3 className="font-medium text-gray-800">
          {invitation.teamName || "Team"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Invited by {invitation.invitedBy || "Unknown"} on{" "}
          {new Date(invitation.date || Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
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
  );
};

export default InvitationItem;
