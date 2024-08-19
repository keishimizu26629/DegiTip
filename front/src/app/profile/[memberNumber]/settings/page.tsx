'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import UserSettingsForm from '../../../../components/settings/UserSettingsForm';
import PaymentMethodsForm from '../../../../components/settings/PaymentMethodsForm';
import { getUserSettingsAndPaymentMethods, updateUserSettings, updatePaymentMethod, addPaymentMethod } from '../../../../services/userService';
import { UserSettings } from '../../../../interfaces/User';
import { PaymentMethod } from '../../../../interfaces/Payment';

export default function UserSettingsPage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserSettings, setEditingUserSettings] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<number | null>(null);
  const { memberNumber } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('No token found');
          router.push(`/profile/${memberNumber}`);
          return;
        }
        console.log('Fetching user data...');
        const data = await getUserSettingsAndPaymentMethods(token);
        console.log('User data fetched:', data);
        setUserSettings({
          id: data.id,
          name: data.name,
          email: data.email,
          memberNumber: data.memberNumber
        });
        setPaymentMethods(data.paymentMethods || []);
        if (setPaymentMethods.length === 0) {
          // 支払い方法がない場合、空の支払い方法を追加
          setPaymentMethods([{
            id: '',
            userId: data.id,
            paymentTypeId: 0,
            key: '',
            secret: '',
            merchantId: '',
            paymentType: { name: '', enabled: true }
          }]);
          setEditingPaymentMethod(0);  // 編集モードを有効にする
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setUserSettings(null);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
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
    const token = Cookies.get('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      router.push('/login');
      return;
    }
    try {
      const updatedSettings = await updateUserSettings(token, userSettings);
      setUserSettings(updatedSettings);
      alert('User settings updated successfully');
      setEditingUserSettings(false);
    } catch (error) {
      console.error('Error updating user settings:', error);
      alert('Failed to update user settings');
    }
  };

  const handleSavePaymentMethod = async (index: number, updatedMethod: PaymentMethod) => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      router.push('/login');
      return;
    }
    try {
      let result: PaymentMethod;
      if (updatedMethod.id) {
        result = await updatePaymentMethod(token, updatedMethod);
      } else {
        result = await addPaymentMethod(token, updatedMethod);
      }

      setPaymentMethods(prev => {
        const updated = [...prev];
        updated[index] = result;
        return updated;
      });

      alert('Payment method saved successfully');
      setEditingPaymentMethod(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Failed to save payment method');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!userSettings) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p>Error loading user settings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar
        isLoggedIn={true}
        avatarUrl={null}
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
