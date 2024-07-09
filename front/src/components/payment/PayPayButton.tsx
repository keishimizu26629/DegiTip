import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PayPayButtonProps {
  amount: number;
  recipientId: string;
}

const PayPayButton: React.FC<PayPayButtonProps> = ({ amount, recipientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayPayPayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        body: JSON.stringify({ amount, recipientId }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/payment/process?url=${encodeURIComponent(data.url)}&merchantPaymentId=${data.merchantPaymentId}`);
      } else {
        throw new Error(data.error || 'Failed to create PayPay payment');
      }
    } catch (error) {
      console.error('Error initiating PayPay payment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayPayPayment}
      disabled={isLoading}
      className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : 'Send with PayPay'}
    </button>
  );
};

export default PayPayButton;
