import React from 'react';
import { UserStats } from '@theft/shared';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserStats | null;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout
}) => {
  if (!isOpen || !user) return null;

  const totalWins = user.wins;
  const winRate = user.gamesPlayed > 0 ? Math.round((totalWins / user.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-crime-surface border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-police via-undercover to-thief" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-police text-[24px]">badge</span>
              <h2 className="font-headline font-extrabold text-xl text-white">OPERATIVE DOSSIER</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-crime-card border border-white/[0.08] mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-police to-indigo-600 flex items-center justify-center text-white text-2xl font-bold font-headline shadow-lg">
              {user.avatar || user.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-white">{user.username}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-police/20 text-police-light border border-police/30">
                  LVL {user.level}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">ID: {user.id.substring(0, 10)}...</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-crime-card/60 border border-white/[0.06]">
              <span className="text-xs font-mono text-slate-400">Total Games</span>
              <p className="text-2xl font-headline font-bold text-white mt-1">{user.gamesPlayed}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-crime-card/60 border border-white/[0.06]">
              <span className="text-xs font-mono text-slate-400">Win Rate</span>
              <p className="text-2xl font-headline font-bold text-emerald-400 mt-1">{winRate}%</p>
            </div>
          </div>

          {/* Role Breakdown */}
          <div className="space-y-2.5 mb-6">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Role Records
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-police/10 border border-police/20 font-mono text-xs">
              <span className="text-police-light flex items-center gap-1.5 font-bold">
                👮 Police Wins
              </span>
              <span className="text-white font-bold">{user.policeWins}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-undercover/10 border border-undercover/20 font-mono text-xs">
              <span className="text-undercover-light flex items-center gap-1.5 font-bold">
                🕵️ Undercover Wins
              </span>
              <span className="text-white font-bold">{user.undercoverWins}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-thief/10 border border-thief/20 font-mono text-xs">
              <span className="text-thief-light flex items-center gap-1.5 font-bold">
                🥷 Thief Wins
              </span>
              <span className="text-white font-bold">{user.thiefWins}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold transition-all text-center"
            >
              DISCONNECT SESSION
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs font-bold transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
