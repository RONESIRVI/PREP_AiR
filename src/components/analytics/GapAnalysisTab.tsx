import React, { useState, useMemo } from "react";
import { SyllabusTopic, StudySessionLog, TimeVsWeightageGap } from "../../types";
import { GAP_ANALYSIS_METRICS } from "../../data/analyticsDefaults";
import {
  Layers,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Download,
  BookOpen,
  Filter
} from "lucide-react";

interface GapAnalysisTabProps {
  syllabus?: SyllabusTopic[];
  sessionLogs?: StudySessionLog[];
  onOpenExportReport?: () => void;
}

export const GapAnalysisTab: React.FC<GapAnalysisTabProps> = ({
  syllabus = [],
  sessionLogs = [],
  onOpenExportReport,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  // Get unique papers from syllabus
  const papers = useMemo(() => {
    const p = new Set<string>();
    syllabus.forEach(t => {
      if (t.paper) p.add(t.paper);
    });
    return ["All", ...Array.from(p)];
  }, [syllabus]);

  // Get unique subjects for the selected paper
  const subjects = useMemo(() => {
    const s = new Set<string>();
    syllabus.filter(t => t.status !== "not_started" && t.status !== "in_progress").forEach(t => {
      if (t.subject && (selectedPaper === "All" || t.paper === selectedPaper)) s.add(t.subject);
    });
    return ["All", ...Array.from(s)];
  }, [syllabus, selectedPaper]);

  // Compute dynamic gap analysis based on syllabus & sessionLogs
  const dynamicMetrics = useMemo(() => {
    if (!syllabus || syllabus.length === 0) return GAP_ANALYSIS_METRICS;

    // Filter topics by paper, subject and status
    let filteredTopics = syllabus.filter(t => t.status !== "not_started" && t.status !== "in_progress");
    if (selectedPaper !== "All") filteredTopics = filteredTopics.filter(t => t.paper === selectedPaper);
    if (selectedSubject !== "All") filteredTopics = filteredTopics.filter(t => t.subject === selectedSubject);

    if (filteredTopics.length === 0) return [];

    // Filter session logs
    let filteredLogs = sessionLogs;
    if (selectedPaper !== "All") filteredLogs = filteredLogs.filter(log => log.paper === selectedPaper);
    if (selectedSubject !== "All") filteredLogs = filteredLogs.filter(log => log.subject === selectedSubject);

    let totalQs = 0;
    let totalTime = 0;

    const subjectMap = new Map<string, { qCount: number; timeCount: number; recommendation: string }>();

    // 1. Gather Questions Weightage
    filteredTopics.forEach(topic => {
      const qMatch = topic.questionEstimate?.match(/\d+/);
      const q = qMatch ? parseInt(qMatch[0]) : 0;
      
      const subj = topic.subject || "Other";
      if (!subjectMap.has(subj)) {
        subjectMap.set(subj, { qCount: 0, timeCount: 0, recommendation: topic.studyGuide || "Focus on key topics." });
      }
      subjectMap.get(subj)!.qCount += q;
      totalQs += q;
    });

    // 2. Gather Time Invested
    filteredLogs.forEach(log => {
      const subj = log.subject || "Other";
      if (!subjectMap.has(subj)) {
        subjectMap.set(subj, { qCount: 0, timeCount: 0, recommendation: "Review study strategy." });
      }
      subjectMap.get(subj)!.timeCount += log.durationMinutes;
      totalTime += log.durationMinutes;
    });

    // 3. Compute Gap
    const metrics: TimeVsWeightageGap[] = [];

    subjectMap.forEach((data, subject) => {
      // If we don't have enough data to calculate percentages properly, fallback to even spread or zero
      const idealPct = totalQs > 0 ? (data.qCount / totalQs) * 100 : 0;
      const actualPct = totalTime > 0 ? (data.timeCount / totalTime) * 100 : 0;
      
      const delta = Math.round(actualPct - idealPct);
      let status: "Under-Allocated" | "Balanced" | "Over-Allocated" = "Balanced";
      
      if (delta < -3) status = "Under-Allocated";
      else if (delta > 3) status = "Over-Allocated";

      // If user hasn't started logging time, and there are no estimates, skip it if not relevant
      if (data.qCount === 0 && data.timeCount === 0) return;

      metrics.push({
        subject,
        actualTimePercent: Math.round(actualPct),
        idealWeightagePercent: Math.round(idealPct),
        deltaPercent: delta,
        status,
        recommendation: data.recommendation,
      });
    });

    // Sort by largest gap magnitude
    metrics.sort((a, b) => Math.abs(b.deltaPercent || 0) - Math.abs(a.deltaPercent || 0));

    // If completely empty (no time logged, no questions estimated), return empty array
    return metrics;
  }, [syllabus, sessionLogs, selectedPaper, selectedSubject]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-600" /> ROI Optimizer
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
              Live Syllabus Synced
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Dynamic Effort Gap Analysis
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
            यह सेक्शन आपके द्वारा लॉग किए गए अध्ययन समय की तुलना सिलेबस के अनुसार अनुमानित प्रश्नों के वेटेज से करता है।
            सही पेपर चुनें और अपनी रणनीति (Strategy) को संतुलित (Balance) करें।
          </p>
        </div>

        {onOpenExportReport && (
          <button
            onClick={onOpenExportReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            title="Export Gap Analysis as PDF/PNG"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Report</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
          <div className="pl-2 flex items-center gap-1.5 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Paper:</span>
          </div>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-indigo-700 outline-none cursor-pointer flex-1"
          >
            {papers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
          <div className="pl-2 flex items-center gap-1.5 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Subject:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-indigo-700 outline-none cursor-pointer flex-1 max-w-[200px] truncate"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gap Analysis Cards */}
      <div className="space-y-4">
        {dynamicMetrics.length === 0 ? (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No data available for {selectedPaper}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please make sure syllabus topics exist and you have logged study sessions for this paper.
            </p>
          </div>
        ) : (
          dynamicMetrics.map((gap, index) => {
            const isUnderAllocated = gap.status === "Under-Allocated";
            const isOverAllocated = gap.status === "Over-Allocated";
            const isBalanced = gap.status === "Balanced";
            const delta = gap.deltaPercent || 0;

            return (
              <div
                key={index}
                className={`bg-white border-2 rounded-2xl p-6 shadow-sm space-y-4 transition ${
                  isUnderAllocated
                    ? "border-rose-300"
                    : isOverAllocated
                    ? "border-amber-300"
                    : "border-emerald-300"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {isUnderAllocated ? (
                      <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : isOverAllocated ? (
                      <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Minus className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <h3 className="text-base font-bold text-slate-900">
                      {gap.subject}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border self-start sm:self-auto ${
                      isUnderAllocated
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isOverAllocated
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {gap.status} ({delta > 0 ? `+${delta}%` : `${delta}%`} Gap)
                  </span>
                </div>

                {/* Dual Visual Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Time Bar */}
                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>आपका अध्ययन समय</span>
                      <span className="font-mono text-amber-700 font-bold">
                        {gap.actualTimePercent}% of Total Hours
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((gap.actualTimePercent || 0) * 3, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* RAS Weightage Bar */}
                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>पेपर वेटेज (अनुमानित MCQ)</span>
                      <span className="font-mono text-indigo-600 font-bold">
                        {gap.idealWeightagePercent}% of Total Marks
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((gap.idealWeightagePercent || 0) * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendation with क्या करें */}
                <div
                  className={`p-3.5 rounded-xl border text-xs text-slate-700 flex items-start gap-2.5 font-medium ${
                    isUnderAllocated
                      ? "bg-rose-50 border-rose-200"
                      : isOverAllocated
                      ? "bg-amber-50 border-amber-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <BookOpen
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isUnderAllocated
                        ? "text-rose-600"
                        : isOverAllocated
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  />
                  <div className="flex-1">
                    <strong className="text-slate-900 font-bold block mb-0.5">
                      {isUnderAllocated
                        ? "⚠️ कम समय दे रहे हैं — बढ़ाएं:"
                        : isOverAllocated
                        ? "📉 ज़्यादा समय दे रहे हैं — Rebalance करें:"
                        : "✅ Balanced — Maintain करें:"}
                    </strong>
                    <span className="block line-clamp-3 leading-relaxed">{gap.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
