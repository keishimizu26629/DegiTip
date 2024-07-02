'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Navbar from '../../../components/Navbar';
import { UserProfile, ExtraProfile } from '../../../interfaces/Profile';
import { FaLink, FaImage, FaInfo } from 'react-icons/fa';

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

  const renderExtraProfile = (profile: ExtraProfile) => {
    const iconMap = {
      1: <FaLink className="text-indigo-600" />,
      2: <FaInfo className="text-indigo-600" />,
      3: <FaInfo className="text-indigo-600" />,
      4: <FaImage className="text-indigo-600" />,
    };

    return (
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        {iconMap[profile.contentTypeId as keyof typeof iconMap]}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{profile.title}</h3>
          {profile.contentTypeId === 1 ? (
            <a href={profile.content} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              {profile.content}
            </a>
          ) : profile.contentTypeId === 4 ? (
            <Image src={profile.content} alt={profile.title} width={300} height={200} className="rounded-md" objectFit="cover" />
          ) : (
            <p className="text-gray-600">{profile.content}</p>
          )}
        </div>
      </div>
    );
  };

  const EditProfileButton = () => (
    <Link href={`/profile/${profileUser.memberNumber}/edit`}>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out">
        Edit Profile
      </button>
    </Link>
  );

  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar
        isLoggedIn={!!currentUser}
        avatarUrl={currentUser?.avatarUrl}
        memberNumber={currentUser?.memberNumber}
      />
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Image */}
        <div className="relative w-full h-64">
          {profileUser.headerImageUrl ? (
            <Image
              src={profileUser.headerImageUrl}
              alt="Header"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-100"></div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative -mt-20 px-6">
          <div className="relative w-40 h-40 mx-auto border-4 border-white rounded-full overflow-hidden shadow-lg">
            {profileUser.avatarUrl ? (
              <Image
                src={profileUser.avatarUrl}
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-200"></div>
            )}
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{profileUser.displayName}</h1>
          {profileUser.occupation && (
            <p className="text-center text-gray-600 text-xl mb-6">{profileUser.occupation}</p>
          )}

          {/* Extra Profiles */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Extra Profiles</h2>
            <div className="space-y-4">
              {profileUser.extraProfiles && profileUser.extraProfiles.length > 0 ? (
                profileUser.extraProfiles.map((profile) => (
                  <div key={profile.id}>{renderExtraProfile(profile)}</div>
                ))
              ) : (
                <p className="text-gray-500 italic">No extra profiles to display</p>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-12 flex justify-center">
              <EditProfileButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
