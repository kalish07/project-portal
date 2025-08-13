import React from "react";
import PropTypes from "prop-types";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map(word => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const PartnerManagement = ({
  inviteStatus = "none",
  selectedPartner = null,
  filteredStudents = [],
  searchQuery = "",
  setSearchQuery = () => {},
  sendPartnerInvite = () => {},
  withdrawPartnerInvite = () => {},
  goSolo = () => {},
  students = [],
  teammate = null
}) => {
  const selectedStudent = students.find((s) => s.id === Number(selectedPartner));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-6 pb-4 text-white">
        <h3 className="text-2xl font-bold mb-2">Partner Management</h3>
        <p className="text-indigo-100">Collaborate with your teammate or work solo</p>
      </div>

      <div className="p-6">
        {/* ✅ Show fixed teammate if already in a team */}
        {teammate ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-8 pb-6 text-white">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with gradient border */}
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
                    {teammate.profile_pic_url ? (
                      <img
                        src={teammate.profile_pic_url}
                        alt="Teammate"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {getInitials(teammate.student_name)}
                      </span>
                    )}
                  </div>
                  {/* Partnership status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold mb-2">{teammate.student_name}</h4>
                
                {/* Partnership badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-400 text-yellow-900">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  PARTNER
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Info Section */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Partner Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Registration Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Registration</p>
                        <p className="text-lg font-bold text-purple-900">{teammate.reg_number || "______"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Department Info */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Department</p>
                        <p className="text-sm font-bold text-emerald-900">{teammate.department_name || "__________"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  Quick Contact
                </h5>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${teammate.phone_number || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                      </svg>
                      Message on WhatsApp
                    </span>
                  </a>

                  {/* Email Button */}
                  <a
                    href={`mailto:${teammate.email || ''}`}
                    className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer with subtle pattern */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Active partnership
                </span>
              </div>
            </div>
          </div>
        ) : inviteStatus === "outgoing" ? (
          // ✅ Outgoing invite in progress
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-800">Invitation Sent</p>
                  <p className="text-amber-600">
                    Waiting for response from {selectedStudent?.student_name || "selected student"}
                  </p>
                </div>
              </div>
              <button
                onClick={withdrawPartnerInvite}
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Withdraw</span>
              </button>
            </div>
          </div>
        ) : (
          // ✅ No team and no invite - allow searching partners
          <>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="mb-6 max-h-96 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group"
                    >
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center overflow-hidden shadow-md">
                            {student.profile_pic_url ? (
                              <img
                                src={student.profile_pic_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-semibold text-indigo-600">
                                {getInitials(student.student_name)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-gray-900 truncate mb-1">
                            {student.student_name || "Unknown"}
                          </p>
                          <p className="text-gray-600 text-sm truncate mb-3">{student.email || "No email"}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs px-3 py-1 rounded-lg font-medium border border-indigo-100">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                              Reg: {student.reg_number || "______"}
                            </span>
                            <span className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg font-medium border border-gray-200">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              Dept: {student.department_name || "__________"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => sendPartnerInvite(student.id)}
                        className="ml-4 group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative">Send Invite</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500 mb-2">
                    {searchQuery ? "No matching students found" : "No students available"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={goSolo}
              className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center space-x-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Proceed Solo</span>
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

PartnerManagement.propTypes = {
  inviteStatus: PropTypes.oneOf(["none", "outgoing", "accepted", "rejected"]),
  selectedPartner: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filteredStudents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      student_name: PropTypes.string,
      email: PropTypes.string,
      reg_number: PropTypes.string,
      department_name: PropTypes.string,
      profile_pic_url: PropTypes.string
    })
  ),
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  sendPartnerInvite: PropTypes.func,
  withdrawPartnerInvite: PropTypes.func,
  goSolo: PropTypes.func,
  students: PropTypes.array,
  teammate: PropTypes.object
};
export default PartnerManagement;