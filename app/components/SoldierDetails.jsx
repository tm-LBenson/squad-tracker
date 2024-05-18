const SoldierDetails = ({ soldier, onEdit, onClose }) => {
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white mt-4">
      <h2 className="text-2xl font-bold mb-4">Soldier Details</h2>
      <ul>
        {Object.keys(soldier.data).map((key, index) => (
          <li
            key={index}
            className="mb-2"
          >
            <strong>{key}:</strong> {soldier.data[key]}
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          onClick={onEdit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Edit Soldier
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Close Details
        </button>
      </div>
    </div>
  );
};

export default SoldierDetails;
