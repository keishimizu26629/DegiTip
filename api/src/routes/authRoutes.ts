import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/verify-email', authController.verifyEmail);

export default router;
