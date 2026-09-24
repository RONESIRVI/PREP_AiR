import React from "react";
import { Target, Calendar, ShieldAlert, BarChart2 } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-screen bg-pale text-ink font-sans">
      {/* Top Header */}
      <header className="bg-forest px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0 safe-top">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="37" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="37" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="175 57" strokeLinecap="round" transform="rotate(-90 40 40)" />
            <path d="M40 16 L57 23 L57 42 C57 52 40 63 40 63 C40 63 23 52 23 42 L23 23 Z" fill="#0D5C3A" stroke="#22C55E" strokeWidth="1.5" />
            <circle cx="40" cy="39" r="10" fill="rgba(255,255,255,.08)" stroke="#22C55E" strokeWidth="1.5" />
            <line x1="33" y1="32" x2="47" y2="46" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="8" r="3" fill="#22C55E" />
          </svg>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PREP_<span className="text-lime">AiR</span>
            </h1>
            <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Focus · Block · Study</p>
          </div>
        </div>
      </header>

      {/* Main Content Area - Rendered via Router */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-border flex justify-around items-center safe-bottom pb-2 pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20 relative">
        <NavItem 
          icon={<Target />} 
          label="Focus" 
          isActive={currentPath === "/" || currentPath.startsWith("/focus")} 
          onClick={() => navigate("/")} 
        />
        <NavItem 
          icon={<Calendar />} 
          label="Planner" 
          isActive={currentPath.startsWith("/planner")} 
          onClick={() => navigate("/planner")} 
        />
        <NavItem 
          icon={<ShieldAlert />} 
          label="Blocks" 
          isActive={currentPath.startsWith("/blocks")} 
          onClick={() => navigate("/blocks")} 
        />
        <NavItem 
          icon={<BarChart2 />} 
          label="Stats" 
          isActive={currentPath.startsWith("/stats")} 
          onClick={() => navigate("/stats")} 
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
        isActive ? "text-forest" : "text-slate hover:text-ink hover:bg-slate-50"
      }`}
    >
      <div className={`mb-1 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
      </div>
      <span className={`text-[10px] font-medium tracking-wide ${isActive ? "font-bold" : ""}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute top-0 w-8 h-1 bg-lime rounded-b-md" />
      )}
    </button>
  );
}
