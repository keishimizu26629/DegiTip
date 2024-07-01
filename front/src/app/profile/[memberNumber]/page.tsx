'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Navbar from '../../../components/Navbar';
import { UserProfile, ExtraProfile } from '../../../interfaces/Profile';

export default function ProfilePage() {
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderExtraProfile = (profile: ExtraProfile) => {
    switch (profile.contentTypeId) {
      case 1: // URL
        return (
          <a href={profile.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {profile.title}
          </a>
        );
      case 2: // テキストフィールド
      case 3: // ショートテキスト
        return (
          <div>
            <h3 className="text-lg font-semibold">{profile.title}</h3>
            <p>{profile.content}</p>
          </div>
        );
      case 4: // 画像
        return (
          <div>
            <h3 className="text-lg font-semibold">{profile.title}</h3>
            <Image src={profile.content} alt={profile.title} width={300} height={200} objectFit="cover" />
          </div>
        );
      default:
        return null;
    }
  };

  const EditProfileButton = () => (
    <Link href={`/profile/${profileUser.memberNumber}/edit`}>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
        Edit Profile
      </button>
    </Link>
  );

  return (
    <>
      <Navbar
        isLoggedIn={!!currentUser}
        avatarUrl={currentUser?.avatarUrl}
        memberNumber={currentUser?.memberNumber}
      />
      <div className="max-w-2xl mx-auto mt-32 bg-white rounded-lg shadow-xl relative z-10">
        {/* Header Image */}
        <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
          {profileUser.headerImageUrl ? (
            <Image
              src={profileUser.headerImageUrl}
              alt="Header"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200"></div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative w-48 h-48 mx-auto -mt-16 border-4 border-white rounded-full overflow-hidden">
          {profileUser.avatarUrl ? (
            <Image
              src={profileUser.avatarUrl}
              alt="Avatar"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full"></div>
          )}
        </div>

        <div className="px-6 pb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center mt-4">{profileUser.displayName}</h1>
          {profileUser.occupation && (
            <p className="text-center text-gray-600 mb-4">{profileUser.occupation}</p>
          )}

          {/* Extra Profiles */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Extra Profiles</h2>
            <div className="space-y-6">
              {profileUser.extraProfiles && profileUser.extraProfiles.length > 0 ? (
                profileUser.extraProfiles.map((profile) => (
                  <div key={profile.id} className="p-6 bg-gray-100 rounded-lg shadow">
                    {renderExtraProfile(profile)}
                  </div>
                ))
              ) : (
                <p>No extra profiles to display</p>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-8 flex justify-center">
              <EditProfileButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
