const API_BASE = '/api';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('theft_token');
  }

  private static getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async register(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  }

  static async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  }

  static async guestLogin() {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }

  static async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  static async createRoom() {
    const res = await fetch(`${API_BASE}/rooms/create`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

  static async joinRoom(roomCode: string) {
    const res = await fetch(`${API_BASE}/rooms/join`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ roomCode: roomCode.toUpperCase() })
    });
    return res.json();
  }

  static async quickPlay() {
    const res = await fetch(`${API_BASE}/rooms/quickplay`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

  static async getRoom(roomCode: string) {
    const res = await fetch(`${API_BASE}/rooms/${roomCode.toUpperCase()}`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  static async getAdminStats(adminKey: string = 'theft_secret_admin_2026') {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      }
    });
    return res.json();
  }
}

export const apiService = ApiService;

