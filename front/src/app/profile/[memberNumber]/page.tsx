'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  memberNumber: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { memberNumber } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:3000/api/users/${memberNumber}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // ログインユーザーの情報と比較
        const currentUser = Cookies.get('user');
        if (currentUser) {
          const { memberNumber: currentMemberNumber } = JSON.parse(currentUser);
          setIsOwnProfile(currentMemberNumber === memberNumber);
        }
      }
    };

    fetchUser();
  }, [memberNumber]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Member Number: {user.memberNumber}</p>
      {isOwnProfile && <button>Edit Profile</button>}
    </div>
  );
}
