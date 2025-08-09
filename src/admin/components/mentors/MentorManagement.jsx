import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import AddMentorModal from "../modals/AddMentorModal";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import MentorTable from "./MentorTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllMentors,
  createMentor,
  deleteMentor,
  updateMentor,
  changeMentorPassword,
  updateAllMentorsCapacity
} from "./../../api/AdminApi";

const MentorManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showCapacityConfirm, setShowCapacityConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [capacityType, setCapacityType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [editableMentors, setEditableMentors] = useState([]);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [addMentorError, setAddMentorError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: fetchAllMentors,
  });

  useEffect(() => {
    setEditableMentors(mentors);
  }, [mentors]);

  const deleteMutation = useMutation({
    mutationFn: deleteMentor,
    onSuccess: () => {
      queryClient.invalidateQueries(["mentors"]);
      toast.success("Mentor deleted successfully");
    },
    onError: () => toast.error("Failed to delete mentor"),
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const addMutation = useMutation({
    mutationFn: createMentor,
    onSuccess: () => {
      queryClient.invalidateQueries(["mentors"]);
      toast.success("Mentor added successfully");
      setShowAddModal(false);
      setAddMentorError(false);
    },
    onError: (err) => {
      console.error("Failed to create mentor:", err);
      toast.error(err.message || "Failed to add mentor");
      setAddMentorError(true);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ id, password }) => changeMentorPassword(id, password),
    onSuccess: () => {
      toast.success(`Password updated for ${selectedMentor.name}`);
      setShowPasswordModal(false);
    },
    onError: () => toast.error("Failed to update password"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, update }) => updateMentor(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries(["mentors"]);
      toast.success("Mentor updated");
    },
    onError: () => {
      toast.error("Failed to update mentor");
    },
  });

  const editTimeouts = useRef({});

  const handleEditChange = (mentorId, field, value) => {
    setEditableMentors((prev) =>
      prev.map((mentor) =>
        mentor.id === mentorId ? { ...mentor, [field]: value } : mentor
      )
    );
  };

  const handleSaveChanges = (mentorId, update) => {
    editMutation.mutate({ id: mentorId, update });
  };

  const handleOpenPasswordModal = (mentor) => {
    setSelectedMentor(mentor);
    setNewPassword("");
    setShowPassword(false);
    setShowPasswordModal(true);
  };

  const handlePasswordChange = () => {
    if (isPasswordSubmitting || newPassword.trim() === "") {
      if (newPassword.trim() === "") toast.error("Password cannot be empty");
      return;
    }
    setIsPasswordSubmitting(true);
    passwordMutation.mutate(
      { id: selectedMentor.id, password: newPassword },
      {
        onSettled: () => setIsPasswordSubmitting(false),
      }
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Mentor Management</h1>
        <div className="flex gap-2">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center hover:bg-gray-300"
            onClick={() => setShowCapacityModal(true)}
          >
            <i className="fas fa-sliders-h mr-2"></i>
            Set Mentor Capacity
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Mentor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            >
              <option value="All">All Departments</option>
              {[...new Set(mentors.map((m) => m.specialized_in))].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-indigo-600 font-medium">Loading mentors...</span>
        </div>
      ) : (
        <>
          {/*
            Filter mentors by search term and department before passing to MentorTable.
          */}
          {(() => {
            const filteredMentors = editableMentors
              .filter((mentor) =>
                (mentor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (mentor?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (mentor?.department || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter((mentor) =>
                departmentFilter === "All" ||
                mentor?.specialized_in === departmentFilter
              );
            return (
              <MentorTable
                mentors={filteredMentors}
                searchTerm={searchTerm}
                departmentFilter={departmentFilter}
                handleEditChange={handleEditChange}
                handleSaveChanges={handleSaveChanges}
                handleDelete={handleDelete}
                handleOpenPasswordModal={handleOpenPasswordModal}
              />
            );
          })()}
        </>
      )}

      {showCapacityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Mentor Capacity For</h2>
            <input
              type="number"
              placeholder="Enter capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (capacity.trim() === "") {
                    toast.error("Capacity cannot be empty");
                    return;
                  }
                  setCapacityType("pt1");
                  setShowCapacityConfirm(true);
                }}
              >
                PT1
              </button>
              <button
                className="bg-emerald-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (capacity.trim() === "") {
                    toast.error("Capacity cannot be empty");
                    return;
                  }
                  setCapacityType("pt2");
                  setShowCapacityConfirm(true);
                }}
              >
                PT2
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (capacity.trim() === "") {
                    toast.error("Capacity cannot be empty");
                    return;
                  }
                  setCapacityType("final_year");
                  setShowCapacityConfirm(true);
                }}
              >
                Final Year
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowCapacityModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <p className="text-sm mb-2 text-gray-600">
              Set a new password for <strong>{selectedMentor.name}</strong>
            </p>
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={passwordMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                disabled={passwordMutation.isLoading || isPasswordSubmitting}
              >
                {passwordMutation.isLoading || isPasswordSubmitting ? "Updating..." : "Change"}
              </button>
            </div>
            {passwordMutation.isLoading && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
                <span className="text-sm text-indigo-600">Updating password...</span>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={showCapacityConfirm}
        title="Confirm Capacity"
        message={`Set mentor capacity for ${capacityType.toUpperCase()} to ${capacity}?`}
        onConfirm={async () => {
          try {
            await updateAllMentorsCapacity(capacityType, parseInt(capacity));
            toast.success(`Mentor capacity for ${capacityType.toUpperCase()} set to ${capacity}`);
            queryClient.invalidateQueries(["mentors"]);
          } catch (error) {
            toast.error(error.message || "Failed to update mentor capacities");
          }
          setShowCapacityConfirm(false);
          setShowCapacityModal(false);
        }}
        onCancel={() => setShowCapacityConfirm(false)}
      />

      <AddMentorModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
        }}
        isLoading={addMutation.isLoading}
        onAddMentor={async (mentor) => {
          try {
            await addMutation.mutateAsync(mentor);
          } catch (error) {
            throw error;
          }
        }}
      />
    </div>
  );
};

export default MentorManagement;