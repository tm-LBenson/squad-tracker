import { useState, useEffect } from 'react';
import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TemplateEditor = ({ onSave, onCancel }) => {
  const [fields, setFields] = useState([
    { name: 'name', type: 'text', required: true },
    { name: 'rank', type: 'text', required: true },
  ]);
  const [originalFields, setOriginalFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const squadLeaderId = 'squadLeader123'; // Get this from auth context

  useEffect(() => {
    const fetchTemplate = async () => {
      const templateDoc = await getDoc(doc(db, 'templates', squadLeaderId));
      if (templateDoc.exists()) {
        const templateData = templateDoc.data().fields;
        setFields(templateData);
        setOriginalFields(templateData);
      }
    };
    fetchTemplate();
  }, [squadLeaderId]);

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', required: false }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
    setShowModal(false);
    setDeleteIndex(null);
  };

  const confirmRemoveField = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const updateSoldiers = async (newFields) => {
    const soldiersSnapshot = await getDocs(collection(db, 'soldiers'));
    const updatePromises = soldiersSnapshot.docs.map((soldierDoc) => {
      if (soldierDoc.data().squadLeaderId === squadLeaderId) {
        const soldierData = soldierDoc.data().data;
        const updatedSoldierData = { ...soldierData };

        // Add new fields
        newFields.forEach((field) => {
          if (!(field.name in updatedSoldierData)) {
            updatedSoldierData[field.name] = '';
          }
        });

        // Remove deleted fields
        Object.keys(soldierData).forEach((key) => {
          if (!newFields.some((field) => field.name === key)) {
            delete updatedSoldierData[key];
          }
        });

        return updateDoc(doc(db, 'soldiers', soldierDoc.id), {
          data: updatedSoldierData,
        });
      }
      return Promise.resolve();
    });
    await Promise.all(updatePromises);
  };

  const saveTemplate = async () => {
    await setDoc(doc(db, 'templates', squadLeaderId), {
      fields,
    });
    toast.success('Template saved successfully!');
    await updateSoldiers(fields);
    onSave();
  };

  const cancelChanges = () => {
    setFields(originalFields);
    onCancel();
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Template Editor</h2>
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center mb-3"
        >
          <input
            type="text"
            value={field.name}
            onChange={(e) => {
              const newFields = [...fields];
              newFields[index].name = e.target.value;
              setFields(newFields);
            }}
            placeholder="Field Name"
            className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
          />
          <select
            value={field.type}
            onChange={(e) => {
              const newFields = [...fields];
              newFields[index].type = e.target.value;
              setFields(newFields);
            }}
            className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
          >
            <option value="text">Text</option>
            <option value="date">Date</option>
          </select>
          <label className="flex items-center mr-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].required = e.target.checked;
                setFields(newFields);
              }}
              className="mr-1"
            />
            Required
          </label>
          <button
            onClick={() => confirmRemoveField(index)}
            className="p-2 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <button
          onClick={addField}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Field
        </button>
        <button
          onClick={saveTemplate}
          className="p-2 bg-green-500 text-white rounded"
        >
          Save Template
        </button>
        <button
          onClick={cancelChanges}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this field?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => removeField(deleteIndex)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TemplateEditor;
