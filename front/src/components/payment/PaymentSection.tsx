import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPaymentTypes } from '../../services/paymentService';
import { PaymentType } from '../../interfaces/Payment';
import Image from 'next/image';

interface PaymentSectionProps {
  isOwnProfile: boolean;
  memberNumber: string | string[];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ isOwnProfile, memberNumber }) => {
  const router = useRouter();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const types = await getPaymentTypes();
        setPaymentTypes(types);
      } catch (error) {
        console.error('Failed to fetch payment types:', error);
      }
    };
    fetchPaymentTypes();
  }, []);

  const handlePaymentClick = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentType(method);
  };

  const handleProceedToPayment = () => {
    if (selectedPaymentType) {
      router.push(`/profile/${memberNumber}/payment?method=${selectedPaymentType}`);
    }
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
          <h3 className="text-lg font-semibold mb-4">支払い方法を選択:</h3>
          <div className="grid grid-cols-2 gap-4">
            {paymentTypes.length > 0 ? (
              paymentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handlePaymentMethodSelect(type.name)}
                  className={`
                    relative w-full h-24 rounded-lg shadow-md transition-all duration-300
                    ${type.enabled ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}
                    ${selectedPaymentType === type.name ? 'ring-2 ring-blue-500' : ''}
                  `}
                  disabled={!type.enabled}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={`/images/${type.name.toLowerCase()}-icon.png`}
                      alt={`${type.name} icon`}
                      width={120}
                      height={45}
                    />
                  </div>
                  <span className="absolute bottom-2 left-2 text-sm font-medium">
                    {type.name}
                  </span>
                </button>
              ))
            ) : (
              <p className="col-span-2 text-center">支払い方法が利用できません。</p>
            )}
          </div>
          {selectedPaymentType && (
            <button
              onClick={handleProceedToPayment}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              支払いへ進む
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
