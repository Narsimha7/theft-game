import mongoose, { Schema, Document } from 'mongoose';

export interface IGameRoom extends Document {
  roomCode: string;
  hostId: string;
  players: Array<{
    id: string;
    username: string;
    avatar: string;
    isHost: boolean;
    isReady: boolean;
    isAlive: boolean;
    isBot: boolean;
  }>;
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
  currentPhase: string;
  gameSettings: {
    gameMode: string;
    minPlayers: number;
    maxPlayers: number;
    revealRolesOnElimination: boolean;
    discussionDuration: number;
    votingDuration: number;
    investigationDuration: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GameRoomSchema: Schema = new Schema(
  {
    roomCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hostId: { type: String, required: true },
    players: [
      {
        id: { type: String, required: true },
        username: { type: String, required: true },
        avatar: { type: String, default: 'avatar-detective-1' },
        isHost: { type: Boolean, default: false },
        isReady: { type: Boolean, default: false },
        isAlive: { type: Boolean, default: true },
        isBot: { type: Boolean, default: false }
      }
    ],
    status: { type: String, enum: ['WAITING', 'IN_PROGRESS', 'FINISHED'], default: 'WAITING' },
    currentPhase: { type: String, default: 'LOBBY' },
    gameSettings: {
      gameMode: { type: String, default: 'CLASSIC' },
      minPlayers: { type: Number, default: 4 },
      maxPlayers: { type: Number, default: 10 },
      revealRolesOnElimination: { type: Boolean, default: true },
      discussionDuration: { type: Number, default: 120 },
      votingDuration: { type: Number, default: 45 },
      investigationDuration: { type: Number, default: 60 }
    }
  },
  { timestamps: true }
);

export const GameRoom = mongoose.model<IGameRoom>('GameRoom', GameRoomSchema);
