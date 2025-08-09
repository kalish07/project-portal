// === Updated InvitationsList.js ===
import React from "react";

const InvitationsList = ({ invitations, loading, onAccept, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Incoming Partner Invitations
      </h3>
      {loading ? (
        <p className="text-center text-gray-500 py-4">Loading...</p>
      ) : invitations.length > 0 ? (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">{inv.sender.name}</p>
                <p className="text-gray-600 text-sm">{inv.sender.email}</p>
                <div className="flex flex-wrap mt-2">
                  {(inv.sender.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAccept(inv.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(inv.id)}
                  className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No incoming invitations.</p>
      )}
    </div>
  );
};

export default InvitationsList;
