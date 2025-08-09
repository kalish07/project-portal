import React, { useState, useRef, useEffect as useReactEffect } from 'react';
import { fetchUnassignedStudents, forcePairStudents } from '../../api/AdminApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ForcePairModal = () => {
  const [firstStudentId, setFirstStudentId] = useState('');
  const [secondStudentId, setSecondStudentId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState('');
  // Search query state for dropdowns
  const [firstSearchQuery, setFirstSearchQuery] = useState('');
  const [secondSearchQuery, setSecondSearchQuery] = useState('');

  // Dropdown open state
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showFirstStudentDropdown, setShowFirstStudentDropdown] = useState(false);
  const [showSecondStudentDropdown, setShowSecondStudentDropdown] = useState(false);

  // Refs for dropdowns for outside click
  const projectDropdownRef = useRef(null);
  const firstStudentDropdownRef = useRef(null);
  const secondStudentDropdownRef = useRef(null);

  // Utility function to generate initials from name
  const generateInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  useEffect(() => {
    if (!projectType) return;

    const fetchAndSetStudents = async () => {
      try {
        let semesterFilter = [];
        if (projectType === "PT-1") semesterFilter = [5];
        else if (projectType === "PT-2") semesterFilter = [6];
        else if (projectType === "Final-Year") semesterFilter = [7, 8];

        const res = await fetchUnassignedStudents();
        const filtered = res.students.filter(s => semesterFilter.includes(s.current_semester));
        setStudents(filtered.sort((a, b) => a.reg_number.localeCompare(b.reg_number)));
      } catch (err) {
        console.error("Failed to load students:", err);
        toast.error("Failed to load students");
      }
    };

    fetchAndSetStudents();
  }, [projectType]);

  const handlePair = async () => {
    if (!firstStudentId || !secondStudentId || firstStudentId === secondStudentId) {
      toast.error("Select two different students");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await forcePairStudents({
        student1_id: firstStudentId,
        student2_id: secondStudentId,
        projectType
      });
      toast.success("Team created successfully!");
      setFirstStudentId('');
      setSecondStudentId('');
      document.getElementById('forcePairModal').style.display = 'none';
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create team. Please try again.";
      console.error("Backend error during pairing:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle closing dropdowns on click outside
  useReactEffect(() => {
    function handleClickOutside(event) {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target)
      ) {
        setShowProjectDropdown(false);
      }
      if (
        firstStudentDropdownRef.current &&
        !firstStudentDropdownRef.current.contains(event.target)
      ) {
        setShowFirstStudentDropdown(false);
      }
      if (
        secondStudentDropdownRef.current &&
        !secondStudentDropdownRef.current.contains(event.target)
      ) {
        setShowSecondStudentDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="forcePairModal" className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Force Team Pairing</h3>
            <p className="text-gray-500 text-sm mt-1">Create a new team by pairing two unassigned students</p>
          </div>
          <button onClick={() => document.getElementById('forcePairModal').style.display = 'none'} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <i className="fas fa-project-diagram mr-2 text-indigo-600"></i>
            Select Project Type
          </label>
          <div className="relative group" ref={projectDropdownRef}>
            <div
              onClick={() => setShowProjectDropdown((show) => !show)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 pr-10 bg-white shadow-sm cursor-pointer hover:border-indigo-400 transition-all duration-300 relative"
              tabIndex={0}
            >
              {projectType || "Select project type..."}
              <i className={`fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300 ${showProjectDropdown ? 'rotate-180' : ''}`}></i>
            </div>
            {showProjectDropdown && (
              <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10 transition-all duration-200">
                {["PT-1", "PT-2", "Final-Year"].map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setProjectType(type);
                      setShowProjectDropdown(false);
                      setFirstStudentId('');
                      setSecondStudentId('');
                    }}
                    className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer transition-colors duration-150 ${projectType === type ? 'bg-indigo-50 font-semibold' : ''}`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-user-graduate mr-2 text-indigo-600"></i>
                First Student
              </label>
              <div className="relative group" ref={firstStudentDropdownRef}>
                <div
                  onClick={() => {
                    if (projectType) setShowFirstStudentDropdown((show) => !show);
                  }}
                  className={`w-full border-2 border-gray-300 rounded-lg p-3 pr-10 bg-white shadow-sm cursor-pointer transition-all duration-300 relative ${projectType ? 'hover:border-indigo-400' : 'bg-gray-100 cursor-not-allowed text-gray-400'}`}
                  tabIndex={0}
                >
                  {firstStudentId && students.find((s) => s.id == firstStudentId)
                    ? `${students.find((s) => s.id == firstStudentId).student_name} - ${students.find((s) => s.id == firstStudentId).reg_number}`
                    : "Select student..."}
                  <i className={`fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300 ${showFirstStudentDropdown ? 'rotate-180' : ''}`}></i>
                </div>
                {showFirstStudentDropdown && projectType && (
                  <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto transition-all duration-200">
                    <div className="px-2 py-1">
                      <input
                        type="text"
                        placeholder="Search by name or reg. no."
                        value={firstSearchQuery}
                        onChange={(e) => setFirstSearchQuery(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                      />
                    </div>
                    {students.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No students available</div>
                    )}
                    {students
                      .filter(s =>
                        s.student_name.toLowerCase().includes(firstSearchQuery.toLowerCase()) ||
                        s.reg_number.toLowerCase().includes(firstSearchQuery.toLowerCase())
                      )
                      .map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setFirstStudentId(s.id);
                            setShowFirstStudentDropdown(false);
                            setFirstSearchQuery('');
                          }}
                          className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer transition-colors duration-150 ${firstStudentId == s.id ? 'bg-indigo-50 font-semibold' : ''}`}
                        >
                          {s.student_name} - {s.reg_number}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div id="firstStudentDetails" className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                {firstStudentId && students.find((s) => s.id == firstStudentId) ? (
                  (() => {
                    const student = students.find((s) => s.id == firstStudentId);
                    return (
                      <div>
                        <div className="flex items-center mb-3">
                          {student.profile_pic_url ? (
                            <img
                              src={student.profile_pic_url}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg mr-3">
                              {generateInitials(student.student_name)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{student.student_name}</h4>
                            <p className="text-sm text-gray-500">{student.reg_number}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <i className="fas fa-graduation-cap text-indigo-500 mr-2"></i>
                            <span>{student.department_name}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <i className="fas fa-layer-group text-purple-500 mr-2"></i>
                            <span>Semester: {student.current_semester}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <i className="fas fa-envelope text-red-500 mr-2"></i>
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <i className="fas fa-user-graduate text-4xl"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-user-graduate mr-2 text-purple-600"></i>
                Second Student
              </label>
              <div className="relative group" ref={secondStudentDropdownRef}>
                <div
                  onClick={() => {
                    if (projectType) setShowSecondStudentDropdown((show) => !show);
                  }}
                  className={`w-full border-2 border-gray-300 rounded-lg p-3 pr-10 bg-white shadow-sm cursor-pointer transition-all duration-300 relative ${projectType ? 'hover:border-purple-400' : 'bg-gray-100 cursor-not-allowed text-gray-400'}`}
                  tabIndex={0}
                >
                  {secondStudentId && students.find((s) => s.id == secondStudentId)
                    ? `${students.find((s) => s.id == secondStudentId).student_name} - ${students.find((s) => s.id == secondStudentId).reg_number}`
                    : "Select student..."}
                  <i className={`fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300 ${showSecondStudentDropdown ? 'rotate-180' : ''}`}></i>
                </div>
                {showSecondStudentDropdown && projectType && (
                  <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto transition-all duration-200">
                    <div className="px-2 py-1">
                      <input
                        type="text"
                        placeholder="Search by name or reg. no."
                        value={secondSearchQuery}
                        onChange={(e) => setSecondSearchQuery(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                      />
                    </div>
                    {students.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No students available</div>
                    )}
                    {students
                      .filter(s =>
                        s.student_name.toLowerCase().includes(secondSearchQuery.toLowerCase()) ||
                        s.reg_number.toLowerCase().includes(secondSearchQuery.toLowerCase())
                      )
                      .map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSecondStudentId(s.id);
                            setShowSecondStudentDropdown(false);
                            setSecondSearchQuery('');
                          }}
                          className={`px-4 py-2 hover:bg-purple-100 cursor-pointer transition-colors duration-150 ${secondStudentId == s.id ? 'bg-purple-50 font-semibold' : ''}`}
                        >
                          {s.student_name} - {s.reg_number}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div id="secondStudentDetails" className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                {secondStudentId && students.find((s) => s.id == secondStudentId) ? (
                  (() => {
                    const student = students.find((s) => s.id == secondStudentId);
                    return (
                      <div>
                        <div className="flex items-center mb-3">
                          {student.profile_pic_url ? (
                            <img
                              src={student.profile_pic_url}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg mr-3">
                              {generateInitials(student.student_name)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{student.student_name}</h4>
                            <p className="text-sm text-gray-500">{student.reg_number}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <i className="fas fa-graduation-cap text-indigo-500 mr-2"></i>
                            <span>{student.department_name}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <i className="fas fa-layer-group text-purple-500 mr-2"></i>
                            <span>Semester: {student.current_semester}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <i className="fas fa-envelope text-red-500 mr-2"></i>
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <i className="fas fa-user-graduate text-4xl"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <i className="fas fa-puzzle-piece mr-2"></i>
              Team Compatibility Analysis
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Academic Match</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Similar CGPA Range
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Skill Complementarity</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <i className="fas fa-code-branch text-blue-500 mr-2"></i>
                    Diverse Tech Stack
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Schedule Compatibility</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <i className="fas fa-calendar-check text-purple-500 mr-2"></i>
                    Matching Availability
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Project Interest</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Complementary Interests
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100 flex items-center">
              <i className="fas fa-chart-line text-indigo-500 mr-3"></i>
              <span className="text-sm text-gray-600">Overall Compatibility Score: <span className="font-semibold text-indigo-600">87%</span></span>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => document.getElementById('forcePairModal').style.display = 'none'}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
            <button
              onClick={handlePair}
              disabled={loading}
              className={`px-8 py-3 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg ${loading ? '' : 'hover:shadow-indigo-500/50'}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Pairing...
                </>
              ) : (
                <>
                  <i className="fas fa-users mr-2"></i> Create Dream Team
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForcePairModal;