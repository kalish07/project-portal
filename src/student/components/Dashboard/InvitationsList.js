import React, { useRef, useEffect, useState } from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const InvitationsList = ({ invitations = [], loading, onAccept, onReject }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    action: null,
    invId: null,
  });

  const openDialog = (action, invId) => {
    setDialog({ isOpen: true, action, invId });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, action: null, invId: null });
  };

  const handleConfirm = () => {
    if (dialog.action === "accept") {
      onAccept(dialog.invId);
    } else if (dialog.action === "reject") {
      onReject(dialog.invId);
    }
    closeDialog();
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.firstChild?.offsetWidth + 16 || 1;
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

      {/* Confirmation dialog */}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.action === "accept" ? "Accept Invitation" : "Reject Invitation"}
        message={
          dialog.action === "accept"
            ? "Are you sure you want to accept this invitation?"
            : "Are you sure you want to reject this invitation?"
        }
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />

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
              {/* Profile info */}
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
                  onClick={() => openDialog("accept", inv.id)}
                  className="flex-1 bg-green-500/20 text-green-700 border border-green-500/30 backdrop-blur-md px-4 py-2 rounded-md hover:bg-green-500/30 hover:text-green-800 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => openDialog("reject", inv.id)}
                  className="flex-1 bg-red-500/20 text-red-700 border border-red-500/30 backdrop-blur-md px-4 py-2 rounded-md hover:bg-red-500/30 hover:text-red-800 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* scroll indicator */}
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

      {/* Desktop grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="rounded-lg p-4 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              {/* profile info */}
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
                  onClick={() => openDialog("accept", inv.id)}
                  className="flex-1 bg-green-500/20 text-green-700 border border-green-500/30 backdrop-blur-md px-4 py-2 rounded-md hover:bg-green-500/30 hover:text-green-800 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => openDialog("reject", inv.id)}
                  className="flex-1 bg-red-500/20 text-red-700 border border-red-500/30 backdrop-blur-md px-4 py-2 rounded-md hover:bg-red-500/30 hover:text-red-800 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvitationsList;