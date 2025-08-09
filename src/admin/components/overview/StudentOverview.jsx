import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { fetchAllStudents } from "../../api/AdminApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const StudentsOverview = () => {
  const [students, setStudents] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const batchSize = 8;

  useEffect(() => {
    fetchAllStudents()
      .then((res) => {
        if (Array.isArray(res)) {
          setStudents(res);
        } else if (res.success && Array.isArray(res.students)) {
          setStudents(res.students);
        }
      })
      .catch((err) => console.error("Failed to fetch students overview:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (students.length ? (prev + batchSize) % students.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [students]);

  if (loading) {
    return (
      <div className="mt-6">
        <div className="bg-gradient-to-tr from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl p-6 border border-indigo-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(8)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-lg p-5 ring-1 ring-indigo-100 animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-200"></div>
                <div className="flex-grow ml-5 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setIndex((prev) => (prev + batchSize) % students.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - batchSize + students.length) % students.length);
  };

  const currentBatch = students.slice(index, index + batchSize).concat(
    index + batchSize > students.length
      ? students.slice(0, (index + batchSize) % students.length)
      : []
  );

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-tr from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl p-6 border border-indigo-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Students Overview</h3>
          <div className="flex items-center gap-3">
            <button onClick={handlePrev} className="p-1 hover:text-indigo-600">
              <FaChevronLeft />
            </button>
            <button onClick={handleNext} className="p-1 hover:text-indigo-600">
              <FaChevronRight />
            </button>
            <button
              onClick={() => window.location.href = '/admin/students'}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 hover:underline transition"
            >
              View All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {currentBatch.map((student) => {
              const initials = student.student_name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex items-center bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-lg p-5 ring-1 ring-indigo-100 hover:ring-indigo-400 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white text-xl font-extrabold shadow-md ring-4 ring-white ring-offset-2 ring-offset-purple-200 transition-all duration-300 hover:scale-110">
                    {initials}
                  </div>
                  <div className="flex-grow ml-5">
                    <h4 className="text-lg font-semibold text-indigo-800">{student.student_name}</h4>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p><span className="font-medium text-gray-800">🎓 Reg:</span> {student.reg_number}</p>
                      <p><span className="font-medium text-gray-800">🏫 Dept:</span> {student.department_name}</p>
                      <p><span className="font-medium text-gray-800">📚 Sem:</span> {student.current_semester}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentsOverview;