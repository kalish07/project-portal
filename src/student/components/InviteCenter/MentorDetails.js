
import React from "react";

const MentorDetails = ({ mentor = {}, withdrawMentorRequest, teamApproved = false }) => {
  const {
    name = "Unknown",
    availability = "No",
    expertise = [],
    phone = "",
    email = ""
  } = mentor;

  const getAvailabilityColor = (availability) => {
    if (availability.toLowerCase().includes('high') || availability.toLowerCase().includes('yes')) {
      return 'text-green-600 bg-green-50';
    } else if (availability.toLowerCase().includes('medium') || availability.toLowerCase().includes('partial')) {
      return 'text-yellow-600 bg-yellow-50';
    } else {
      return 'text-red-600 bg-red-50';
    }
  };

  const getAvailabilityIcon = (availability) => {
    if (availability.toLowerCase().includes('high') || availability.toLowerCase().includes('yes')) {
      return '✓';
    } else if (availability.toLowerCase().includes('medium') || availability.toLowerCase().includes('partial')) {
      return '◐';
    } else {
      return '○';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-8 pb-6 text-white">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with gradient border */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
              <span className="text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          
          {/* Availability badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(availability)} bg-white/90 text-gray-800`}>
            <span className="mr-2">{getAvailabilityIcon(availability)}</span>
            {availability} Availability
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Expertise Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Expertise
          </h4>
          {Array.isArray(expertise) && expertise.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {expertise.map((exp, i) => (
                <span
                  key={i}
                  className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm px-3 py-2 rounded-lg font-medium border border-indigo-100 hover:border-indigo-200 transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                  {exp}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center text-gray-400 text-sm italic bg-gray-50 px-4 py-3 rounded-lg">
              <span className="text-gray-300 mr-2">ⓘ</span>
              No expertise listed yet
            </div>
          )}
        </div>

        {/* Contact Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                </svg>
                Message on WhatsApp
              </span>
            </a>

            {/* Email Button */}
            <a
              href={`mailto:${email}`}
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

          {/* Change Mentor Button */}
          {!teamApproved && (
            <button
              onClick={withdrawMentorRequest}
              className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 mt-4"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Change Mentor
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer with subtle pattern */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Ready to help you succeed
          </span>
        </div>
      </div>
    </div>
  );
};

export default MentorDetails;
