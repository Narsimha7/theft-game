import { Request, Response } from 'express';
import { GameManager } from '../services/GameManager';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'theft_admin_clearance_level_5';

export class AdminController {
  static getStats(req: Request, res: Response) {
    const key = req.headers['x-admin-key'];
    if (key !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin clearance' });
    }

    const gm = GameManager.getInstance();
    const rooms = gm.getAllActiveRoomsSummary();

    return res.status(200).json({
      uptimeSeconds: Math.floor(process.uptime()),
      activeRoomsCount: rooms.length,
      rooms,
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    });
  }

  static terminateRoom(req: Request, res: Response) {
    const key = req.headers['x-admin-key'];
    if (key !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin clearance' });
    }

    const { roomCode } = req.body;
    const gm = GameManager.getInstance();
    const room = gm.getRoom(roomCode);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    gm.transitionPhase(room, 'GAME_OVER', 0);
    return res.status(200).json({ success: true, message: `Room ${roomCode} terminated by admin.` });
  }
}
