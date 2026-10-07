import { Server as SocketIOServer, Socket } from 'socket.io';
import { GameManager } from '../services/GameManager';
import { verifySocketToken } from '../middleware/authMiddleware';
import { SOCKET_EVENTS, PoliceActionPayload, ThiefActionPayload } from '@theft/shared';

export function setupSocketHandlers(io: SocketIOServer) {
  const gm = GameManager.getInstance();
  gm.setIO(io);

  io.on('connection', (socket: Socket) => {
    let authenticatedUser: { id: string; username: string; isGuest?: boolean } | null = null;
    let currentRoomCode: string | null = null;

    // Optional auth token handshake
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (token) {
      authenticatedUser = verifySocketToken(token);
    }

    // 1. Join / Create Room Handler
    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomCode, user }: { roomCode: string; user?: any }) => {
      const activeUser = authenticatedUser || user;
      if (!activeUser || !roomCode) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: 'Authentication required to enter room.' });
        return;
      }

      const room = gm.getRoom(roomCode);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: 'Room not found.' });
        return;
      }

      gm.joinRoom(roomCode, activeUser.id, activeUser.username, activeUser.avatar || 'avatar-detective-1');
      currentRoomCode = roomCode.toUpperCase();
      socket.join(currentRoomCode);

      // Track socket mappings for private messaging and reconnection
      room.socketToPlayer.set(socket.id, activeUser.id);
      room.playerToSocket.set(activeUser.id, socket.id);

      // Broadcast updated room state
      io.to(currentRoomCode).emit(SOCKET_EVENTS.ROOM_UPDATED, gm.getPublicRoomState(room));

      // If game already started, send player their private role
      const p = room.players.get(activeUser.id);
      if (p && room.phase !== 'LOBBY') {
        socket.emit(SOCKET_EVENTS.ROLE_ASSIGNED, {
          role: p.role,
          investigationActionsLeft: p.investigationActionsLeft
        });
      }
    });

    // 2. Player Ready Toggle
    socket.on(SOCKET_EVENTS.PLAYER_READY, ({ roomCode, isReady }: { roomCode: string; isReady: boolean }) => {
      const room = gm.getRoom(roomCode);
      const playerId = room?.socketToPlayer.get(socket.id);
      if (room && playerId) {
        const p = room.players.get(playerId);
        if (p) {
          p.isReady = isReady;
          io.to(room.roomCode).emit(SOCKET_EVENTS.ROOM_UPDATED, gm.getPublicRoomState(room));
        }
      }
    });

    // 3. Add AI Bot (Allows instant solo/multiplayer testing)
    socket.on(SOCKET_EVENTS.ADD_BOT, ({ roomCode }: { roomCode: string }) => {
      const room = gm.getRoom(roomCode);
      if (room) {
        const res = gm.addBot(roomCode);
        if (res.success) {
          io.to(room.roomCode).emit(SOCKET_EVENTS.ROOM_UPDATED, gm.getPublicRoomState(room));
        } else {
          socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: res.error });
        }
      }
    });

    // 4. Start Game (Server-Side Role Assignment)
    socket.on(SOCKET_EVENTS.START_GAME, ({ roomCode }: { roomCode: string }) => {
      const room = gm.getRoom(roomCode);
      const playerId = room?.socketToPlayer.get(socket.id);
      if (!room || !playerId) return;

      const res = gm.startGame(roomCode, playerId);
      if (!res.success) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: res.error });
        return;
      }

      // CRITICAL SECURITY REQUIREMENT:
      // Send each player ONLY their own role! Never broadcast allRoles.
      room.players.forEach((player, pId) => {
        const targetSocketId = room.playerToSocket.get(pId);
        if (targetSocketId) {
          io.to(targetSocketId).emit(SOCKET_EVENTS.ROLE_ASSIGNED, {
            role: player.role,
            investigationActionsLeft: player.investigationActionsLeft,
            briefing: player.role === 'POLICE'
              ? 'Find and arrest the Thief before they escape the facility!'
              : player.role === 'UNDERCOVER'
              ? 'Protect the Thief. Deflect suspicion and mislead the Police!'
              : 'Execute your heist objectives and escape without being caught!'
          });
        }
      });

      // Broadcast public game started state
      io.to(room.roomCode).emit(SOCKET_EVENTS.GAME_STARTED, gm.getPublicRoomState(room));
    });

    // 5. Real-Time Chat in Discussion Phase
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, ({ roomCode, text }: { roomCode: string; text: string }) => {
      const room = gm.getRoom(roomCode);
      const playerId = room?.socketToPlayer.get(socket.id);
      if (!room || !playerId || !text?.trim()) return;

      const player = room.players.get(playerId);
      if (!player) return;

      const chatMsg = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: player.id,
        senderName: player.username,
        text: text.trim().substring(0, 200),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      io.to(room.roomCode).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, chatMsg);
    });

    // 6. Police Investigation Actions
    socket.on(SOCKET_EVENTS.POLICE_ACTION, ({ roomCode, payload }: { roomCode: string; payload: PoliceActionPayload }) => {
      const room = gm.getRoom(roomCode);
      const playerId = room?.socketToPlayer.get(socket.id);
      if (!room || !playerId) return;

      const player = room.players.get(playerId);
      if (!player || player.role !== 'POLICE' || room.phase !== 'INVESTIGATION') {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: 'Action not authorized.' });
        return;
      }

      if (player.investigationActionsLeft <= 0) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: 'No investigation actions remaining this round.' });
        return;
      }

      player.investigationActionsLeft--;

      // Generate actionable intelligence
      let actionReport = '';
      if (payload.actionType === 'INSPECT_CCTV') {
        const cctvClue = room.evidencePool.find(e => e.type === 'CCTV');
        actionReport = cctvClue ? cctvClue.description : 'CCTV feeds show clear corridor at entry points.';
      } else if (payload.actionType === 'FINGERPRINT_CHECK') {
        const fpClue = room.evidencePool.find(e => e.type === 'FINGERPRINT');
        actionReport = fpClue ? fpClue.description : 'Latent print scans completed. No matches on file.';
      } else if (payload.actionType === 'LOCATION_CHECK' && payload.targetPlayerId) {
        const target = room.players.get(payload.targetPlayerId);
        actionReport = `Badge clearance for ${target?.username || 'suspect'} shows movement near east wing at 23:38.`;
      } else {
        actionReport = 'Investigation scan completed. Intelligence synced to evidence ledger.';
      }

      socket.emit(SOCKET_EVENTS.ACTION_RESULT, {
        actionType: payload.actionType,
        report: actionReport,
        actionsRemaining: player.investigationActionsLeft
      });
    });

    // 7. Thief Heist Actions
    socket.on(SOCKET_EVENTS.THIEF_ACTION, ({ roomCode, payload }: { roomCode: string; payload: ThiefActionPayload }) => {
      const room = gm.getRoom(roomCode);
      const playerId = room?.socketToPlayer.get(socket.id);
      if (!room || !playerId) return;

      const player = room.players.get(playerId);
      if (!player || player.role !== 'THIEF') {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: 'Only the Thief can trigger heist operations.' });
        return;
      }

      const obj = room.thiefObjectives.find(o => o.id === payload.objectiveId);
      if (obj && !obj.completed) {
        obj.completed = true;
        socket.emit(SOCKET_EVENTS.ACTION_RESULT, {
          objectiveId: obj.id,
          report: `Objective [${obj.title}] successfully completed!`
        });

        // If all objectives complete, Thief escapes & wins!
        const allDone = room.thiefObjectives.every(o => o.completed);
        if (allDone) {
          room.winner = 'THIEF_AND_UNDERCOVER';
          room.winReason = 'The Thief completed all heist objectives and made a clean escape!';
          io.to(room.roomCode).emit(SOCKET_EVENTS.GAME_OVER, {
            winner: room.winner,
            winReason: room.winReason,
            allRoles: Array.from(room.players.values()).map(p => ({
              id: p.id,
              username: p.username,
              role: p.role
            }))
          });
        }
      }
    });

    // 8. Confidential Ballot Voting
    socket.on(SOCKET_EVENTS.SUBMIT_VOTE, ({ roomCode, targetId }: { roomCode: string; targetId: string }) => {
      const room = gm.getRoom(roomCode);
      const voterId = room?.socketToPlayer.get(socket.id);
      if (!room || !voterId) return;

      const res = gm.submitVote(roomCode, voterId, targetId);
      if (!res.success) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { error: res.error });
      }
    });

    // 9. Disconnect & Cleanup
    socket.on('disconnect', () => {
      if (currentRoomCode) {
        const room = gm.getRoom(currentRoomCode);
        if (room) {
          const playerId = room.socketToPlayer.get(socket.id);
          if (playerId) {
            room.socketToPlayer.delete(socket.id);
            // Allow grace period for reconnection
            setTimeout(() => {
              if (!room.playerToSocket.has(playerId)) {
                gm.removePlayer(currentRoomCode!, playerId);
                io.to(currentRoomCode!).emit(SOCKET_EVENTS.ROOM_UPDATED, gm.getPublicRoomState(room));
              }
            }, 10000);
          }
        }
      }
    });
  });
}
