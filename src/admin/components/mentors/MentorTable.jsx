import React, { useState } from "react";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import { toast } from "react-toastify";

const MentorTable = ({
  mentors,
  setMentors,
  handleEditChange,
  handleSaveChanges,
  handleDelete,
  handleOpenPasswordModal,
  passwordMutation,
}) => {
  const [editableRow, setEditableRow] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [targetMentor, setTargetMentor] = useState(null);
  const [editingMentor, setEditingMentor] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mentor ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teams
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors.map((mentor, index) => (
              <tr key={mentor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {mentor.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {editableRow === mentor.id ? (
                      <input
                        type="text"
                        value={editingMentor?.name || ""}
                        onChange={(e) =>
                          setEditingMentor((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      mentor.name
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {editableRow === mentor.id ? (
                    <input
                      type="email"
                      value={editingMentor?.email || ""}
                      onChange={(e) =>
                        setEditingMentor((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    mentor.email
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {editableRow === mentor.id ? (
                    <input
                      type="text"
                      value={editingMentor?.specialized_in || ""}
                      onChange={(e) =>
                        setEditingMentor((prev) => ({ ...prev, specialized_in: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    mentor.specialized_in
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {mentor.teams} teams
                    </span>     
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  {editableRow === mentor.id ? (
                    <button
                      onClick={() => {
                        setConfirmAction("save");
                        setTargetMentor(mentor);
                        setShowConfirm(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditableRow(mentor.id);
                        setEditingMentor({ ...mentor });
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setConfirmAction("delete");
                      setTargetMentor(mentor);
                      setShowConfirm(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmAction("password");
                      setTargetMentor(mentor);
                      setShowConfirm(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-700"
                    disabled={passwordMutation?.isLoading}
                  >
                    <i className="fas fa-key"></i>
                    {passwordMutation?.isLoading && (
                      <svg className="animate-spin h-4 w-4 ml-1 text-yellow-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        open={showConfirm}
        title="Are you sure?"
        message={`Do you want to change ${confirmAction} for ${targetMentor?.name}?`}
        loading={passwordMutation?.isLoading}
        onConfirm={() => {
          try {
            if (confirmAction === "save") {
              handleSaveChanges(editingMentor.id, {
                name: editingMentor.name,
                email: editingMentor.email,
                specialized_in: editingMentor.specialized_in,
              });
              setEditableRow(null);
            } else if (confirmAction === "delete") {
              handleDelete(targetMentor.id);
              
            } else if (confirmAction === "password" && !passwordMutation?.isLoading) {
              handleOpenPasswordModal(targetMentor);
            }
          } catch (err) {
            toast.error(`Failed to ${confirmAction} mentor.`);
          }

          setShowConfirm(false);
          setConfirmAction(null);
          setTargetMentor(null);
          setEditingMentor(null);
        }}
        onCancel={() => {
          if (confirmAction === "save") setEditableRow(null);
          setShowConfirm(false);
          setConfirmAction(null);
          setTargetMentor(null);
          setEditingMentor(null);
        }}
      >
        {confirmAction === "password" && (
          <div className="mt-4">
            <div className="relative w-full">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              >
                <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
};

export default MentorTable;