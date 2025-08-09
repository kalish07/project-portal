import React from 'react';

const RecentActivityItem = ({ icon, color, title, description, time }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="flex items-start">
      <div className={`${colorClasses[color]} p-2 rounded-full mr-4`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default RecentActivityItem;