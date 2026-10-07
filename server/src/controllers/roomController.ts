import { Response } from 'express';
import { GameManager } from '../services/GameManager';
import { AuthRequest } from '../middleware/authMiddleware';

export class RoomController {
  static createRoom(req: AuthRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const gm = GameManager.getInstance();
      const room = gm.createRoom(user.id, user.username, 'avatar-detective-1');

      return res.status(201).json({
        roomCode: room.roomCode,
        room: gm.getPublicRoomState(room)
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static joinRoom(req: AuthRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { roomCode } = req.body;
      if (!roomCode) return res.status(400).json({ error: 'Room code required' });

      const gm = GameManager.getInstance();
      const result = gm.joinRoom(roomCode, user.id, user.username, 'avatar-detective-1');

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      const room = gm.getRoom(roomCode)!;
      return res.status(200).json({
        roomCode: room.roomCode,
        room: gm.getPublicRoomState(room)
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static quickPlay(req: AuthRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const gm = GameManager.getInstance();
      const activeRooms = gm.getAllActiveRoomsSummary();
      const openRoom = activeRooms.find(r => r.phase === 'LOBBY' && r.playerCount < 10);

      if (openRoom) {
        const result = gm.joinRoom(openRoom.roomCode, user.id, user.username, 'avatar-detective-1');
        if (result.success) {
          const room = gm.getRoom(openRoom.roomCode)!;
          return res.status(200).json({
            roomCode: room.roomCode,
            room: gm.getPublicRoomState(room)
          });
        }
      }

      // If no room open, create fresh one
      const room = gm.createRoom(user.id, user.username, 'avatar-detective-1');
      return res.status(201).json({
        roomCode: room.roomCode,
        room: gm.getPublicRoomState(room)
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static getRoom(req: AuthRequest, res: Response) {
    try {
      const { roomCode } = req.params;
      const gm = GameManager.getInstance();
      const room = gm.getRoom(roomCode);

      if (!room) return res.status(404).json({ error: 'Room not found' });

      return res.status(200).json({
        room: gm.getPublicRoomState(room)
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
