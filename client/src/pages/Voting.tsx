import React, { useState } from 'react';
import { GameStatePublic, VoteResults, PlayerPublic } from '@theft/shared';
import { PlayerCard } from '../components/PlayerCard';
import { Timer } from '../components/Timer';

interface VotingProps {
  gameState: GameStatePublic;
  currentUserId: string;
  hasVoted: boolean;
  voteResults: VoteResults | null;
  onSubmitVote: (targetPlayerId: string) => void;
}

export const Voting: React.FC<VotingProps> = ({
  gameState,
  currentUserId,
  hasVoted,
  voteResults,
  onSubmitVote
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const selfPlayer = gameState.players.find((p) => p.id === currentUserId);
  const isAlive = selfPlayer?.isAlive ?? true;
  const alivePlayers = gameState.players.filter((p) => p.isAlive);

  const handleConfirmVote = () => {
    if (!selectedTargetId || hasVoted || !isAlive) return;
    onSubmitVote(selectedTargetId);
  };

  const handleVoteSkip = () => {
    if (hasVoted || !isAlive) return;
    onSubmitVote('SKIP');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Top Banner */}
      <div className="bg-crime-surface border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-thief/15 border border-thief/30 flex items-center justify-center text-thief shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <span className="material-symbols-outlined text-[26px]">how_to_vote</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-thief-light tracking-widest uppercase">
                PHASE 04 // TRIBUNAL VOTE
              </span>
            </div>
            <h2 className="font-headline font-extrabold text-2xl text-white">
              Official Indictment Ballot
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Cast your vote for the operative suspected of being the Thief.
            </p>
          </div>
        </div>

        {/* Timer */}
        <Timer
          seconds={gameState.phaseTimeRemaining}
          label="POLLS CLOSE IN"
          warningThreshold={10}
        />
      </div>

      {/* Results View if available */}
      {voteResults ? (
        <div className="bg-crime-surface border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
          <div className="text-center py-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              BALLOT RESOLUTION
            </span>
            <h3 className="text-3xl font-headline font-extrabold text-white mt-1">
              {voteResults.tieOccurred
                ? '⚖️ TIE VOTE — NO INDICTMENT'
                : voteResults.eliminatedPlayer
                ? `🚨 ${voteResults.eliminatedPlayer.username.toUpperCase()} WAS ARRESTED`
                : 'NO PLAYER WAS ELIMINATED'}
            </h3>
            <p className="text-sm font-body text-slate-300 mt-2 max-w-lg mx-auto">
              {voteResults.phaseSummary}
            </p>
            {voteResults.eliminatedPlayer?.role && (
              <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-police/20 border border-police/40 font-mono text-sm font-bold text-police-light">
                CONFIRMED IDENTITY: {voteResults.eliminatedPlayer.role}
              </div>
            )}
          </div>

          {/* Tally Breakdown */}
          <div className="border-t border-white/[0.08] pt-4 space-y-2">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              Vote Distribution:
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(voteResults.voteCounts).map(([id, count]) => {
                const targetPlayer = gameState.players.find((p) => p.id === id);
                const name = id === 'SKIP' ? 'Skip Vote' : targetPlayer?.username || 'Unknown';

                return (
                  <div
                    key={id}
                    className="p-3 rounded-xl bg-crime-card/80 border border-white/[0.06] flex items-center justify-between font-mono text-xs"
                  >
                    <span className="text-white font-bold">{name}</span>
                    <span className="px-2 py-0.5 rounded bg-thief/20 text-thief-light font-bold">
                      {count} {count === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Active Voting View */
        <div className="space-y-6">
          {/* Status Alert */}
          {!isAlive ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 font-mono text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">block</span>
              You have been eliminated and cannot cast a vote in this tribunal.
            </div>
          ) : hasVoted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                Your sealed ballot has been recorded by the mainframe.
              </span>
              <span className="text-slate-400">Waiting for all operatives...</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-police/10 border border-police/25 text-police-light font-mono text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              Select a suspect below, then click "CONFIRM ACCUSATION". You may also skip.
            </div>
          )}

          {/* Suspect Voting Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {alivePlayers.map((player: PlayerPublic) => {
              const isSelected = player.id === selectedTargetId;

              return (
                <div
                  key={player.id}
                  onClick={() => {
                    if (!hasVoted && isAlive) {
                      setSelectedTargetId(player.id);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-thief/15 border-thief ring-1 ring-thief shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-crime-surface/80 border-white/[0.08] hover:border-white/[0.2]'
                  } ${hasVoted || !isAlive ? 'pointer-events-none opacity-60' : ''}`}
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
                        {player.id === currentUserId && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-police/30 text-police-light">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {player.hasVoted ? '✓ Ballot cast' : 'Deciding...'}
                      </span>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full border-2 border-white/[0.2] flex items-center justify-center">
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-thief shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Vote Bar */}
          {!hasVoted && isAlive && (
            <div className="p-4 rounded-2xl bg-crime-surface border border-white/[0.08] flex items-center justify-between gap-4">
              <button
                onClick={handleVoteSkip}
                className="py-3 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-mono text-xs font-bold transition-all border border-white/[0.08]"
              >
                ABSTAIN / SKIP VOTE
              </button>

              <button
                onClick={handleConfirmVote}
                disabled={!selectedTargetId}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-thief to-rose-600 hover:from-rose-500 hover:to-thief text-white font-headline font-bold text-sm tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>CONFIRM INDICTMENT</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
