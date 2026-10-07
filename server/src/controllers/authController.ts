import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_theft_jwt_key_992817263544';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password || username.length < 3 || password.length < 6) {
        return res.status(400).json({ error: 'Username (min 3 chars) and password (min 6 chars) required' });
      }

      const existing = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      if (existing) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        passwordHash,
        avatar: `avatar-detective-${Math.floor(Math.random() * 6) + 1}`,
        isGuest: false
      });

      await user.save();

      const token = jwt.sign({ id: user._id, username: user.username, isGuest: false }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          gamesPlayed: user.gamesPlayed,
          wins: user.wins,
          losses: user.losses,
          policeWins: user.policeWins,
          undercoverWins: user.undercoverWins,
          thiefWins: user.thiefWins
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user._id, username: user.username, isGuest: false }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          gamesPlayed: user.gamesPlayed,
          wins: user.wins,
          losses: user.losses,
          policeWins: user.policeWins,
          undercoverWins: user.undercoverWins,
          thiefWins: user.thiefWins
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Login failed: ' + err.message });
    }
  }

  static async guestLogin(req: Request, res: Response) {
    try {
      const guestNum = Math.floor(1000 + Math.random() * 9000);
      const username = `Agent_${guestNum}`;
      const dummyHash = await bcrypt.hash('guest_secret_pass', 4);

      let user = new User({
        username,
        passwordHash: dummyHash,
        avatar: `avatar-detective-${Math.floor(Math.random() * 6) + 1}`,
        isGuest: true
      });

      // Try saving to MongoDB if connected; otherwise create in-memory profile
      try {
        await user.save();
      } catch (dbErr) {
        // Fallback for offline mode
      }

      const token = jwt.sign({ id: user._id || `guest-${guestNum}`, username, isGuest: true }, JWT_SECRET, { expiresIn: '24h' });

      return res.status(200).json({
        token,
        user: {
          id: user._id || `guest-${guestNum}`,
          username: user.username,
          avatar: user.avatar,
          level: 1,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          policeWins: 0,
          undercoverWins: 0,
          thiefWins: 0,
          isGuest: true
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Guest login failed: ' + err.message });
    }
  }

  static async getProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(200).json({
          user: {
            id: userId,
            username: req.user?.username || 'Operative',
            avatar: 'avatar-detective-1',
            level: 1,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            policeWins: 0,
            undercoverWins: 0,
            thiefWins: 0
          }
        });
      }

      return res.status(200).json({ user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
