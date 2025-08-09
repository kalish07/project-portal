import React, { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import PartnerManagement from "../../components/InviteCenter/PartnerManagement";
import MentorManagement from "../../components/InviteCenter/MentorManagement";
import PartnerDetails from "../../components/InviteCenter/PartnerDetails";
import MentorDetails from "../../components/InviteCenter/MentorDetails";
import ConfirmationModal from "../../components/InviteCenter/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
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

  const userId = Cookies.get("studentId");

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
      console.log(teamsData);
      
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
      const { Student1, Student2, Mentor } = team;
      if (!Student1 || !Student2) return;
      const teammate = String(Student1.id) === String(userId) ? Student2 : Student1;
      setSelectedPartner(teammate.id || null);
      setTeamMate(teammate || null);
      setInviteStatus("none");
      if (Mentor) {
        setSelectedMentor(Mentor.id);
        setMentorDetails(Mentor);
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

  const handleWithdrawPartnerInvite = async (invitationId) => {
    try {
      await withdrawPartnerInvite(invitationId);
      setSelectedPartner(null);
      setInviteStatus("none");
      showAlertMessage('info', 'Invitation withdrawn');
      await refreshAll();
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const handleAcceptInvite = async (invitationId) => {
    try {
      await acceptPartnerInvite(invitationId);
      await refreshAll();
      showAlertMessage('success', 'Invitation accepted! You are now teammates.');
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const handleRejectInvite = async (invitationId) => {
    try {
      await rejectPartnerInvite(invitationId);
      await refreshAll();
      showAlertMessage('info', 'Invitation rejected');
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const handleGoSolo = () => {
    setSelectedPartner("solo");
    setInviteStatus("none");
    showAlertMessage('info', 'You are now working solo');
  };

  const handleRequestMentor = async (mentorId) => {
    try {
      await requestMentor(mentorId);
      setSelectedMentor(String(mentorId));
      setMentorRequestStatus("pending");
      showAlertMessage('success', 'Mentor request sent!');
      await refreshAll();
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const handleWithdrawMentorRequest = async () => {
    try {
      await withdrawMentorRequest();
      setSelectedMentor(null);
      setMentorRequestStatus("none");
      showAlertMessage('info', 'Mentor request withdrawn');
      await refreshAll();
    } catch (err) {
      showAlertMessage('error', err.message);
    }
  };

  const isMentorLocked = !selectedPartner || inviteStatus !== "none";
  const partner = students.find((s) => s.id === Number(selectedPartner));

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
          <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        </div>
      )}

      {!(partner && inviteStatus === "none") && (
        <div className="flex space-x-4 mb-6">
          {["find", "incoming", "sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setInviteTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                inviteTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "find" ? "Find Partner" : tab === "incoming" ? (
                <>
                  Incoming Invitations {invitations.incoming.length > 0 && (
                    <span className="ml-2 text-sm text-red-500">({invitations.incoming.length})</span>
                  )}
                </>
              ) : (
                <>
                  Sent Invitations {invitations.sent.length > 0 && (
                    <span className="ml-2 text-sm text-red-500">({invitations.sent.length})</span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner Section */}
        {inviteStatus === "none" && selectedPartner === "solo" ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Partner Details</h3>
            <p className="text-gray-600 mb-4">You are working solo on this project.</p>
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
        ) : partner && inviteStatus === "none" ? (
          <PartnerDetails partner={partner} setSelectedPartner={setSelectedPartner} setInviteTab={setInviteTab} />
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Incoming Invitations</h3>
                {invitations.incoming.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.incoming.map((inv) => (
                      <div key={inv.id} className="bg-gray-50 border p-4 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{inv.sender.name}</p>
                          <p className="text-sm text-gray-600">{inv.sender.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setInviteToConfirm(inv.id); setShowConfirmApprove(true); }} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Approve</button>
                          <button onClick={() => { setInviteToReject(inv.id); setShowConfirmReject(true); }} className="border px-3 py-1 rounded-md hover:bg-gray-100">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No incoming invitations.</p>
                )}
              </div>
            )}
            {inviteTab === "sent" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Sent Invitations</h3>
                {invitations.sent.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.sent.map((inv) => (
                      <div key={inv.id} className="bg-gray-50 border p-4 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{inv.recipient.name}</p>
                          <p className="text-sm text-gray-600">{inv.recipient.email}</p>
                        </div>
                        <button onClick={() => handleWithdrawPartnerInvite(inv.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Withdraw</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No sent invitations.</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Mentor Section */}
        {selectedMentor && mentorRequestStatus === "none" ? (
          <MentorDetails
            mentor={mentors.find((m) => m.id === Number(selectedMentor)) || mentorDetails}
            withdrawMentorRequest={handleWithdrawMentorRequest}
          />
        ) : (
          <MentorManagement
            mentorRequestStatus={mentorRequestStatus}
            selectedMentor={selectedMentor}
            mentors={filteredMentors}
            mentorSearchQuery={mentorSearchQuery}
            setMentorSearchQuery={setMentorSearchQuery}
            requestMentor={handleRequestMentor}
            withdrawMentorRequest={handleWithdrawMentorRequest}
            isMentorLocked={isMentorLocked || selectedMentor !== null}
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
