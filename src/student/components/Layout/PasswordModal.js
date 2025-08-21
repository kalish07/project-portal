// src/components/Layout/PasswordModal.js
import React, { useState } from "react";
import { changeStudentPassword } from "../../api/studentApi";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast"; 

const PasswordModal = ({ showChangePassword, setShowChangePassword, passwordError, setPasswordError }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showChangePassword?.open) return null;
  const student = showChangePassword.student || {};

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      toast.error(" New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setPasswordError("");

      await changeStudentPassword({
        email: student.email,
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword({ open: false, student: null });
    } catch (error) {
      console.error("Password change failed:", error);
      setPasswordError(error.message || "Failed to change password");
      toast.error(error.message || " Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl sm:w-[90%]">
        {/* Student Info */}
        <div className="mb-4 text-center sm:text-left">
          <h4 className="text-lg font-semibold text-gray-800">Change Password</h4>
          <p className="text-sm text-gray-500 break-all">
            {student.student_name} ({student.email})
          </p>
        </div>

        {passwordError && <p className="text-red-500 mb-2 text-sm">{passwordError}</p>}

        {/* Password Fields */}
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pr-10 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pr-10 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pr-10 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={() => setShowChangePassword({ open: false, student: null })}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm sm:text-base"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm sm:text-base text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;