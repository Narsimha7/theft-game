import React, { useState } from 'react';
import { UserStats } from '@theft/shared';

interface MainMenuProps {
  user: UserStats | null;
  onCreateRoom: (mode?: string) => void;
  onJoinRoom: (code: string) => void;
  onQuickPlay: () => void;
  onOpenRules: () => void;
  onOpenProfile: () => void;
  onLoginAsGuest: (username: string) => void;
  onOpenAuth: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  user,
  onCreateRoom,
  onJoinRoom,
  onQuickPlay,
  onOpenRules,
  onOpenProfile,
  onLoginAsGuest,
  onOpenAuth
}) => {
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState('');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    onJoinRoom(joinCodeInput.trim().toUpperCase());
    setShowJoinModal(false);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNameInput.trim()) return;
    onLoginAsGuest(guestNameInput.trim());
    setShowGuestPrompt(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 overflow-hidden">
      {/* Noir atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-police/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-thief/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Title & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-police/15 border border-police/30 text-police-light font-mono text-xs font-bold mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-police animate-ping" />
            REAL-TIME MULTIPLAYER DEDUCTION
          </div>
          
          <h1 className="font-headline font-extrabold text-5xl sm:text-7xl tracking-wider text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            THEFT
          </h1>
          <p className="font-headline font-bold text-lg sm:text-2xl text-slate-300 tracking-widest mt-1">
            POLICE & UNDERCOVER
          </p>
          <p className="text-sm text-slate-400 font-mono mt-3 max-w-md mx-auto">
            Solve high-stakes crimes. Deceive investigators. Execute the perfect heist.
          </p>
        </div>

        {/* User Card if logged in, or Guest Login reminder */}
        {user ? (
          <div className="w-full max-w-xl mb-8 p-4 rounded-2xl bg-crime-surface/80 border border-white/[0.08] backdrop-blur-md shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-police to-indigo-600 flex items-center justify-center font-headline font-bold text-white text-lg shadow-md">
                {user.avatar || user.username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-base text-white">{user.username}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-police/20 text-police-light border border-police/30 font-bold">
                    LVL {user.level}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                  <span>Played: <b className="text-white">{user.gamesPlayed}</b></span>
                  <span>Wins: <b className="text-emerald-400">{user.wins}</b></span>
                  <span>Losses: <b className="text-rose-400">{user.losses}</b></span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-slate-200 transition-colors border border-white/[0.08]"
            >
              PROFILE
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl mb-8 p-4 rounded-2xl bg-crime-card/80 border border-white/[0.08] backdrop-blur flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-police text-[28px]">shield</span>
              <div>
                <p className="text-sm font-headline font-bold text-white">Unidentified Operative</p>
                <p className="text-xs font-mono text-slate-400">Play instantly as a guest or sign in to save rank.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuestPrompt(true)}
                className="px-3.5 py-2 rounded-xl bg-police/20 hover:bg-police text-police-light hover:text-white border border-police/40 font-mono text-xs font-bold transition-all"
              >
                GUEST
              </button>
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white font-mono text-xs font-bold transition-all border border-white/[0.1]"
              >
                LOGIN
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          {/* Quick Play */}
          <button
            onClick={onQuickPlay}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-police to-blue-600 hover:from-blue-500 hover:to-police text-white font-headline font-extrabold text-lg tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3 group"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">bolt</span>
            <span>QUICK PLAY</span>
          </button>

          {/* Create Room */}
          <button
            onClick={() => onCreateRoom('CLASSIC')}
            className="w-full py-3.5 px-6 rounded-2xl bg-crime-surface hover:bg-crime-card border border-white/[0.1] hover:border-police text-white font-headline font-bold text-base tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-3 group"
          >
            <span className="material-symbols-outlined text-police text-[22px] group-hover:scale-110 transition-transform">add_circle</span>
            <span>CREATE ROOM</span>
          </button>

          {/* Join Room */}
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-crime-surface hover:bg-crime-card border border-white/[0.1] hover:border-undercover text-white font-headline font-bold text-base tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-3 group"
          >
            <span className="material-symbols-outlined text-undercover text-[22px] group-hover:scale-110 transition-transform">login</span>
            <span>JOIN ROOM</span>
          </button>

          {/* How to Play / Rules */}
          <button
            onClick={onOpenRules}
            className="w-full py-3 px-6 rounded-2xl bg-crime-surface/60 hover:bg-crime-surface border border-white/[0.06] text-slate-300 hover:text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>FIELD MANUAL & RULES</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-xs font-mono text-slate-400">
          THEFT Online • Authoritative Multiplayer Engine • 4-10 Operatives
        </div>
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-crime-surface border border-white/[0.12] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-headline font-bold text-lg text-white mb-2">JOIN ROOM</h3>
            <p className="text-xs font-mono text-slate-400 mb-4">Enter the 6-character room access code</p>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="E.G. 7K9X2P"
                autoFocus
                className="w-full text-center tracking-[0.3em] font-mono text-2xl font-bold bg-crime-darkest border border-white/[0.15] rounded-xl py-3 text-white placeholder-slate-400 focus:outline-none focus:border-police"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] font-mono text-xs text-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={joinCodeInput.trim().length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-police hover:bg-police-light text-white font-mono text-xs font-bold disabled:opacity-40"
                >
                  ENTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Prompt Modal */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-crime-surface border border-white/[0.12] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-headline font-bold text-lg text-white mb-2">OPERATIVE CALLSIGN</h3>
            <p className="text-xs font-mono text-slate-400 mb-4">Choose a nickname for this session</p>
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={16}
                value={guestNameInput}
                onChange={(e) => setGuestNameInput(e.target.value)}
                placeholder="Operative_42"
                autoFocus
                className="w-full font-mono text-base bg-crime-darkest border border-white/[0.15] rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-police"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGuestPrompt(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] font-mono text-xs text-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!guestNameInput.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-police hover:bg-police-light text-white font-mono text-xs font-bold disabled:opacity-40"
                >
                  CONTINUE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
