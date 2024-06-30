'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  memberNumber: string;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const params = useParams();
  const memberNumber = params.memberNumber as string;

  useEffect(() => {
    console.log('Edit page mounted, memberNumber:', memberNumber);

    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const currentUser = await response.json();
          if (currentUser.memberNumber !== memberNumber) {
            router.push('/profile/' + currentUser.memberNumber);
            return;
          }
          setUser(currentUser);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error in EditProfilePage:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, memberNumber]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      {/* 編集フォームのJSX */}
    </div>
  );
}
