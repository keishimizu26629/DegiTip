import React from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  paymentMethod: 'PayPay' | 'Metamask' | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, amount, paymentMethod }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">支払い確認</h2>
        <p>本当に{amount}円を{paymentMethod}で送りますか？</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">キャンセル</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">OK</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
