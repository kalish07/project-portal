import React from 'react';
import { useStats } from '../../context/StatsContext';

const ProjectStats = () => {
  const { stats, loading } = useStats();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-100 rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-300 h-10 w-10 rounded-lg"></div>
              <div className="h-4 w-20 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-6 w-16 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}  
      </div>
    );
  }

  const statsData = [
    {
      title: 'Active Projects',
      value: stats.activeProjects || 0,
      description: 'Current Semester',
      change: `${stats.activeProjects > 40 ? '15% increase from last semester' : 'Stable'}`,
      icon: 'fas fa-file-alt',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Submissions Approved',
      value: stats.submissionsApproved || 0,
      description: 'This Week',
      change: `${stats.submissionsApproved > 10 ? '8% increase from last week' : 'Stable'}`,
      icon: 'fas fa-check-circle',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews || 0,
      description: 'Unreviewed Submissions',
      change: `${stats.pendingReviews > 5 ? '3 added today' : 'On track'}`,
      icon: 'fas fa-hourglass-half',
      gradient: 'from-yellow-500 to-rose-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-lg p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <i className={`${stat.icon} text-2xl`}></i>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stat.description}</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
          <p className="text-white/80 text-sm">{stat.title}</p>
          <div className="mt-4 flex items-center text-sm">
            <i className={`fas ${stat.change.includes('increase') ? 'fa-arrow-up' : stat.change.includes('critical') ? 'fa-exclamation-circle' : 'fa-arrow-down'} mr-1`}></i>
            <span>{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;