/* eslint-disable react/display-name */
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const withAuth = (Component) => {
  return (props) => {
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        }
      });
      return () => unsubscribe();
    }, [router, auth]);

    return <Component {...props} />;
  };
};

export default withAuth;
