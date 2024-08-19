import React, { useState, useEffect } from 'react';
import { PaymentMethod, PaymentMethodsFormProps } from '../../interfaces/Payment';
import { FaPencilAlt } from 'react-icons/fa';

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({
  paymentMethods,
  editingPaymentMethod,
  onPaymentMethodChange,
  onSavePaymentMethod,
  setEditingPaymentMethod,
}) => {
  const [localPaymentMethods, setLocalPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (paymentMethods.length === 0) {
      // PayPay の空のメソッドを追加
      setLocalPaymentMethods([
        {
          id: '',
          userId: 0,
          paymentTypeId: 1, // PayPay のID（仮の値）
          key: '',
          secret: '',
          merchantId: '',
          paymentType: { id: 1, name: 'PayPay', enabled: true },
        },
      ]);
    } else {
      // paymentType が undefined の場合、デフォルト値を設定
      const updatedPaymentMethods = paymentMethods.map(method => ({
        ...method,
        paymentType: method.paymentType || { id: 0, name: 'Unknown', enabled: true }
      }));
      setLocalPaymentMethods(updatedPaymentMethods);
    }
  }, [paymentMethods]);

  const handleSave = (index: number) => {
    const updatedMethod = localPaymentMethods[index];
    onSavePaymentMethod(index, updatedMethod);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      {localPaymentMethods.map((paymentMethod, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{paymentMethod.paymentType?.name || 'Unknown'}</h3>
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
                  value={(paymentMethod[field as keyof PaymentMethod] as string) || ''}
                  onChange={(e) =>
                    onPaymentMethodChange(index, field as keyof PaymentMethod, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2">
                  {paymentMethod[field as keyof PaymentMethod]
                    ? (paymentMethod[field as keyof PaymentMethod] as string)
                        .slice(-4)
                        .padStart(
                          (paymentMethod[field as keyof PaymentMethod] as string).length,
                          '*',
                        )
                    : ''}
                </div>
              )}
            </div>
          ))}
          {editingPaymentMethod === index && (
            <button
              onClick={() => handleSave(index)}
              className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Payment Method
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsForm;
