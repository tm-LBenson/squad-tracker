import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './UserContext';

const SoldierList = ({ onSelectSoldier }) => {
  const [soldiers, setSoldiers] = useState([]);
  const { user } = useUser();

  const squadLeaderId = user?.fullName;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'soldiers'), (snapshot) => {
      const soldiersList = snapshot.docs
        .filter((doc) => doc.data().squadLeaderId === squadLeaderId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setSoldiers(soldiersList);
    });
    return () => unsub();
  }, [squadLeaderId]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'soldiers', id));
    setSoldiers(soldiers.filter((soldier) => soldier.id !== id));
    toast.success('Soldier deleted successfully!');
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Soldier List</h2>
      {soldiers.length === 0 ? (
        <p>No soldiers found.</p>
      ) : (
        <ul>
          {soldiers.map((soldier) => (
            <li
              key={soldier.id}
              className="flex justify-between items-center mb-2"
            >
              <span
                onClick={() => onSelectSoldier(soldier)}
                className="cursor-pointer"
              >
                {soldier.data['Full Name']}
              </span>
              <button
                onClick={() => handleDelete(soldier.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default SoldierList;
