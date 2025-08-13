import React, { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllStudents, createStudent, updateStudent, deleteStudent, shiftAllStudents, resetStudentPassword } from "../../api/AdminApi";
import StudentTable from "./StudentTable";
import AddStudentModal from "../modals/AddStudentModal";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const StudentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const tableRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [projectPhaseFilter, setProjectPhaseFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingStudentId, setProcessingStudentId] = useState(null);
  const [isShifting, setIsShifting] = useState(false);

  const queryClient = useQueryClient();
  const { data: students = [], isLoading: isFetching } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const handleAddStudent = async (newStudent) => {
    setSubmitting(true);
    setLoading(true);
    try {
      await createStudent(newStudent);
      toast.success("student created successfully");
      await queryClient.invalidateQueries(["students"]);
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleEditStudent = async (id, updatedData) => {
    setProcessingStudentId(id);
    try {
      await updateStudent(id, updatedData);
      toast.success("Student updated successfully");
      await queryClient.invalidateQueries(["students"]);
    } catch (err) {
      toast.error(err.message);
      await queryClient.invalidateQueries(["students"]);
      await queryClient.refetchQueries({
        queryKey: ["students"],
        type: "active",
        exact: true,
      });
    } finally {
      setProcessingStudentId(null);
    }
  };

  const handleDeleteStudent = async (id) => {
    setProcessingStudentId(id);
    try {
      await deleteStudent(id);
      await queryClient.invalidateQueries(["students"]);
      toast.success("Student deleted successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingStudentId(null);
    }
  };

  const handleShiftSemester = async () => {
    try {
      setIsShifting(true);
      const res = await shiftAllStudents();
      toast.success(res?.message || " Semester shifted successfully");
      await queryClient.invalidateQueries(["students"]);
    } catch (err) {
      toast.error(err?.message || "❌ Failed to shift students");
    } finally {
      setIsShifting(false);
      setShowConfirm(false); // closes modal only after request finishes
    }
  };

  const handleResetPassword = async (studentId) => {
    try {
      await resetStudentPassword(studentId);
      toast.success("Password reset to default successfully.");
    } catch (err) {
      toast.error(err?.message || "❌ Failed to reset password");
    }
  };

  // Map projectPhaseFilter to semester ranges
  const mappedSemesterFilter =
    projectPhaseFilter === "PT-1"
      ? [5]
      : projectPhaseFilter === "PT-2"
      ? [6]
      : projectPhaseFilter === "Final Year"
      ? [7, 8]
      : [];

  // Helper function to get initials from name
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map(word => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Student Management</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
          >
            <i className="fas fa-forward mr-2"></i>
            Shift Semester
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            >
              <option value="All">All Programs</option>
              {Array.from(new Set(students.map(s => s.department_name).filter(Boolean)))
                .map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
            </select>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            >
              <option value="All">All Teams</option>
              <option value="Assigned">Assigned Only</option>
              <option value="Unassigned">Unassigned Only</option>
            </select>

            <select
              value={projectPhaseFilter}
              onChange={(e) => setProjectPhaseFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            >
              <option value="All">All Projects</option>
              <option value="PT-1">PT-1</option>
              <option value="PT-2">PT-2</option>
              <option value="Final Year">Final Year</option>
            </select>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="flex flex-col justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 text-sm">Loading students...</p>
      </div>
      ) : (
        <StudentTable
          ref={tableRef}
          students={students}
          searchTerm={searchTerm}
          programFilter={programFilter}
          teamFilter={teamFilter}
          projectPhaseFilter={projectPhaseFilter}
          semesterFilter={mappedSemesterFilter}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
          onResetPassword={handleResetPassword}
          processingStudentId={processingStudentId}
        />
      )}

      <AddStudentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStudent}
        loading={loading}
        submitting={submitting}
      />

      <ConfirmationDialog
        open={showConfirm}
        title="Confirm Shift Semester"
        message="Are you sure you want to shift all students to the next semester?"
        loading={isShifting}
        confirmLabel="Shifting..."
        onConfirm={handleShiftSemester}
        onCancel={() => setShowConfirm(false)}
      />
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
};

export default StudentManagement;


/* Tailwind-based minimal spinner styling (if not already present globally) */