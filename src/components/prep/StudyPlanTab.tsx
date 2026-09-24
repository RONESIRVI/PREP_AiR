import React, { useState } from "react";
import { StudyPlanPhase } from "../../types";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  Flag,
  Plus,
  RotateCcw,
  Trash2,
  Layers,
  ChevronRight,
} from "lucide-react";

interface StudyPlanTabProps {
  phases: StudyPlanPhase[];
  onToggleMilestone: (phaseId: string, milestoneId: string) => void;

  onAddMilestone?: (phaseId: string, title: string, targetDate: string) => void;
  onDeleteMilestone?: (phaseId: string, milestoneId: string) => void;
  onResetDefaultStudyPlan?: () => void;
}

export const StudyPlanTab: React.FC<StudyPlanTabProps> = ({
  phases,
  onToggleMilestone,

  onAddMilestone,
  onDeleteMilestone,
  onResetDefaultStudyPlan,
}) => {
  const [selectedPlanType, setSelectedPlanType] = useState<
    "1-Year" | "6-Month Fast Track" | "2-Year Foundation"
  >("1-Year");

  // Modal for Add Custom Milestone
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetPhaseId, setTargetPhaseId] = useState<string>(
    phases[0]?.id || "phase-1"
  );
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");

  const totalMilestones = phases.flatMap((p) => p.milestones);
  const completedMilestones = totalMilestones.filter((m) => m.completed).length;
  const milestoneProgress =
    Math.round((completedMilestones / totalMilestones.length) * 100) || 0;

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    if (onAddMilestone) {
      onAddMilestone(
        targetPhaseId,
        milestoneTitle.trim(),
        milestoneDate.trim() || new Date().toISOString().split("T")[0]
      );
    }

    setMilestoneTitle("");
    setMilestoneDate("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-indigo-600" />{" "}
                Milestone-Driven Roadmap
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phase-Wise Strategic Planning
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Personalized RAS Study Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Follow a time-tested 4-phase preparation lifecycle: Foundation ➔
              Core GS & Optional ➔ Mains Consolidation ➔ Prelims Intensive
              War-Footing.
            </p>
          </div>

          {/* Top Action Buttons (Add Custom Milestone & Restore Standard) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+ Add Custom Milestone</span>
            </button>

            {onResetDefaultStudyPlan && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Restore standard RAS 4-Phase study plan? Your custom milestones will be reset."
                    )
                  ) {
                    onResetDefaultStudyPlan();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Restore Standard RAS Study Roadmap"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Restore Standard Plan</span>
              </button>
            )}


          </div>
        </div>

        {/* Plan Mode Selector & Overall Milestone Progress */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(
              ["1-Year", "6-Month Fast Track", "2-Year Foundation"] as const
            ).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPlanType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap cursor-pointer ${
                  selectedPlanType === type
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs shadow-xs shrink-0">
            <span className="text-slate-600 font-medium">
              Roadmap Progress:
            </span>
            <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <span className="font-extrabold text-indigo-600">
              {milestoneProgress}% ({completedMilestones}/
              {totalMilestones.length})
            </span>
          </div>
        </div>
      </div>

      {/* Phase Timeline Cards */}
      <div className="space-y-4">
        {phases.map((phase, pIdx) => {
          const isPhaseCompleted = phase.status === "completed";
          const isPhaseActive = phase.status === "in_progress";

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border-2 p-5 transition-all ${
                isPhaseCompleted
                  ? "bg-white border-emerald-300 shadow-sm"
                  : isPhaseActive
                  ? "bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-400/20"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center shadow-xs ${
                      isPhaseCompleted
                        ? "bg-emerald-600 text-white"
                        : isPhaseActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {pIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {phase.phaseName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {phase.focusArea}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetPhaseId(phase.id);
                      setShowAddModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-100 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                    {phase.durationMonths}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isPhaseCompleted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isPhaseActive
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {phase.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Milestones Checklist Bento Area */}
              <div className="mt-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Key Actionable Milestones
                </div>

                <div className="space-y-2">
                  {phase.milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 transition ${
                        m.completed
                          ? "bg-emerald-50/30 border-emerald-200 text-slate-700 shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800 shadow-xs"
                      }`}
                    >
                      <div
                        onClick={() => onToggleMilestone(phase.id, m.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            m.completed
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Target: {m.targetDate}</span>
                        </div>

                        {onDeleteMilestone && (
                          <button
                            onClick={() => onDeleteMilestone(phase.id, m.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add Custom Milestone */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Add Custom Milestone
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Phase *
                </label>
                <select
                  value={targetPhaseId}
                  onChange={(e) => setTargetPhaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-bold"
                >
                  {phases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.phaseName} ({p.durationMonths})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete 5 Full-Length GS2 Mocks & Review"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
