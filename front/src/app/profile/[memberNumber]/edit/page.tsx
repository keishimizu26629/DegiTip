'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Navbar from '../../../../components/Navbar';
import { UserProfile, ExtraProfile } from '../../../../interfaces/Profile';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../../../utils/firebase';
import { FaLink, FaImage, FaInfo, FaPlus, FaTrash } from 'react-icons/fa';

const storage = getStorage(firebaseApp);

export default function EditProfilePage() {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [newContentType, setNewContentType] = useState<number>(1);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
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

    fetchProfileUser();
  }, [memberNumber, router]);

  const handleImageUpload = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleImageSelect = (type: 'avatar' | 'header') => {
    if (type === 'avatar' && avatarInputRef.current) {
      avatarInputRef.current.click();
    } else if (type === 'header' && headerInputRef.current) {
      headerInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'header') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
      } else {
        setHeaderFile(file);
      }
    }
  };

  const handleExtraProfileChange = (index: number, field: keyof ExtraProfile, value: string | number) => {
    if (profileUser) {
      const newExtraProfiles = [...profileUser.extraProfiles];
      newExtraProfiles[index] = { ...newExtraProfiles[index], [field]: value };
      setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
    }
  };

  const addExtraProfile = () => {
    if (profileUser) {
      const newExtraProfile: ExtraProfile = {
        id: Date.now(), // 一時的なIDを生成
        title: '',
        content: '',
        contentTypeId: newContentType,
      };
      setProfileUser({
        ...profileUser,
        extraProfiles: [...profileUser.extraProfiles, newExtraProfile],
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      let avatarURL = profileUser?.avatarUrl;
      let headerImageURL = profileUser?.headerImageUrl;

      if (avatarFile) {
        avatarURL = await handleImageUpload(avatarFile, `avatars/${memberNumber}`);
      }

      if (headerFile) {
        headerImageURL = await handleImageUpload(headerFile, `headers/${memberNumber}`);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${memberNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileUser,
          avatarURL,
          headerImageURL,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      router.push(`/profile/${memberNumber}`);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteExtraProfile = async (index: number) => {
    if (profileUser) {
      const profileToDelete = profileUser.extraProfiles[index];

      if (typeof profileToDelete.id === 'number') {
        // 未保存のプロフィールの場合、直接削除
        const newExtraProfiles = profileUser.extraProfiles.filter((_, i) => i !== index);
        setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
      } else {
        // 保存済みのプロフィールの場合、確認ポップアップを表示
        setShowDeleteConfirm(index);
      }
    }
  };

  const confirmDelete = async (index: number) => {
    if (profileUser) {
      const profileToDelete = profileUser.extraProfiles[index];

      try {
        const token = Cookies.get('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${memberNumber}/extra-profiles/${profileToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete extra profile');
        }

        const newExtraProfiles = profileUser.extraProfiles.filter((_, i) => i !== index);
        setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
      } catch (error) {
        console.error('Error deleting extra profile:', error);
        // エラー処理（ユーザーへの通知など）
      }
    }
    setShowDeleteConfirm(null);
  };

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
        isLoggedIn={true}
        avatarUrl={profileUser.avatarUrl}
        memberNumber={profileUser.memberNumber}
      />
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Image */}
        <div className="relative w-full h-64">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 cursor-pointer"
            onClick={() => handleImageSelect('header')}
          >
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {headerFile || profileUser.headerImageUrl ? (
            <Image
              src={headerFile ? URL.createObjectURL(headerFile) : profileUser.headerImageUrl!}
              alt="Header"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-100"></div>
          )}
          <input
            type="file"
            ref={headerInputRef}
            onChange={(e) => handleFileChange(e, 'header')}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Avatar */}
        <div className="relative -mt-20 px-6">
          <div
            className="relative w-40 h-40 mx-auto border-4 border-white rounded-full overflow-hidden shadow-lg cursor-pointer"
            onClick={() => handleImageSelect('avatar')}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {avatarFile || profileUser.avatarUrl ? (
              <Image
                src={avatarFile ? URL.createObjectURL(avatarFile) : profileUser.avatarUrl!}
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-200"></div>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              onChange={(e) => handleFileChange(e, 'avatar')}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={profileUser.displayName || ''}
              onChange={(e) => setProfileUser({ ...profileUser, displayName: e.target.value })}
              className="text-3xl font-bold text-center text-gray-800 mb-2 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
              placeholder="Display Name"
            />
            <input
              type="text"
              value={profileUser.occupation || ''}
              onChange={(e) => setProfileUser({ ...profileUser, occupation: e.target.value })}
              className="text-center text-gray-600 text-xl mb-6 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
              placeholder="Occupation"
            />

            {/* Extra Profiles */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Extra Profiles</h2>
              <div className="space-y-4">
                {profileUser.extraProfiles.map((profile, index) => (
                  <div key={profile.id} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-300">
                    {profile.contentTypeId === 1 && <FaLink className="text-indigo-600" />}
                    {profile.contentTypeId === 2 && <FaInfo className="text-indigo-600" />}
                    {profile.contentTypeId === 3 && <FaInfo className="text-indigo-600" />}
                    {profile.contentTypeId === 4 && <FaImage className="text-indigo-600" />}
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => handleExtraProfileChange(index, 'title', e.target.value)}
                        className="text-lg font-semibold text-gray-800 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1 mb-2"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={profile.content}
                        onChange={(e) => handleExtraProfileChange(index, 'content', e.target.value)}
                        className="text-gray-600 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
                        placeholder="Content"
                      />
                    </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExtraProfile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <select
                  value={newContentType}
                  onChange={(e) => setNewContentType(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>URL</option>
                  <option value={2}>Text Field</option>
                  <option value={3}>Short Text</option>
                  <option value={4}>Image</option>
                </select>
                <button
                  type="button"
                  onClick={addExtraProfile}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Extra Profile
                </button>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* 削除確認ポップアップ */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete this extra profile?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
