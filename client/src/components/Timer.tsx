import React from 'react';

interface TimerProps {
  seconds: number;
  totalDuration: number;
  label?: string;
}

export const Timer: React.FC<TimerProps> = ({ seconds, totalDuration, label = 'Time Remaining' }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, seconds / (totalDuration || 60)));
  const strokeDashoffset = circumference * (1 - progress);

  const isLowTime = seconds <= 15;
  const colorClass = isLowTime ? 'text-thief animate-pulse' : seconds <= 30 ? 'text-undercover' : 'text-police';

  return (
    <div className="flex items-center gap-3 bg-crime-surface border border-white/[0.08] px-3.5 py-2 rounded-xl shadow-lg font-mono">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 52 52">
          <circle
            className="text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            cx="26"
            cy="26"
            r={radius}
          />
          <circle
            className={`${colorClass} transition-all duration-1000`}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            cx="26"
            cy="26"
            r={radius}
          />
        </svg>
        <span className={`material-symbols-outlined text-[16px] absolute ${colorClass}`}>
          hourglass_top
        </span>
      </div>

      <div>
        <span className="text-[10px] tracking-widest uppercase text-slate-400 block">{label}</span>
        <span className={`text-xl font-bold tracking-wider ${colorClass}`}>{formatted}</span>
      </div>
    </div>
  );
};
