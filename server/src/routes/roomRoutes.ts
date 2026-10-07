import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/create', authMiddleware as any, RoomController.createRoom as any);
router.post('/join', authMiddleware as any, RoomController.joinRoom as any);
router.post('/quickplay', authMiddleware as any, RoomController.quickPlay as any);
router.get('/:roomCode', authMiddleware as any, RoomController.getRoom as any);

export default router;
