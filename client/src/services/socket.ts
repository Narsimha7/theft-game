import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@theft/shared';

class SocketService {
  private socket: Socket | null = null;

  connect(token?: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const serverUrl = window.location.origin;

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to game server:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Typed emitters
  createRoom() {
    this.socket?.emit(SOCKET_EVENTS.CREATE_ROOM);
  }

  joinRoom(roomCode: string, user: any) {
    this.socket?.emit(SOCKET_EVENTS.JOIN_ROOM, { roomCode, user });
  }

  leaveRoom(roomCode: string) {
    this.socket?.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomCode });
  }

  setReady(roomCode: string, isReady: boolean) {
    this.socket?.emit(SOCKET_EVENTS.PLAYER_READY, { roomCode, isReady });
  }

  addBot(roomCode: string) {
    this.socket?.emit(SOCKET_EVENTS.ADD_BOT, { roomCode });
  }

  startGame(roomCode: string) {
    this.socket?.emit(SOCKET_EVENTS.START_GAME, { roomCode });
  }

  sendMessage(roomCode: string, text: string) {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, { roomCode, text });
  }

  submitVote(roomCode: string, targetId: string) {
    this.socket?.emit(SOCKET_EVENTS.SUBMIT_VOTE, { roomCode, targetId });
  }

  policeAction(roomCode: string, actionType: any, targetPlayerId?: string) {
    this.socket?.emit(SOCKET_EVENTS.POLICE_ACTION, { roomCode, payload: { actionType, targetPlayerId } });
  }

  thiefAction(roomCode: string, objectiveId: string) {
    this.socket?.emit(SOCKET_EVENTS.THIEF_ACTION, { roomCode, payload: { objectiveId } });
  }
}

export const socketService = new SocketService();
