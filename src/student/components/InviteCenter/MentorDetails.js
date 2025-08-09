import React from "react";

const MentorDetails = ({ mentor = {}, withdrawMentorRequest, teamApproved = false }) => {
  const {
    name = "Unknown",
    availability = "No",
    expertise = [],
    phone = "",
    email = ""
  } = mentor;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <span className="text-3xl font-semibold text-indigo-600">
            {name.charAt(0)}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-500 mb-4">{availability} Availability</p>

        <div className="mb-4">
          {Array.isArray(expertise) && expertise.length > 0 ? (
            expertise.map((exp, i) => (
              <span
                key={i}
                className="inline-block bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full mr-2 mb-2"
              >
                {exp}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No expertise listed.</p>
          )}
        </div>

        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          <i className="fab fa-whatsapp mr-2 text-lg"></i>
          Message on WhatsApp
        </a>
        <a
          href={`mailto:${email}`}
          className="mt-2 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-envelope mr-2 text-lg"></i>
          Send Email
        </a>

        {/* Only show button if team is NOT approved */}
        {!teamApproved && (
          <button
            onClick={withdrawMentorRequest}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Change Mentor
          </button>
        )}
      </div>
    </div>
  );
};

export default MentorDetails;
