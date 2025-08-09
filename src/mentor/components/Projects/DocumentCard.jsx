import React from "react";

const DocumentCard = ({ doc, handleDocAction }) => {
  return (
    <div
      className={`bg-${doc.color}-50 rounded-lg p-4 border border-${doc.color}-100`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 bg-${doc.color}-100 rounded-lg flex items-center justify-center`}
          >
            <i className={`${doc.icon} text-${doc.color}-600`}></i>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">{doc.title}</h3>
            <p className="text-sm text-gray-500">
              Submitted{" "}
              {doc.created_at
                ? new Date(doc.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "recently"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {doc.link_url && (
            <a
              href={doc.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors !rounded-button"
            >
              <i className="fas fa-eye mr-1"></i> View
            </a>
          )}
          <button
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors !rounded-button"
            onClick={() => handleDocAction(doc.title, true, doc.id)}
          >
            <i className="fas fa-check mr-1"></i> Approve
          </button>
          <button
            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors !rounded-button"
            onClick={() => handleDocAction(doc.title, false, doc.id)}
          >
            <i className="fas fa-times mr-1"></i> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
