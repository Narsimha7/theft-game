import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  roomCode: string;
  players: Array<{
    id: string;
    username: string;
    role: 'POLICE' | 'UNDERCOVER' | 'THIEF';
    isAlive: boolean;
  }>;
  phase: string;
  evidence: Array<{
    id: string;
    type: string;
    description: string;
    reliability: number;
    suspectId?: string;
    suspectName?: string;
  }>;
  votes: Array<{
    voterId: string;
    targetId: string;
    round: number;
  }>;
  objectives: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
  winner: 'POLICE' | 'THIEF_AND_UNDERCOVER' | null;
  winReason?: string;
  startedAt: Date;
  endedAt?: Date;
}

const GameSchema: Schema = new Schema(
  {
    roomCode: { type: String, required: true },
    players: [
      {
        id: { type: String, required: true },
        username: { type: String, required: true },
        role: { type: String, enum: ['POLICE', 'UNDERCOVER', 'THIEF'], required: true },
        isAlive: { type: Boolean, default: true }
      }
    ],
    phase: { type: String, default: 'LOBBY' },
    evidence: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        reliability: { type: Number, required: true },
        suspectId: { type: String },
        suspectName: { type: String }
      }
    ],
    votes: [
      {
        voterId: { type: String, required: true },
        targetId: { type: String, required: true },
        round: { type: Number, default: 1 }
      }
    ],
    objectives: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    winner: { type: String, enum: ['POLICE', 'THIEF_AND_UNDERCOVER', null], default: null },
    winReason: { type: String },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
  },
  { timestamps: true }
);

export const Game = mongoose.model<IGame>('Game', GameSchema);
