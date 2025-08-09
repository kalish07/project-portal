import React, { useState, useEffect } from 'react';
import { useStats } from '../../context/StatsContext';
import ForcePairModal from '../modals/ForcePairModal';
import AssignMentorModal from '../modals/AssignMentorModal';
import TeamCard from './TeamCard';
import { fetchAllTeamsWithProgress } from '../../api/AdminApi';

const generateInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const fallbackColor = (index) => {
  const colors = ['indigo', 'purple', 'emerald', 'teal', 'amber', 'blue', 'cyan', 'lime', 'rose', 'violet', 'gray'];
  return colors[index % colors.length];
};

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');
  const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);

  const { stats, loading: statsLoading } = useStats();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const res = await fetchAllTeamsWithProgress();
        const allTeams = [
          ...res.teams.pt1.map(t => ({ ...t, projectType: 'PT-1' })),
          ...res.teams.pt2.map(t => ({ ...t, projectType: 'PT-2' })),
          ...res.teams.final_year.map(t => ({ ...t, projectType: 'Final Year' })),
        ];

        // Enhance members and mentor with initials and colors
        const enhancedTeams = allTeams.map(team => ({
          ...team,
          members: team.members.map(m => ({
            ...m,
            initials: generateInitials(m.name),
            color: fallbackColor(m.name.length),
          })),
          mentor: team.mentor ? {
            ...team.mentor,
            initials: generateInitials(team.mentor.name),
            color: fallbackColor(team.mentor.name.length),
          } : null,
        }));

        setTeams(enhancedTeams);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setError('Failed to load team data.');
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-6 shadow animate-pulse border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-300 h-10 w-10 rounded-lg" />
              <div className="bg-gray-300 h-4 w-16 rounded-full" />
            </div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  const handleDeleteTeam = (team, isSuccess) => {
    if (isSuccess) {
      setTeams(prev => prev.filter(t => t.id !== team.id));
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
    } else {
      setShowDeleteError(true);
      setTimeout(() => setShowDeleteError(false), 3000);
    }
  };

  const filteredTeams = teams.filter((team) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      team.id.toString().includes(query) ||
      (team.name && team.name.toLowerCase().includes(query)) ||
      (team.mentor && team.mentor.name && team.mentor.name.toLowerCase().includes(query)) ||
      (team.members && team.members.some(member =>
        member.name.toLowerCase().includes(query) ||
        member.id?.toString().toLowerCase().includes(query)
      ))
    );

    const matchesProjectType =
      projectTypeFilter === 'All' || team.projectType === projectTypeFilter;

    return matchesSearch && matchesProjectType;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Team Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => document.getElementById('forcePairModal').style.display = 'flex'}
            className="bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded-md flex items-center shadow-lg hover:shadow-indigo-500/50"
          >
            <i className="fas fa-users-cog mr-2"></i>
            Force Team Pairing
          </button>
          <button
            onClick={() => document.getElementById('assignMentorModal').style.display = 'flex'}
            className="bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded-md flex items-center shadow-lg hover:shadow-purple-500/50"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Force Assign Mentor
          </button>
        </div>
      </div>
  
      <ForcePairModal />
      <AssignMentorModal />
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Last 24h</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats?.activeTeams ?? '...'}</h3>
          <p className="text-white/80 text-sm">Active Teams</p>
          <div className="mt-4 flex items-center text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>12% increase</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <i className="fas fa-user-graduate text-2xl"></i>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Current</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats?.unassignedStudents ?? '...'}</h3>
          <p className="text-white/80 text-sm">Unassigned Students</p>
          <div className="mt-4 flex items-center text-sm">
            <i className="fas fa-arrow-down mr-1"></i>
            <span>8% decrease</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <i className="fas fa-chalkboard-teacher text-2xl"></i>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Available</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats?.availableMentors ?? '...'}</h3>
          <p className="text-white/80 text-sm">Available Mentors</p>
          <div className="mt-4 flex items-center text-sm">
            <i className="fas fa-equals mr-1"></i>
            <span>Stable</span>
          </div>
        </div>
      </div>
  
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search teams, students or mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <button
                className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center justify-between w-full md:w-auto"
                onClick={() => setShowProjectTypeDropdown(!showProjectTypeDropdown)}
              >
                <span>{projectTypeFilter === 'All' ? 'Project Type' : projectTypeFilter}</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              {showProjectTypeDropdown && (
                <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                  {['All', 'PT-1', 'PT-2', 'Final Year'].map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setProjectTypeFilter(type);
                        setShowProjectTypeDropdown(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center justify-between w-full md:w-auto">
                <span>Mentor Load</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
            <button className="bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
              <i className="fas fa-filter mr-2"></i>
              More Filters
            </button>
          </div>
        </div>
      </div>
  
      {/* 👇 Render content based on loading/error/final data */}
      {loading ? (
        <p className="text-center text-gray-500 py-10 text-sm">Loading teams...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredTeams.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No matching teams found.</p>
          ) : (
            filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onDelete={handleDeleteTeam} />
            ))
          )}
        </div>
      )}
  
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
            2
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
  
      {(showDeleteSuccess || showDeleteError) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center pointer-events-auto">
          <div
            className={`${
              showDeleteSuccess
                ? 'bg-green-100 border-green-400 text-green-800'
                : 'bg-red-100 border-red-400 text-red-800'
            } border px-6 py-3 rounded shadow-lg animate-bounce`}
          >
            {showDeleteSuccess
              ? 'Team deleted successfully!'
              : 'Failed to delete team. Please try again.'}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
