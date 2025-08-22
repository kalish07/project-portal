import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { fetchUserTeams } from "../../api/inviteCenterApi"; 

const Dashboard = () => {
  const [loading, setLoading] = useState({
    profile: true,
    projects: true,
    invitations: true,
    team: true, // added team loading
  });
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [profile, setProfile] = useState(null);
  const [rawProjects, setRawProjects] = useState({});
  const [invitations, setInvitations] = useState([]);
  const [semester, setSemester] = useState(5);
  const [cardHeight, setCardHeight] = useState(null);
  const [teamData, setTeamData] = useState(null); // ✅ team state

  const teamRef = useRef(null);
  const projectRef = useRef(null);

  const showAlert = useCallback((type, message, duration = 5000) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), duration);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getStudentProfile();
      setProfile(data);
      setSemester(data.current_semester || 5);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [showAlert]);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getStudentProjects();
      setRawProjects(data?.projects || {});
    } catch (error) {
      showAlert("error", "No projects found for this semester");
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  }, [showAlert]);

  const fetchInvitations = useCallback(async () => {
    try {
      const response = await getStudentInvitations();
      const incoming = response?.data?.incomingInvitations || [];
      setInvitations(incoming);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(prev => ({ ...prev, invitations: false }));
    }
  }, [showAlert]);

  // ✅ fetch team using new API
  const fetchTeam = useCallback(async () => {
    try {
      const response = await fetchUserTeams();
      const userTeam = response.teams?.[0]; // assuming first team for current semester
      if (userTeam) {
        const members = [
          {
            ...userTeam.Student1,
            id: userTeam.student1_id,
            isCurrentUser: userTeam.student1_id === profile?.id,
          },
          userTeam.Student2
            ? {
                ...userTeam.Student2,
                id: userTeam.student2_id,
                isCurrentUser: userTeam.student2_id === profile?.id,
              }
            : null,
        ].filter(Boolean);

        const mentorData = userTeam.Mentor
          ? {
              name: userTeam.Mentor.name,
              email: userTeam.Mentor.email,
              profile_pic_url: userTeam.Mentor.profile_pic_url,
            }
          : null;

        setTeamData({ ...userTeam, members, mentor: mentorData });
      } else {
        setTeamData(null);
      }
    } catch (error) {
      showAlert("error", "Failed to fetch your team");
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  }, [profile, showAlert]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (semester) {
      fetchProjects();
      fetchInvitations();
      fetchTeam(); // ✅ fetch team once semester/profile is ready
    }
  }, [semester, fetchProjects, fetchInvitations, fetchTeam]);

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);
      showAlert("success", "Invitation accepted successfully");
      fetchInvitations();
      fetchTeam(); // refresh team after accepting invitation
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

  const formattedProjects = Object.entries(rawProjects || {})
    .filter(([_, value]) => value && value.project)
    .map(([type, value]) => ({ ...value, type }));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        const teamHeight = teamRef.current?.offsetHeight || 0;
        const projectHeight = projectRef.current?.offsetHeight || 0;
        setCardHeight(Math.max(teamHeight, projectHeight));
      } else {
        setCardHeight(null);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [teamData, formattedProjects]);

  if (loading.profile || loading.team) {
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
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
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

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8">
            <div className="lg:w-1/3 flex-shrink-0" ref={teamRef}>
              <TeamInfo team={teamData} cardHeight={cardHeight} />
            </div>

            <div className="lg:w-2/3 flex-1" ref={projectRef}>
              <ProjectStatus
                projects={formattedProjects}
                semester={semester}
                cardHeight={cardHeight}
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