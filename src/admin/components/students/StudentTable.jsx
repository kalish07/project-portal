import React, { useState, forwardRef, useEffect } from "react";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import { toast } from "react-toastify";
import { resetStudentPassword } from "../../api/AdminApi";

const renderDeptBadge = (dept) => {
  const badgeColors = {
    "Cyber-Security": "bg-purple-100 text-purple-800",
    "AI/ROBOTICS": "bg-green-100 text-green-800",
    "AI/ML": "bg-yellow-100 text-yellow-800",
    "BLOCKCHAIN": "bg-pink-100 text-pink-800",
  };
  const colorClass = badgeColors[dept] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-block ${colorClass} text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}>
      {dept}
    </span>
  );
};

const StudentTable = forwardRef(
  (
    {
      students,
      searchTerm,
      programFilter,
      semesterFilter = [],
      teamFilter = "All",
      onEditStudent,
      onDeleteStudent,
      processingStudentId,
    },
    ref
  ) => {
  const [editableRow, setEditableRow] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);

  const [localStudents, setLocalStudents] = useState([]);

  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const openPasswordModal = (student) => {
    setSelectedStudent(student);
    setShowPasswordModal(true);
  };

  const submitPasswordChange = () => {
    setConfirmAction("passwordSubmit");
    setShowConfirm(true);
  };

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...localStudents];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setLocalStudents(updatedStudents);
  };

  // Filter students based on search term, selected program, semester, and team
  const filteredStudents = localStudents.filter((student) => {
    const matchesSearch =
      !searchTerm ||
      (student?.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.department_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student?.team || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram =
      programFilter === "All" || student.department_name === programFilter;

    const matchesSemester =
      semesterFilter.length === 0 || semesterFilter.includes(student.current_semester);

    const matchesTeam =
      teamFilter === "All" ||
      (teamFilter === "Unassigned" && student.team === "Unassigned") ||
      (teamFilter === "Assigned" && student.team !== "Unassigned");

    return matchesSearch && matchesProgram && matchesSemester && matchesTeam;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Student ID
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Program
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Semester
              </th>
              {/* Team and Status columns removed */}
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className={`hover:bg-gray-50 ${
                  editableRow === index ? 'bg-indigo-50 border-l-4 border-yellow-400' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {student.reg_number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-x-5 ml-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-md ring-2 ring-white">
                      {student.student_name?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                    {editableRow === index ? (
                      <input
                        type="text"
                        value={student.student_name}
                        onChange={(e) => handleInputChange(index, "student_name", e.target.value)}
                        className="border px-2 py-1 rounded w-full text-sm"
                      />
                    ) : (
                      student.student_name
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {editableRow === index ? (
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => handleInputChange(index, "email", e.target.value)}
                      className="border px-2 py-1 rounded w-full text-sm"
                    />
                  ) : (
                    student.email
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editableRow === index ? (
                    <select
                      value={student.department_name}
                      onChange={(e) => handleInputChange(index, "department_name", e.target.value)}
                      className="border px-2 py-1 rounded w-full text-sm"
                    >
                      <option value="">Select Department</option>
                      <option value="Cyber-Security">Cyber-Security</option>
                      <option value="AI/ROBOTICS">AI/ROBOTICS</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="BLOCKCHAIN">BLOCKCHAIN</option>
                    </select>
                  ) : (
                    renderDeptBadge(student.department_name)
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {student.current_semester}
                </td>
                {/* Team and Status columns removed */}
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  {processingStudentId === student.id ? (
                    <span className="text-gray-400 text-sm">
                      <i className="fas fa-spinner fa-spin"></i>
                    </span>
                  ) : (
                    <>
                      {editableRow === index ? (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setConfirmAction("save");
                            setTargetIndex(index);
                            setShowConfirm(true);
                          }}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      ) : (
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setEditableRow(index)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          setConfirmAction("delete");
                          setTargetIndex(index);
                          setShowConfirm(true);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button
                        className="text-gray-600 hover:text-yellow-600"
                        onClick={() => {
                          setConfirmAction("password");
                          setTargetIndex(index);
                          setShowConfirm(true);
                        }}
                      >
                        <i className="fas fa-key"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No students match the search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to reset the password for <strong>{selectedStudent.student_name}</strong>?
              The default password will be <code>Password@XXXX</code>.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={submitPasswordChange}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={showConfirm}
        title="Are you sure?"
        message={`Do you want to ${confirmAction} for ${confirmAction === "passwordSubmit" ? selectedStudent?.student_name : filteredStudents[targetIndex]?.student_name}?`}
        onConfirm={() => {
          if (confirmAction === "save") {
            const student = filteredStudents[targetIndex];
            if (!student) return;

            const originalIndex = localStudents.findIndex(s => s.id === student.id);

            if (onEditStudent) {
              onEditStudent(student.id, {
                student_name: student.student_name,
                email: student.email,
                department_name: student.department_name,
              })
                .then(() => {
                  setEditableRow(null);
                })
                .catch(() => {
                  // Reset only the edited row
                  const latest = students.find(s => s.id === student.id);
                  if (latest && originalIndex !== -1) {
                    const updated = [...localStudents];
                    updated[originalIndex] = {
                      ...latest,
                      // explicitly reset fields that might have been edited
                      student_name: latest.student_name,
                      email: latest.email,
                      department_name: latest.department_name,
                    };
                    setLocalStudents(updated);
                  }
                  setEditableRow(null);
                });
            }
            setShowConfirm(false);
            setConfirmAction(null);
            setTargetIndex(null);
            return;
          }

          const student = filteredStudents[targetIndex];
          if (!student && confirmAction !== "passwordSubmit") return;

          if (confirmAction === "delete") {
            if (onDeleteStudent) {
              onDeleteStudent(student.id);
            }
          } else if (confirmAction === "password") {
            openPasswordModal(student);
          } else if (confirmAction === "passwordSubmit") {
            if (!selectedStudent) return;
            resetStudentPassword(selectedStudent.id)
              .then(() => {
                toast.success(`Password reset successfully for ${selectedStudent.student_name}`);
              })
              .catch((err) => {
                toast.error(err.message || "Failed to reset password");
              })
              .finally(() => {
                setShowPasswordModal(false);
              });
          }

          setShowConfirm(false);
          setConfirmAction(null);
          setTargetIndex(null);
        }}
        onCancel={() => {
          if (confirmAction === "save") {
            setEditableRow(null);
          }
          setShowConfirm(false);
          setConfirmAction(null);
          setTargetIndex(null);
        }}
      />
    </div>
  );
});

export default StudentTable;
