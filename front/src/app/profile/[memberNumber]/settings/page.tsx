'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import { getUserSettingsAndPaymentMethods, updateUserSettings, updatePaymentMethod } from '../../../../services/userService';

export default function UserSettingsPage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
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

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">User Settings</h2>
            <button
              onClick={() => setEditingUserSettings(!editingUserSettings)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <FaPencilAlt />
            </button>
          </div>
          <div className="space-y-4">
            {['name', 'email', 'memberNumber'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {editingUserSettings ? (
                  <input
                    type="text"
                    value={userSettings[field as keyof UserSettings] as string}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2">
                    {userSettings[field as keyof UserSettings] as string}
                  </div>
                )}
              </div>
            ))}
          </div>
          {editingUserSettings && (
            <button
              onClick={handleSaveUserSettings}
              className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <Link href={`settings/change-password`} className="text-indigo-600 hover:text-indigo-800">
            Change Password
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
          {paymentTypes.filter(type => type.enabled).map((type, index) => {
            const paymentMethod = userSettings.paymentMethods.find(
              (m) => m.paymentTypeId === type.id
            ) || { paymentTypeId: type.id, key: '', secret: '', merchantId: '' };
            return (
              <div key={type.id} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{type.name}</h3>
                  <button
                    onClick={() => setEditingPaymentMethod(editingPaymentMethod === index ? null : index)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FaPencilAlt />
                  </button>
                </div>
                {['key', 'secret', 'merchantId'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {editingPaymentMethod === index ? (
                      <input
                        type="text"
                        value={(paymentMethod as PaymentMethod)[field as keyof PaymentMethod] || ''}
                        onChange={(e) => handlePaymentMethodChange(index, field as keyof PaymentMethod, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    ) : (
                      <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2">
                        {(paymentMethod as PaymentMethod)[field as keyof PaymentMethod]
                          ? ((paymentMethod as PaymentMethod)[field as keyof PaymentMethod] as string).slice(-4).padStart(((paymentMethod as PaymentMethod)[field as keyof PaymentMethod] as string).length, '*')
                          : ''}
                      </div>
                    )}
                  </div>
                ))}
                {editingPaymentMethod === index && (
                  <button
                    onClick={() => handleSavePaymentMethod(index)}
                    className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
