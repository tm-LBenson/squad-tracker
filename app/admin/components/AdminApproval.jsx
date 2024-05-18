import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs
        .filter((doc) => !doc.data().approved)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingUsers(usersList);
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'users', id), { approved: true });
    setPendingUsers(pendingUsers.filter((user) => user.id !== id));
    toast.success('User approved successfully!');
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending users found.</p>
      ) : (
        <ul>
          {pendingUsers.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {user.fullName} ({user.email})
              </span>
              <button
                onClick={() => handleApprove(user.id)}
                className="p-2 bg-green-500 text-white rounded"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminApproval;
