import React from "react";
import { Activity, Clock, CheckCircle2, BookOpen } from "lucide-react";
import { PreparationHealth, StudySessionLog } from "../../types";

interface PreparationHealthProps {
  health: PreparationHealth;
  sessionLogs?: StudySessionLog[];
  totalStudyTimeToday?: number; // in seconds
}

export const PreparationHealthScore: React.FC<PreparationHealthProps> = ({
  health,
  sessionLogs = [],
  totalStudyTimeToday = 0,
}) => {
  // Convert total seconds to hours and minutes
  const totalMins = Math.floor(totalStudyTimeToday / 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  // Get only today's sessions
  const today = new Date().toISOString().split("T")[0];
  const todaysSessions = sessionLogs.filter((log) => log.date === today);
  
  const formatTimeStr = (t?: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    let hours = parseInt(h);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${m} ${ampm}`;
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          Today's Study Activity
        </h3>

        <div className="px-4 py-2 rounded-xl border flex items-center gap-2 bg-indigo-50 border-indigo-200">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <div className="text-xl font-black text-indigo-700">
            {hrs > 0 ? `${hrs}h ` : ""}
            {mins}m
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {todaysSessions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50">
            No sessions logged today yet.<br/>
            Click "Start" on a task to log your study time!
          </div>
        ) : (
          todaysSessions.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {log.topicCovered}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1.5 mt-0.5">
                    <span className="text-indigo-600">{log.subject}</span>
                    {log.startTime && log.endTime && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-slate-600 truncate">{formatTimeStr(log.startTime)} - {formatTimeStr(log.endTime)}</span>
                      </>
                    )}
                    {log.notes && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-slate-600 truncate">{log.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 text-right">
                <div className="text-sm font-black text-indigo-600">
                  {log.durationMinutes}m
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-100">
                  Completed
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            All logged sessions contribute directly to your daily target. Keep logging consistently!
          </p>
        </div>
      </div>
    </div>
  );
};
