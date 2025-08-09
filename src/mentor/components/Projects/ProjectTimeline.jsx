import React from "react";

const colorMap = {
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-600",
    iconBg: "bg-red-100",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    iconBg: "bg-green-100",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-100",
    text: "text-gray-600",
    iconBg: "bg-gray-100",
  },
};

const ProjectTimeline = ({ projectDocs, handleDocAction, isIdeaApproved }) => {
  // Filter out abstract documents
  const filteredDocs = projectDocs.filter(doc => doc.key !== "ABSTRACT");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Project Timeline</h2>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <i className="fas fa-list-ul"></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors">
              <i className="fas fa-th"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => {
            const colorKey = doc.link_url ? doc.color || "gray" : "gray";
            const colors = colorMap[colorKey] || colorMap.gray;

            return (
              <div
                key={doc.id}
                className={`${colors.bg} ${colors.border} rounded-lg p-4 flex items-center justify-between`}
              >
                <div className="flex items-center">
                  <div className={`${colors.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <i className={`${doc.icon} ${colors.text}`}></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.link_url ? (
                        <>
                          Submitted{" "}
                          {new Date(doc.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </>
                      ) : (
                        "No submission yet."
                      )}
                    </p>
                  </div>
                </div>

                {isIdeaApproved && doc.link_url && (
                  <div className="flex items-center space-x-2">
                    <a
                      href={doc.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      <i className="fas fa-eye mr-1"></i> View
                    </a>
                    <button
                      onClick={() => handleDocAction(doc.title, false, doc.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                    >
                      <i className="fas fa-times mr-1"></i> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 text-center flex flex-col items-center">
            <i className="text-3xl mb-3 fas fa-folder-open text-gray-200"></i>
            <h3 className="font-medium text-gray-400">No Documents</h3>
            <p className="text-gray-400 text-sm mt-1">No submission yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;