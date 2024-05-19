import React from 'react';

const ConsentModal = ({ show, handleClose, handleConsent }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl mb-4">Consent Required</h3>
        <p>
          By checking &quot;SMS&quot;, you consent to receive text messages.
          Standard messaging rates may apply. Please confirm your consent to
          proceed.
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleClose}
            className="p-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConsent}
            className="p-2 bg-green-500 text-white rounded"
          >
            I Consent
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
