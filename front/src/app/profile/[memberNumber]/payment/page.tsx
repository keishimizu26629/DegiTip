'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { createPayment } from '../../../../services/paymentService';
import Image from 'next/image';
import Navbar from '../../../../components/Navbar';
import Cookies from 'js-cookie';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [memberNumber, setMemberNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserMemberNumber, setCurrentUserMemberNumber] = useState<string | null>(null);

  useEffect(() => {
    const urlMemberNumber = params.memberNumber;
    if (typeof urlMemberNumber === 'string') {
      setMemberNumber(urlMemberNumber);
    }

    const method = searchParams?.get('method');
    if (method) {
      setPaymentMethod(method);
    }

    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      // TODO: Implement fetching current user's memberNumber
      // const currentUser = await fetchCurrentUser(token);
      // setCurrentUserMemberNumber(currentUser.memberNumber);
    }
  }, [params, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paymentMethod || !memberNumber) return;

    try {
      const response = await createPayment(parseInt(amount), memberNumber);
      console.log('Payment created:', response);
      router.push(response.url);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('支払いの作成に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} avatarUrl={null} memberNumber={currentUserMemberNumber || ''} />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">支払い詳細</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                金額 (円)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                メッセージ (任意)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                支払いサイトへ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
