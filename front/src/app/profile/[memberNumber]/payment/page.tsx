'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { createPayment } from '../../../../services/paymentService';
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [memberNumber, setMemberNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    const urlMemberNumber = params.memberNumber;
    if (typeof urlMemberNumber === 'string') {
      setMemberNumber(urlMemberNumber);
    }

    const method = searchParams?.get('method');
    if (method) {
      setPaymentMethod(method);
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src={`/images/${paymentMethod?.toLowerCase()}-icon.png`}
          alt={`${paymentMethod} icon`}
          width={64}
          height={64}
          className="mx-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          支払い詳細
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                金額 (円)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                メッセージ (任意)
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
