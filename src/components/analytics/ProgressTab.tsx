import React, { useState } from "react";
import { SyllabusTopic, StudySessionLog, MockTestLog } from "../../types";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Trophy,
  TrendingUp,
  Target,
  FileSpreadsheet,
  Download,
  CheckCheck,
} from "lucide-react";
import { exportStudyLogsToCsv } from "../../utils/csvExporter";

interface ProgressTabProps {
  syllabus: SyllabusTopic[];
  sessionLogs: StudySessionLog[];
  studyStreak: number;
  mockLogs?: MockTestLog[];
  onOpenExportReport?: () => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  syllabus,
  sessionLogs,
  studyStreak,
  mockLogs = [],
  onOpenExportReport,
}) => {
  const [exportedMsg, setExportedMsg] = useState<boolean>(false);

  // Compute dynamic mock confidence
  const prelimsLogs = mockLogs.filter(m => m.type === "Prelims GS1" || m.type === "CSAT" || m.type?.includes("Prelims"));
  const avgPrelimsScore = prelimsLogs.length > 0
    ? Math.round(prelimsLogs.reduce((acc, l) => acc + (l.marksObtained || 0), 0) / prelimsLogs.length)
    : 0;
  
  // A simplistic probability model (Target 100+ score = 99% probability)
  const probability = prelimsLogs.length > 0 
    ? Math.min(Math.round((avgPrelimsScore / 110) * 100 * 10) / 10, 99) 
    : 0;

  const totalTopics = syllabus.length;
  const masteredTopics = syllabus.filter((s) => s.status === "mastered").length;
  const inProgressTopics = syllabus.filter(
    (s) =>
      s.status === "in_progress" ||
      s.status === "revised_1" ||
      s.status === "revised_2"
  ).length;
  const unreadTopics = totalTopics - masteredTopics - inProgressTopics;

  const syllabusProgress =
    Math.round(
      ((masteredTopics * 1 + inProgressTopics * 0.5) / totalTopics) * 100
    ) || 0;
  const totalMinutesLogged = sessionLogs.reduce(
    (acc, l) => acc + l.durationMinutes,
    0
  );
  const totalHoursLogged = (totalMinutesLogged / 60).toFixed(1);

  const handleExport = () => {
    const ok = exportStudyLogsToCsv(
      sessionLogs,
      "upsc_study_sessions_analytics"
    );
    if (ok) {
      setExportedMsg(true);
      setTimeout(() => setExportedMsg(false), 3500);
    }
  };

  // Group by Paper (previously Subject)
  const paperGroups = Array.from(new Set(syllabus.map((s) => s.paper || "Uncategorized"))).map(
    (paper) => {
      const topics = syllabus.filter((s) => (s.paper || "Uncategorized") === paper);
      const mastered = topics.filter((s) => s.status === "mastered").length;
      const active = topics.filter(
        (s) => s.status !== "not_started" && s.status !== "mastered"
      ).length;
      const pct = Math.round(
        ((mastered * 1 + active * 0.5) / topics.length) * 100
      );
      
      const subjectSet = Array.from(new Set(topics.map(t => t.subject).filter(Boolean)));
      const subjects = subjectSet.map(sub => {
        const subTopics = topics.filter(t => t.subject === sub);
        const subMastered = subTopics.filter(t => t.status === "mastered").length;
        const subActive = subTopics.filter(t => t.status !== "not_started" && t.status !== "mastered").length;
        const subPct = Math.round(((subMastered * 1 + subActive * 0.5) / subTopics.length) * 100) || 0;
        return { name: sub, total: subTopics.length, mastered: subMastered, pct: subPct };
      });

      return { paper, total: topics.length, mastered, pct, subjects };
    }
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Syllabus
              Coverage & Mastery Index
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Deep Paper Diagnostics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Holistic Preparation Progress
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
            Real-time telemetry on your syllabus coverage, time invested, active
            streaks, and paper-wise completion rates across Prelims and Mains.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenExportReport && (
            <button
              onClick={onOpenExportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              title="Export progress, gap analysis and visual heatmap as PDF or PNG"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export PDF / PNG Report</span>
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={sessionLogs.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download full study sessions dataset as a CSV file"
          >
            {exportedMsg ? (
              <>
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Exported!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Core Vital Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Syllabus Covered */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Syllabus Covered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {syllabusProgress}%
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {masteredTopics} mastered, {inProgressTopics} in cycle
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${syllabusProgress}%` }}
            />
          </div>
        </div>

        {/* Time Invested */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Time Invested</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {totalHoursLogged} <span className="text-lg">hrs</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Across {sessionLogs.length} focused sessions
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min((totalMinutesLogged / 6000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Active Streak */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-500">
            {studyStreak} <span className="text-lg">days</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Keep the momentum going!
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${Math.min((studyStreak / 30) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Mock Confidence */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Mock Confidence</span>
            <Target className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">
            {prelimsLogs.length > 0 ? `${probability} / 100` : "N/A"}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Prelims Qualification Probability
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-1000"
              style={{ width: `${probability}%` }}
            />
          </div>
        </div>
      </div>

      {/* Paper-Wise Mastery Bars */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Paper-Wise Mastery Breakdown</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Weighted by RAS Question Distribution
          </span>
        </div>

        <div className="space-y-4">
          {paperGroups.map((group, index) => (
            <div key={index} className="space-y-3 mb-4">
              <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{group.paper}</span>
                  <span className="font-mono text-indigo-600 font-extrabold">
                    {group.pct}% ({group.mastered}/{group.total} Topics)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      group.pct >= 70
                        ? "bg-emerald-500"
                        : group.pct >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${group.pct}%` }}
                  />
                </div>
              </div>
              
              {group.subjects.length > 0 && (
                <div className="space-y-2.5 pl-4 border-l-2 border-indigo-100 ml-2">
                  {group.subjects.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-700 truncate max-w-[200px] sm:max-w-[400px]">{sub.name}</span>
                        <span className="font-mono text-slate-500">
                          {sub.pct}% ({sub.mastered}/{sub.total})
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sub.pct >= 70
                              ? "bg-emerald-400"
                              : sub.pct >= 40
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                          style={{ width: `${sub.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
