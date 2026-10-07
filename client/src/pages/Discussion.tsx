import React from 'react';
import { GameStatePublic, ChatMessage, Role, EvidenceItem } from '@theft/shared';
import { ChatBox } from '../components/ChatBox';
import { EvidenceCard } from '../components/EvidenceCard';
import { PlayerCard } from '../components/PlayerCard';
import { Timer } from '../components/Timer';

interface DiscussionProps {
  gameState: GameStatePublic;
  currentUserId: string;
  role: Role | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const Discussion: React.FC<DiscussionProps> = ({
  gameState,
  currentUserId,
  role,
  messages,
  onSendMessage
}) => {
  const handleShareEvidence = (evidence: EvidenceItem) => {
    const text = `[EVIDENCE] ${evidence.type}: "${evidence.description}" (${Math.round(evidence.reliability * 100)}% Certainty)`;
    onSendMessage(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Top Banner */}
      <div className="bg-crime-surface border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-police/15 border border-police/30 flex items-center justify-center text-police shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="material-symbols-outlined text-[26px]">record_voice_over</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-police-light tracking-widest uppercase">
                PHASE 03 // INTERROGATION & DISCUSSION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                ROUND {gameState.roundNumber || 1}
              </span>
            </div>
            <h2 className="font-headline font-extrabold text-2xl text-white">
              Open Channel Deliberation
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Cross-examine suspects, share forensic clues, and spot contradictions before voting begins.
            </p>
          </div>
        </div>

        {/* Timer */}
        <Timer
          seconds={gameState.phaseTimeRemaining}
          label="DISCUSSION CLOSES IN"
          warningThreshold={20}
        />
      </div>

      {/* Main Grid: Evidence Drawer (Left), Chat Feed (Center), Suspect Roster (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Evidence Dossier for quick reference (3 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-evidence text-[18px]">folder_open</span>
              <span>FORENSIC CLUES</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Click to quote</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {gameState.evidencePool.length === 0 ? (
              <div className="p-8 rounded-xl bg-crime-surface/40 border border-white/[0.06] text-center text-xs font-mono text-slate-500">
                No physical evidence uncovered. Rely on testimony.
              </div>
            ) : (
              gameState.evidencePool.map((item) => (
                <EvidenceCard
                  key={item.id}
                  evidence={item}
                  onShareToChat={handleShareEvidence}
                />
              ))
            )}
          </div>
        </div>

        {/* Center: Live Chat Channel (5 cols) */}
        <div className="lg:col-span-5">
          <ChatBox
            messages={messages}
            onSendMessage={onSendMessage}
            className="h-[550px]"
          />
        </div>

        {/* Right: Suspect List (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-police text-[18px]">group</span>
              <span>ACCUSED ROSTER</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {gameState.players.filter((p) => p.isAlive).length} Alive
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {gameState.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelf={player.id === currentUserId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
