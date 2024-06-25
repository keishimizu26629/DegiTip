'use client';

import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [name, setName] = useState(user.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ここにプロフィール更新のロジックを実装します
    console.log('Profile update submitted:', { name });
    // 注: 実際のAPIコールをここに実装する必要があります
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
        />
      </div>
      <div>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileForm;
