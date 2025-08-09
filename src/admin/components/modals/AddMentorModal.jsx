import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

const AddMentorModal = ({ open, onClose, onAddMentor, isLoading = false }) => {
  const [mentor, setMentor] = useState({
    name: '',
    email: '',
    degree: '',
    specialized_in: '',
    role: 'mentor',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMentor({
        name: '',
        email: '',
        degree: '',
        specialized_in: '',
        role: 'mentor',
      });
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setMentor({ ...mentor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isLoading) return;

    if (!mentor.name || !mentor.email || !mentor.degree || !mentor.specialized_in || !mentor.role) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddMentor(mentor);
    } catch (error) {
      // Error is already handled by parent component's mutation
    } finally {
      if (!open) return; // If modal was closed during submission
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg border border-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-700">Add New Mentor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={mentor.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={mentor.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="degree"
            value={mentor.degree}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select Degree</option>
            <option value="M.Tech">M.Tech</option>
            <option value="Ph.D.">Ph.D.</option>
            <option value="M.Sc">M.Sc</option>
            <option value="B.E">B.E</option>
          </select>
          <select
            name="specialized_in"
            value={mentor.specialized_in}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select Specialization</option>
            <option value="AI">AI</option>
            <option value="AI-ML">AI-ML</option>
            <option value="AI-Robotics">AI-Robotics</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Cyber-Security">Cyber Security</option>
            <option value="Data Science">Data Science</option>
            <option value="IOT">IOT</option>
            
          </select>
          <select
            name="role"
            value={mentor.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ${
                isSubmitting || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {(isSubmitting || isLoading) ? "Adding..." : "Add Mentor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMentorModal;