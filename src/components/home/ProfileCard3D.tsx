import React, { useState, useEffect } from "react";
import { Clock, Flame, CheckCircle, Target, TrendingUp, ChevronRight, CalendarDays } from "lucide-react";

interface ProfileCard3DProps {
  name: string;
  role: string;
  avatarUrl?: string;
  onOpenProfileEdit?: () => void;
  onOpenSettings?: () => void;
  totalStudyHours: number;
  currentStreak: number;
  completedTests: number;
  targetExam: string;
  progressPercent: number;
  currentFocus: string[];
}

export const ProfileCard3D: React.FC<ProfileCard3DProps> = ({
  name,
  role,
  avatarUrl,
  onOpenProfileEdit,
  onOpenSettings,
  totalStudyHours,
  currentStreak,
  completedTests,
  targetExam,
  progressPercent,
  currentFocus,
}) => {
  const [dDayDaysLeft, setDDayDaysLeft] = useState<number | null>(null);
  const [dDayName, setDDayName] = useState<string>("Mission D-Day");

  useEffect(() => {
    const fetchDDay = () => {
      const stored = localStorage.getItem("d_day_projects");
      if (stored) {
        try {
          const projects = JSON.parse(stored);
          const mainProject = projects.find((p: any) => p.isMain);
          if (mainProject) {
            setDDayName(mainProject.name);
            const targetDate = new Date(mainProject.targetDate);
            const today = new Date();
            targetDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffTime = targetDate.getTime() - today.getTime();
            setDDayDaysLeft(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            return;
          }
        } catch (e) {}
      }
      
      // No valid main project found
      setDDayDaysLeft(null);
    };

    fetchDDay();
    window.addEventListener("d_day_updated", fetchDDay);
    return () => window.removeEventListener("d_day_updated", fetchDDay);
  }, []);

  return (
    <div className="group relative w-full rounded-[32px] bg-[#0A0F1C] overflow-hidden border border-[#2A3441] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)] hover:-translate-y-2">
      
      {/* Background Geometric Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        
        {/* Left Section: Avatar & Info */}
        <div className="flex flex-col items-center justify-center space-y-4 md:w-1/3">
          
          {/* 3D Glowing Avatar */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse"></div>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#8A7322] shadow-[0_0_20px_rgba(212,175,55,0.3)] relative z-10 overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#111827] border-4 border-[#0A0F1C] flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover relative z-10" />
                ) : (
                  <svg
                    className="w-16 h-16 text-slate-300 relative z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                )}
                {/* subtle mandala/chakra background inside avatar */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-500 animate-[spin_60s_linear_infinite]">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    {[...Array(12)].map((_, i) => (
                      <line key={i} x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" transform={`rotate(${i * 15} 50 50)`} />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            {/* Active Indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0F1C] z-20 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-sans">{name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">{role}</p>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-2"></div>

        {/* Right Section: Stats & Progress */}
        <div className="flex-1 flex flex-col justify-between w-full space-y-6">
          
          {/* 3D Stat Tiles */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
            
            {/* Tile 1: Hours */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
              <Clock className="w-5 h-5 text-indigo-400 mb-2 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
              <span className="text-xl sm:text-2xl font-black text-white">{totalStudyHours}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Hours</span>
            </div>

            {/* Tile 2: Streak */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
              <Flame className="w-5 h-5 text-amber-500 mb-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="text-xl sm:text-2xl font-black text-white">{currentStreak}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Streak</span>
            </div>

            {/* Tile 3: Tests */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
              <CheckCircle className="w-5 h-5 text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-xl sm:text-2xl font-black text-white">{completedTests}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Tests</span>
            </div>

          </div>

          {/* D-Day Banner */}
          {dDayDaysLeft !== null && (
            <div className="w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] relative overflow-hidden group/dday">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 group-hover/dday:scale-110 transition-transform">
                  <CalendarDays className="w-5 h-5 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300 text-xs sm:text-sm uppercase tracking-wider">{dDayName}</h4>
                  <p className="text-[10px] text-slate-500">Time is ticking...</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <span className="text-2xl sm:text-3xl font-black text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                  {dDayDaysLeft > 0 ? dDayDaysLeft : 0}
                </span>
                <span className="text-[10px] font-bold text-rose-400/80 uppercase ml-1 tracking-widest">Days Left</span>
              </div>
            </div>
          )}

          {/* Progress & Target Row */}
          <div className="flex items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 bg-[#D4AF37]/5 blur-3xl rounded-full"></div>
            
            {/* Circular Ring */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                {/* Progress Ring */}
                <path
                  className="text-[#D4AF37] transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-black text-sm sm:text-base leading-none">{progressPercent}%</span>
              </div>
            </div>

            <div className="ml-4 sm:ml-6 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">{targetExam}</h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Focus:</span>
                {currentFocus.map((topic, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-medium border border-white/10">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            {/* View Details Button */}
            <button 
              onClick={() => onOpenProfileEdit?.()}
              className="hidden sm:flex ml-auto px-4 py-2 rounded-full bg-white/10 border border-white/20 items-center justify-center text-white text-xs font-bold tracking-widest uppercase transition-all hover:bg-white/20 hover:scale-105 shadow-lg gap-2"
            >
              <span>View Profile</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile View Details Action (Visible only on mobile) */}
      <div className="sm:hidden border-t border-[#2A3441] bg-[#0A0F1C]/80 flex">
        <div 
          onClick={() => onOpenProfileEdit?.()}
          className="flex-1 px-6 py-3 flex items-center justify-between cursor-pointer active:bg-white/5 border-r border-[#2A3441]"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Full Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div 
          onClick={() => onOpenSettings?.()}
          className="px-6 py-3 flex items-center justify-center cursor-pointer active:bg-white/5"
        >
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </span>
        </div>
      </div>

    </div>
  );
};
