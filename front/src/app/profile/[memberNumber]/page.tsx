'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '../../../components/Navbar';
import { UserProfile } from '../../../interfaces/Profile';
import Avatar from '../../../components/Profile/Avatar';
import HeaderImage from '../../../components/Profile/HeaderImage';
import Card from '../../../components/Profile/Card';
import ProfileDetails from '../../../components/Profile/ProfileDetails';
import PaymentSection from '../../../components/payment/PaymentSection';
import { fetchProfileUser, fetchCurrentUser } from '../../../services/userService';

const ProfilePage = () => {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { memberNumber } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberNumberString = Array.isArray(memberNumber) ? memberNumber[0] : memberNumber;
        const profileUser = await fetchProfileUser(memberNumberString);
        setProfileUser(profileUser);
        const token = Cookies.get('token');
        if (token) {
          const currentUser = await fetchCurrentUser(token);
          if (currentUser.error) {
            Cookies.remove('token');
          }
          setCurrentUser(currentUser);
          setIsOwnProfile(currentUser.memberNumber === memberNumber);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
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

        <PaymentSection
          isOwnProfile={isOwnProfile}
          memberNumber={memberNumber}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
