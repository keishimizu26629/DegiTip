import { generateUuid } from '../utils/generateUuid';
import { PaymentType } from '../interfaces/Payment';

interface PaymentRequest {
  amount: number;
  recipientId: string;
}

interface PaymentResponse {
  url: string;
  merchantPaymentId: string;
}

export async function createPayment(amount: number, memberNumber: string | string[]): Promise<PaymentResponse> {
  const recipientId = generateUuid();
  const memberNumberString = Array.isArray(memberNumber) ? memberNumber[0] : memberNumber;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      recipientId,
      memberNumber: memberNumberString
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment');
  }

  return await response.json();
}

export async function getPaymentTypes(): Promise<PaymentType[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/payment-types`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment types');
    }
    const data = await response.json();
    console.log('Fetched payment types:', data); // デバッグ用ログ
    return data; // データがそのまま配列として返ってくるため、.paymentTypes は不要
  } catch (error) {
    console.error('Error fetching payment types:', error);
    throw error;
  }
}
