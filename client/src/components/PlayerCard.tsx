import React from 'react';
import { PlayerPublic } from '@theft/shared';

interface PlayerCardProps {
  player: PlayerPublic;
  isSelf: boolean;
  isSelected?: boolean;
  onSelect?: (player: PlayerPublic) => void;
  actionButtonText?: string;
  onActionClick?: (player: PlayerPublic) => void;
  disabled?: boolean;
  voteCount?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelf,
  isSelected = false,
  onSelect,
  actionButtonText,
  onActionClick,
  disabled = false,
  voteCount
}) => {
  return (
    <div
      onClick={() => onSelect && !disabled && onSelect(player)}
      className={`relative rounded-xl p-3.5 transition-all duration-200 border ${
        isSelected
          ? 'bg-police/15 border-police shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-police'
          : player.isAlive
          ? 'bg-crime-surface/70 border-white/[0.08] hover:border-white/[0.2] hover:bg-crime-surface'
          : 'bg-crime-darkest/60 border-white/[0.04] opacity-50 grayscale'
      } ${onSelect && !disabled ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/[0.1] flex items-center justify-center font-headline font-bold text-base text-white shadow-inner">
            {player.avatar || player.username.substring(0, 2).toUpperCase()}
          </div>
          {player.isAlive ? (
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-crime-surface ${
                player.hasVoted ? 'bg-police' : 'bg-emerald-500'
              }`}
              title={player.hasVoted ? 'Has Voted' : 'Ready'}
            />
          ) : (
            <span
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-crime-surface flex items-center justify-center text-[9px] text-white"
              title="Eliminated"
            >
              ✕
            </span>
          )}
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono font-bold text-sm text-white truncate max-w-[120px] sm:max-w-[160px]">
              {player.username}
            </span>
            {isSelf && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-police/20 text-police-light border border-police/30">
                YOU
              </span>
            )}
            {player.isHost && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HOST
              </span>
            )}
            {player.isBot && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-300 border border-slate-600">
                BOT
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs font-mono">
            {player.isAlive ? (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Suspect
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Eliminated
              </span>
            )}

            {voteCount !== undefined && voteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px]">
                {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {actionButtonText && onActionClick && player.isAlive && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(player);
            }}
            className="px-3 py-1.5 rounded-lg bg-police/20 hover:bg-police text-police-light hover:text-white border border-police/40 font-mono text-xs font-bold transition-all shadow-sm"
          >
            {actionButtonText}
          </button>
        )}
      </div>
    </div>
  );
};
