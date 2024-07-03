'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Navbar from '../../../components/Navbar';
import { UserProfile } from '../../../interfaces/Profile';
import Avatar from '../../../components/Profile/Avatar';
import HeaderImage from '../../../components/Profile/HeaderImage';
import Card from '../../../components/Profile/Card';
import ProfileDetails from '../../../components/Profile/ProfileDetails';

const ProfilePage = () => {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { memberNumber } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${memberNumber}`,
        );
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar
        isLoggedIn={!!currentUser}
        avatarUrl={currentUser?.avatarUrl}
        memberNumber={currentUser?.memberNumber}
      />
      <Card>
        <HeaderImage src={profileUser.headerImageUrl!} />
        <div className="relative -mt-20 px-6">
          <Avatar src={profileUser.avatarUrl!} />
        </div>

        <ProfileDetails
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          isEditable={false}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
