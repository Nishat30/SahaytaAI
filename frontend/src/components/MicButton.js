import React from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

/**
 * MicButton — shows a mic icon that pulses while listening.
 *
 * Props:
 *   listening   bool
 *   onStart     fn()
 *   onStop      fn()
 *   supported   bool
 *   color       hex string (accent color)
 *   size        'sm' | 'md' | 'lg'  (default 'md')
 *   label       string shown below button (optional)
 */
export default function MicButton({ listening, onStart, onStop, supported, color = '#4F46E5', size = 'md', label }) {
  if (!supported) return null;

  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  const iconSizes = { sm: 16, md: 20, lg: 26 };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={listening ? onStop : onStart}
        title={listening ? 'Stop recording' : 'Speak your answer'}
        className={`relative ${sizes[size]} rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none`}
        style={{ background: listening ? '#ef4444' : color }}
      >
        {/* Pulse rings when active */}
        {listening && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: '#ef4444' }} />
            <span className="absolute inset-[-6px] rounded-full border-2 border-red-400 opacity-60 animate-pulse" />
          </>
        )}
        {listening
          ? <MicOff size={iconSizes[size]} />
          : <Mic size={iconSizes[size]} />
        }
      </button>
      {label && (
        <span className="text-xs font-bold text-gray-500">
          {listening ? '🔴 Listening…' : label}
        </span>
      )}
    </div>
  );
}
