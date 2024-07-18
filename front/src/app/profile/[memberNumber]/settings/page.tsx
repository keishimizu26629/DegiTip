'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import UserSettingsForm from '../../../../components/settings/UserSettingsForm';
import PaymentMethodsForm from '../../../../components/settings/PaymentMethodsForm';
import { getUserSettingsAndPaymentMethods, updateUserSettings, updatePaymentMethod } from '../../../../services/userService';
import { UserSettings } from '../../../../interfaces/User';
import { PaymentMethod } from '../../../../interfaces/Payment';

export default function UserSettingsPage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingUserSettings, setEditingUserSettings] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<number | null>(null);
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
        const data = await getUserSettingsAndPaymentMethods(token);
        setUserSettings({
          id: data.id,
          name: data.name,
          email: data.email,
          memberNumber: data.memberNumber
        });
        setPaymentMethods(data.paymentMethods || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchData();
  }, [router, memberNumber]);

  const handleInputChange = (name: string, value: string) => {
    setUserSettings((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePaymentMethodChange = (index: number, field: keyof PaymentMethod, value: string) => {
    setPaymentMethods((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveUserSettings = async () => {
    if (!userSettings) return;
    try {
      await updateUserSettings('', userSettings);
      alert('User settings updated successfully');
      setEditingUserSettings(false);
    } catch (error) {
      console.error('Error updating user settings:', error);
      alert('Failed to update user settings');
    }
  };

  const handleSavePaymentMethod = async (index: number) => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      router.push('/login');
      return;
    }
    try {
      const paymentMethod = paymentMethods[index];
      const updatedPaymentMethod = await updatePaymentMethod(token, paymentMethod);

      setPaymentMethods(prev => {
        const updated = [...prev];
        updated[index] = updatedPaymentMethod;
        return updated;
      });

      alert('Payment method updated successfully');
      setEditingPaymentMethod(null);
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert('Failed to update payment method');
    }
  };

  if (!userSettings) {
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
        avatarUrl={userSettings.profile?.avatarUrl}
        memberNumber={userSettings.memberNumber}
      />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <UserSettingsForm
          userSettings={userSettings}
          editingUserSettings={editingUserSettings}
          onInputChange={handleInputChange}
          onSaveUserSettings={handleSaveUserSettings}
          setEditingUserSettings={setEditingUserSettings}
        />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <Link href={`settings/change-password`} className="text-indigo-600 hover:text-indigo-800">
            Change Password
          </Link>
        </div>

        <PaymentMethodsForm
          paymentMethods={paymentMethods}
          editingPaymentMethod={editingPaymentMethod}
          onPaymentMethodChange={handlePaymentMethodChange}
          onSavePaymentMethod={handleSavePaymentMethod}
          setEditingPaymentMethod={setEditingPaymentMethod}
        />
      </div>
    </div>
  );
}
