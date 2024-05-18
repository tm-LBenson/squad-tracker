'use client';
import { useState, useEffect } from 'react';
import SoldierForm from './components/SoldierForm';
import SoldierList from './components/SoldierList';
import SoldierDetails from './components/SoldierDetails';
import TemplateEditor from './components/TemplateEditor';
import withAuth from './components/withAuth';
import { UserProvider, useUser } from './components/UserContext';
import Header from './components/Header';
import { auth, db } from '@/firebaseConfig';
import Loading from './loading';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedSoldier, setSelectedSoldier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingSoldier, setIsAddingSoldier] = useState(false);
  const [templateFields, setTemplateFields] = useState([]);
  const user = useUser()?.user;
  const setUser = useUser()?.setUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          setUser({ ...authUser, ...userDoc.data() });
          const templateDoc = await getDoc(doc(db, 'templates', authUser.uid));
          if (templateDoc.exists()) {
            setTemplateFields(templateDoc.data().fields);
          }
        } else {
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleFormSubmit = () => {
    setSelectedSoldier(null);
    setIsAddingSoldier(false);
  };

  const handleAddSoldier = () => {
    setIsAddingSoldier(true);
    setSelectedSoldier(null);
  };

  const handleEditSoldier = () => {
    setIsAddingSoldier(true);
  };

  const handleCloseDetails = () => {
    setSelectedSoldier(null);
  };

  const handleOpenTemplateEditor = () => {
    setShowTemplateEditor(true);
    setSelectedSoldier(null);
    setIsAddingSoldier(false);
  };

  const handleCloseTemplateEditor = () => {
    setShowTemplateEditor(false);
  };

  return (
    <UserProvider>
      <Header isLoggedIn={true} />
      {user ? (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100">
          <h2 className="text-4xl font-bold mb-6">Leaders Tracker</h2>
          <button
            onClick={handleOpenTemplateEditor}
            className="p-2 bg-blue-500 text-white rounded mb-4"
          >
            {showTemplateEditor
              ? 'Close Template Editor'
              : 'Open Template Editor'}
          </button>
          {showTemplateEditor ? (
            <TemplateEditor
              onSave={handleCloseTemplateEditor}
              onCancel={handleCloseTemplateEditor}
            />
          ) : (
            <>
              <hr className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SoldierList onSelectSoldier={setSelectedSoldier} />
                {!selectedSoldier && !isAddingSoldier ? (
                  <button
                    onClick={handleAddSoldier}
                    className="bg-green-500 max-w-40 text-white py-2 rounded-lg hover:bg-green-700 max-h-10 transition duration-200"
                  >
                    Add Soldier
                  </button>
                ) : (
                  selectedSoldier &&
                  !isAddingSoldier && (
                    <SoldierDetails
                      soldier={selectedSoldier}
                      fields={templateFields}
                      onEdit={handleEditSoldier}
                      onClose={handleCloseDetails}
                    />
                  )
                )}
                {(selectedSoldier && isAddingSoldier) || isAddingSoldier ? (
                  <SoldierForm
                    selectedSoldier={selectedSoldier}
                    onFormSubmit={handleFormSubmit}
                    isAdding={isAddingSoldier}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </UserProvider>
  );
};

export default withAuth(Home);
