import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  avatar: string;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  policeWins: number;
  undercoverWins: number;
  thiefWins: number;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: 'avatar-detective-1' },
    level: { type: Number, default: 1 },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    policeWins: { type: Number, default: 0 },
    undercoverWins: { type: Number, default: 0 },
    thiefWins: { type: Number, default: 0 },
    isGuest: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
