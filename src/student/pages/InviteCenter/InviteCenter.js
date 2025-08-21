import React, { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import PartnerManagement from "../../components/InviteCenter/PartnerManagement";
import MentorManagement from "../../components/InviteCenter/MentorManagement";
import PartnerDetails from "../../components/InviteCenter/PartnerDetails";
import ConfirmationModal from "../../components/InviteCenter/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import InvitationListMobile from "../../components/InviteCenter/invitation";
import {
  fetchPartnerCandidates,
  fetchMentors,
  fetchAllInvitations,
  sendPartnerInvite,
  acceptPartnerInvite,
  rejectPartnerInvite,
  requestMentor,
  withdrawMentorRequest,
  fetchUserTeams,
  withdrawPartnerInvite
} from "../../api/inviteCenterApi";

const InviteCenter = () => {
  const [inviteTab, setInviteTab] = useState("find");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [inviteStatus, setInviteStatus] = useState("none");
  const [mentorRequestStatus, setMentorRequestStatus] = useState("none");
  const [mentorSearchQuery, setMentorSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [teamMate, setTeamMate] = useState(null);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState({ students: true, mentors: true, invites: true, teams: true });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const [invitations, setInvitations] = useState({ sent: [], incoming: [] });
  const [inviteToConfirm, setInviteToConfirm] = useState(null);
  const [inviteToReject, setInviteToReject] = useState(null);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  const [mobileView, setMobileView] = useState("partner"); // partner | mentor
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const [acceptingInviteId, setAcceptingInviteId] = useState(null);
  const [rejectingInviteId, setRejectingInviteId] = useState(null);
  const [withdrawingInviteId, setWithdrawingInviteId] = useState(null);

  const [requestingMentorId, setRequestingMentorId] = useState(null);
  const [withdrawingMentorId, setWithdrawingMentorId] = useState(null); 

  const userId = Cookies.get("studentId");

  

  // Listen for screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showAlertMessage = useCallback((type, message, duration = 5000) => {
    setAlert({ show: true, type, message });
    const timer = setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading({ students: true, mentors: true, invites: true, teams: true });
      const [studentsData, mentorsData, invitationsData, teamsData] = await Promise.all([
        fetchPartnerCandidates(),
        fetchMentors(),
        fetchAllInvitations(),
        fetchUserTeams()
      ]);
      setStudents(studentsData || []);
      setMentors(mentorsData || []);
      setInvitations({
        sent: invitationsData?.sentInvitations || [],
        incoming: invitationsData?.incomingInvitations || []
      });
      setUserTeams(teamsData?.teams || []);
    } catch (err) {
      showAlertMessage('error', err.message);
    } finally {
      setLoading({ students: false, mentors: false, invites: false, teams: false });
    }
  }, [showAlertMessage]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  useEffect(() => {
  const loadTeamData = async () => {
    if (!userTeams[0] || !userId) return;

    const team = userTeams[0];
    const { Student1, Student2, Mentor, status } = team;

    if (!Student1 || !Student2) return;

    const teammate = String(Student1.id) === String(userId) ? Student2 : Student1;
    setSelectedPartner(teammate.id || null);
    setTeamMate(teammate || null);
    setInviteStatus("none");

    // ✅ set mentor info + status
    if (Mentor) {
      setSelectedMentor(Mentor.id);
      setMentorDetails(Mentor);
    }

    if (status) {
      setMentorRequestStatus(status);  // <-- direct from backend: pending / accepted / rejected
    } else {
      setMentorRequestStatus("none");
    }
  };

  loadTeamData();
}, [userTeams, userId]);

  const filteredStudents = students.filter(student =>
    student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMentors = mentors.filter(mentor =>
    mentor.name?.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
    mentor.email?.toLowerCase().includes(mentorSearchQuery.toLowerCase()) ||
    mentor.specialized_in?.toLowerCase().includes(mentorSearchQuery.toLowerCase())
  );

  const handleSendPartnerInvite = async (studentId) => {
    try {
      await sendPartnerInvite(studentId);
      setSelectedPartner(String(studentId));
      setInviteStatus("outgoing");
      showAlertMessage('success', 'Invitation sent successfully!');
      await refreshAll();
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const handleAcceptInvite = async (invitationId) => {
  try {
    setAcceptingInviteId(invitationId);
    await acceptPartnerInvite(invitationId);
    await refreshAll();
    showAlertMessage('success', 'Invitation accepted! You are now teammates.');
  } catch (err) {
    showAlertMessage('error', err.message);
  } finally {
    setAcceptingInviteId(null);
  }
};

const handleRejectInvite = async (invitationId) => {
  try {
    setRejectingInviteId(invitationId);
    await rejectPartnerInvite(invitationId);
    await refreshAll();
    showAlertMessage('info', 'Invitation rejected');
  } catch (err) {
    showAlertMessage('error', err.message);
  } finally {
    setRejectingInviteId(null);
  }
};

const handleWithdrawPartnerInvite = async (invitationId) => {
  try {
    setWithdrawingInviteId(invitationId);
    await withdrawPartnerInvite(invitationId);
    setSelectedPartner(null);
    setInviteStatus("none");
    showAlertMessage('info', 'Invitation withdrawn');
    await refreshAll();
  } catch (err) {
    showAlertMessage('error', err.message);
  } finally {
    setWithdrawingInviteId(null);
  }
};

  const handleGoSolo = () => {
    setSelectedPartner("solo");
    setInviteStatus("none");
    showAlertMessage('info', 'You are now working solo');
  };

  const handleRequestMentor = async (mentorId) => {
  try {
    setRequestingMentorId(mentorId); // start loading
    await requestMentor(mentorId);
    setSelectedMentor(String(mentorId));
    setMentorRequestStatus("pending");
    showAlertMessage('success', 'Mentor request sent!');
    await refreshAll();
  } catch (err) {
    showAlertMessage('error', err.message);
  } finally {
    setRequestingMentorId(null); // stop loading
  }
};

  const handleWithdrawMentorRequest = async (mentorId) => {
  try {
    setWithdrawingMentorId(mentorId); // start spinner
    await withdrawMentorRequest(mentorId);

    // 🔑 Reset everything locally
    setSelectedMentor(null);
    setMentorDetails(null);      // <-- important
    setMentorRequestStatus("none");

    showAlertMessage('info', 'Mentor request withdrawn');
    await refreshAll();
  } catch (err) {
    showAlertMessage('error', err.message);
  } finally {
    setWithdrawingMentorId(null); // stop spinner
  }
};

  const partnerFromList = students.find((s) => s.id === Number(selectedPartner));
  const partner = partnerFromList || teamMate;
  const hasConfirmedPartner =
    Boolean(partner) &&
    inviteStatus === "none" &&
    selectedPartner !== "solo";
  const isMentorLocked = !selectedPartner || inviteStatus !== "none";

  if (loading.students || loading.mentors || loading.invites || loading.teams) {
    return (
      <div className="p-6">
        <LoadingSpinner variant="orbit" size="lg" message="Loading your team data..." />
      </div>
    );
  }


  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invite Center</h2>

      {alert.show && (
        <div className="mb-4">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}

      {/* Show partner tabs on desktop (text buttons) */}
      {!hasConfirmedPartner && isDesktop && (
        <div className="flex space-x-4 mb-6">
          {["find", "incoming", "sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setInviteTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                inviteTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "find"
                ? "Find Partner"
                : tab === "incoming"
                ? <>
                    Incoming Invitations{" "}
                    {invitations.incoming.length > 0 && (
                      <span className="ml-2 text-sm text-red-500">
                        ({invitations.incoming.length})
                      </span>
                    )}
                  </>
                : <>
                    Sent Invitations{" "}
                    {invitations.sent.length > 0 && (
                      <span className="ml-2 text-sm text-red-500">
                        ({invitations.sent.length})
                      </span>
                    )}
                  </>}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Toggle */}
      {!isDesktop && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setMobileView("partner")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mobileView === "partner"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Partner Details
          </button>
          <button
            onClick={() => setMobileView("mentor")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mobileView === "mentor"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Mentor Details
          </button>
        </div>
      )}

      {/* Mobile: partner tabs as icon buttons below the toggle (only on Partner view) */}
      {!isDesktop && !hasConfirmedPartner && mobileView === "partner" && (
        <div className="flex items-center justify-between mb-6">
          {/* Find Partner */}
          <button
            aria-label="Find Partner"
            onClick={() => setInviteTab("find")}
            className={`flex-1 mx-1 h-10 rounded-lg flex items-center justify-center ${
              inviteTab === "find" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {/* Incoming Invitations */}
          <button
            aria-label="Incoming Invitations"
            onClick={() => setInviteTab("incoming")}
            className={`flex-1 mx-1 h-10 rounded-lg flex items-center justify-center relative ${
              inviteTab === "incoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-8 5-8-5" />
            </svg>
            {invitations.incoming.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {invitations.incoming.length}
              </span>
            )}
          </button>
          {/* Sent Invitations */}
          <button
            aria-label="Sent Invitations"
            onClick={() => setInviteTab("sent")}
            className={`flex-1 mx-1 h-10 rounded-lg flex items-center justify-center relative ${
              inviteTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" />
            </svg>
            {invitations.sent.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {invitations.sent.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(mobileView === "partner" || isDesktop) && (
          <>
            {inviteStatus === "none" && selectedPartner === "solo" ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Partner Details
                </h3>
                <p className="text-gray-600 mb-4">
                  You are working solo on this project.
                </p>
                <button
                  onClick={() => {
                    setSelectedPartner(null);
                    setInviteTab("find");
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Select Team Member
                </button>
              </div>
            ) : partnerFromList && inviteStatus === "none" ? (
              <PartnerDetails
                partner={partnerFromList}
                setSelectedPartner={setSelectedPartner}
                setInviteTab={setInviteTab}
              />
            ) : (
              <>
                {inviteTab === "find" && (
                  <PartnerManagement
                    inviteStatus={inviteStatus}
                    selectedPartner={selectedPartner}
                    filteredStudents={filteredStudents}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sendPartnerInvite={handleSendPartnerInvite}
                    withdrawPartnerInvite={handleWithdrawPartnerInvite}
                    goSolo={handleGoSolo}
                    teammate={teamMate}
                    sentInvitations={invitations.sent}
                  />
                )}
                {inviteTab === "incoming" && (
                  <InvitationListMobile
                    type="incoming"
                    invitations={invitations.incoming}
                    onApprove={handleAcceptInvite}
                    onReject={handleRejectInvite}
                    acceptingInviteId={acceptingInviteId}
                    rejectingInviteId={rejectingInviteId}
                  />
                )}

                {inviteTab === "sent" && (
                  <InvitationListMobile
                    type="sent"
                    invitations={invitations.sent}
                    onWithdraw={handleWithdrawPartnerInvite}
                    withdrawingInviteId={withdrawingInviteId}
                  />
                )}
              </>
            )}
          </>
        )}

        {(mobileView === "mentor" || isDesktop) && (
          <MentorManagement
            mentorRequestStatus={mentorRequestStatus}
            selectedMentor={selectedMentor}
            mentors={filteredMentors}
            mentorSearchQuery={mentorSearchQuery}
            setMentorSearchQuery={setMentorSearchQuery}
            requestMentor={handleRequestMentor}
            withdrawMentorRequest={handleWithdrawMentorRequest}
            isMentorLocked={isMentorLocked}
            mentorDetails={mentorDetails}
            requestingMentorId={requestingMentorId}
            withdrawingMentorId={withdrawingMentorId}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmApprove}
        onClose={() => setShowConfirmApprove(false)}
        onConfirm={() => {
          if (inviteToConfirm !== null) handleAcceptInvite(inviteToConfirm);
          setShowConfirmApprove(false);
        }}
        title="Confirm Acceptance"
        message="Are you sure you want to accept this invitation?"
        confirmText="Confirm"
        confirmColor="blue"
      />

      <ConfirmationModal
        isOpen={showConfirmReject}
        onClose={() => setShowConfirmReject(false)}
        onConfirm={() => {
          if (inviteToReject !== null) handleRejectInvite(inviteToReject);
          setShowConfirmReject(false);
        }}
        title="Confirm Rejection"
        message="Are you sure you want to reject this invitation?"
        confirmText="Confirm"
        confirmColor="red"
      />
    </div>
  );
};

export default InviteCenter;