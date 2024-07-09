'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProfileUser } from '../../../../services/userService';
import { UserProfile } from '../../../../interfaces/Profile';

export default function PaymentCompletePage() {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { memberNumber } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberNumberString = Array.isArray(memberNumber) ? memberNumber[0] : memberNumber;
        const user = await fetchProfileUser(memberNumberString);
        setProfileUser(user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('プロフィールデータの取得に失敗しました。');
      }
    };

    fetchData();
  }, [memberNumber]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          ホームに戻る
        </Link>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {profileUser.displayName}さんに支払いが完了しました！
      </h1>
      <p className="text-xl mb-8 text-gray-600">ありがとうございました。</p>
      <Link
        href={`/profile/${memberNumber}`}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out"
      >
        元のページに戻る
      </Link>
    </div>
  );
}
