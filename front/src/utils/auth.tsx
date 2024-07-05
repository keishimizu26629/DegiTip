'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { fetchCurrentUser } from '../services/userService';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const currentUser = await fetchCurrentUser(token);
          router.push(`/profile/${currentUser.memberNumber}`);
        }
      } catch (error) {
        Cookies.remove('token');
        router.push('/404');
      }
    };

    checkToken();
  }, [router]);

  return <>{children}</>;
}
