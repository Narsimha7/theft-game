import React, { useState } from 'react';
import { GameStatePublic, Role, EvidenceItem, PlayerPublic, ThiefObjective } from '@theft/shared';
import { EvidenceCard } from '../components/EvidenceCard';
import { PlayerCard } from '../components/PlayerCard';
import { Timer } from '../components/Timer';

interface InvestigationProps {
  gameState: GameStatePublic;
  currentUserId: string;
  role: Role | null;
  thiefObjectives?: ThiefObjective[];
  investigationActionsLeft?: number;
  onPoliceAction: (actionType: 'INSPECT_CCTV' | 'INTERVIEW' | 'FINGERPRINT_CHECK' | 'LOCATION_CHECK' | 'ARREST', targetPlayerId?: string) => void;
  onThiefAction: (objectiveId: string) => void;
  onShareEvidenceToChat?: (evidence: EvidenceItem) => void;
}

export const Investigation: React.FC<InvestigationProps> = ({
  gameState,
  currentUserId,
  role,
  thiefObjectives = [],
  investigationActionsLeft = 2,
  onPoliceAction,
  onThiefAction,
  onShareEvidenceToChat
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'evidence' | 'suspects' | 'operations'>('evidence');

  const otherPlayers = gameState.players.filter((p) => p.id !== currentUserId && p.isAlive);
  const selectedSuspect = gameState.players.find((p) => p.id === selectedSuspectId);

  // Default mock objectives if none sent yet
  const defaultObjectives: ThiefObjective[] = [
    { id: 'cctv_disable', title: 'Cut CCTV Feed', description: 'Disable the surveillance grid in Sector B', completed: false, timeLimitSeconds: 60 },
    { id: 'crack_vault', title: 'Crack Master Safe', description: 'Bypass biometric keypad in the vault', completed: false, timeLimitSeconds: 60 },
    { id: 'cut_power', title: 'Kill Power Grid', description: 'Trigger circuit breaker to create panic', completed: false, timeLimitSeconds: 60 },
    { id: 'signal_getaway', title: 'Signal Getaway Van', description: 'Broadcast encrypted signal to driver', completed: false, timeLimitSeconds: 60 }
  ];

  const objectivesToDisplay = thiefObjectives.length > 0 ? thiefObjectives : defaultObjectives;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Top Phase Header */}
      <div className="bg-crime-surface border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-evidence/15 border border-evidence/30 flex items-center justify-center text-evidence shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <span className="material-symbols-outlined text-[26px]">search</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-evidence tracking-widest uppercase">
                PHASE 02 // FORENSIC INVESTIGATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                ROUND {gameState.roundNumber || 1}
              </span>
            </div>
            <h2 className="font-headline font-extrabold text-2xl text-white">
              Crime Scene Analysis
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Gather clues, test suspect alibis, and prepare for room interrogation.
            </p>
          </div>
        </div>

        {/* Timer */}
        <Timer
          seconds={gameState.phaseTimeRemaining}
          label="INVESTIGATION TIMEOUT"
          warningThreshold={15}
        />
      </div>

      {/* Role-Specific Action Banner */}
      {role === 'POLICE' && (
        <div className="bg-police/10 border border-police/30 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">👮</span>
              <div>
                <h3 className="font-headline font-bold text-base text-police-light">
                  POLICE DISPATCH CONSOLE
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  Actions available: <b className="text-white">{investigationActionsLeft}</b>
                </p>
              </div>
            </div>

            {selectedSuspect && (
              <span className="text-xs font-mono bg-white/[0.08] text-white px-3 py-1 rounded-lg border border-white/[0.1]">
                Target: <b className="text-police-light">{selectedSuspect.username}</b>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onPoliceAction('INSPECT_CCTV')}
              disabled={investigationActionsLeft <= 0}
              className="p-3 rounded-xl bg-police/20 hover:bg-police text-white font-mono text-xs font-bold transition-all border border-police/40 flex flex-col items-center gap-1 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">videocam</span>
              <span>Inspect CCTV</span>
            </button>

            <button
              onClick={() => onPoliceAction('FINGERPRINT_CHECK', selectedSuspectId || undefined)}
              disabled={investigationActionsLeft <= 0 || !selectedSuspectId}
              className="p-3 rounded-xl bg-police/20 hover:bg-police text-white font-mono text-xs font-bold transition-all border border-police/40 flex flex-col items-center gap-1 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              <span>Fingerprint Check</span>
            </button>

            <button
              onClick={() => onPoliceAction('LOCATION_CHECK', selectedSuspectId || undefined)}
              disabled={investigationActionsLeft <= 0 || !selectedSuspectId}
              className="p-3 rounded-xl bg-police/20 hover:bg-police text-white font-mono text-xs font-bold transition-all border border-police/40 flex flex-col items-center gap-1 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span>Location Check</span>
            </button>

            <button
              onClick={() => onPoliceAction('INTERVIEW', selectedSuspectId || undefined)}
              disabled={investigationActionsLeft <= 0 || !selectedSuspectId}
              className="p-3 rounded-xl bg-police/20 hover:bg-police text-white font-mono text-xs font-bold transition-all border border-police/40 flex flex-col items-center gap-1 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
              <span>Interview</span>
            </button>
          </div>
        </div>
      )}

      {role === 'THIEF' && (
        <div className="bg-thief/10 border border-thief/30 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-2xl">🥷</span>
            <div>
              <h3 className="font-headline font-bold text-base text-thief-light">
                STEALTH HEIST DIRECTIVES
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Execute objectives quietly to secure victory or escape.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {objectivesToDisplay.map((obj) => (
              <div
                key={obj.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  obj.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-crime-surface/80 border-thief/30 hover:border-thief'
                }`}
              >
                <div>
                  <h4 className="font-headline font-bold text-sm text-white">{obj.title}</h4>
                  <p className="text-xs font-body text-slate-300 mt-0.5">{obj.description}</p>
                </div>
                <button
                  onClick={() => onThiefAction(obj.id)}
                  disabled={obj.completed}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    obj.completed
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                      : 'bg-thief hover:bg-thief-light text-white shadow-md'
                  }`}
                >
                  {obj.completed ? 'COMPLETED' : 'EXECUTE'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === 'UNDERCOVER' && (
        <div className="bg-undercover/10 border border-undercover/30 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕵️</span>
            <div>
              <h3 className="font-headline font-bold text-base text-undercover-light">
                UNDERCOVER SHADOW PROTOCOL
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Analyze clues below to identify inconsistencies you can invent during discussion to misdirect Police.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Clues (Left) + Suspects (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence Pool */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-evidence text-[20px]">folder_open</span>
              <span>UNCOVERED EVIDENCE DOSSIER</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300">
                {gameState.evidencePool.length}
              </span>
            </h3>
          </div>

          {gameState.evidencePool.length === 0 ? (
            <div className="p-12 rounded-2xl bg-crime-surface/40 border border-white/[0.06] text-center">
              <span className="material-symbols-outlined text-slate-500 text-[40px] mb-2">pending</span>
              <p className="text-sm font-headline text-slate-300">Scanning forensic feed...</p>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Police can use investigation tools to uncover immediate surveillance clues.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3.5">
              {gameState.evidencePool.map((item) => (
                <EvidenceCard
                  key={item.id}
                  evidence={item}
                  onShareToChat={onShareEvidenceToChat}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Suspect List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-police text-[20px]">group</span>
              <span>SUSPECT OPERATIVES</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Click to target</span>
          </div>

          <div className="space-y-2.5">
            {gameState.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelf={player.id === currentUserId}
                isSelected={player.id === selectedSuspectId}
                onSelect={(p) => {
                  if (p.id !== currentUserId) {
                    setSelectedSuspectId(p.id === selectedSuspectId ? null : p.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
