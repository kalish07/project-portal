import React, { useState, useEffect, useCallback } from "react";
import StatusCards from "../../components/Dashboard/StatusCards";
import TeamInfo from "../../components/Dashboard/TeamInfo";
import ProjectStatus from "../../components/Dashboard/ProjectStatus";
import InvitationsList from "../../components/Dashboard/InvitationsList";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import {
  getStudentProfile,
  getStudentProjects,
  getStudentInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../../api/studentApi";

const Dashboard = () => {
  const [loading, setLoading] = useState({
    profile: true,
    projects: true,
    invitations: true,
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [profile, setProfile] = useState(null);
  const [rawProjects, setRawProjects] = useState({});
  const [invitations, setInvitations] = useState([]);
  const [semester, setSemester] = useState(5);

  const showAlert = useCallback((type, message, duration = 5000) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), duration);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getStudentProfile();
      setProfile(data);
      setSemester(data.current_semester || 5);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, [showAlert]);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getStudentProjects();
      setRawProjects(data?.projects || {}); // response shape: { projects: { FYP: {...}, PT1: null, ... } }
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, [semester, showAlert]);

  const fetchInvitations = useCallback(async () => {
    try {
      const data = await getStudentInvitations();
      setInvitations(data);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, invitations: false }));
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (semester) {
      fetchProjects();
      fetchInvitations();
    }
  }, [semester, fetchProjects, fetchInvitations]);

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);
      showAlert("success", "Invitation accepted successfully");
      fetchInvitations();
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      await rejectInvitation(invitationId);
      showAlert("info", "Invitation rejected");
      fetchInvitations();
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  // ✅ Convert raw object to array for rendering
  const formattedProjects = Object.entries(rawProjects || {})
    .filter(([_, value]) => value && value.project)
    .map(([type, value]) => ({
      ...value,
      type,
    }));

  if (loading.profile) {
    return (
      <div className="p-4 md:p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 animate-fadeIn">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {profile?.student_name || "Student"}!
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Here's an overview of your project progress and recent activities
        </p>
      </div>

      {alert.show && (
        <div className="mb-4">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          />
        </div>
      )}

      {loading.projects || loading.invitations ? (
        <LoadingSpinner />
      ) : (
        <>
          <StatusCards
            projects={formattedProjects}
            invitations={invitations}
            semester={semester}
            profile={profile}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <TeamInfo
              team={profile?.team}
              profile={profile}
              loading={loading.profile}
            />
            <div className="lg:col-span-2">
              <ProjectStatus
                projects={formattedProjects}
                loading={loading.projects}
                semester={semester}
              />
            </div>
          </div>

          <InvitationsList
            invitations={invitations}
            loading={loading.invitations}
            onAccept={handleAcceptInvitation}
            onReject={handleRejectInvitation}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
