import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import StatsCard from '../common/StatsCard';
import EnrollmentChart from './EnrollmentChart';
import ProjectStatusChart from './ProjectStatusChart';
import RecentActivityItem from '../common/RecentActivityItem';
import PendingActionItem from '../common/PendingActionItem';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useStats } from "../../context/StatsContext";
import StudentsOverview from "../overview/StudentOverview";
import MentorsOverview from "../overview/MentorsOverview";

const Dashboard = () => {
  useEffect(() => {
    const studentChart = echarts.init(document.getElementById('studentChart'));
    const projectChart = echarts.init(document.getElementById('projectChart'));

    const studentOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      yAxis: { type: 'value' },
      series: [{
        data: [25, 40, 45, 50, 65, 80],
        type: 'line',
        smooth: true,
        color: '#4F46E5'
      }]
    };

    const projectOption = {
      animation: false,
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 10, top: 'center' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 35, name: 'Completed' },
          { value: 25, name: 'In Progress' },
          { value: 15, name: 'Pending' },
          { value: 10, name: 'Rejected' }
        ],
        color: ['#10B981', '#4F46E5', '#F59E0B', '#EF4444']
      }]
    };

    studentChart.setOption(studentOption);
    projectChart.setOption(projectOption);

    return () => {
      studentChart.dispose();
      projectChart.dispose();
    };
  }, []);


  const { stats, loading } = useStats();

  const statCards = stats ? [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: 'fas fa-user-graduate',
      color: 'indigo',
    },
    {
      title: 'Total Mentors',
      value: stats.totalMentors,
      icon: 'fas fa-chalkboard-teacher',
      color: 'purple',
    },
    {
      title: 'Active Teams',
      value: stats.activeTeams,
      icon: 'fas fa-users',
      color: 'blue',
    },
    {
      title: 'Project Submissions',
      value: stats.projectSubmissions,
      icon: 'fas fa-file-alt',
      color: 'green',
    },
  ] : [];

  const recentActivities = [
    { icon: 'fa-user-plus', color: 'green', title: 'New student registered', description: 'Emma Wilson joined CS 401', time: '2 hours ago' },
    { icon: 'fa-file-upload', color: 'blue', title: 'Project submission', description: 'Team Alpha submitted final report', time: '5 hours ago' },
    { icon: 'fa-user-tie', color: 'purple', title: 'New mentor assigned', description: 'Dr. Robert Chen assigned to Team Beta', time: 'Yesterday' },
    { icon: 'fa-exclamation-triangle', color: 'yellow', title: 'Deadline approaching', description: 'Abstract submission due in 2 days', time: 'Yesterday' }
  ];

  const pendingActions = [
    { icon: 'fa-user-check', title: 'Approve 3 new student registrations', buttonText: 'Review' },
    { icon: 'fa-file-alt', title: 'Review 5 project submissions', buttonText: 'Review' },
    { icon: 'fa-users', title: 'Assign mentors to 2 teams', buttonText: 'Assign' },
    { icon: 'fa-calendar-alt', title: 'Update project deadline', buttonText: 'Update' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array(4).fill().map((_, idx) => (
            <div key={idx} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))
        ) : (
          statCards.map((stat, index) => <StatsCard key={index} {...stat} />)
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <EnrollmentChart />
        <ProjectStatusChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentsOverview />
        <MentorsOverview />
      </div>
    </div>
  );
};

export default Dashboard;