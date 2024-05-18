import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTemplate = {
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'rank', type: 'text', required: true },
    { name: 'dob', type: 'date', required: true },
    { name: 'email', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
    { name: 'certifications', type: 'text', required: false },
    { name: 'schoolSchedule', type: 'text', required: false },
    { name: 'SUTA', type: 'text', required: false },
    { name: 'counselingDocuments', type: 'text', required: false },
  ],
};

const SoldierForm = ({ selectedSoldier, onFormSubmit, isAdding }) => {
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const squadLeaderId = 'squadLeader123'; // Get this from auth context

  useEffect(() => {
    const fetchTemplate = async () => {
      const templateDoc = await getDoc(
        doc(collection(db, 'templates'), squadLeaderId),
      );
      if (templateDoc.exists()) {
        setTemplate(templateDoc.data());
      } else {
        toast.info(
          'No template found for this squad leader. Using default template.',
        );
        setTemplate(defaultTemplate);
        await setDoc(doc(db, 'templates', squadLeaderId), defaultTemplate);
      }
    };
    fetchTemplate();
  }, [squadLeaderId]);

  useEffect(() => {
    if (selectedSoldier) {
      setFormData(selectedSoldier.data);
    } else if (isAdding) {
      setFormData({});
    }
  }, [selectedSoldier, isAdding]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSoldier) {
      await setDoc(doc(db, 'soldiers', selectedSoldier.id), {
        squadLeaderId,
        data: formData,
      });
      toast.success('Soldier data updated successfully!');
    } else {
      await addDoc(collection(db, 'soldiers'), {
        squadLeaderId,
        data: formData,
      });
      toast.success('Soldier data saved successfully!');
    }
    onFormSubmit();
  };

  if (!template) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white mt-4">
        <h2 className="text-2xl font-bold mb-4">Loading template...</h2>
        <ToastContainer />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 font-[sans-serif] max-w-md mx-auto"
    >
      {template.fields.map((field, index) => (
        <div
          key={index}
          className="mb-4"
        >
          <label className="block mb-2">{field.name}</label>
          <input
            type={field.type}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
          />
        </div>
      ))}
      <button
        type="submit"
        className="p-2 bg-green-500 text-white rounded"
      >
        {selectedSoldier ? 'Update Soldier' : 'Save Soldier'}
      </button>
      <ToastContainer />
    </form>
  );
};

export default SoldierForm;
