import React from 'react';
import { GameStatePublic, Role } from '@theft/shared';

interface GameOverProps {
  gameState: GameStatePublic;
  currentUserId: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  gameState,
  currentUserId,
  onPlayAgain,
  onBackToMenu
}) => {
  const isPoliceWin = gameState.winner === 'POLICE';
  const isHost = gameState.hostId === currentUserId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Victor Banner */}
      <div
        className={`p-8 rounded-3xl border shadow-2xl text-center relative overflow-hidden backdrop-blur-xl ${
          isPoliceWin
            ? 'bg-police/15 border-police/40 shadow-[0_0_60px_rgba(59,130,246,0.3)]'
            : 'bg-thief/15 border-thief/40 shadow-[0_0_60px_rgba(244,63,94,0.3)]'
        }`}
      >
        <div className="text-6xl mb-3">{isPoliceWin ? '👮' : '🥷'}</div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
          MISSION RESOLUTION
        </span>
        <h1
          className={`font-headline font-extrabold text-4xl sm:text-6xl tracking-wider mt-2 ${
            isPoliceWin ? 'text-police-light' : 'text-thief-light'
          }`}
        >
          {isPoliceWin ? 'POLICE VICTORY' : 'THIEF & UNDERCOVER VICTORY'}
        </h1>
        <p className="font-body text-base text-slate-200 max-w-xl mx-auto mt-3">
          {gameState.winReason || (isPoliceWin
            ? 'The Thief was identified and apprehended by law enforcement.'
            : 'The Master Thief executed the heist and escaped with the Undercover accomplice.')}
        </p>
      </div>

      {/* Full Roster Identity Declassification */}
      <div className="bg-crime-surface border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-police text-[20px]">badge</span>
            <span>DECLASSIFIED OPERATIVE ROSTER</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">All identities uncovered</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {gameState.players.map((player) => {
            const isMe = player.id === currentUserId;

            return (
              <div
                key={player.id}
                className="p-4 rounded-xl bg-crime-card/80 border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/[0.1] flex items-center justify-center font-headline font-bold text-white text-sm">
                    {player.avatar || player.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-white">
                        {player.username}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-police/20 text-police-light font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {player.isAlive ? 'Survived' : 'Eliminated'}
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  OPERATIVE
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onBackToMenu}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-crime-surface hover:bg-crime-card border border-white/[0.1] text-white font-mono text-xs font-bold transition-all"
        >
          RETURN TO MAIN MENU
        </button>

        {isHost && (
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-police to-blue-600 hover:from-blue-500 hover:to-police text-white font-headline font-bold text-sm tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>PLAY AGAIN (SAME ROOM)</span>
          </button>
        )}
      </div>
    </div>
  );
};
