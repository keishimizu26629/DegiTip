import React from 'react';
import { PaymentMethod } from '../../interfaces/Payment';
import { FaPencilAlt } from 'react-icons/fa';

interface PaymentMethodsFormProps {
  paymentMethods: PaymentMethod[];
  editingPaymentMethod: number | null;
  onPaymentMethodChange: (index: number, field: keyof PaymentMethod, value: string) => void;
  onSavePaymentMethod: (index: number) => void;
  setEditingPaymentMethod: (index: number | null) => void;
}

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({
  paymentMethods,
  editingPaymentMethod,
  onPaymentMethodChange,
  onSavePaymentMethod,
  setEditingPaymentMethod,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      {paymentMethods.map((paymentMethod, index) => (
        <div key={paymentMethod.id} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{paymentMethod.paymentType.name}</h3>
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
              onClick={() => onSavePaymentMethod(index)}
              className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsForm;
