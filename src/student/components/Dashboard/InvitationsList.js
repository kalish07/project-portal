import React, { useRef, useEffect, useState } from "react";

const InvitationsList = ({ invitations = [], loading, onAccept, onReject }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.firstChild?.offsetWidth + 16 || 1; // width + gap
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Incoming Partner Invitations
        </h3>
        <p className="text-center text-gray-500 py-4">Loading...</p>
      </div>
    );
  }

  if (!invitations.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Incoming Partner Invitations
        </h3>
        <p className="text-center text-gray-500 py-8">No incoming invitations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Incoming Partner Invitations
      </h3>

      {/* Mobile Carousel */}
      <div className="lg:hidden relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {invitations.map((inv, idx) => (
            <div
              key={inv.id}
              className={`flex-shrink-0 w-72 rounded-lg p-4 bg-gray-50 border border-gray-200 shadow-sm transition-transform duration-300 snap-start ${
                activeIndex === idx ? "scale-105 shadow-md" : "scale-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100 overflow-hidden">
                  {inv.sender.profilePic ? (
                    <img
                      src={inv.sender.profilePic}
                      alt={inv.sender.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-700 font-semibold">
                      {inv.sender.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{inv.sender.name}</p>
                  <p className="text-gray-500 text-sm">{inv.sender.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAccept(inv.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(inv.id)}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-2 space-x-1">
          {invitations.map((_, idx) => (
            <span
              key={idx}
              className={`block w-2 h-2 rounded-full transition-all ${
                activeIndex === idx ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {invitations.map((inv) => (
          <div
            key={inv.id}
            className="rounded-lg p-4 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100 overflow-hidden">
                {inv.sender.profilePic ? (
                  <img
                    src={inv.sender.profilePic}
                    alt={inv.sender.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-700 font-semibold">
                    {inv.sender.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{inv.sender.name}</p>
                <p className="text-gray-500 text-sm">{inv.sender.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAccept(inv.id)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(inv.id)}
                className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitationsList;