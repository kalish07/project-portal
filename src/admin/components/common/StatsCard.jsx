import React from 'react';

const StatsCard = ({ title, value, change = '', icon, color = 'indigo', loading = false }) => {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' }
  };

  const changeColor = change.includes('increase') ? 'text-green-500' :
                      change.includes('decrease') ? 'text-red-500' :
                      'text-yellow-500';

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-6 animate-pulse border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-200 p-4 rounded-full w-12 h-12" />
          <div className="text-right space-y-2">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 transition-transform transform hover:scale-105 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className={`${colorClasses?.[color]?.bg || 'bg-gray-100'} p-4 rounded-full`}>
          <i className={`${icon} ${colorClasses?.[color]?.text || 'text-gray-600'} text-2xl`}></i>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-extrabold text-gray-900">{value}</h2>
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center justify-end text-sm font-medium ${changeColor}`}>
          <i className={`fas ${change.includes('increase') ? 'fa-arrow-up' : change.includes('decrease') ? 'fa-arrow-down' : 'fa-equals'} mr-1`}></i>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatsCard;