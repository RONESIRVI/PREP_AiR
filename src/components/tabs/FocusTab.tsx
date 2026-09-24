import React, { useState } from "react";
import { Play, Pause, Square, RefreshCcw, BellOff } from "lucide-react";

export default function FocusTab() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="w-full max-w-sm mb-8 text-center">
        <h2 className="text-xl font-bold font-[Space Grotesk] text-ink mb-1">Deep Focus</h2>
        <p className="text-slate text-sm">Stay disciplined. Achieve your goals.</p>
      </div>

      {/* Circular Timer UI */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        {/* Outer Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="var(--color-border)" strokeWidth="4" fill="none" />
          <circle 
            cx="50" cy="50" r="45" 
            stroke="var(--color-lime)" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="282.7" 
            strokeDashoffset="70" 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Timer Text */}
        <div className="text-center z-10 flex flex-col items-center">
          <span className="text-5xl font-bold text-ink tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>25:00</span>
          <span className="text-xs font-semibold text-forest uppercase tracking-widest mt-2 bg-green/10 px-3 py-1 rounded-full">Pomodoro</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-12">
        <button className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-slate hover:text-ink shadow-sm transition-colors">
          <RefreshCcw size={20} />
        </button>
        
        <button 
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="w-20 h-20 rounded-full bg-forest text-white flex items-center justify-center shadow-lg shadow-forest/30 hover:bg-forest-dark transition-all transform hover:scale-105 active:scale-95"
        >
          {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-slate hover:text-ink shadow-sm transition-colors">
          <Square size={18} fill="currentColor" />
        </button>
      </div>

      {/* Active Session Info */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-border shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-ink font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-amber"></span>
            Current Session
          </div>
          <span className="text-xs text-slate font-medium">Physics Rev.</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate text-xs">
            <BellOff size={14} className="text-rose" />
            Strict Mode Active
          </div>
          <span className="text-xs font-bold text-forest cursor-pointer hover:underline">Change Tag</span>
        </div>
      </div>
    </div>
  );
}
