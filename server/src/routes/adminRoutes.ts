import { Router } from 'express';
import { AdminController } from '../controllers/adminController';

const router = Router();

router.get('/stats', AdminController.getStats);
router.post('/terminate', AdminController.terminateRoom);

export default router;
