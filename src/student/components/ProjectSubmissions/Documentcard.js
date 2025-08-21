import React, { useState, useEffect } from 'react';

const DocumentCard = ({
  doc,
  isLocked,
  documentLinks,
  onLinkChange,
  onLinkSubmit,
  isEmpty,
  isSubmitting,
}) => {
  const [linkError, setLinkError] = useState(null);
  const [isValidLink, setIsValidLink] = useState(false);

  // Validate Google Drive link
  const isValidGoogleDriveLink = (url) => {
    if (!url) return false;
    
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      
      // Validate it's a Google Drive domain
      if (!hostname.includes('drive.google.com')) {
        return false;
      }
      
      // Additional validation for Google Drive URL patterns
      const path = parsedUrl.pathname;
      
      // Common Google Drive URL patterns:
      // - File: /file/d/{fileId}/...
      // - Folder: /drive/folders/{folderId}
      // - Open: /open?id={fileId}
      const isValidPattern = 
        path.includes('/file/d/') ||
        path.includes('/drive/folders/') ||
        (path === '/open' && parsedUrl.searchParams.has('id'));
      
      return isValidPattern;
    } catch (error) {
      return false; // Invalid URL format
    }
  };

  // Validate link when it changes
  useEffect(() => {
    const link = documentLinks[doc.id];
    if (link) {
      if (isValidGoogleDriveLink(link)) {
        setLinkError(null);
        setIsValidLink(true);
      } else {
        setLinkError('Please enter a valid Google Drive link');
        setIsValidLink(false);
      }
    } else {
      setLinkError(null);
      setIsValidLink(false);
    }
  }, [documentLinks[doc.id], doc.id]);

  const getStatusColor = () => {
    if (isEmpty) return 'bg-gray-100 text-gray-800';
    switch (doc.state) {
      case 'Draft': return 'bg-gray-200 text-gray-800';
      case 'In Review': return 'bg-yellow-100 text-yellow-800';
      case 'Changes Requested': return 'bg-orange-100 text-orange-800';
      case 'Approved': 
      case 'Submitted': 
        return 'bg-green-100 text-green-800';
      case 'Not Submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDocumentIcon = () => {
    switch (doc.type) {
      case 'Abstract': return 'fa-file-alt text-purple-700';
      case 'Report': return 'fa-file-word text-blue-700';
      case 'Slide Deck': return 'fa-file-powerpoint text-indigo-700';
      case 'Demo Video': return 'fa-file-video text-red-700';
      default: return 'fa-file text-gray-700';
    }
  };

  const getStatusBarColor = () => {
    if (isEmpty) return 'bg-gray-300';
    switch (doc.state) {
      case 'Draft': return 'bg-gray-400';
      case 'In Review': return 'bg-yellow-400';
      case 'Changes Requested': return 'bg-orange-400';
      case 'Approved': 
      case 'Submitted': 
        return 'bg-green-400';
      case 'Not Submitted': return 'bg-gray-300';
      default: return 'bg-blue-400';
    }
  };

  const handleInputChange = (e) => {
    onLinkChange(doc.id, e.target.value);
  };

  const handleSubmit = () => {
    if (isValidLink) {
      onLinkSubmit();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-60' : ''} w-full max-w-md mx-auto`}>
      {/* Status bar */}
      <div className={`h-2 ${getStatusBarColor()}`}></div>

      <div className="p-4 sm:p-6 flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{doc.type}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>{doc.state}</span>
              {doc.state !== 'Not Submitted' && <span className="text-xs text-gray-500">v{doc.version}</span>}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
            <i className={`fas ${getDocumentIcon()} text-lg`}></i>
          </div>
        </div>

        {/* Document Link Display */}
        {doc.link && (
          <div className="text-sm break-words">
            <span className="font-medium text-gray-700">Link: </span>
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {doc.link.length > 40 ? `${doc.link.substring(0, 40)}...` : doc.link}
            </a>
          </div>
        )}

        {/* Submission Form - Show if document hasn't been submitted yet or needs resubmission */}
        {(doc.state === 'Not Submitted' || doc.state === 'Changes Requested') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {doc.state === 'Changes Requested' ? 'Resubmit Document' : 'Submit Document'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={documentLinks[doc.id] || ''}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/..."
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 ${
                  linkError ? 'border-red-500' : isValidLink ? 'border-green-500' : 'border-gray-300'
                }`}
                disabled={isLocked}
              />
              <button
                onClick={handleSubmit}
                disabled={isLocked || !documentLinks[doc.id] || isSubmitting || !isValidLink}
                className={`px-4 py-2 rounded-md text-sm flex items-center justify-center ${
                  isLocked || !documentLinks[doc.id] || isSubmitting || !isValidLink
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
            
            {/* Validation messages */}
            {linkError && (
              <p className="mt-1 text-xs text-red-500">{linkError}</p>
            )}
            {isValidLink && (
              <p className="mt-1 text-xs text-green-500">✓ Valid Google Drive link</p>
            )}
            {!linkError && !isValidLink && documentLinks[doc.id] && (
              <p className="mt-1 text-xs text-gray-500">Only Google Drive links are accepted</p>
            )}
            {!documentLinks[doc.id] && (
              <p className="mt-1 text-xs text-gray-500">Enter a Google Drive link to submit</p>
            )}
          </div>
        )}

        {/* Success message */}
        {doc.state === 'Submitted' && (
          <div className="bg-green-50 text-green-700 p-2 rounded text-sm">
            <i className="fas fa-check-circle mr-1"></i> Document successfully submitted
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;