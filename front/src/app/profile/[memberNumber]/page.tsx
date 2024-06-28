'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Navbar from '../../../components/Navber';

interface User {
  id: number;
  name: string;
  email: string;
  memberNumber: string;
}

export default function ProfilePage() {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { memberNumber } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${memberNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const userData = await response.json();
        setProfileUser(userData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        router.push('/404');
      }
    };

    const fetchCurrentUser = async () => {
      const token = Cookies.get('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch current user data');
        }
        const userData = await response.json();
        setCurrentUser(userData);
        setIsOwnProfile(userData.memberNumber === memberNumber);
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchProfileUser();
    fetchCurrentUser();
  }, [memberNumber, router]);

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={!!currentUser} username={currentUser?.name} />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-gray-600 font-semibold w-32">Name:</span>
            <span className="text-gray-800">{profileUser.name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-semibold w-32">Email:</span>
            <span className="text-gray-800">{profileUser.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-semibold w-32">Member Number:</span>
            <span className="text-gray-800">{profileUser.memberNumber}</span>
          </div>
        </div>
        {isOwnProfile && (
          <div className="mt-8">
            <Link href={`/profile/${profileUser.memberNumber}/edit`}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                Edit Profile
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
