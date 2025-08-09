import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "blue",
  cancelText = "Cancel",
  disableConfirm = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    yellow: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 
          id="modal-title"
          className="text-lg font-semibold mb-4 text-gray-900"
        >
          {title}
        </h4>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={disableConfirm}
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses[confirmColor]} ${
              disableConfirm ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  confirmColor: PropTypes.oneOf(["blue", "red", "green", "yellow"]),
  cancelText: PropTypes.string,
  disableConfirm: PropTypes.bool,
};

export default ConfirmationModal;