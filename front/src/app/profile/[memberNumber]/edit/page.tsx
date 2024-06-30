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

interface ContentType {
  id: number;
  name: string;
}

interface ProfileContent {
  contentTypeId: number;
  title: string;
  content: string;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [profileContents, setProfileContents] = useState<ProfileContent[]>([]);
  const router = useRouter();
  const params = useParams();
  const memberNumber = params.memberNumber as string;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const currentUser = await response.json();
          if (currentUser.memberNumber !== memberNumber) {
            router.push(`/profile/${currentUser.memberNumber}`);
            return;
          }
          setUser(currentUser);

          // ContentTypesを取得
          const contentTypesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/content-types`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (contentTypesResponse.ok) {
            const contentTypesData = await contentTypesResponse.json();
            setContentTypes(contentTypesData);
          }
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

  const addProfileContent = () => {
    setProfileContents([...profileContents, { contentTypeId: 0, title: '', content: '' }]);
  };

  const updateProfileContent = (
    index: number,
    field: keyof ProfileContent,
    value: string | number,
  ) => {
    const updatedContents = [...profileContents];
    updatedContents[index] = { ...updatedContents[index], [field]: value };
    setProfileContents(updatedContents);
  };

  const saveProfile = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileContents }),
      });

      if (response.ok) {
        alert('Profile updated successfully');
        router.push(`/profile/${memberNumber}`);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <div className="mb-4">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
      {profileContents.map((content, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <select
            value={content.contentTypeId}
            onChange={(e) => updateProfileContent(index, 'contentTypeId', parseInt(e.target.value))}
            className="mb-2 w-full p-2 border rounded"
          >
            <option value={0}>Select Content Type</option>
            {contentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={content.title}
            onChange={(e) => updateProfileContent(index, 'title', e.target.value)}
            placeholder="Title"
            className="mb-2 w-full p-2 border rounded"
          />
          <textarea
            value={content.content}
            onChange={(e) => updateProfileContent(index, 'content', e.target.value)}
            placeholder="Content"
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addProfileContent} className="bg-blue-500 text-white p-2 rounded mb-4">
        Add Content
      </button>
      <button onClick={saveProfile} className="bg-green-500 text-white p-2 rounded">
        Save Profile
      </button>
    </div>
  );
}
