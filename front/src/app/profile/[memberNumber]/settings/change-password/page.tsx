'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '../../../../../components/Navbar';
import PasswordInput from '../../../../../components/PasswordInput';
import { changePassword, fetchCurrentUser } from '../../../../../services/userService';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const currentUser = await fetchCurrentUser(token);
        console.log(currentUser);
        if (!currentUser.memberNumber) {
          router.push(`/profile/${currentUser.memberNumber}`);
          return;
        }
        setMemberNumber(currentUser.memberNumber);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
        return;
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const result = await changePassword(token, currentPassword, newPassword, confirmPassword);
      if (result.success) {
        alert(result.message);
        router.push(`/profile/${memberNumber}/settings`);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password');
    }
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar isLoggedIn={true} avatarUrl={null} memberNumber={memberNumber} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <PasswordInput
            value={currentPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
            show={showCurrentPassword}
            setShow={setShowCurrentPassword}
            label="Current Password"
          />
          <PasswordInput
            value={newPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            show={showNewPassword}
            setShow={setShowNewPassword}
            label="New Password"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            label="Confirm New Password"
          />
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
