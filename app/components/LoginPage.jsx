import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/firebaseConfig';
import GoogleLogoSVG from '../components/GoogleLogoSVG';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      toast.error('Google login failed.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex md:flex-row flex-col h-screen">
      <div className="flex md:w-1/2 h-1/4 md:h-full bg-black items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold">Squad Tracker</h1>
          <h2 className="mt-4 text-3xl">Easily track your squad.</h2>
          <p>Notifications for important events.</p>
        </div>
      </div>
      <div className="flex md:w-1/2 bg-gradient-to-r from-purple-500 h-3/4 md:h-full to-indigo-500 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6">Sign in</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Sign in
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>OR</p>
            <button
              onClick={handleGoogleLogin}
              className="px-4 py-2.5 text-lg rounded-md bg-white border border-gray-400 w-full outline-blue-500 flex items-center gap-3 justify-center"
            >
              <GoogleLogoSVG /> Continue with Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
