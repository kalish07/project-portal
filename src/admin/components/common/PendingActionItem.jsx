import React from 'react';

const PendingActionItem = ({ icon, title, buttonText }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <i className={`fas ${icon} text-indigo-500 mr-3`}></i>
        <span className="text-sm">{title}</span>
      </div>
      <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap">
        {buttonText}
      </button>
    </div>
  );
};

export default PendingActionItem;