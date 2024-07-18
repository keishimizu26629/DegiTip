import PAYPAY from '@paypayopa/paypayopa-sdk-node';
import { PrismaClient, Prisma } from '@prisma/client';

const clientId = process.env.PAYPAY_API_KEY;
const clientSecret = process.env.PAYPAY_API_SECRET;
const merchantId = process.env.PAYPAY_MERCHANT_ID;

const prisma = new PrismaClient();

if (!clientId || !clientSecret || !merchantId) {
  throw new Error('PayPay API credentials are not properly configured');
}

PAYPAY.Configure({
  clientId: clientId,
  clientSecret: clientSecret,
  productionMode: false,
  merchantId: merchantId,
});

interface ResultInfo {
  code: string;
  message: string;
}

interface QRCodeCreateResponse {
  resultInfo: ResultInfo;
  data?: any;
}

interface PaymentDetailsResponse {
  resultInfo: ResultInfo;
  data?: any;
}

export async function createPaymentQRCode(
  amount: number,
  orderId: string,
  description: string,
  memberNumber: string,
): Promise<any> {
  const payload = {
    merchantPaymentId: orderId,
    amount: {
      amount,
      currency: 'JPY',
    },
    codeType: 'ORDER_QR',
    orderDescription: description,
    isAuthorization: false,
    redirectUrl: `${process.env.FRONTEND_URL}/payment/complete/${memberNumber}`,
    redirectType: 'WEB_LINK',
  };

  return new Promise((resolve, reject) => {
    PAYPAY.QRCodeCreate(payload, (response) => {
      if (
        'BODY' in response &&
        response.BODY &&
        (response.BODY as QRCodeCreateResponse).resultInfo
      ) {
        const responseBody = response.BODY as QRCodeCreateResponse;

        if (responseBody.resultInfo.code === 'SUCCESS') {
          resolve(responseBody.data);
        } else {
          reject(new Error(responseBody.resultInfo.message));
        }
      } else if ('ERROR' in response) {
        reject(new Error(response.ERROR));
      } else {
        reject(new Error('Unexpected response format'));
      }
    });
  });
}

export async function getPaymentDetails(merchantPaymentId: (string | number)[]) {
  try {
    const response = await PAYPAY.GetPaymentDetails(merchantPaymentId);
    if (
      'BODY' in response &&
      response.BODY &&
      (response.BODY as PaymentDetailsResponse).resultInfo
    ) {
      const responseBody = response.BODY as PaymentDetailsResponse;

      if (responseBody.resultInfo.code === 'SUCCESS') {
        return responseBody.data;
      } else {
        throw new Error(responseBody.resultInfo.message);
      }
    } else if ('ERROR' in response) {
      throw new Error(response.ERROR);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw error;
  }
}

export async function getPaymentTypes() {
  return prisma.paymentType.findMany();
}
