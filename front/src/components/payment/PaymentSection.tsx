import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from './PaymentModal';
import { createPayment } from '../../services/paymentService';

interface PaymentSectionProps {
  isOwnProfile: boolean;
  memberNumber: string | string[];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ isOwnProfile, memberNumber }) => {
  const router = useRouter();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PayPay' | 'Metamask' | null>(null);
  const [amount, setAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handlePaymentClick = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentMethodSelect = (method: 'PayPay' | 'Metamask') => {
    setPaymentMethod(method);
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'PayPay' && amount) {
      try {
        const response = await createPayment(parseInt(amount), memberNumber);
        console.log('Payment created:', response);
        // PayPay Web Cashierページへリダイレクト
        router.push(response.url);
      } catch (error) {
        console.error('Payment failed:', error);
        alert('支払いの作成に失敗しました。もう一度お試しください。');
      }
    } else if (paymentMethod === 'Metamask') {
      // Metamaskの処理は後で実装
      console.log('Metamask payment not implemented yet');
      alert('Metamask支払いは現在実装中です。');
    }
    setShowConfirmModal(false);
    setShowPaymentOptions(false);
    setAmount('');
    setPaymentMethod(null);
  };

  if (isOwnProfile) return null;

  return (
    <div className="mt-6 px-6">
      <button
        onClick={handlePaymentClick}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        チップを送りますか？
      </button>

      {showPaymentOptions && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">支払い方法を選択:</h3>
          <div className="space-x-4 flex justify-center">
            <button
              onClick={() => handlePaymentMethodSelect('PayPay')}
              className={`px-4 py-2 rounded ${paymentMethod === 'PayPay' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              PayPay
            </button>
            <button
              onClick={() => handlePaymentMethodSelect('Metamask')}
              className={`px-4 py-2 rounded ${paymentMethod === 'Metamask' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Metamask
            </button>
          </div>
          {paymentMethod && (
            <form onSubmit={handleAmountSubmit} className="mt-4 flex justify-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in yen"
                className="border rounded px-2 py-1 mr-2"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
                送信
              </button>
            </form>
          )}
        </div>
      )}

      <PaymentModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmPayment}
        amount={amount}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default PaymentSection;
