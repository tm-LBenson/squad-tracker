'use client';
import React from 'react';
import { useUser } from './UserContext';

const SoldierDetails = ({ soldier, fields, onEdit, onClose }) => {
  const { user } = useUser();

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Soldier Details</h2>
      <button
        onClick={onClose}
        className="p-2 bg-gray-500 text-white rounded mb-4"
      >
        Close
      </button>
      <button
        onClick={onEdit}
        className="p-2 bg-blue-500 text-white rounded mb-4 ml-2"
      >
        Edit
      </button>
      <div className="grid grid-cols-1 gap-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="flex flex-col"
          >
            <span className="font-bold">{field.name}</span>
            <span>{soldier.data[field.name] || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoldierDetails;
