import React from 'react';

const ConfirmDeleteModal = ({ show, handleClose, removeField }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl mb-4">Confirm Delete</h3>
        <p>Are you sure you want to delete this field?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleClose}
            className="p-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={removeField}
            className="p-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
