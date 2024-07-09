import { generateUuid } from '../utils/generateUuid';

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
