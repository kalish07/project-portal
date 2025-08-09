import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { unassignTeam, fetchAvailableMentorsByProjectType, changeMentorForTeam } from "../../api/AdminApi";

const TeamCard = ({ team, onDelete, onMentorChanged }) => {
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [assignError, setAssignError] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [availableMentors, setAvailableMentors] = useState([]);
  const [mentorLoading, setMentorLoading] = useState(false);

  const getProjectType = () => {
    return team.type || null;
  };

    useEffect(() => {
      const loadMentors = async () => {
        const projectType = getProjectType();
        console.log("Triggered mentor modal:", showMentorModal);
        console.log("Team type:", team.type);
        console.log("Derived project type:", projectType);

        if (showMentorModal && projectType) {
          setMentorLoading(true);
          try {
            const mentorsResponse = await fetchAvailableMentorsByProjectType(projectType);
            const mentorList = Array.isArray(mentorsResponse.mentors) ? mentorsResponse.mentors : [];
            console.log("Fetched mentors:", mentorList);
            setAvailableMentors(mentorList);
          } catch (err) {
            console.error("Failed to fetch mentors:", err.message);
          } finally {
            setMentorLoading(false);
          }
        } else {
          console.log("Skipping mentor fetch due to invalid state.");
        }
      };

      loadMentors();
    }, [showMentorModal, team.type]);

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await unassignTeam(team.id, {
        removeStudent1: true,
        removeStudent2: true,
        removeMentor: true,
      });
      if (onDelete) onDelete(team, true);
    } catch (err) {
      console.error("Failed to unassign team:", err.message);
      setShowDeleteError(true);
      setTimeout(() => setShowDeleteError(false), 3000);
      if (onDelete) onDelete(team, false);
    }
  };

  const formattedCreated = new Date(team.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedActivity = formatDistanceToNow(new Date(team.lastActivity), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Created {formattedCreated}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Team Members
            </h4>
            <div className="space-y-2">
              {team.members.map((member, index) => (
                <div key={index} className="flex items-center group">
                  <div
                    className={`h-10 w-10 rounded-full bg-${member?.color || 'gray'}-100 border-2 border-white flex items-center justify-center text-${member?.color || 'gray'}-800 font-medium transform transition-all duration-300 group-hover:scale-110`}
                  >
                    {member?.initials || 'NA'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {member.id} • {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Assigned Mentor
            </h4>
            <div className="flex items-center">
              <div
                className={`h-10 w-10 rounded-full bg-${team.mentor?.color || 'gray'}-100 border-2 border-white flex items-center justify-center text-${team.mentor?.color || 'gray'}-800 font-medium`}
              >
                {team.mentor?.initials || 'NA'}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{team.mentor?.name || 'Unassigned'}</p>
                <p className="text-xs text-gray-500">
                  {team.mentor?.teams != null ? `${team.mentor.teams} teams assigned` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2"></i>
              <span className="text-gray-600">
                Last activity: {formattedActivity}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-tasks text-gray-400 mr-2"></i>
              <span className="text-gray-600">
                Project progress: {team.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
        <div className="flex gap-3">
          <button
            className="text-gray-600 hover:text-gray-800 text-sm font-medium transform hover:scale-105 transition-all duration-300"
            onClick={() => setShowMentorModal(true)}
          >
            <i className="fas fa-user-plus mr-1"></i>
            Change Mentor
          </button>
          {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transform hover:scale-105 transition-all duration-300">
            <i className="fas fa-eye mr-1"></i>
            View Details
          </button> */}
        </div>
        <button
          className="text-red-600 hover:text-red-800 text-sm font-medium transform hover:scale-105 transition-all duration-300"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <i className="fas fa-trash-alt mr-1"></i>
          Delete
        </button>
      </div>

      {showMentorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Reassign Mentor</h2>
            {mentorLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2 animate-pulse">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300" />
                      <div className="ml-3 space-y-1">
                        <div className="h-3 w-32 bg-gray-300 rounded" />
                        <div className="h-2 w-48 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-12 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            ) : Array.isArray(availableMentors) && availableMentors.length > 0 ? (
              <div className="max-h-60 overflow-y-auto pr-2">
                {availableMentors.map((mentor, idx) => {
                  const initials = mentor.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase();
                  return (
                  <div
                    key={idx}
                    className="flex items-center justify-between hover:bg-gray-50 px-4 py-2 rounded cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold"
                      >
                        {mentor.name
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{mentor.name}</p>
                        <p className="text-xs text-gray-500">
                          Specialized in {mentor.specialized_in || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Currently guiding {mentor.currentTeamCount ?? 0} / {mentor.maxTeams ?? 0} teams
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-indigo-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setShowAssignConfirm(true);
                      }}
                    >
                      Assign
                    </button>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">No available mentors</p>
            )}
            <div className="text-right mt-4">
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowMentorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this team?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Assignment</h2>
            <p className="text-sm text-gray-600 mb-6">
              Assign {selectedMentor?.name} to this team?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowAssignConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={async () => {
                  setShowAssignConfirm(false);
                  setShowMentorModal(false);
                  setLoading(true);
                  try {
                    await changeMentorForTeam(team.id, selectedMentor.id);
                    setShowSuccessAnimation(true);
                    if (onMentorChanged) onMentorChanged();
                    setTimeout(() => setShowSuccessAnimation(false), 3000);
                  } catch (err) {
                    console.error("Failed to change mentor:", err.message);
                    setAssignError(true);
                    setTimeout(() => setAssignError(false), 3000);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded shadow-lg animate-bounce">
            Mentor reassigned successfully!
          </div>
        </div>
      )}
      {assignError && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-3 rounded shadow-lg animate-bounce">
            Failed to reassign mentor. Please try again.
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <span className="text-gray-700 font-medium">Reassigning mentor...</span>
            <div className="mt-2 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
