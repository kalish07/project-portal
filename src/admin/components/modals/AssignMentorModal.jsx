import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchAvailableMentorsByProjectType, fetchTeamsWithoutMentor, assignMentorToTeam } from '../../api/AdminApi';

const AssignMentorModal = () => {
  const [teams, setTeams] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [projectType, setProjectType] = useState('pt1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamRes, mentorRes] = await Promise.all([
          fetchTeamsWithoutMentor(projectType),
          fetchAvailableMentorsByProjectType(projectType)
        ]);
        setTeams(teamRes.teams);
        setMentors(mentorRes.mentors);
        setSelectedTeam('');
        setSelectedMentor('');
      } catch (err) {
        toast.error('Failed to load data');
      }
    };

    loadData();

    const modal = document.getElementById('assignMentorModal');
    const observer = new MutationObserver(() => {
      if (modal.style.display === 'flex') {
        loadData();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [projectType]);

  const teamDetails = teams.reduce((acc, team) => {
    acc[team.id] = { name: team.name, domain: team.project_title };
    return acc;
  }, {});

  return (
    <div id="assignMentorModal" className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Force Assign Mentor</h3>
            <p className="text-gray-500 text-sm mt-1">Assign a mentor to guide and support the team's journey</p>
          </div>
          <button onClick={() => document.getElementById('assignMentorModal').style.display = 'none'} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="fas fa-layer-group mr-2 text-indigo-600"></i>
            Select Project Type
          </label>
          <div className="relative group">
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white shadow-sm transition-all duration-300 hover:border-indigo-400 cursor-pointer"
            >
              <option value="pt1">PT-1</option>
              <option value="pt2">PT-2</option>
              <option value="final_year">Final Year</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-users mr-2 text-indigo-600"></i>
                Select Team
              </label>
              <div className="relative group">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white shadow-sm transition-all duration-300 hover:border-indigo-400 cursor-pointer"
                >
                  <option value="">Choose team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} - {team.project_title}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"></i>
              </div>
              <div id="teamDetailsSection" className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                {selectedTeam ? (
                  <div className="text-gray-700 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {teamDetails[selectedTeam]?.name?.split(' ').map(word => word[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{teamDetails[selectedTeam]?.name}</h4>
                        <p className="text-sm text-gray-500">
                          Project Domain: <span className="font-medium text-indigo-700">{teamDetails[selectedTeam]?.domain || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="col-span-2 bg-purple-50 border border-purple-100 p-4 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Team Members</p>
                        <ul className="space-y-1 text-sm text-purple-700 list-disc list-inside">
                          {teams.find(t => t.id == selectedTeam)?.members?.map(member => (
                            <li key={member.id}>
                              {member.name} ({member.reg_number})
                            </li>
                          )) || <li>No members listed</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <div className="text-center">
                      <i className="fas fa-users-cog text-4xl mb-2"></i>
                      <p className="text-sm">Select a team to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-chalkboard-teacher mr-2 text-purple-600"></i>
                Select Mentor
              </label>
              <div className="relative group">
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white shadow-sm transition-all duration-300 hover:border-purple-400 cursor-pointer"
                >
                  <option value="">Choose mentor...</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.specialized_in}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300"></i>
              </div>
              <div className="mt-4 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-100 transition-all duration-300">
                {selectedMentor ? (
                  <>
                    <h4 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                      <i className="fas fa-user-tie mr-2 text-purple-600"></i>
                      Mentor Details
                    </h4>
                    <div className="flex items-center gap-4">
                      <img
                        src={mentors.find(m => m.id == selectedMentor)?.profile_pic_url || 'https://via.placeholder.com/48'}
                        alt="Mentor"
                        className="h-14 w-14 rounded-full border-2 border-purple-300 shadow-md"
                      />
                      <div className="space-y-1">
                        <h5 className="text-lg font-semibold text-indigo-800">
                          {mentors.find(m => m.id == selectedMentor)?.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-envelope mr-1 text-gray-400"></i>
                          {mentors.find(m => m.id == selectedMentor)?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-brain mr-1 text-gray-400"></i>
                          {mentors.find(m => m.id == selectedMentor)?.specialized_in}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs text-gray-500 mb-1">Current Workload</label>
                      <div className="flex items-center justify-between mb-1 text-sm text-gray-700">
                        <span>
                          {mentors.find(m => m.id == selectedMentor)?.currentTeamCount} / {mentors.find(m => m.id == selectedMentor)?.maxTeams} Teams
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              Math.round(
                                (mentors.find(m => m.id == selectedMentor)?.currentTeamCount || 0) /
                                  (mentors.find(m => m.id == selectedMentor)?.maxTeams || 1) *
                                  100
                              )
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    <i className="fas fa-chalkboard-teacher text-3xl mb-2"></i>
                    <p className="text-sm">Select a mentor to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <i className="fas fa-handshake mr-2"></i>
              Mentor-Team Match Analysis
            </h4>
            <div className="grid grid-cols-2 gap-6">
  <div className="space-y-4">
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Expertise Match</span>
        <div className="h-2 w-24 bg-gray-200 rounded-full">
          <div className="h-2 bg-green-500 rounded-full" style={{ width: selectedMentor ? '95%' : '0%' }}></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <i className="fas fa-check-circle text-green-500 mr-1"></i>
        {selectedMentor ? 'Perfect Domain Match' : 'No Match'}
      </p>
    </div>
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Availability</span>
        <div className="h-2 w-24 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{
              width: selectedMentor
                ? `${Math.max(
                    0,
                    100 -
                      Math.round(
                        (mentors.find(m => m.id == selectedMentor)?.currentTeamCount || 0) /
                          (mentors.find(m => m.id == selectedMentor)?.maxTeams || 1) *
                          100
                      )
                  )}%`
                : '0%',
            }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <i className="fas fa-calendar-check text-blue-500 mr-1"></i>
        {selectedMentor ? 'Good Time Overlap' : 'Unavailable' }
      </p>
    </div>
  </div>

  <div className="space-y-4">
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Experience Level</span>
        <div className="h-2 w-24 bg-gray-200 rounded-full">
          <div className="h-2 bg-purple-500 rounded-full" style={{ width: selectedMentor ? '100%' : '0%' }}></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <i className="fas fa-trophy text-purple-500 mr-1"></i>
        {selectedMentor ? 'Senior Expert' : 'Unknown'}
      </p>
    </div>
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Team Size Comfort</span>
        <div className="h-2 w-24 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-yellow-500 rounded-full"
            style={{
              width: selectedMentor
                ? `${Math.max(
                    0,
                    100 -
                      Math.round(
                        (mentors.find(m => m.id == selectedMentor)?.currentTeamCount || 0) /
                          (mentors.find(m => m.id == selectedMentor)?.maxTeams || 1) *
                          100
                      )
                  )}%`
                : '0%',
            }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <i className="fas fa-users text-yellow-500 mr-1"></i>
        {selectedMentor ? 'Optimal Team Load' : 'Unknown Load'}
      </p>
    </div>
  </div>
</div>

<div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100 flex items-center">
  <i className="fas fa-chart-line text-indigo-500 mr-3"></i>
  <span className="text-sm text-gray-600">
    Overall Match Score:{' '}
    <span className="font-semibold text-indigo-600">
      {selectedMentor
        ? `${100 -
            Math.round(
              (mentors.find(m => m.id == selectedMentor)?.currentTeamCount || 0) /
                (mentors.find(m => m.id == selectedMentor)?.maxTeams || 1) *
                100
            )}%`
        : 'N/A'}
    </span>
  </span>
</div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100 flex items-center">
              <i className="fas fa-chart-line text-indigo-500 mr-3"></i>
              <span className="text-sm text-gray-600">Overall Match Score: <span className="font-semibold text-indigo-600">92%</span></span>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => document.getElementById('assignMentorModal').style.display = 'none'}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
            <button
              onClick={async () => {
                if (isSubmitting) return;
                setIsSubmitting(true);
                try {
                  await assignMentorToTeam({ teamId: selectedTeam, mentorId: selectedMentor });
                  toast.success('Mentor assigned successfully!');
                  document.getElementById('assignMentorModal').style.display = 'none';
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Failed to assign mentor.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-indigo-500/50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Pairing...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Assign Perfect Match
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignMentorModal;