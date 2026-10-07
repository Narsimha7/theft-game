import React from 'react';
import { GameStatePublic, UserStats } from '@theft/shared';
import { soundService } from '../services/audio';

interface NavbarProps {
  user: UserStats | null;
  gameState: GameStatePublic | null;
  onOpenProfile: () => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  onLeaveRoom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  gameState,
  onOpenProfile,
  onOpenRules,
  onOpenAdmin,
  onLeaveRoom
}) => {
  const [audioOn, setAudioOn] = React.useState(soundService.enabled);

  const toggleSound = () => {
    const state = soundService.toggle();
    setAudioOn(state);
  };

  return (
    <header className="sticky top-0 z-40 bg-crime-darkest/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Back to Menu */}
        <div className="flex items-center gap-3">
          <button 
            onClick={gameState ? onLeaveRoom : undefined} 
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-police/15 border border-police/30 flex items-center justify-center text-police shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:border-police transition-all">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-extrabold text-base sm:text-lg tracking-wider text-white">THEFT</span>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-police/20 text-police-light border border-police/30 font-bold">POLICE & UNDERCOVER</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Tactical Social Deduction</p>
            </div>
          </button>
        </div>

        {/* Center Room HUD if in game */}
        {gameState && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-crime-card border border-white/[0.1] font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-police animate-ping"></span>
            <span className="text-slate-400">ROOM:</span>
            <span className="text-white font-bold tracking-wider">{gameState.roomCode}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">OPERATIVES:</span>
            <span className="text-white font-bold">{gameState.players.length}/10</span>
          </div>
        )}

        {/* Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button 
            onClick={toggleSound} 
            title="Toggle Audio Synthesizer"
            className="p-2 rounded-lg bg-crime-surface border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {audioOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button 
            onClick={onOpenRules} 
            title="How to Play"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-crime-surface border border-white/[0.08] text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span className="hidden sm:inline">Rules</span>
          </button>

          <button 
            onClick={onOpenAdmin} 
            title="Admin Dashboard"
            className="p-2 rounded-lg bg-crime-surface border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </button>

          {/* User Profile Pill */}
          <button 
            onClick={onOpenProfile} 
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-crime-surface border border-white/[0.1] hover:border-police transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-police to-indigo-600 flex items-center justify-center text-white text-xs font-bold font-mono">
              {user ? user.username.substring(0, 2).toUpperCase() : 'ME'}
            </div>
            <span className="text-xs font-mono text-slate-200 hidden sm:inline font-medium">
              {user?.username || 'Guest'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
