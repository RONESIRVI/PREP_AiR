import React, { useState } from "react";
import { X, Settings2, Palette, Bell, Cloud, LogOut, LogIn, RefreshCw, CheckCircle2, Target, Calendar, ChevronRight } from "lucide-react";
import { DDayManagerModal } from "./DDayManagerModal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isDDayModalOpen, setIsDDayModalOpen] = useState(false);
  
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(() => {
    return localStorage.getItem("disable_auto_update") !== "true";
  });

  const toggleAutoUpdate = () => {
    const newValue = !autoUpdateEnabled;
    setAutoUpdateEnabled(newValue);
    if (!newValue) {
      localStorage.setItem("disable_auto_update", "true");
    } else {
      localStorage.removeItem("disable_auto_update");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Settings2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">App Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8">



          {/* System Settings Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Preferences</h3>
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">App Auto-Updates</h4>
                  <p className="text-[10px] text-slate-500 max-w-[200px]">Check for new app versions automatically in the background. (Does not affect Firebase sync)</p>
                </div>
              </div>
              <button
                onClick={toggleAutoUpdate}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${autoUpdateEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${autoUpdateEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Target D-Day (Exam Date)</h4>
                    <p className="text-[10px] text-slate-500 max-w-[200px]">Set your target exam date to see a live countdown on your profile.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDDayModalOpen(true)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                >
                  Manage <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">More Options</h3>
            
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-100 transition-colors">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">App Theme</h4>
                  <p className="text-xs text-slate-400">Light, Dark, or System Match</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Coming Soon</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Notifications</h4>
                  <p className="text-xs text-slate-400">Manage daily reminders</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Coming Soon</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>

      <DDayManagerModal 
        isOpen={isDDayModalOpen}
        onClose={() => setIsDDayModalOpen(false)}
      />
    </div>
  );
};
