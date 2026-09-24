import React from "react";
import { AlertTriangle, Clock, Flame } from "lucide-react";
import { WeakAreaItem, RevisionItem } from "../../types";

interface SmartAlertsProps {
  overdueRevisions: RevisionItem[];
  criticalWeakAreas: WeakAreaItem[];
  weeklyGoalRemaining: number; // in hours
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  overdueRevisions,
  criticalWeakAreas,
  weeklyGoalRemaining,
}) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">
          Smart Alerts
        </h3>
      </div>

      <div className="space-y-3">
        {/* Revision Alert */}
        {overdueRevisions.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-0.5">
                Revision Due
              </div>
              <div className="text-sm font-bold text-slate-800">
                {overdueRevisions[0].subject}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {overdueRevisions.length} Topics pending revision
              </div>
            </div>
          </div>
        )}

        {/* Weak Area Alert */}
        {criticalWeakAreas.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
            <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">
                Weak Area Alert
              </div>
              <div className="text-sm font-bold text-slate-800">
                {criticalWeakAreas[0].subject}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Accuracy dropping in Mocks
              </div>
            </div>
          </div>
        )}

        {/* Weekly Target Alert */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-3">
          <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-0.5">
              Weekly Target
            </div>
            <div className="text-sm font-bold text-slate-800">
              {weeklyGoalRemaining} Hours Remaining
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Keep pushing to hit your 40h target
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
