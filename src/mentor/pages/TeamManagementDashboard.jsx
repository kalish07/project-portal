import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Dashboard from "../components/Dashboard/Dashboard";
import TeamsList from "../components/Teams/TeamsList";
import ProjectManagement from "../components/Projects/ProjectManagement";
import Calendar from "../components/Calendar";

import {
  fetchMentorDetails,
  fetchPendingInvites,
  fetchTeams,
  respondToInvitation,
  resetMentorPassword,
  fetchProjectDocs,
  respondToDocAction,
} from "../api/mentorApi";

const TeamManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projectDocs, setProjectDocs] = useState({});
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState("PT-1");
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [mentorName, setMentorName] = useState("Mentor");
  const [editingZeroth, setEditingZeroth] = useState(true);
  const [editingFirst, setEditingFirst] = useState(true);
  const [editingSecond, setEditingSecond] = useState(true);
  const [submittingZeroth, setSubmittingZeroth] = useState(false);
  const [submittingFirst, setSubmittingFirst] = useState(false);
  const [submittingSecond, setSubmittingSecond] = useState(false);
  const [zerothReview, setZerothReview] = useState("");
  const [firstReview, setFirstReview] = useState("");
  const [secondReview, setSecondReview] = useState("");

  const loadMentorDetails = async () => {
    try {
      const data = await fetchMentorDetails();
      setMentorName(data?.name || "Mentor");
    } catch (e) {
      setMentorName("Mentor");
      setToast({ type: "error", msg: "Could not fetch mentor details." });
    }
  };

  const fetchDocsForTeam = async (teamId) => {
    setProjectDocs({});
    if (!teamId) return;
    try {
      const docs = await fetchProjectDocs(teamId);
      setProjectDocs(docs);
    } catch {
      setProjectDocs({});
    }
  };

  const loadPendingInvites = async () => {
    try {
      const data = await fetchPendingInvites();
      setPendingInvitations(data);
    } catch (e) {
      setPendingInvitations([]);
      setToast({ type: "error", msg: "Could not fetch invitations." });
    }
  };

  const loadTeams = async () => {
    try {
      const data = await fetchTeams();
      setTeams(Array.isArray(data) ? data : []);
      console.log(data);
    } catch (e) {
      setTeams([]);
      setToast({ type: "error", msg: "Could not fetch teams." });
    }
  };

  useEffect(() => {
    loadMentorDetails();
    loadPendingInvites();
    loadTeams();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordError("");
    try {
      await resetMentorPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setToast({ type: "success", msg: "Password updated successfully!" });
    } catch (err) {
      const msg = err.message || "Failed to change password. Try again.";
      setPasswordError(msg);
      setToast({ type: "error", msg });
    }
  };

  const askConfirm = (msg, onYes) => setConfirmModal({ msg, onYes });

  const goToPrevMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTeamRequest = (id, approved) => {
    askConfirm(`Are you sure you want to ${approved ? "approve" : "reject"} this team request?`, () => {
      setPendingInvitations((prev) => prev.filter((request) => request.id !== id));
      setToast({
        type: approved ? "success" : "error",
        msg: approved ? "Team request approved ✅" : "Team request rejected.",
      });
    });
  };

  const handleDocAction = async (docLabel, approved, docId) => {
    askConfirm(`Are you sure you want to ${approved ? "approve" : "reject"} this ${docLabel}?`, async () => {
      try {
        await respondToDocAction(docId, approved ? "approve" : "reject");
        setToast({ type: approved ? "success" : "error", msg: `${docLabel} ${approved ? "approved ✅" : "rejected."}` });
      } catch (e) {
        setToast({ type: "error", msg: `Failed to ${approved ? "approve" : "reject"} ${docLabel}.` });
      }
    });
  };

  const handleInvitationResponse = (id, accepted) => {
    askConfirm(`Are you sure you want to ${accepted ? "accept" : "decline"} this invitation?`, async () => {
      try {
        await respondToInvitation(id, accepted ? "accept" : "reject");
        setToast({ type: accepted ? "success" : "error", msg: accepted ? "Invitation accepted ✅" : "Invitation declined." });
        await loadPendingInvites();
      } catch (e) {
        setToast({ type: "error", msg: "Failed to respond to invitation." });
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar {...{ activeTab, setActiveTab, showProfileMenu, setShowProfileMenu, setShowPasswordModal, mentorName }} />
      <TopBar
        {...{
          toast,
          setToast,
          showPasswordModal,
          setShowPasswordModal,
          passwordForm,
          setPasswordForm,
          passwordError,
          setPasswordError,
          handlePasswordChange,
          mentorName,
        }}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {activeTab === "dashboard" && (
          <Dashboard {...{ pendingInvitations, teams, handleInvitationResponse, mentorName }} />
        )}
        {activeTab === "teams" && (
          <TeamsList
            {...{
              teams,
              selectedTeam,
              setSelectedTeam,
              setActiveTab,
              showPendingRequests,
              setShowPendingRequests,
              submissionFilter,
              setSubmissionFilter,
              pendingInvitations,
              handleTeamRequest,
            }}
          />
        )}
        {activeTab === "projects" && (
          <ProjectManagement
            {...{
              selectedTeam,
              setSelectedTeam,
              teams,
              projectDocs,
              handleDocAction,
              zerothReview,
              setZerothReview,
              firstReview,
              setFirstReview,
              secondReview,
              setSecondReview,
              editingZeroth,
              setEditingZeroth,
              submittingZeroth,
              setSubmittingZeroth,
              editingFirst,
              setEditingFirst,
              submittingFirst,
              setSubmittingFirst,
              editingSecond,
              setEditingSecond,
              submittingSecond,
              setSubmittingSecond,
            }}
          />
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Please confirm</h3>
            <p className="text-gray-600 mb-6">{confirmModal.msg}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onYes();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors !rounded-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementDashboard;
