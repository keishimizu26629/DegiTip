import express from 'express';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

router.post('/create', paymentController.createPayment);
router.get('/status/:merchantPaymentId', paymentController.getPaymentStatus);
router.get('/config', paymentController.getPayPayConfig);

export default router;
