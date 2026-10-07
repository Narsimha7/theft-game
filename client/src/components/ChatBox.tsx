import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@theft/shared';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

const QUICK_CALLOUTS = [
  "I was nowhere near the Vault!",
  "Check the CCTV logs!",
  "That testimony contradicts the time record.",
  "Who is voting to skip?",
  "I'm confident I found the Thief."
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  disabled = false,
  className = ''
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickCallout = (callout: string) => {
    if (disabled) return;
    onSendMessage(callout);
  };

  return (
    <div className={`flex flex-col bg-crime-surface/90 backdrop-blur border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-crime-card/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-police text-[18px]">forum</span>
          <span className="font-headline font-bold text-sm tracking-wide text-white">COMMUNICATIONS CHANNEL</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.05]">
          SECURE RADIO
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[360px]">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-mono">
            Radio channel clear. Share clues or cross-examine suspects.
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-police/10 border border-police/25 text-police-light font-mono text-[11px]">
                    📢 {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-police-light">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="bg-crime-darkest/70 border border-white/[0.06] rounded-xl px-3.5 py-2 text-sm text-slate-200 font-body break-words">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Callouts */}
      <div className="px-3 py-2 bg-crime-darkest/40 border-t border-white/[0.04] overflow-x-auto flex gap-1.5 no-scrollbar">
        {QUICK_CALLOUTS.map((callout, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => handleQuickCallout(callout)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-[11px] font-mono transition-colors disabled:opacity-40"
          >
            "{callout}"
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.08] bg-crime-card/40 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={disabled ? 'Radio silenced during this phase...' : 'Broadcast statement to room...'}
          disabled={disabled}
          maxLength={200}
          className="flex-1 bg-crime-darkest border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-police font-body transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !inputText.trim()}
          className="px-4 py-2 rounded-xl bg-police hover:bg-police-light text-white font-mono text-xs font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span>SEND</span>
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </form>
    </div>
  );
};
