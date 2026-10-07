import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onRegister: (username: string, password: string) => Promise<boolean>;
  onGuestLogin: (username: string) => Promise<boolean>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onGuestLogin
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'GUEST'>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    try {
      setLoading(true);
      let success = false;
      if (mode === 'LOGIN') {
        success = await onLogin(username.trim(), password);
      } else if (mode === 'REGISTER') {
        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        success = await onRegister(username.trim(), password);
      } else if (mode === 'GUEST') {
        success = await onGuestLogin(username.trim());
      }

      if (success) {
        onClose();
      } else {
        setError('Authentication failed. Check your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-crime-surface border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="h-1.5 bg-gradient-to-r from-police via-undercover to-thief" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-police text-[24px]">vpn_key</span>
              <h2 className="font-headline font-extrabold text-xl text-white">OPERATIVE ACCESS</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-crime-card border border-white/[0.06] mb-5 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-police text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-police text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
            <button
              type="button"
              onClick={() => { setMode('GUEST'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'GUEST' ? 'bg-police text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              GUEST
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                OPERATIVE CALLSIGN (USERNAME)
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Agent_Viper"
                className="w-full bg-crime-darkest border border-white/[0.12] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-police"
              />
            </div>

            {mode !== 'GUEST' && (
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  SECURITY PASSPHRASE
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-crime-darkest border border-white/[0.12] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-police"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-police to-blue-600 hover:from-blue-500 hover:to-police text-white font-headline font-bold text-sm tracking-wider transition-all duration-200 shadow-lg disabled:opacity-40"
            >
              {loading ? 'AUTHENTICATING...' : mode === 'LOGIN' ? 'SIGN IN' : mode === 'REGISTER' ? 'CREATE ACCOUNT' : 'PLAY AS GUEST'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
