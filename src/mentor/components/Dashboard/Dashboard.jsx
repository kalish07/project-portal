import React, { useEffect, useState } from "react";
import {
  fetchPendingInvites,
  fetchTeams,
  respondToInvitation,
} from "../../api/mentorApi";
import WorkloadChart from "./WorkloadChart";

const Dashboard = () => {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [mentorName, setMentorName] = useState("Mentor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invites, teamsData] = await Promise.all([
          fetchPendingInvites(),
          fetchTeams(),
        ]);

        setPendingInvitations(invites);
        setTeams(teamsData);

        const nameFromCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("mentorName="))
          ?.split("=")[1];
        setMentorName(nameFromCookie || "Mentor");
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInvitationResponse = async (id, accepted) => {
    try {
      await respondToInvitation(id, accepted ? "accept" : "decline");
      setPendingInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error("Failed to respond to invitation:", err);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {mentorName}! Here's what's happening today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-sm text-gray-500">
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invitations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Invitations
            </h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {pendingInvitations.length} New
            </span>
          </div>

          {pendingInvitations.length > 0 ? (
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-md"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {invitation.members.map((m) => m.name).join(", ") || "Team"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {invitation.members.map((m) => m.department).join(" & ")}
                    </p>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0 space-x-3">
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-check text-gray-400 text-xl"></i>
              </div>
              <h3 className="text-gray-800 font-medium">
                No pending invitations
              </h3>
              <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <WorkloadChart />
        </div>

        {/* My Teams */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">My Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    {team.members.map((m) => m.student_name).join(", ")}
                  </h3>
                  <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-indigo-600"></i>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {team.members.map((m) => `${m.student_name} (${m.reg_number})`).join(", ")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {team.members.map((m) => m.department_name).join(" & ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
