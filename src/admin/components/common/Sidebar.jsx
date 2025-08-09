import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { changeAdminPassword } from '../../api/AdminApi';


const Sidebar = ({ sidebarExpanded, toggleSidebar }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    setAdminName(Cookies.get('name') || 'Admin');
    setAdminEmail(Cookies.get('email') || 'admin@example.com');
  }, []);

  // Redirect to /login if token is missing
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('name');
    Cookies.remove('email');

    setTimeout(() => {
      window.location.href = '/admin-login';
    }, 200);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      const payload = {
        email: adminEmail,
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
        confirmPassword: passwordForm.confirm,
      };
      await changeAdminPassword(payload);
      console.log("Toast firing success");
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.log("Toast firing error", err.message);
      toast.error(err.message || 'Failed to change password');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'students', icon: 'fas fa-user-graduate', label: 'Student Management', path: '/admin/students' },
    { id: 'mentors', icon: 'fas fa-chalkboard-teacher', label: 'Mentor Management', path: '/admin/mentors' },
    { id: 'teams', icon: 'fas fa-users', label: 'Team Management', path: '/admin/teams' },
    { id: 'projects', icon: 'fas fa-tasks', label: 'Project Management', path: '/admin/projects' },
    { id: 'announcements', icon: 'fas fa-bullhorn', label: 'Announcements', path: '/admin/announcements' }
  ];

  return (
    <div className={`bg-indigo-800 text-white transition-all duration-300 ease-in-out ${sidebarExpanded ? 'w-64' : 'w-20'} fixed h-full z-10`}>
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center w-full'}`}>
          <div
            onClick={!sidebarExpanded ? toggleSidebar : undefined}
            className={`text-2xl ${!sidebarExpanded ? 'cursor-pointer hover:text-indigo-300' : ''}`}
          >
            <i className="fas fa-graduation-cap"></i>
          </div>
          {sidebarExpanded && <span className="ml-3 font-bold text-lg">Admin Portal</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className={`text-white p-1 rounded-full hover:bg-indigo-700 focus:outline-none ${!sidebarExpanded && 'hidden'}`}
        >
          <i className="fas fa-chevron-left text-sm"></i>
        </button>
      </div>
      
      <div className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full py-3 px-4 ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700'
                } transition-colors duration-200 ${
                  sidebarExpanded ? 'justify-start' : 'justify-center'
                }`}
              >
                <i className={`${item.icon} ${sidebarExpanded ? 'mr-3' : ''}`}></i>
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-full p-4">
        {sidebarExpanded ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-800 font-bold">
                {getInitials(adminName)}
              </div>
              {sidebarExpanded && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{adminName || 'Admin'}</p>
                  <p className="text-xs text-indigo-200">{adminEmail || 'admin@example.com'}</p>
                </div>
              )}
            </div>

            {profileMenuOpen && (
              <div className="absolute left-0 bottom-full mb-3 bg-white text-indigo-800 rounded shadow-lg w-48 z-20">
                <button onClick={handleChangePassword} className="w-full text-left px-4 py-2 hover:bg-indigo-100 flex items-center space-x-2">
                  <i className="fas fa-key"></i>
                  <span>Change Password</span>
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-indigo-100 flex items-center space-x-2">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-800 font-bold">
              {getInitials(adminName)}
            </div>
          </div>
        )}
        {!sidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="mt-4 w-full flex justify-center text-white p-1 rounded-full hover:bg-indigo-700 focus:outline-none"
          >
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
        )}
        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Change Password</h2>
              <div className="relative mb-3">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  placeholder="Current Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 pr-10"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                >
                  <i className={`fas ${showPassword.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <div className="relative mb-3">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 pr-10"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                >
                  <i className={`fas ${showPassword.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 pr-10"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                >
                  <i className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                {passwordForm.confirm && (
                  <p className={`text-sm mt-1 ${passwordForm.new === passwordForm.confirm ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordForm.new === passwordForm.confirm ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                  onClick={handlePasswordSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;