import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/guest', AuthController.guestLogin);
router.get('/profile', authMiddleware as any, AuthController.getProfile);

export default router;
