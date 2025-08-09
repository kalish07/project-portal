import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddStudentModal = ({ open, onClose, onAdd, submitting }) => {
  const [form, setForm] = useState({
    reg_number: '',
    student_name: '',
    email: '',
    department_name: '',
    current_semester: 1,
  });

  useEffect(() => {
    if (!submitting && open) {
      setForm({
        reg_number: '',
        student_name: '',
        email: '',
        department_name: '',
        current_semester: 1,
      });
    }
  }, [submitting, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.reg_number || !form.student_name || !form.email || !form.department_name) {
      toast.error("Please fill all required fields");
      return;
    }
    onAdd({ ...form });
    // Removed onClose and form reset
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-indigo-700">Add New Student</h2>
          <button onClick={onClose}>
            <i className="fas fa-times text-gray-600 hover:text-black" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="reg_number"
            placeholder="Registration Number"
            value={form.reg_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="student_name"
            placeholder="Full Name"
            value={form.student_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <select
            name="department_name"
            value={form.department_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Department</option>
            <option value="Cyber-Security">Cyber-Security</option>
            <option value="AI/ROBOTICS">AI/ROBOTICS</option>
            <option value="Data Science">Data Science</option>
          </select>
          <select
            name="current_semester"
            value={form.current_semester}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          >
            {[...Array(8)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Semester {idx + 1}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;