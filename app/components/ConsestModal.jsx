import React from 'react';

const ConsentModal = ({ show, handleClose, handleConsent }) => {
  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    handleConsent();
    handleClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-4">
          Consent for SMS Notifications
        </h3>
        <p className="mb-4">
          By selecting SMS notifications, you agree to receive text messages to
          your provided phone number. Standard messaging rates may apply. You
          can opt-out at any time by updating your notification preferences.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="p-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="p-2 bg-green-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
