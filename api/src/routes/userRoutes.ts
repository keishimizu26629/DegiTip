import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:memberNumber', userController.getUser);
router.get('/me', authenticateToken, userController.getProfile);
router.put('/me', authenticateToken, userController.updateProfile);

export default router;
