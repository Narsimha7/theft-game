/**
 * Shared Type Definitions for THEFT: Police & Undercover
 */

export type Role = 'POLICE' | 'UNDERCOVER' | 'THIEF';

export type GamePhase = 
  | 'LOBBY'
  | 'ROLE_REVEAL'
  | 'INVESTIGATION'
  | 'DISCUSSION'
  | 'VOTING'
  | 'RESULTS'
  | 'GAME_OVER';

export type GameMode = 'CLASSIC' | 'CHAOS' | 'RANKED' | 'PRIVATE';

export type EvidenceType = 
  | 'CCTV'
  | 'FINGERPRINT'
  | 'LOCATION'
  | 'WITNESS'
  | 'SECURITY_LOG'
  | 'PHONE_RECORD';

export interface PlayerPublic {
  id: string;
  username: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isAlive: boolean;
  hasVoted: boolean;
  isBot?: boolean;
}

export interface PlayerPrivate extends PlayerPublic {
  role: Role;
  investigationActionsLeft: number;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  description: string;
  reliability: number; // 0.0 to 1.0
  suspectId?: string;
  suspectName?: string;
  timestamp: string;
  isMisleading: boolean;
}

export interface ThiefObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timeLimitSeconds: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  roleTag?: Role; // optional, e.g. for private undercover channel if enabled
}

export interface VoteRecord {
  voterId: string;
  targetId: string;
  timestamp: string;
}

export interface VoteResults {
  voteCounts: Record<string, number>;
  eliminatedPlayer: {
    id: string;
    username: string;
    role?: Role; // shown only if revealRolesOnElimination is true or game over
  } | null;
  tieOccurred: boolean;
  phaseSummary: string;
}

export interface GameSettings {
  roomCode: string;
  gameMode: GameMode;
  minPlayers: number;
  maxPlayers: number;
  revealRolesOnElimination: boolean;
  discussionDuration: number; // in seconds, default 120
  votingDuration: number; // in seconds, default 45
  investigationDuration: number; // in seconds, default 60
}

export interface GameStatePublic {
  roomCode: string;
  hostId: string;
  currentPhase: GamePhase;
  phaseTimeRemaining: number;
  players: PlayerPublic[];
  evidencePool: EvidenceItem[];
  settings: GameSettings;
  winner: 'POLICE' | 'THIEF_AND_UNDERCOVER' | null;
  winReason?: string;
  roundNumber: number;
}

export interface UserStats {
  id: string;
  username: string;
  avatar: string;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  policeWins: number;
  undercoverWins: number;
  thiefWins: number;
}

// Police Investigation Action Payload
export interface PoliceActionPayload {
  actionType: 'INSPECT_CCTV' | 'INTERVIEW' | 'FINGERPRINT_CHECK' | 'LOCATION_CHECK' | 'ARREST';
  targetPlayerId?: string;
}

// Thief Action Payload
export interface ThiefActionPayload {
  objectiveId: string;
}

// Socket Events Constants
export const SOCKET_EVENTS = {
  // Client to Server
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  PLAYER_READY: 'player_ready',
  START_GAME: 'start_game',
  ADD_BOT: 'add_bot',
  REMOVE_BOT: 'remove_bot',
  SEND_MESSAGE: 'send_message',
  REQUEST_CLUE: 'request_clue',
  POLICE_ACTION: 'police_action',
  THIEF_ACTION: 'thief_action',
  SUBMIT_VOTE: 'submit_vote',
  RECONNECT: 'reconnect_player',

  // Server to Client
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_UPDATED: 'room_updated',
  ROLE_ASSIGNED: 'role_assigned',
  GAME_STARTED: 'game_started',
  PHASE_CHANGED: 'phase_changed',
  TIMER_TICK: 'timer_tick',
  RECEIVE_MESSAGE: 'receive_message',
  EVIDENCE_UNLOCKED: 'evidence_unlocked',
  ACTION_RESULT: 'action_result',
  VOTE_RECEIVED: 'vote_received',
  VOTE_RESULTS: 'vote_results',
  PLAYER_ELIMINATED: 'player_eliminated',
  GAME_OVER: 'game_over',
  ERROR_MESSAGE: 'error_message'
} as const;
