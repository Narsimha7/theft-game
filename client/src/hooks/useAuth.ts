import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { UserStats } from '@theft/shared';

export function useAuth() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('theft_token');
    const storedUser = localStorage.getItem('theft_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    } else {
      // Auto-initiate guest login for frictionless play
      autoGuestLogin();
    }
    setLoading(false);
  }, []);

  const autoGuestLogin = async () => {
    try {
      const data = await ApiService.guestLogin();
      if (data.token && data.user) {
        localStorage.setItem('theft_token', data.token);
        localStorage.setItem('theft_user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (e) {
      // Offline fallback
      const offlineGuest: UserStats = {
        id: `guest-${Math.floor(Math.random() * 10000)}`,
        username: `Agent_${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: 'avatar-detective-1',
        level: 1,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        policeWins: 0,
        undercoverWins: 0,
        thiefWins: 0
      };
      setUser(offlineGuest);
    }
  };

  const login = async (u: string, p: string) => {
    const data = await ApiService.login(u, p);
    if (data.token && data.user) {
      localStorage.setItem('theft_token', data.token);
      localStorage.setItem('theft_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error || 'Login failed' };
  };

  const register = async (u: string, p: string) => {
    const data = await ApiService.register(u, p);
    if (data.token && data.user) {
      localStorage.setItem('theft_token', data.token);
      localStorage.setItem('theft_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('theft_token');
    localStorage.removeItem('theft_user');
    autoGuestLogin();
  };

  return { user, loading, login, register, logout, setUser };
}
