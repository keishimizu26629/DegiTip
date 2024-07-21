import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export async function createPayment(req: Request, res: Response) {
  try {
    const { amount, recipientId, memberNumber } = req.body;
    const orderId = `order_${Date.now()}_${recipientId}`;
    const description = `Payment to user ${recipientId}`;

    const paymentData = await paymentService.createPaymentQRCode(amount, orderId, description, memberNumber);
    res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}

export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const { merchantPaymentId } = req.params;
    const paymentDetails = await paymentService.getPaymentDetails([merchantPaymentId]);
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error('Error getting payment status:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}

export async function getPayPayConfig(req: Request, res: Response) {
  const clientId = process.env.PAYPAY_API_KEY;
  const clientSecret = process.env.PAYPAY_API_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'PayPay API credentials are not properly configured' });
  }

  res.status(200).json({
    clientId,
    clientSecret
  });
}

export async function getPaymentTypes(req: Request, res: Response) {
  try {
    const users = await paymentService.getPaymentTypes();
    res.json(users);
  } catch (error) {
    console.error('Error fetching paymentTypes:', error);
    res.status(500).json({ error: 'Failed to fetch paymentTypes' });
  }
}
