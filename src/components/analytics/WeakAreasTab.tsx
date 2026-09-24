import React, { useState, useMemo } from "react";
import { WeakAreaItem, SyllabusTopic, MockTestLog } from "../../types";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Flame,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Grid3X3,
  ListFilter,
  Target,
  BarChart2,
  TrendingDown,
  XCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  Download,
} from "lucide-react";

interface WeakAreasTabProps {
  weakAreas: WeakAreaItem[];
  sessionLogs?: StudySessionLog[];
  syllabus?: SyllabusTopic[];
  mockLogs?: MockTestLog[];
  onOpenExportReport?: () => void;
}

export const WeakAreasTab: React.FC<WeakAreasTabProps> = ({
  weakAreas,
  sessionLogs = [],
  syllabus = [],
  mockLogs = [],
  onOpenExportReport,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"heatmap" | "cards">("heatmap");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    weakAreas[0]?.id || null
  );

  // Calculate failed question intensity level
  const getIntensityInfo = (failedCount: number = 0, accuracy: number = 50) => {
    if (failedCount >= 6 || accuracy < 45) {
      return {
        level: "Critical (6+ Failed)",
        badge: "🔴 Critical Risk",
        badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
        cellBg:
          "bg-rose-50/90 border-rose-300 hover:border-rose-500 text-rose-950",
        headerBg: "bg-rose-500 text-white",
        barColor: "bg-rose-600",
        intensityText: "High Failure Density",
      };
    } else if (failedCount >= 4 || accuracy < 60) {
      return {
        level: "Moderate (4-5 Failed)",
        badge: "🟠 Moderate Risk",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
        cellBg:
          "bg-amber-50/90 border-amber-300 hover:border-amber-500 text-amber-950",
        headerBg: "bg-amber-500 text-white",
        barColor: "bg-amber-500",
        intensityText: "Moderate Failure Density",
      };
    } else if (failedCount >= 2 || accuracy < 75) {
      return {
        level: "Mild (2-3 Failed)",
        badge: "🟡 Mild Risk",
        badgeBg: "bg-yellow-100 text-yellow-800 border-yellow-300",
        cellBg:
          "bg-yellow-50/80 border-yellow-300 hover:border-yellow-500 text-yellow-950",
        headerBg: "bg-yellow-500 text-white",
        barColor: "bg-yellow-500",
        intensityText: "Low Failure Density",
      };
    } else {
      return {
        level: "Secure (0-1 Failed)",
        badge: "🟢 Mastered",
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        cellBg:
          "bg-emerald-50/80 border-emerald-300 hover:border-emerald-500 text-emerald-950",
        headerBg: "bg-emerald-600 text-white",
        barColor: "bg-emerald-500",
        intensityText: "Zero/Negligible Deficit",
      };
    }
  };

  // Filtered topics
  const filteredWeakAreas = useMemo(() => {
    return weakAreas.filter((item) => {
      const matchPaper =
        selectedPaper === "All" || item.paper === selectedPaper;
      const failedCount =
        item.failedQuestionsCount ||
        (item.severity === "Critical"
          ? 7
          : item.severity === "Moderate"
          ? 4
          : 2);
      const intensity = getIntensityInfo(
        failedCount,
        item.accuracyInMocks || 50
      );
      const matchSubject =
        selectedSubject === "All" || item.subject === selectedSubject;
      const matchQuery =
        !searchQuery.trim() ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      return matchPaper && matchSubject && matchQuery;
    });
  }, [weakAreas, selectedPaper, selectedSubject, searchQuery]);

  // Aggregate metrics
  const totalFailedQuestions = useMemo(() => {
    return weakAreas.reduce(
      (acc, curr) =>
        acc +
        (curr.failedQuestionsCount ||
          (curr.severity === "Critical"
            ? 7
            : curr.severity === "Moderate"
            ? 4
            : 2)),
      0
    );
  }, [weakAreas]);

  const totalMarksLoss = useMemo(() => {
    return weakAreas.reduce(
      (acc, curr) => acc + (curr.estimatedMarkLoss || 0),
      0
    );
  }, [weakAreas]);

  const criticalCount = useMemo(() => {
    return weakAreas.filter(
      (w) => (w.failedQuestionsCount || 0) >= 6 || w.severity === "Critical"
    ).length;
  }, [weakAreas]);

  const selectedTopic = useMemo(() => {
    return weakAreas.find((w) => w.id === selectedTopicId) || weakAreas[0];
  }, [weakAreas, selectedTopicId]);

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Negative
                Mark Deficit Engine
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mock Error Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Syllabus Weak Areas & Failure Intensity Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Visual matrix mapping syllabus topics against negative marks and
              failed mock test questions. Color intensity highlights vulnerable
              topics where targeted PYQ practice delivers immediate score jumps.
            </p>
          </div>

        </div>

        {/* Heatmap Intensity Legend */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Failure Color Scale:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Critical (6+ Failed MCQs)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Moderate (4-5 Failed MCQs)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Mild (2-3 Failed MCQs)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Mastered (&lt;2 Failed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls Toolbar */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search weak topics (e.g. Biosphere, Permutation, Climatology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3.5 py-2 outline-none font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Paper filter */}
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none font-bold cursor-pointer"
          >
            <option value="All">All Papers</option>
            <option value="Prelims GS1">Prelims (GK & GS)</option>
            <option value="Mains GS1">Mains Paper I</option>
            <option value="Mains GS2">Mains Paper II</option>
            <option value="Mains GS3">Mains Paper III</option>
            <option value="Mains GS4">Mains Paper IV (Hindi/Eng)</option>
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none font-bold cursor-pointer max-w-[200px] truncate"
          >
            <option value="All">All Subjects</option>
            {Array.from(new Set(weakAreas.filter(w => selectedPaper === "All" || w.paper === selectedPaper).map(w => w.subject).filter(Boolean))).map(s => (
               <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "heatmap"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Visual Grid Matrix"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Grid Heatmap</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Diagnostic Action Cards"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Deep Cards</span>
            </button>
          </div>

          {/* Export Report Trigger */}
          {onOpenExportReport && (
            <button
              onClick={onOpenExportReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
              title="Export Heatmap & Weak Areas to PDF or PNG"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Heatmap Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "heatmap" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap Visual Matrix (2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>
                Failure Intensity Grid ({filteredWeakAreas.length} Topics)
              </span>
              <span>Click a tile to inspect diagnosis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredWeakAreas.map((item) => {
                const failedCount =
                  item.failedQuestionsCount ||
                  (item.severity === "Critical"
                    ? 7
                    : item.severity === "Moderate"
                    ? 4
                    : 2);
                const totalMocks = item.totalAttemptedInMocks || 12;
                const accuracy =
                  item.accuracyInMocks ||
                  Math.round(((totalMocks - failedCount) / totalMocks) * 100);
                const intensity = getIntensityInfo(failedCount, accuracy);
                const isSelected = selectedTopic?.id === item.id;

                return (
                  <div
                    key={item.id}
                    id={`heatmap-tile-${item.id}`}
                    onClick={() => setSelectedTopicId(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                      intensity.cellBg
                    } ${
                      isSelected
                        ? "ring-3 ring-indigo-500 shadow-md scale-[1.01]"
                        : "hover:shadow-sm"
                    }`}
                  >
                    {/* Top Subject & Intensity Indicator */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-white/80 font-mono text-[10px] font-extrabold border border-black/10">
                            {item.paper}
                          </span>
                          <span className="text-[11px] font-bold opacity-80 truncate">
                            {item.subject}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-2 leading-snug">
                          {item.topic}
                        </h4>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 border uppercase tracking-wider ${intensity.badgeBg}`}
                      >
                        {failedCount} Failed
                      </span>
                    </div>

                    {/* Telemetry Metric Bar inside tile */}
                    <div className="space-y-1.5 pt-2 border-t border-black/5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="opacity-75">Accuracy in Mocks</span>
                        <span className="font-mono">{accuracy}%</span>
                      </div>

                      {/* Visual Accuracy Bar */}
                      <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${intensity.barColor} rounded-full`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-semibold opacity-75 pt-0.5 font-mono">
                        <span>Deficit: -{item.estimatedMarkLoss} marks</span>
                        <span>{item.recommendedPYQCount}+ PYQs Req</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredWeakAreas.length === 0 && (
              <div className="p-12 text-center bg-white border-2 border-slate-200 rounded-3xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  No Weak Topics Found for Selected Filters
                </h4>
                <p className="text-xs text-slate-500">
                  Try adjusting your paper or intensity filters above.
                </p>
              </div>
            )}
          </div>

          {/* Selected Topic Inspector Sidebar (1 Column) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Active Topic Diagnostic Blueprint
            </div>

            {selectedTopic ? (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 sticky top-4">
                {/* Topic Header */}
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {selectedTopic.paper}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${
                        getIntensityInfo(
                          selectedTopic.failedQuestionsCount || 5,
                          selectedTopic.accuracyInMocks || 50
                        ).badgeBg
                      }`}
                    >
                      {selectedTopic.failedQuestionsCount || 5} Questions Failed
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedTopic.topic}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold">
                    {selectedTopic.subject}
                  </div>
                </div>

                {/* Score & Error Breakdown */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Mock Accuracy
                    </span>
                    <span className="text-base font-mono font-extrabold text-rose-600">
                      {selectedTopic.accuracyInMocks}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Mark Penalty
                    </span>
                    <span className="text-base font-mono font-extrabold text-amber-700">
                      -{selectedTopic.estimatedMarkLoss} M
                    </span>
                  </div>
                </div>

                {/* Root Cause Analysis */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Root
                    Cause of Mock Failures:
                  </span>
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-slate-700 leading-relaxed font-medium">
                    {selectedTopic.rootCause ||
                      "High negative marking due to close distractors in Prelims options."}
                  </div>
                </div>

                {/* Revision Insights AI Scolding */}
                {(() => {
                  const revisionTime = sessionLogs
                    .filter((log) => log.topicCovered === selectedTopic.topic && log.taskType === "revision")
                    .reduce((sum, log) => sum + log.durationMinutes, 0);
                  const accuracy = selectedTopic.accuracyInMocks || 50;
                  
                  if (accuracy < 70 && revisionTime < 60) {
                    return (
                      <div className="space-y-1.5 text-xs mt-3">
                        <span className="font-bold text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning: Lack of Revision
                        </span>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 leading-relaxed font-bold shadow-sm">
                          भाई, आपने हाल ही में इस विषय का टेस्ट दिया है, लेकिन आपका परिणाम संतोषजनक नहीं रहा (Accuracy: {accuracy}%)। 
                          आपने इस टॉपिक का ठीक से रिवीजन भी नहीं किया है (रिवीजन रिकॉर्ड: सिर्फ़ {revisionTime} मिनट)। इसी वजह से यह विषय कमज़ोर है, इसे सेटअप करें!
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Targeted Action Plan */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />{" "}
                    Prescribed Action Plan:
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                    {selectedTopic.recommendedAction}
                  </div>
                </div>

                {/* Excel Study Guide Injection */}
                {(() => {
                  const syllabusMatch = syllabus.find(s => s.title === selectedTopic.topic || s.id === selectedTopic.topic);
                  if (syllabusMatch?.studyGuide) {
                    return (
                      <div className="space-y-1.5 text-xs mt-3">
                        <span className="font-bold text-indigo-800 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> 
                          मार्क बढ़ाने के लिए क्या तैयार करें (Excel Guide):
                        </span>
                        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 leading-relaxed font-bold shadow-sm">
                          {syllabusMatch.studyGuide}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Priority Book & PYQs */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-slate-600 font-medium">
                      Primary Book:{" "}
                      <strong className="text-slate-900">
                        {selectedTopic.priorityBook}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-800">
                    <span>Target PYQ Target:</span>
                    <span className="font-mono">
                      {selectedTopic.recommendedPYQCount || 20}+ Questions
                    </span>
                  </div>
                </div>


              </div>
            ) : (
              <div className="p-8 text-center bg-white border-2 border-slate-200 rounded-3xl text-slate-500 text-xs">
                Select a topic from the heatmap to inspect its diagnosis.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Detailed Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWeakAreas.map((item) => {
            const failedCount =
              item.failedQuestionsCount ||
              (item.severity === "Critical"
                ? 7
                : item.severity === "Moderate"
                ? 4
                : 2);
            const intensity = getIntensityInfo(
              failedCount,
              item.accuracyInMocks || 50
            );

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                          {item.paper}
                        </span>
                        <span className="text-xs text-slate-600 font-semibold">
                          {item.subject}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {item.topic}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${intensity.badgeBg}`}
                    >
                      {failedCount} Failed
                    </span>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs text-center">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold">
                        Mock Accuracy
                      </span>
                      <span className="font-bold text-rose-600 font-mono">
                        {item.accuracyInMocks}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold">
                        Marks Loss
                      </span>
                      <span className="font-bold text-amber-700 font-mono">
                        -{item.estimatedMarkLoss} Marks
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold">
                        PYQs Needed
                      </span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {item.recommendedPYQCount}+ MCQs
                      </span>
                    </div>
                  </div>

                  {/* Revision Insights AI Scolding */}
                  {(() => {
                    const revisionTime = sessionLogs
                      .filter((log) => log.topicCovered === item.topic && log.taskType === "revision")
                      .reduce((sum, log) => sum + log.durationMinutes, 0);
                    const accuracy = item.accuracyInMocks || 50;
                    
                    if (accuracy < 70 && revisionTime < 60) {
                      return (
                        <div className="space-y-1.5 text-xs mt-3">
                          <span className="font-bold text-rose-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Warning: Lack of Revision
                          </span>
                          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 leading-relaxed font-bold shadow-sm">
                            भाई, आपने हाल ही में इस विषय का टेस्ट दिया है, लेकिन आपका परिणाम संतोषजनक नहीं रहा (Accuracy: {accuracy}%)। 
                            आपने इस टॉपिक का ठीक से रिवीजन भी नहीं किया है (रिवीजन रिकॉर्ड: सिर्फ़ {revisionTime} मिनट)। इसी वजह से यह विषय कमज़ोर है, इसे सेटअप करें!
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Recommended Action & Books */}
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                      <strong className="text-slate-900 font-bold">
                        Action Plan:{" "}
                      </strong>
                      {item.recommendedAction}
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>
                        Refer:{" "}
                        <strong className="text-slate-900">
                          {item.priorityBook}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
