import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_theft_jwt_key_992817263544';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    isGuest?: boolean;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; isGuest?: boolean };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}

export function verifySocketToken(token: string): { id: string; username: string; isGuest?: boolean } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string; isGuest?: boolean };
  } catch (err) {
    return null;
  }
}
