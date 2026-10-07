import React, { useEffect } from 'react';
import { Role } from '@theft/shared';
import { Timer } from '../components/Timer';
import { soundService } from '../services/audio';

interface RoleRevealProps {
  role: Role | null;
  timeRemaining: number;
}

export const RoleReveal: React.FC<RoleRevealProps> = ({ role, timeRemaining }) => {
  useEffect(() => {
    soundService.playAlert();
  }, []);

  const getRoleInfo = (r: Role | null) => {
    switch (r) {
      case 'POLICE':
        return {
          title: 'POLICE',
          icon: '👮',
          color: 'text-police-light',
          border: 'border-police/40',
          bg: 'bg-police/10',
          glow: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
          badge: 'LAW ENFORCEMENT',
          mission: 'Find and arrest the Thief before they execute the heist. Cross-examine suspects and gather forensic clues.',
          objective: 'Identify the Thief and vote to arrest them.'
        };
      case 'UNDERCOVER':
        return {
          title: 'UNDERCOVER',
          icon: '🕵️',
          color: 'text-undercover-light',
          border: 'border-undercover/40',
          bg: 'bg-undercover/10',
          glow: 'shadow-[0_0_50px_rgba(245,158,11,0.3)]',
          badge: 'COVERT MOLE',
          mission: 'You are secretly allied with the Thief. Feed misinformation to the Police, create false trails, and ensure the Thief evades justice.',
          objective: 'Protect the Thief and confuse the investigation.'
        };
      case 'THIEF':
        return {
          title: 'THIEF',
          icon: '🥷',
          color: 'text-thief-light',
          border: 'border-thief/40',
          bg: 'bg-thief/10',
          glow: 'shadow-[0_0_50px_rgba(244,63,94,0.3)]',
          badge: 'MASTER INFILTRATOR',
          mission: 'Execute your heist objectives, disable security systems, and remain hidden in plain sight. Do not get arrested.',
          objective: 'Complete stealth objectives and escape.'
        };
      default:
        return {
          title: 'CLASSIFIED',
          icon: '❓',
          color: 'text-slate-300',
          border: 'border-slate-500/40',
          bg: 'bg-slate-800/40',
          glow: '',
          badge: 'DECRYPTING',
          mission: 'Awaiting directive from headquarters...',
          objective: 'Maintain cover.'
        };
    }
  };

  const info = getRoleInfo(role);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8 relative animate-fade-in">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Top timer countdown */}
        <div className="mb-6">
          <Timer seconds={timeRemaining} label="BRIEFING EXPIRES IN" warningThreshold={3} />
        </div>

        {/* Secret Dossier Card */}
        <div
          className={`w-full p-8 rounded-3xl bg-crime-surface border ${info.border} ${info.glow} backdrop-blur-xl relative overflow-hidden transition-all`}
        >
          {/* Top Stamp */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
              FILE: TOP SECRET // LEVEL 5
            </span>
            <span
              className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${info.border} ${info.bg} ${info.color}`}
            >
              {info.badge}
            </span>
          </div>

          {/* Role Icon and Title */}
          <div className="my-6">
            <div className="text-7xl mb-4 transform hover:scale-110 transition-transform inline-block">
              {info.icon}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-1">
              YOU ARE ASSIGNED AS
            </div>
            <h1
              className={`font-headline font-extrabold text-4xl sm:text-5xl tracking-widest ${info.color}`}
            >
              {info.title}
            </h1>
          </div>

          {/* Mission description */}
          <div className="p-4 rounded-2xl bg-crime-card/80 border border-white/[0.06] my-6 text-left">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-slate-300">
              <span className="material-symbols-outlined text-[16px] text-evidence">task_alt</span>
              PRIMARY DIRECTIVE:
            </div>
            <p className="text-sm font-body text-slate-200 leading-relaxed">
              {info.mission}
            </p>
          </div>

          {/* Win Condition footer */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-slate-400">
            🎯 Win Condition: <span className="text-white font-bold">{info.objective}</span>
          </div>
        </div>

        <p className="mt-6 text-xs font-mono text-slate-400">
          Memorize your instructions. Investigation begins automatically.
        </p>
      </div>
    </div>
  );
};
