import React from 'react';
import { EvidenceItem } from '@theft/shared';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  onShareToChat?: (evidence: EvidenceItem) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onShareToChat }) => {
  const getIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'CCTV':
        return 'videocam';
      case 'FINGERPRINT':
        return 'fingerprint';
      case 'LOCATION':
        return 'location_on';
      case 'WITNESS':
        return 'record_voice_over';
      case 'SECURITY_LOG':
        return 'key';
      case 'PHONE_RECORD':
        return 'phone_iphone';
      default:
        return 'inventory_2';
    }
  };

  const getTypeBadge = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'CCTV':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'FINGERPRINT':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOCATION':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'WITNESS':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'SECURITY_LOG':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'PHONE_RECORD':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const reliabilityPercent = Math.round(evidence.reliability * 100);
  const reliabilityColor =
    reliabilityPercent >= 80 ? 'text-emerald-400 bg-emerald-500/20' :
    reliabilityPercent >= 50 ? 'text-amber-400 bg-amber-500/20' :
    'text-rose-400 bg-rose-500/20';

  return (
    <div className="bg-crime-surface/80 backdrop-blur border border-white/[0.08] hover:border-evidence/40 rounded-xl p-4 transition-all duration-200 relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-evidence/5 rounded-full blur-2xl group-hover:bg-evidence/10 transition-colors pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border flex items-center gap-1 ${getTypeBadge(evidence.type)}`}>
            <span className="material-symbols-outlined text-[14px]">{getIcon(evidence.type)}</span>
            {evidence.type}
          </span>
          {evidence.suspectName && (
            <span className="text-[11px] font-mono text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
              Target: <span className="text-white font-semibold">{evidence.suspectName}</span>
            </span>
          )}
        </div>

        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-white/[0.08] ${reliabilityColor}`}>
          {reliabilityPercent}% CERTAINTY
        </div>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed font-body mb-3">
        {evidence.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-slate-400">schedule</span>
          {evidence.timestamp}
        </span>

        {onShareToChat && (
          <button
            onClick={() => onShareToChat(evidence)}
            className="flex items-center gap-1 text-slate-300 hover:text-police transition-colors hover:underline text-[11px]"
          >
            <span className="material-symbols-outlined text-[13px]">chat</span>
            Share in chat
          </button>
        )}
      </div>
    </div>
  );
};
