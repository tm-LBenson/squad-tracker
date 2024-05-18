// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_KEY,
  authDomain: 'squad-tracker-12f25.firebaseapp.com',
  projectId: 'squad-tracker-12f25',
  storageBucket: 'squad-tracker-12f25.appspot.com',
  messagingSenderId: '306845530848',
  appId: '1:306845530848:web:63ce45502f0a80fddaae85',
  measurementId: 'G-X6YKPHFDC5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export { db, auth, provider };
