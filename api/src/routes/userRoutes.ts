import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/me', authenticateToken, userController.getProfile);
router.get('/:memberNumber', userController.getUser);
router.put('/me', authenticateToken, userController.updateProfile);

export default router;
