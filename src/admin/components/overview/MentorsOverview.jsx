import React, { useEffect, useState } from "react";
import { fetchAllMentors } from "../../api/AdminApi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MentorsOverview = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMentors()
      .then((res) => {
        if (res.success && Array.isArray(res.mentors)) {
          setMentors(res.mentors);
        } else if (Array.isArray(res)) {
          setMentors(res);
        } else {
          console.error("Unexpected response:", res);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch mentors:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mentors.length) return;
    const interval = setInterval(() => {
      setTimeout(() => {
        setVisibleIndex((prev) => (prev + 1) % Math.ceil(mentors.length / 4));
      }, 1000); // 1 second delay after student transition
    }, 6000);
    return () => clearInterval(interval);
  }, [mentors, visibleIndex]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      className="bg-white shadow rounded-lg p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Mentors Overview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/mentors")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
          <button
            onClick={() => setVisibleIndex((prev) => (prev - 1 + Math.ceil(mentors.length / 4)) % Math.ceil(mentors.length / 4))}
            className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Prev
          </button>
          <button
            onClick={() => setVisibleIndex((prev) => (prev + 1) % Math.ceil(mentors.length / 4))}
            className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={visibleIndex}
            className="flex flex-wrap justify-between gap-4"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {mentors.slice(visibleIndex * 4, visibleIndex * 4 + 4).map((mentor) => (
              <div
                key={mentor.id}
                className="relative w-full flex-1 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl p-5 flex items-center gap-5 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:ring-2 hover:ring-purple-300"
              >
                <div className="min-w-[48px] min-h-[48px] w-12 h-12 aspect-square bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md ring-2 ring-purple-300">
                  {getInitials(mentor.name)}
                </div>
                <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-[10px] px-2 py-[2px] rounded-full shadow-sm animate-pulse">
                  ⭐ Top Mentor
                </span>
                <div className="flex flex-col">
                  <span className="text-md font-semibold text-gray-900 hover:text-purple-700 transition-colors duration-200">
                    {mentor.name}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v1.3L12 13 2 7.3V6c0-1.1.9-2 2-2zm0 4.7V18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8.7l-8 5.2-8-5.2z"/>
                    </svg>
                    {mentor.email}
                  </span>
                  {mentor.specialized_in && (
                    <span
                      title={`Specialized in ${mentor.specialized_in}`}
                      className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full w-max"
                    >
                      {mentor.specialized_in}
                    </span>
                  )}
                </div>
                <div className="h-[1px] bg-gradient-to-r from-purple-400 via-transparent to-blue-400 my-2 w-full"></div>
                <motion.div
                  className="ml-auto flex flex-col items-end bg-gradient-to-tr from-blue-100 to-purple-100 px-4 py-2 rounded-lg shadow-md border border-blue-200"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs font-semibold text-gray-600 mb-1">Capacities</div>
                  <div className="text-sm text-blue-700 font-medium">PT1: {mentor.max_pt1 || 0}</div>
                  <div className="text-sm text-blue-700 font-medium">PT2: {mentor.max_pt2 || 0}</div>
                  <div className="text-sm text-blue-700 font-medium">Final: {mentor.max_final_year || 0}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default MentorsOverview;