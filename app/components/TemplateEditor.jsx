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
import { useUser } from './UserContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragHandle from './DragHandle';
import ConsentModal from './ConsestModal';

const notificationTypes = ['None', 'SMS'];
const notificationPeriods = [30, 60, 90];

const TemplateEditor = ({ onSave, onCancel }) => {
  const [fields, setFields] = useState([]);
  const [originalFields, setOriginalFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const { user } = useUser();
  const squadLeaderId = user?.uid;

  useEffect(() => {
    const fetchTemplate = async () => {
      const templateDoc = await getDoc(doc(db, 'templates', squadLeaderId));
      if (templateDoc.exists()) {
        const templateData = templateDoc.data().fields;
        setFields(templateData);
        setOriginalFields(templateData);
      } else {
        const defaultFields = [
          {
            name: 'Full Name',
            type: 'text',
            required: true,
            editable: false,
            notification: 'None',
            notificationPeriod: 0,
          },
        ];
        setFields(defaultFields);
        setOriginalFields(defaultFields);
      }
    };
    fetchTemplate();
  }, [squadLeaderId]);

  const addField = () => {
    setFields([
      ...fields,
      {
        name: '',
        type: 'text',
        required: false,
        editable: true,
        notification: 'None',
        notificationPeriod: 0,
      },
    ]);
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

        newFields.forEach((field) => {
          if (!(field.name in updatedSoldierData)) {
            updatedSoldierData[field.name] = '';
          }
        });

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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    setFields(reorderedFields);
  };

  const handleNotificationChange = (index, value) => {
    if (value === 'SMS') {
      setSelectedFieldIndex(index);
      setShowConsentModal(true);
    } else {
      const newFields = [...fields];
      newFields[index].notification = value;
      setFields(newFields);
    }
  };

  const handleConsent = () => {
    const newFields = [...fields];
    newFields[selectedFieldIndex].notification = 'SMS';
    setFields(newFields);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Template Editor</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {fields.map((field, index) => (
                <Draggable
                  key={index}
                  draggableId={`field-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center mb-3"
                    >
                      <DragHandle />
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => {
                          if (field.editable) {
                            const newFields = [...fields];
                            newFields[index].name = e.target.value;
                            setFields(newFields);
                          }
                        }}
                        placeholder="Field Name"
                        className={
                          field.editable
                            ? 'px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2 text-black'
                            : 'px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2 text-slate-400'
                        }
                        disabled={!field.editable}
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          if (field.editable) {
                            const newFields = [...fields];
                            newFields[index].type = e.target.value;
                            setFields(newFields);
                          }
                        }}
                        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
                        disabled={!field.editable}
                      >
                        <option value="text">Text</option>
                        <option value="date">Date</option>
                      </select>
                      <select
                        value={field.notification}
                        onChange={(e) =>
                          handleNotificationChange(index, e.target.value)
                        }
                        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
                      >
                        {notificationTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                      <select
                        value={field.notificationPeriod}
                        onChange={(e) => {
                          if (field.editable) {
                            const newFields = [...fields];
                            newFields[index].notificationPeriod =
                              e.target.value;
                            setFields(newFields);
                          }
                        }}
                        className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 mr-2"
                        disabled={!field.editable}
                      >
                        {notificationPeriods.map((period) => (
                          <option
                            key={period}
                            value={period}
                          >
                            {period} days
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center mr-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            if (field.editable) {
                              const newFields = [...fields];
                              newFields[index].required = e.target.checked;
                              setFields(newFields);
                            }
                          }}
                          className="mr-1"
                          disabled={!field.editable}
                        />
                        Required
                      </label>
                      {field.editable ? (
                        <button
                          onClick={() => confirmRemoveField(index)}
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-slate-400 text-white rounded"
                          disabled
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
      <ConsentModal
        show={showConsentModal}
        handleClose={() => setShowConsentModal(false)}
        handleConsent={handleConsent}
      />
      <ToastContainer />
    </div>
  );
};

export default TemplateEditor;
