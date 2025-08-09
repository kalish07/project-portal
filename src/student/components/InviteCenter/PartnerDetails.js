import React from "react";

const PartnerDetails = ({ partner, setSelectedPartner, setInviteTab }) => {
  if (!partner) return null; // ⛑️ Early return if partner is not provided

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-3xl font-semibold text-blue-600">
            {partner.name?.charAt(0) || "?"}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          {partner.student_name}
        </h3>
        <p className="text-gray-500 mb-4">
          {partner.department_name}
        </p>
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
            Reg No: {partner.reg_number}
          </span>
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {partner.email}
          </span>
        </div>

        <a
          href={`https://wa.me/${partner.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          <i className="fab fa-whatsapp mr-2 text-lg"></i>
          Message on WhatsApp
        </a>
        <a
          href={`mailto:${partner.email}`}
          className="mt-2 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-envelope mr-2 text-lg"></i>
          Send Email
        </a>
        <button
          onClick={() => {
            setSelectedPartner(null);
            setInviteTab("find");
          }}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Change Partner
        </button>
      </div>
    </div>
  );
};

export default PartnerDetails;
