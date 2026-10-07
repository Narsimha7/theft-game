import { 
  GamePhase, 
  PlayerPublic, 
  PlayerPrivate, 
  Role, 
  EvidenceItem, 
  ThiefObjective, 
  VoteRecord, 
  VoteResults, 
  GameSettings,
  SOCKET_EVENTS
} from '@theft/shared';
import { RoleDistributor } from './RoleDistributor';
import { EvidenceGenerator } from './EvidenceGenerator';
import { BotService } from './BotService';
import { AntiCheatValidator } from '../middleware/antiCheat';
import { Server as SocketIOServer } from 'socket.io';

export interface RoomInstance {
  roomCode: string;
  hostId: string;
  phase: GamePhase;
  phaseTimeRemaining: number;
  timerInterval?: NodeJS.Timeout;
  botChatInterval?: NodeJS.Timeout;
  players: Map<string, PlayerPrivate>;
  socketToPlayer: Map<string, string>; // socketId -> playerId
  playerToSocket: Map<string, string>; // playerId -> socketId
  evidencePool: EvidenceItem[];
  thiefObjectives: ThiefObjective[];
  votes: VoteRecord[];
  settings: GameSettings;
  winner: 'POLICE' | 'THIEF_AND_UNDERCOVER' | null;
  winReason?: string;
  roundNumber: number;
}

export class GameManager {
  private static instance: GameManager;
  private rooms: Map<string, RoomInstance> = new Map();
  private io?: SocketIOServer;

  private constructor() {}

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setIO(io: SocketIOServer) {
    this.io = io;
  }

  /**
   * Generate unique 6-character room code (e.g., 7K9X2P)
   */
  generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  /**
   * Create a new room
   */
  createRoom(hostId: string, hostUsername: string, hostAvatar: string): RoomInstance {
    const roomCode = this.generateRoomCode();
    const settings: GameSettings = {
      roomCode,
      gameMode: 'CLASSIC',
      minPlayers: 4,
      maxPlayers: 10,
      revealRolesOnElimination: true,
      discussionDuration: 120,
      votingDuration: 45,
      investigationDuration: 60
    };

    const hostPlayer: PlayerPrivate = {
      id: hostId,
      username: hostUsername,
      avatar: hostAvatar,
      isHost: true,
      isReady: true,
      isAlive: true,
      role: 'POLICE',
      investigationActionsLeft: 2,
      hasVoted: false
    };

    const room: RoomInstance = {
      roomCode,
      hostId,
      phase: 'LOBBY',
      phaseTimeRemaining: 0,
      players: new Map([[hostId, hostPlayer]]),
      socketToPlayer: new Map(),
      playerToSocket: new Map(),
      evidencePool: [],
      thiefObjectives: [],
      votes: [],
      settings,
      winner: null,
      roundNumber: 1
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  getRoom(roomCode: string): RoomInstance | undefined {
    return this.rooms.get(roomCode.toUpperCase());
  }

  joinRoom(roomCode: string, playerId: string, username: string, avatar: string): { success: boolean; error?: string } {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room code not found' };
    if (room.phase !== 'LOBBY') return { success: false, error: 'Game is already in progress' };
    if (room.players.size >= room.settings.maxPlayers) return { success: false, error: 'Room is full' };

    if (!room.players.has(playerId)) {
      const newPlayer: PlayerPrivate = {
        id: playerId,
        username,
        avatar,
        isHost: false,
        isReady: false,
        isAlive: true,
        role: 'POLICE',
        investigationActionsLeft: 2,
        hasVoted: false
      };
      room.players.set(playerId, newPlayer);
    }

    return { success: true };
  }

  addBot(roomCode: string): { success: boolean; error?: string } {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.phase !== 'LOBBY') return { success: false, error: 'Cannot add bots during active game' };
    if (room.players.size >= room.settings.maxPlayers) return { success: false, error: 'Room is full' };

    const bot = BotService.createBot();
    const botPrivate: PlayerPrivate = {
      ...bot,
      role: 'POLICE',
      investigationActionsLeft: 2
    };

    room.players.set(bot.id, botPrivate);
    return { success: true };
  }

  removePlayer(roomCode: string, playerId: string) {
    const room = this.getRoom(roomCode);
    if (!room) return;

    room.players.delete(playerId);
    room.playerToSocket.delete(playerId);

    if (room.players.size === 0) {
      this.clearRoomTimers(room);
      this.rooms.delete(roomCode);
      return;
    }

    // If host left, pass host to next real player
    if (room.hostId === playerId) {
      const remainingPlayers = Array.from(room.players.values());
      const nextReal = remainingPlayers.find(p => !p.isBot) || remainingPlayers[0];
      if (nextReal) {
        nextReal.isHost = true;
        room.hostId = nextReal.id;
      }
    }
  }

  startGame(roomCode: string, requesterId: string): { success: boolean; error?: string } {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== requesterId) return { success: false, error: 'Only the host can start the game' };
    if (room.players.size < room.settings.minPlayers) {
      return { success: false, error: `Minimum ${room.settings.minPlayers} operatives required to start. Add bots or invite players!` };
    }

    // 1. Distribute roles strictly on the server
    const playerIds = Array.from(room.players.keys());
    const assignedRoles = RoleDistributor.assignRoles(playerIds);

    assignedRoles.forEach((role, pid) => {
      const p = room.players.get(pid);
      if (p) {
        p.role = role;
        p.isAlive = true;
        p.hasVoted = false;
        p.investigationActionsLeft = role === 'POLICE' ? 2 : 0;
      }
    });

    // 2. Generate Thief Objectives
    room.thiefObjectives = [
      { id: 'obj-1', title: 'Disable CCTV 04', description: 'Cut camera surveillance to the vault corridor.', completed: false, timeLimitSeconds: 60 },
      { id: 'obj-2', title: 'Crack Master Keypad', description: 'Decrypt the digital vault access code.', completed: false, timeLimitSeconds: 90 },
      { id: 'obj-3', title: 'Signal Getaway Vehicle', description: 'Transmit beacon to exit via back alley.', completed: false, timeLimitSeconds: 120 }
    ];

    // 3. Generate Evidence Pool
    const playersForEvidence = Array.from(room.players.values()).map(p => ({
      id: p.id,
      username: p.username,
      role: p.role
    }));
    room.evidencePool = EvidenceGenerator.generateEvidencePool(playersForEvidence);

    // 4. Begin Phase 1: ROLE_REVEAL (10 seconds)
    this.transitionPhase(room, 'ROLE_REVEAL', 10);

    return { success: true };
  }

  transitionPhase(room: RoomInstance, nextPhase: GamePhase, duration: number) {
    this.clearRoomTimers(room);
    room.phase = nextPhase;
    room.phaseTimeRemaining = duration;

    // Reset votes if entering voting phase
    if (nextPhase === 'VOTING') {
      room.votes = [];
      room.players.forEach(p => p.hasVoted = false);
      // Trigger bot votes automatically after a short delay
      setTimeout(() => this.executeBotVotes(room), 12000);
    }

    // Bot discussion chatter if in discussion phase
    if (nextPhase === 'DISCUSSION') {
      this.startBotChatter(room);
    }

    // Broadcast phase change
    if (this.io) {
      this.io.to(room.roomCode).emit(SOCKET_EVENTS.PHASE_CHANGED, {
        phase: room.phase,
        duration: room.phaseTimeRemaining,
        roundNumber: room.roundNumber
      });
    }

    // Authoritative Server Timer Loop
    room.timerInterval = setInterval(() => {
      room.phaseTimeRemaining--;

      if (this.io) {
        this.io.to(room.roomCode).emit(SOCKET_EVENTS.TIMER_TICK, {
          timeRemaining: room.phaseTimeRemaining
        });
      }

      if (room.phaseTimeRemaining <= 0) {
        this.onTimerExpired(room);
      }
    }, 1000);
  }

  private onTimerExpired(room: RoomInstance) {
    this.clearRoomTimers(room);

    switch (room.phase) {
      case 'ROLE_REVEAL':
        this.transitionPhase(room, 'INVESTIGATION', room.settings.investigationDuration);
        break;

      case 'INVESTIGATION':
        this.transitionPhase(room, 'DISCUSSION', room.settings.discussionDuration);
        break;

      case 'DISCUSSION':
        this.transitionPhase(room, 'VOTING', room.settings.votingDuration);
        break;

      case 'VOTING':
        this.resolveVotes(room);
        break;

      case 'RESULTS':
        // Check game over or proceed to next round
        if (room.winner) {
          this.transitionPhase(room, 'GAME_OVER', 0);
        } else {
          room.roundNumber++;
          this.transitionPhase(room, 'INVESTIGATION', room.settings.investigationDuration);
        }
        break;
    }
  }

  submitVote(roomCode: string, voterId: string, targetId: string): { success: boolean; error?: string } {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const voter = room.players.get(voterId);
    if (!voter) return { success: false, error: 'Player not in room' };

    const validation = AntiCheatValidator.canVote(room.phase, voter.isAlive, voter.hasVoted);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    voter.hasVoted = true;
    room.votes.push({
      voterId,
      targetId,
      timestamp: new Date().toISOString()
    });

    if (this.io) {
      this.io.to(room.roomCode).emit(SOCKET_EVENTS.VOTE_RECEIVED, {
        voterId,
        totalVotesCast: room.votes.length,
        totalAlivePlayers: Array.from(room.players.values()).filter(p => p.isAlive).length
      });
    }

    // Check if all alive players have voted
    const aliveCount = Array.from(room.players.values()).filter(p => p.isAlive).length;
    if (room.votes.length >= aliveCount) {
      this.resolveVotes(room);
    }

    return { success: true };
  }

  private resolveVotes(room: RoomInstance) {
    this.clearRoomTimers(room);

    // Tally votes
    const counts: Record<string, number> = {};
    room.votes.forEach(v => {
      counts[v.targetId] = (counts[v.targetId] || 0) + 1;
    });

    let maxVotes = 0;
    let candidates: string[] = [];
    Object.entries(counts).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        candidates = [targetId];
      } else if (count === maxVotes) {
        candidates.push(targetId);
      }
    });

    let eliminatedPlayer: PlayerPrivate | null = null;
    let isTie = candidates.length > 1;

    if (!isTie && candidates.length === 1 && maxVotes > 0) {
      eliminatedPlayer = room.players.get(candidates[0]) || null;
      if (eliminatedPlayer) {
        eliminatedPlayer.isAlive = false;
      }
    }

    // Check Win Conditions
    const thief = Array.from(room.players.values()).find(p => p.role === 'THIEF');
    const alivePolice = Array.from(room.players.values()).filter(p => p.role === 'POLICE' && p.isAlive);

    let winner: 'POLICE' | 'THIEF_AND_UNDERCOVER' | null = null;
    let winReason = '';

    if (thief && !thief.isAlive) {
      winner = 'POLICE';
      winReason = 'The Thief was successfully identified and arrested by the Police!';
    } else if (alivePolice.length <= 1) {
      winner = 'THIEF_AND_UNDERCOVER';
      winReason = 'The Police force was neutralized. The Thief escaped!';
    }

    room.winner = winner;
    room.winReason = winReason;

    const voteResults: VoteResults = {
      voteCounts: counts,
      eliminatedPlayer: eliminatedPlayer ? {
        id: eliminatedPlayer.id,
        username: eliminatedPlayer.username,
        role: room.settings.revealRolesOnElimination || !!winner ? eliminatedPlayer.role : undefined
      } : null,
      tieOccurred: isTie,
      phaseSummary: isTie 
        ? 'Council resulted in a tie vote. No operative was eliminated this round.' 
        : eliminatedPlayer 
          ? `Operative ${eliminatedPlayer.username} was eliminated by plurality.` 
          : 'No votes were recorded.'
    };

    if (this.io) {
      this.io.to(room.roomCode).emit(SOCKET_EVENTS.VOTE_RESULTS, voteResults);

      if (winner) {
        this.io.to(room.roomCode).emit(SOCKET_EVENTS.GAME_OVER, {
          winner,
          winReason,
          allRoles: Array.from(room.players.values()).map(p => ({
            id: p.id,
            username: p.username,
            role: p.role
          }))
        });
      }
    }

    this.transitionPhase(room, winner ? 'GAME_OVER' : 'RESULTS', 10);
  }

  private executeBotVotes(room: RoomInstance) {
    if (room.phase !== 'VOTING') return;

    const thief = Array.from(room.players.values()).find(p => p.role === 'THIEF');
    const alivePlayers = Array.from(room.players.values()).filter(p => p.isAlive);

    room.players.forEach(p => {
      if (p.isBot && p.isAlive && !p.hasVoted) {
        const targetId = BotService.pickVoteTarget(p.role, alivePlayers, p.id, thief?.id);
        this.submitVote(room.roomCode, p.id, targetId);
      }
    });
  }

  private startBotChatter(room: RoomInstance) {
    const bots = Array.from(room.players.values()).filter(p => p.isBot && p.isAlive);
    if (bots.length === 0) return;

    let botChatCount = 0;
    room.botChatInterval = setInterval(() => {
      botChatCount++;
      if (botChatCount > 4 || room.phase !== 'DISCUSSION') {
        if (room.botChatInterval) clearInterval(room.botChatInterval);
        return;
      }

      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      const text = BotService.getRandomChatPhrase();

      if (this.io) {
        this.io.to(room.roomCode).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
          id: `msg-${Date.now()}`,
          senderId: randomBot.id,
          senderName: randomBot.username,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }, 15000);
  }

  private clearRoomTimers(room: RoomInstance) {
    if (room.timerInterval) {
      clearInterval(room.timerInterval);
      room.timerInterval = undefined;
    }
    if (room.botChatInterval) {
      clearInterval(room.botChatInterval);
      room.botChatInterval = undefined;
    }
  }

  getPublicRoomState(room: RoomInstance) {
    const playersPublic: PlayerPublic[] = Array.from(room.players.values()).map(p => ({
      id: p.id,
      username: p.username,
      avatar: p.avatar,
      isHost: p.isHost,
      isReady: p.isReady,
      isAlive: p.isAlive,
      hasVoted: p.hasVoted,
      isBot: p.isBot
    }));

    return {
      roomCode: room.roomCode,
      hostId: room.hostId,
      currentPhase: room.phase,
      phaseTimeRemaining: room.phaseTimeRemaining,
      players: playersPublic,
      evidencePool: room.evidencePool,
      settings: room.settings,
      winner: room.winner,
      winReason: room.winReason,
      roundNumber: room.roundNumber
    };
  }

  getAllActiveRoomsSummary() {
    return Array.from(this.rooms.values()).map(r => ({
      roomCode: r.roomCode,
      playerCount: r.players.size,
      phase: r.phase,
      round: r.roundNumber
    }));
  }
}
