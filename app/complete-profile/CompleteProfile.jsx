'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rankOptions = [
  'PVT',
  'PV2',
  'PFC',
  'SPC',
  'CPL',
  'SGT',
  'SSG',
  'SFC',
  '2LT',
  '1LT',
  'CPT',
];

const positionOptions = ['Squad Leader'];

const CompleteProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rank, setRank] = useState('');
  const [unit, setUnit] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [position, setPosition] = useState('');
  const [squadNumber, setSquadNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          router.push('/'); // Redirect if profile exists
        }
      }
    };
    checkUserProfile();
  }, [user, router]);

  const handleProfileCompletion = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        rank,
        unit,
        platoon,
        position,
        squadNumber: position === 'Squad Leader' ? squadNumber : '',
        phoneNumber,
        email: user.email,
        uid: user.uid,
        approved: false, // New users need to be approved
      });
      toast.success('Profile submitted for approval!');
      router.push('/');
    } catch (error) {
      toast.error('Error completing profile.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
        <form onSubmit={handleProfileCompletion}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rank</label>
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            >
              <option value="">Select Rank</option>
              {rankOptions.map((rankOption) => (
                <option
                  key={rankOption}
                  value={rankOption}
                >
                  {rankOption}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Platoon</label>
            <input
              type="text"
              value={platoon}
              onChange={(e) => setPlatoon(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            >
              <option value="">Select Position</option>
              {positionOptions.map((positionOption) => (
                <option
                  key={positionOption}
                  value={positionOption}
                >
                  {positionOption}
                </option>
              ))}
            </select>
          </div>
          {position === 'Squad Leader' && (
            <div className="mb-4">
              <label className="block text-gray-700">Squad Number</label>
              <input
                type="number"
                value={squadNumber}
                onChange={(e) => setSquadNumber(e.target.value)}
                className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Complete Profile
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CompleteProfile;
