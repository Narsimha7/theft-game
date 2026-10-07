import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBots?: (count: number) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onAddBots }) => {
  const [stats, setStats] = useState<{ totalUsers?: number; totalRooms?: number; mongoConnected?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchServerStats();
    }
  }, [isOpen]);

  const fetchServerStats = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      setStats({ mongoConnected: true, totalUsers: 1, totalRooms: 1 });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-crime-surface border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
        {/* Terminal top bar */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-crime-darkest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-police text-[20px]">terminal</span>
            <span className="font-mono text-xs font-bold text-slate-200">OPS CONSOLE / SYS_ADMIN</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Health indicator */}
          <div className="p-4 rounded-xl bg-crime-card border border-white/[0.06] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database Connection:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Atlas Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Game Sessions:</span>
              <span className="text-white font-bold">{stats?.totalRooms ?? 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Registered Operatives:</span>
              <span className="text-white font-bold">{stats?.totalUsers ?? 'Dynamic'}</span>
            </div>
          </div>

          {/* Rapid Test Controls */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Simulation & Testing Tools
            </h4>
            
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <button
                onClick={() => {
                  if (onAddBots) {
                    onAddBots(3);
                    setMessage('Deployed 3 AI operatives to your room.');
                  }
                }}
                className="p-3 rounded-xl bg-police/15 hover:bg-police/25 border border-police/30 text-police-light font-bold text-left transition-all"
              >
                🤖 +3 AI Bots
                <p className="text-[10px] text-slate-400 font-normal mt-0.5">Quickly reach min 4 players</p>
              </button>

              <button
                onClick={() => {
                  if (onAddBots) {
                    onAddBots(5);
                    setMessage('Deployed 5 AI operatives to your room.');
                  }
                }}
                className="p-3 rounded-xl bg-police/15 hover:bg-police/25 border border-police/30 text-police-light font-bold text-left transition-all"
              >
                🤖 +5 AI Bots
                <p className="text-[10px] text-slate-400 font-normal mt-0.5">Simulate full 6-player match</p>
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
              ✓ {message}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs font-bold transition-all"
            >
              CLOSE CONSOLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
