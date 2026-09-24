import React from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";
import { DailyTask } from "../../types";

interface PersonalizedPlanProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onNavigateToTracker: (taskId: string) => void;
  dailyGoalHours: number;
}

export const PersonalizedPlan: React.FC<PersonalizedPlanProps> = ({
  tasks,
  onToggleTask,
  onNavigateToTracker,
  dailyGoalHours,
}) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          Today's Daily Plan
        </h3>
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md border border-indigo-100">
          {dailyGoalHours} Hours Target
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 mb-4">
        <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-amber-800 font-bold mb-0.5">
            Deep Focus Recommended
          </p>
          <p className="text-[11px] text-amber-700 leading-tight">
            Want zero distractions? Turn on <strong>App Pinning</strong> (Screen
            Pinning) from your phone settings before you start studying.
          </p>
        </div>
      </div>

      <div className="space-y-0.5">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="relative flex gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            {/* Timeline Line */}
            {index !== tasks.length - 1 && (
              <div className="absolute top-8 left-4 bottom-[-10px] w-0.5 bg-slate-200 group-hover:bg-slate-300 transition-colors" />
            )}

            <button
              onClick={() => onToggleTask(task.id)}
              className="mt-1 bg-white relative z-10 shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
              )}
            </button>

            <div
              className={`flex-1 flex justify-between items-start gap-2 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {task.timeSlot}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {task.type}
                  </span>
                </div>
                <h4
                  className={`text-sm font-bold ${
                    task.completed
                      ? "text-slate-500 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </h4>
              </div>

              {!task.completed && (
                <button
                  onClick={() => onNavigateToTracker(task.id)}
                  className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-600 transition-colors shrink-0"
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
