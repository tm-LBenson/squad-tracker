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
import ConsentModal from './ConsentModal';
import FieldEditor from './FieldEditor';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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
                      <FieldEditor
                        field={field}
                        index={index}
                        fields={fields}
                        setFields={setFields}
                        handleNotificationChange={handleNotificationChange}
                        confirmRemoveField={confirmRemoveField}
                      />
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
        <ConfirmDeleteModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          removeField={() => removeField(deleteIndex)}
        />
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
