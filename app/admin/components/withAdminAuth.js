/* eslint-disable react/display-name */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/components/UserContext';

const withAdminAuth = (Component) => {
  return (props) => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user || !user.isAdmin) {
          router.push('/');
        }
      }
    }, [user, loading, router]);

    if (loading || !user || !user.isAdmin) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAdminAuth;
