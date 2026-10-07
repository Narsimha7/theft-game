import React from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-crime-surface border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-crime-card/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-police text-[24px]">menu_book</span>
            <div>
              <h2 className="font-headline font-extrabold text-xl text-white">TACTICAL FIELD MANUAL</h2>
              <p className="text-xs font-mono text-slate-400">Rules of Engagement: THEFT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Roles section */}
          <div>
            <h3 className="text-sm font-mono font-bold text-police-light uppercase tracking-wider mb-3">
              1. Secret Roles & Alignments
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {/* Police */}
              <div className="p-4 rounded-xl bg-police/10 border border-police/30 flex flex-col">
                <span className="text-2xl mb-1">👮</span>
                <h4 className="font-headline font-bold text-base text-police-light">POLICE</h4>
                <p className="text-xs text-slate-300 mt-2 font-body leading-relaxed flex-1">
                  Examine clues, analyze evidence, question suspects, and vote to arrest the Thief before time expires.
                </p>
                <div className="mt-3 pt-2 border-t border-police/20 text-[11px] font-mono text-police-light font-bold">
                  WIN: Arrest the Thief.
                </div>
              </div>

              {/* Undercover */}
              <div className="p-4 rounded-xl bg-undercover/10 border border-undercover/30 flex flex-col">
                <span className="text-2xl mb-1">🕵️</span>
                <h4 className="font-headline font-bold text-base text-undercover-light">UNDERCOVER</h4>
                <p className="text-xs text-slate-300 mt-2 font-body leading-relaxed flex-1">
                  Secretly allied with the Thief. Mislead the Police during discussions, create alibis, and redirect votes.
                </p>
                <div className="mt-3 pt-2 border-t border-undercover/20 text-[11px] font-mono text-undercover-light font-bold">
                  WIN: Thief escapes or avoids arrest.
                </div>
              </div>

              {/* Thief */}
              <div className="p-4 rounded-xl bg-thief/10 border border-thief/30 flex flex-col">
                <span className="text-2xl mb-1">🥷</span>
                <h4 className="font-headline font-bold text-base text-thief-light">THIEF</h4>
                <p className="text-xs text-slate-300 mt-2 font-body leading-relaxed flex-1">
                  Complete secret heist objectives (cut CCTV, crack vault, reach getaway), avoid suspicion, and escape.
                </p>
                <div className="mt-3 pt-2 border-t border-thief/20 text-[11px] font-mono text-thief-light font-bold">
                  WIN: Escape or survive final vote.
                </div>
              </div>
            </div>
          </div>

          {/* Game Flow */}
          <div>
            <h3 className="text-sm font-mono font-bold text-police-light uppercase tracking-wider mb-3">
              2. Round Phases
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-crime-card/80 border border-white/[0.06] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-police/20 text-police-light font-bold">01</span>
                <div>
                  <h5 className="font-bold text-white">ROLE REVEAL (10s)</h5>
                  <p className="text-slate-400 mt-0.5 font-body">
                    Your secret assignment is displayed. Memorize your win condition.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crime-card/80 border border-white/[0.06] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-police/20 text-police-light font-bold">02</span>
                <div>
                  <h5 className="font-bold text-white">INVESTIGATION (60s)</h5>
                  <p className="text-slate-400 mt-0.5 font-body">
                    Police inspect CCTV feeds, run fingerprint checks, and gather forensic clues. The Thief executes stealth objectives.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crime-card/80 border border-white/[0.06] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-police/20 text-police-light font-bold">03</span>
                <div>
                  <h5 className="font-bold text-white">DISCUSSION (120s)</h5>
                  <p className="text-slate-400 mt-0.5 font-body">
                    Players communicate via radio chat. Share evidence, cross-examine suspects, and identify contradictions.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crime-card/80 border border-white/[0.06] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-police/20 text-police-light font-bold">04</span>
                <div>
                  <h5 className="font-bold text-white">VOTING (45s)</h5>
                  <p className="text-slate-400 mt-0.5 font-body">
                    Cast a secret ballot for the player you suspect is the Thief. Plurality vote eliminates the accused.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crime-card/80 border border-white/[0.06] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-police/20 text-police-light font-bold">05</span>
                <div>
                  <h5 className="font-bold text-white">RESULTS & RESOLUTION</h5>
                  <p className="text-slate-400 mt-0.5 font-body">
                    If the eliminated player was the Thief, Police win! If an innocent was arrested or Thief escaped, the Undercover & Thief triumph.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-crime-card/40 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-police hover:bg-police-light text-white font-mono text-xs font-bold transition-all shadow-md"
          >
            DISMISSED / UNDERSTOOD
          </button>
        </div>
      </div>
    </div>
  );
};
