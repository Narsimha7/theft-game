import React, { useState } from 'react';
import { GameStatePublic, PlayerPublic } from '@theft/shared';

interface LobbyProps {
  gameState: GameStatePublic;
  currentUserId: string;
  onToggleReady: () => void;
  onStartGame: () => void;
  onAddBot: () => void;
  onRemoveBot: () => void;
  onLeaveRoom: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  gameState,
  currentUserId,
  onToggleReady,
  onStartGame,
  onAddBot,
  onRemoveBot,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);

  const isHost = gameState.hostId === currentUserId;
  const selfPlayer = gameState.players.find((p) => p.id === currentUserId);
  const playerCount = gameState.players.length;
  const minPlayers = gameState.settings.minPlayers || 4;
  const maxPlayers = gameState.settings.maxPlayers || 10;
  const canStart = isHost && playerCount >= minPlayers;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Banner: Room Code & Status */}
      <div className="bg-crime-surface border border-white/[0.08] rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-police/15 border border-police/30 flex items-center justify-center text-police shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <span className="material-symbols-outlined text-[32px]">shield</span>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-police-light tracking-widest uppercase">
              SECURE BRIEFING ROOM
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-widest text-white">
                {gameState.roomCode}
              </h2>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 border border-white/[0.08] transition-colors"
                title="Copy Room Code"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Mode: <span className="text-white font-bold">{gameState.settings.gameMode}</span> • Need {minPlayers}–{maxPlayers} operatives
            </p>
          </div>
        </div>

        {/* Player Count & Host Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-headline font-bold text-white">
              {playerCount} <span className="text-slate-400 text-sm">/ {maxPlayers}</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              {playerCount < minPlayers ? `Need ${minPlayers - playerCount} more` : 'Ready for deployment'}
            </p>
          </div>

          <button
            onClick={onLeaveRoom}
            className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition-colors"
            title="Leave Briefing"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>

      {/* Operatives Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
            <span>OPERATIVES PRESENT</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
              {playerCount}
            </span>
          </h3>

          {/* Bot addition controls for quick testing */}
          {isHost && (
            <div className="flex items-center gap-2">
              <button
                onClick={onAddBot}
                disabled={playerCount >= maxPlayers}
                className="px-3 py-1.5 rounded-lg bg-police/20 hover:bg-police text-police-light hover:text-white text-xs font-mono font-bold transition-all border border-police/30 disabled:opacity-40 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                <span>+ ADD BOT</span>
              </button>
              <button
                onClick={onRemoveBot}
                disabled={!gameState.players.some((p) => p.isBot)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-mono transition-all border border-white/[0.08] disabled:opacity-40"
              >
                - REMOVE BOT
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gameState.players.map((player: PlayerPublic) => {
            const isMe = player.id === currentUserId;

            return (
              <div
                key={player.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isMe
                    ? 'bg-police/10 border-police/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'bg-crime-surface/70 border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-white/[0.1] flex items-center justify-center font-headline font-bold text-white shadow-inner">
                    {player.avatar || player.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-white">
                        {player.username}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-police/30 text-police-light">
                          YOU
                        </span>
                      )}
                      {player.isHost && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          HOST
                        </span>
                      )}
                      {player.isBot && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          AI
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Operative
                    </span>
                  </div>
                </div>

                <div>
                  {player.isReady ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-400 border border-white/[0.06] font-mono text-xs">
                      WAITING
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start / Ready Action Bar */}
      <div className="p-6 rounded-2xl bg-crime-surface border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="text-center sm:text-left">
          {playerCount < minPlayers ? (
            <p className="text-amber-400 font-mono text-xs flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              At least {minPlayers} players needed to deploy roles ({playerCount}/{minPlayers}). You can add AI bots to test!
            </p>
          ) : (
            <p className="text-emerald-400 font-mono text-xs flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              All operative slots filled. Ready to launch investigation.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isHost && (
            <button
              onClick={onToggleReady}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                selfPlayer?.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/[0.1]'
              }`}
            >
              {selfPlayer?.isReady ? '✓ MARKED READY' : 'SET AS READY'}
            </button>
          )}

          {isHost && (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-police to-blue-600 hover:from-blue-500 hover:to-police text-white font-headline font-extrabold text-sm tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              <span>START GAME</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
