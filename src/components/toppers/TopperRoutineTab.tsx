import React, { useState } from "react";
import { TOPPER_ROUTINES } from "../../data/toppersData";
import { TopperRoutine } from "../../types";
import { TopperRoutineEditorModal } from "./TopperRoutineEditorModal";
import {
  Clock,
  Sun,
  Moon,
  Coffee,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Edit2
} from "lucide-react";

interface TopperRoutineTabProps {
  onAdoptRoutine: (routine: TopperRoutine) => void;
  routines?: TopperRoutine[];
  setRoutines?: React.Dispatch<React.SetStateAction<TopperRoutine[]>>;
}

export const TopperRoutineTab: React.FC<TopperRoutineTabProps> = ({
  onAdoptRoutine,
  routines = TOPPER_ROUTINES,
  setRoutines,
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<TopperRoutine>(
    routines[0] || TOPPER_ROUTINES[0]
  );
  const [adoptedAlert, setAdoptedAlert] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleAdopt = () => {
    onAdoptRoutine(selectedRoutine);
    setAdoptedAlert(true);
    setTimeout(() => setAdoptedAlert(false), 3500);
  };

  const handleSaveRoutine = (updatedRoutine: TopperRoutine) => {
    if (setRoutines) {
      setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
    }
    setSelectedRoutine(updatedRoutine);
    setIsEditorOpen(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "GS":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Optional":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Current Affairs":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Answer Writing":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "CSAT / Revision":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Circadian
                Rhythm Mastery
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Hour-by-Hour Breakdown
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Toppers' Daily Timetables & Routines
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Examine how AIR 1 rankers balance static GS, optional papers,
              daily answer writing, newspaper editorials, and active spaced
              revision without experiencing cognitive burnout.
            </p>
          </div>

          {/* Routine Switcher Selector Bento Box */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0 shadow-sm">
            <select
              value={selectedRoutine.id}
              onChange={(e) => {
                const found = routines.find(
                  (r) => r.id === e.target.value
                );
                if (found) setSelectedRoutine(found);
              }}
              className="bg-transparent text-slate-900 text-xs font-bold outline-none cursor-pointer"
            >
              {routines.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  className="bg-white text-slate-900 font-medium"
                >
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Adopted alert message */}
        {adoptedAlert && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Success! Adopted "{selectedRoutine.title}" as your active daily
              tracking routine template in Preparation Tracker.
            </span>
          </div>
        )}
      </div>

      {/* Routine Overview Bento Box */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {selectedRoutine.type}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {selectedRoutine.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Total Study Time
              </div>
              <div className="text-base font-extrabold text-indigo-600">
                {selectedRoutine.totalStudyHours} Hours / Day
              </div>
            </div>

            <button
              onClick={handleAdopt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm active:scale-95 transition"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Adopt this Routine</span>
            </button>
          </div>
        </div>

        {/* Wake up and sleep markers Cards (Conditionally Rendered) */}
        {(selectedRoutine.wakeUpTime || selectedRoutine.sleepTime) && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {selectedRoutine.wakeUpTime && (
              <div className="flex-1 w-full bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shadow-inner">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-amber-700 tracking-wider">Wake-up Time</div>
                    <div className="text-xl font-black text-slate-800 mt-0.5">{selectedRoutine.wakeUpTime}</div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedRoutine.sleepTime && (
              <div className="flex-1 w-full bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-indigo-700 tracking-wider">Sleep Time</div>
                    <div className="text-xl font-black text-slate-800 mt-0.5">{selectedRoutine.sleepTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timetable Schedule Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hourly Study & Revision Slots</span>
          </h4>

          <div className="space-y-2.5">
            {selectedRoutine.schedule.map((slot, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shrink-0">
                    {slot.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 break-words">
                      {slot.activity}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 break-words">
                      {slot.description}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border self-start sm:self-auto shrink-0 ${getCategoryBadge(
                    slot.category
                  )}`}
                >
                  {slot.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Routine Success Tips Bento Box */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span>Execution Tips for this Routine</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
            {selectedRoutine.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Extra Data */}
        {selectedRoutine.extraData && Object.keys(selectedRoutine.extraData).length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Additional Info</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(selectedRoutine.extraData).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{key}</div>
                  <div className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Editor Modal */}
      {isEditorOpen && (
        <TopperRoutineEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          editingRoutine={selectedRoutine}
          onSave={handleSaveRoutine}
        />
      )}
    </div>
  );
};
