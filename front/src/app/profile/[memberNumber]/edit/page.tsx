'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '../../../../components/Navbar';
import { UserProfile, ExtraProfile } from '../../../../interfaces/Profile';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../../../utils/firebase';
import Avatar from '../../../../components/Profile/Avatar';
import HeaderImage from '../../../../components/Profile/HeaderImage';
import Card from '../../../../components/Profile/Card';
import ProfileDetails from '../../../../components/Profile/ProfileDetails';
import {
  fetchCurrentUser,
  fetchProfileUser,
  updateProfileUser,
  deleteExtraProfile,
} from '../../../../services/userService';

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
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push(`/profile/${memberNumber}`);
          return;
        }

        const currentUser = await fetchCurrentUser(token);
        if (currentUser.memberNumber !== memberNumber) {
          router.push(`/profile/${currentUser.memberNumber}`);
        } else {
          const profileUser = await fetchProfileUser(memberNumber);
          setProfileUser(profileUser);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        router.push('/404');
      }
    };

    fetchData();
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'header',
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
      } else {
        setHeaderFile(file);
      }
    }
  };

  const handleExtraProfileChange = (
    index: number,
    field: keyof ExtraProfile,
    value: string | number,
  ) => {
    if (profileUser) {
      const newExtraProfiles = [...profileUser.extraProfiles];
      newExtraProfiles[index] = { ...newExtraProfiles[index], [field]: value };
      setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
    }
  };

  const addExtraProfile = () => {
    if (profileUser) {
      const newExtraProfile: ExtraProfile = {
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
      let avatarUrl = profileUser?.avatarUrl;
      let headerImageUrl = profileUser?.headerImageUrl;

      if (avatarFile) {
        avatarUrl = await handleImageUpload(avatarFile, `avatars/${memberNumber}`);
      }

      if (headerFile) {
        headerImageUrl = await handleImageUpload(headerFile, `headers/${memberNumber}`);
      }

      const updatedProfileUser = {
        avatarUrl: profileUser?.avatarUrl ?? undefined,
        headerImageUrl: profileUser?.headerImageUrl ?? undefined,
        displayName: profileUser?.displayName ?? undefined,
        occupation: profileUser?.occupation ?? undefined,
        isPublic: Boolean(profileUser?.isPublic ?? false),
        ExtraProfile: profileUser?.extraProfiles.map((profile) => {
          if (profile.id) {
            return { ...profile };
          }
          const { id, ...newProfile } = profile;
          return newProfile;
        }),
      };

      await updateProfileUser(token, updatedProfileUser);
      router.push(`/profile/${memberNumber}`);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteExtraProfile = (index: number) => {
    if (profileUser) {
      const profileToDelete = profileUser.extraProfiles[index];

      if (profileToDelete.id) {
        setShowDeleteConfirm(index);
      } else {
        const newExtraProfiles = profileUser.extraProfiles.filter((_, i) => i !== index);
        setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
      }
    }
  };

  const confirmDelete = async (index: number) => {
    if (profileUser) {
      const profileToDelete = profileUser.extraProfiles[index];
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token is undefind')
      }
      try {
        await deleteExtraProfile(token, profileToDelete.id!);
        const newExtraProfiles = profileUser.extraProfiles.filter((_, i) => i !== index);
        setProfileUser({ ...profileUser, extraProfiles: newExtraProfiles });
      } catch (error) {
        console.error('Error deleting extra profile:', error);
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
      <Card>
        <HeaderImage
          src={headerFile ? URL.createObjectURL(headerFile) : profileUser.headerImageUrl!}
          onClick={() => handleImageSelect('header')}
          inputRef={headerInputRef}
          onChange={(e) => handleFileChange(e, 'header')}
        />
        <div className="relative -mt-20 px-6">
          <Avatar
            src={avatarFile ? URL.createObjectURL(avatarFile) : profileUser.avatarUrl!}
            onClick={() => handleImageSelect('avatar')}
            inputRef={avatarInputRef}
            onChange={(e) => handleFileChange(e, 'avatar')}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <ProfileDetails
            profileUser={{ ...profileUser, occupation: profileUser.occupation }}
            isOwnProfile={true}
            isEditable={true}
            handleExtraProfileChange={handleExtraProfileChange}
            handleDeleteExtraProfile={handleDeleteExtraProfile}
            addExtraProfile={addExtraProfile}
            newContentType={newContentType}
            setNewContentType={setNewContentType}
            onDisplayNameChange={(value) => setProfileUser({ ...profileUser, displayName: value })}
            onOccupationChange={(value) => setProfileUser({ ...profileUser, occupation: value })}
            onIsPublicChange={(value) => setProfileUser({ ...profileUser, isPublic: value })}
          />

          <div className="mb-8 flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>

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
      </Card>
    </div>
  );
}
