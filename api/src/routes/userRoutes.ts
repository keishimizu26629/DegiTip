import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/me', authenticateToken, userController.getProfile);
router.post('/me', authenticateToken, userController.updateProfile);
router.get('/:memberNumber', userController.getUserByMemberNumber);
router.put('/me', userController.updateProfilePost);
router.post('/me/extra-profiles/delete', authenticateToken, userController.deleteExtraProfile);

export default router;
