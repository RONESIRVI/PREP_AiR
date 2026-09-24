import React, { useState, useEffect } from "react";
import {
  SyllabusTopic,
  StudySessionLog,
  MockTestLog,
  WeakAreaItem,
  UserProfile,
} from "../../types";
import {
  GAP_ANALYSIS_METRICS,
  HISTORICAL_CUTOFFS,
  DEFAULT_WEAK_AREAS,
} from "../../data/analyticsDefaults";
import {
  exportAnalyticsDocument,
  AnalyticsExportOptions,
} from "../../utils/analyticsExport";
import {
  Download,
  FileText,
  Image as ImageIcon,
  X,
  Check,
  Layers,
  AlertTriangle,
  BarChart2,
  TrendingUp,
  Scale,
  Trophy,
  Printer,
  Eye,
  Sparkles,
  Loader2,
  CheckCircle2,
  Grid3X3,
  XCircle,
} from "lucide-react";

interface AnalyticsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  syllabus: SyllabusTopic[];
  sessionLogs: StudySessionLog[];
  studyStreak: number;
  mockLogs: MockTestLog[];
  weakAreas: WeakAreaItem[];
}

export const AnalyticsExportModal: React.FC<AnalyticsExportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  syllabus,
  sessionLogs,
  studyStreak,
  mockLogs,
  weakAreas,
}) => {
  const [format, setFormat] = useState<"pdf" | "png">("pdf");
  const [aspirantName, setAspirantName] = useState<string>(userProfile?.name || "RAS CSE Aspirant");
  const [targetExam, setTargetExam] = useState<string>(userProfile?.targetExam || "RAS CSE 2026");

  useEffect(() => {
    if (userProfile?.name) setAspirantName(userProfile.name);
    if (userProfile?.targetExam) setTargetExam(userProfile.targetExam);
  }, [userProfile]);

  // Section inclusion flags (Heatmap and Gap Analysis prominent)
  const [includeHeatmap, setIncludeHeatmap] = useState<boolean>(true);
  const [includeProgress, setIncludeProgress] = useState<boolean>(true);
  const [includeMocks, setIncludeMocks] = useState<boolean>(true);
  const [includeGapAnalysis, setIncludeGapAnalysis] = useState<boolean>(true);
  const [includeRankBenchmarks, setIncludeRankBenchmarks] =
    useState<boolean>(true);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgressMsg, setExportProgressMsg] = useState<string>("");
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  if (!isOpen) return null;

  // Key metrics for report
  const totalTopics = syllabus.length;
  const masteredTopics = syllabus.filter((s) => s.status === "mastered").length;
  const inProgressTopics = syllabus.filter(
    (s) =>
      s.status === "in_progress" ||
      s.status === "revised_1" ||
      s.status === "revised_2"
  ).length;
  const syllabusProgress =
    Math.round(
      ((masteredTopics * 1 + inProgressTopics * 0.5) / totalTopics) * 100
    ) || 0;

  const totalMinutesLogged = sessionLogs.reduce(
    (acc, l) => acc + l.durationMinutes,
    0
  );
  const totalHoursLogged = (totalMinutesLogged / 60).toFixed(1);

  const totalMocks = mockLogs.length;
  const avgMockScore =
    totalMocks > 0
      ? (mockLogs.reduce((acc, m) => acc + m.marksObtained, 0) / totalMocks).toFixed(1)
      : "0.0";
  const avgNegativeMarks =
    totalMocks > 0
      ? (
          mockLogs.reduce((acc, m) => acc + ((m.incorrectCount || 0) * 0.66), 0) / totalMocks
        ).toFixed(1)
      : "0.0";

  // Heatmap intensity helper
  const getIntensityBadge = (failedCount: number, accuracy: number) => {
    if (failedCount >= 6 || accuracy < 45) {
      return {
        label: "Critical",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        cell: "bg-rose-50 border-rose-300 text-rose-950",
      };
    } else if (failedCount >= 4 || accuracy < 60) {
      return {
        label: "Moderate",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        cell: "bg-amber-50 border-amber-300 text-amber-950",
      };
    } else if (failedCount >= 2 || accuracy < 75) {
      return {
        label: "Mild",
        bg: "bg-yellow-100 text-yellow-800 border-yellow-300",
        cell: "bg-yellow-50 border-yellow-300 text-yellow-950",
      };
    } else {
      return {
        label: "Mastered",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        cell: "bg-emerald-50 border-emerald-300 text-emerald-950",
      };
    }
  };

  const handleTriggerExport = async () => {
    setIsExporting(true);
    setToast(null);
    setExportProgressMsg("Preparing visual report layout...");

    const options: AnalyticsExportOptions = {
      format,
      aspirantName,
      targetExam,
      includeHeatmap,
      includeProgress,
      includeMocks,
      includeGapAnalysis,
      includeRankBenchmarks,
      syllabusProgress,
      totalHoursLogged,
    };

    const result = await exportAnalyticsDocument(
      "printable-analytics-report",
      options,
      (msg) => {
        setExportProgressMsg(msg);
      }
    );

    setIsExporting(false);

    if (result.success) {
      showToast("success", result.message);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2500);
    } else {
      // Show error toast with reason — do NOT close modal
      showToast("error", result.message);
      setExportProgressMsg("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">

      {/* ── Toast Notification Banner ── */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-300 max-w-sm w-full ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-rose-50 border-rose-300 text-rose-900"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      <div
        className="w-full max-w-3xl bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Visual Telemetry Export
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Heatmap + Gap Analysis Included
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Export Performance & Progress Report
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {exportSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-300 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Analytics Report Exported Successfully!
            </h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm">
              Your comprehensive {format.toUpperCase()} performance blueprint
              with the visual heatmap has been downloaded.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Format Selection (PDF vs Image) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat("pdf")}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                    format === "pdf"
                      ? "bg-indigo-50 border-indigo-600 shadow-xs ring-2 ring-indigo-500/20"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      format === "pdf"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      PDF Document Report
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Multi-page print-ready official report with headers &
                      charts
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("png")}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                    format === "png"
                      ? "bg-indigo-50 border-indigo-600 shadow-xs ring-2 ring-indigo-500/20"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      format === "png"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      PNG High-Res Image
                    </div>
                    <div className="text-[10px] text-slate-500">
                      High-dpi visual canvas snapshot for quick sharing &
                      mobile view
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Report Sections Customizer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>2. Customize Modules in Output</span>
                <span className="text-[10px] text-indigo-600 font-bold">
                  5 Modules Available
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Visual Heatmap Tile (Required/Featured) */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border-2 border-amber-300 cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={includeHeatmap}
                    onChange={(e) => setIncludeHeatmap(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Grid3X3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Visual Topic Failure Heatmap Grid</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200 text-amber-900 font-extrabold">
                        Included
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Color-coded grid matrix of critical, moderate, and mild
                      failure intensities across all GS papers.
                    </p>
                  </div>
                </label>

                {/* Effort Gap Analysis */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={includeGapAnalysis}
                    onChange={(e) => setIncludeGapAnalysis(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Effort Gap vs Weightage Parity</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Time invested % vs RAS syllabus weightage return on
                      investment deficit.
                    </p>
                  </div>
                </label>

                {/* Progress & Syllabus Mastery */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={includeProgress}
                    onChange={(e) => setIncludeProgress(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Syllabus Coverage & Mastery %</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Subject-wise progress bars, study streak stats, and total
                      hours logged.
                    </p>
                  </div>
                </label>

                {/* Mock Test Performance */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={includeMocks}
                    onChange={(e) => setIncludeMocks(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Mock Tests & Negative Marks</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Accuracy trends, test logs table, and negative marking
                      penalty deductions.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>
                  {previewMode ? "Hide Preview" : "Preview Visual Document"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleTriggerExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{exportProgressMsg || "Generating..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download {format.toUpperCase()} Export</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PRINTABLE COMPREHENSIVE REPORT CANVAS (Hidden or in Preview) */}
        {/* ------------------------------------------------------------- */}
        <div
          className={
            previewMode
              ? "block pt-4 border-t border-slate-200 max-h-[400px] overflow-y-auto"
              : "sr-only overflow-hidden"
          }
        >
          {previewMode && (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Live Visual Output Snapshot:</span>
              <span className="text-[10px] text-emerald-600 font-bold">
                2x High-DPI Resolution
              </span>
            </div>
          )}

          <div
            id="printable-analytics-report"
            className="w-[1000px] bg-white text-slate-900 p-10 space-y-8 border border-slate-300 font-sans"
            style={{ minHeight: "1350px", backgroundColor: "#ffffff" }}
          >
            {/* Document Header */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-indigo-600">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                    RAS CSE AI Telemetry Report
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {targetExam}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  Performance Gap & Progress Analytics Blueprint
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated for Candidate:{" "}
                  <strong className="text-slate-800">{aspirantName}</strong> •
                  Date:{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    dateStyle: "long",
                  })}
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-indigo-700 font-mono">
                  {syllabusProgress}% Overall
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Syllabus Mastery
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 mt-1">
                  {totalHoursLogged} hrs Logged • {studyStreak}d Streak
                </div>
              </div>
            </div>

            {/* Core Vitals Summary Strip */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Total Study Time
                </div>
                <div className="text-lg font-black text-indigo-700 font-mono mt-0.5">
                  {totalHoursLogged} hrs
                </div>
                <div className="text-[10px] text-slate-500">
                  {sessionLogs.length} logged sessions
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Syllabus Mastered
                </div>
                <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                  {masteredTopics} / {totalTopics}
                </div>
                <div className="text-[10px] text-slate-500">
                  {inProgressTopics} in progress
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Mock Tests Average
                </div>
                <div className="text-lg font-black text-blue-700 font-mono mt-0.5">
                  {avgMockScore} pts
                </div>
                <div className="text-[10px] text-slate-500">
                  {totalMocks} tests evaluated
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Avg Negative Penalty
                </div>
                <div className="text-lg font-black text-rose-700 font-mono mt-0.5">
                  -{avgNegativeMarks} pts
                </div>
                <div className="text-[10px] text-slate-500">
                  RAS 1/3 penalty rate
                </div>
              </div>
            </div>

            {/* MODULE 1: VISUAL TOPIC FAILURE HEATMAP GRID (Guaranteed & prominent) */}
            {includeHeatmap && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-500 text-white font-mono font-bold text-xs">
                      01
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      Visual Topic Failure Heatmap &amp; Diagnostic Deficit Grid
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-rose-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />{" "}
                      Critical (6+ Failed)
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />{" "}
                      Moderate (4-5)
                    </span>
                    <span className="flex items-center gap-1 text-yellow-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-yellow-400 inline-block" />{" "}
                      Mild (2-3)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />{" "}
                      Mastered (0-1)
                    </span>
                  </div>
                </div>

                {weakAreas.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-xs font-medium">No weak areas identified yet. Take a mock test to generate your failure heatmap.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                  {weakAreas.map((item) => {
                    const failedCount =
                      item.failedQuestionsCount ||
                      (item.severity === "Critical"
                        ? 7
                        : item.severity === "Moderate"
                        ? 4
                        : 2);
                    const accuracy =
                      item.accuracyInMocks ||
                      (item.severity === "Critical"
                        ? 38
                        : item.severity === "Moderate"
                        ? 54
                        : 68);
                    const badge = getIntensityBadge(failedCount, accuracy);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border ${badge.cell} space-y-1.5 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-slate-700">
                            {item.paper}
                          </span>
                          <span
                            className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold leading-tight line-clamp-2">
                            {item.topic}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                            {item.subject}
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono font-bold">
                          <span className="text-rose-700">
                            {failedCount} Failed MCQs
                          </span>
                          <span className="text-slate-600">
                            {accuracy}% Acc
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 2: EFFORT GAP ANALYSIS (Time Allocated vs RAS Weightage) */}
            {includeGapAnalysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-600 text-white font-mono font-bold text-xs">
                      02
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      Effort Gap Analysis & Exam Return-On-Investment
                      Deficit
                    </h2>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                    Weightage Parity Analysis
                  </span>
                </div>

                {sessionLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-xs font-medium">Insufficient study data. Log study sessions to unlock Effort Gap vs Exam Weightage parity analysis.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {GAP_ANALYSIS_METRICS.map((gap, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900">{gap.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            gap.status === "Under-Allocated"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : gap.status === "Over-Allocated"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {gap.status} (
                          {gap.deltaPercent > 0
                            ? `+${gap.deltaPercent}%`
                            : `${gap.deltaPercent}%`}{" "}
                          Gap)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <div className="flex justify-between text-slate-600 mb-0.5">
                            <span>Your Actual Study Time:</span>
                            <span className="font-mono font-bold text-amber-700">
                              {gap.actualTimePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{
                                width: `${gap.actualTimePercent * 3.5}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-600 mb-0.5">
                            <span>RAS Marks Weightage:</span>
                            <span className="font-mono font-bold text-indigo-700">
                              {gap.idealWeightagePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600"
                              style={{
                                width: `${gap.idealWeightagePercent * 3.5}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200/80">
                        <strong>Topper Recommendation:</strong>{" "}
                        {gap.recommendation}
                      </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 3: PROGRESS & SYLLABUS BREAKDOWN */}
            {includeProgress && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-emerald-600 text-white font-mono font-bold text-xs">
                      03
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      Syllabus Coverage Breakdown &amp; Subject Index
                    </h2>
                  </div>
                </div>

                {totalHoursLogged === "0.0" && masteredTopics === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-xs font-medium">No syllabus progress tracked yet. Start marking topics as in progress or mastered.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                  {Array.from(new Set(syllabus.map((s) => s.subject)))
                    .map((subject, idx) => {
                      const topics = syllabus.filter(
                        (s) => s.subject === subject
                      );
                      const mastered = topics.filter(
                        (s) => s.status === "mastered"
                      ).length;
                      const active = topics.filter(
                        (s) =>
                          s.status !== "not_started" && s.status !== "mastered"
                      ).length;
                      const pct = Math.round(
                        ((mastered * 1 + active * 0.5) / topics.length) * 100
                      );

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                        >
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-800 truncate">
                              {subject}
                            </span>
                            <span className="font-mono text-emerald-700">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>{mastered} Mastered</span>
                            <span>{topics.length} Total Topics</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 4: MOCK TEST PERFORMANCE LOGS */}
            {includeMocks && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-blue-600 text-white font-mono font-bold text-xs">
                      04
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      Recent Mock Tests &amp; Score Progression
                    </h2>
                  </div>
                </div>

                {mockLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-xs font-medium">No mock tests attempted yet. Record your mock test scores to see accuracy and penalty deductions.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                      <th className="p-2">Date</th>
                      <th className="p-2">Mock Test Name</th>
                      <th className="p-2">Paper</th>
                      <th className="p-2">Score</th>
                      <th className="p-2">Accuracy</th>
                      <th className="p-2">Negative Deduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLogs.slice(0, 5).map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-slate-100 text-slate-700"
                      >
                        <td className="p-2 font-mono text-[11px]">{m.date}</td>
                        <td className="p-2 font-bold text-slate-900">
                          {m.testName}
                        </td>
                        <td className="p-2">{m.type}</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">
                          {m.marksObtained}/{m.totalMarks}
                        </td>
                        <td className="p-2 font-mono font-bold text-emerald-700">
                          {m.accuracyRate}%
                        </td>
                        <td className="p-2 font-mono font-bold text-rose-600">
                          -{((m.incorrectCount || 0) * 0.66).toFixed(1)} pts
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Report Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div>RAS CSE Master Hub • Official Telemetry Engine</div>
              <div>
                Strict Confidential • Personal Aspirant Diagnostic Report
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
