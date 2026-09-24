import React, { useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import {
  StudySessionLog,
  FocusTimerConfig,
  TimerMode,
  TimerPhase,
  SyllabusTopic,
} from "../../types";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Trash2,
  Sliders,
  Coffee,
  Zap,
  SkipForward,
  Volume2,
  Check,
  Award,
  Layers,
  ArrowRight,
  Download,
  FileSpreadsheet,
  Filter,
  Search,
  CheckCheck,
  Lightbulb,
  Image as ImageIcon,
} from "lucide-react";
import { TimerConfigModal, PRESET_CONFIGS } from "./TimerConfigModal";

import { playTimerChime } from "../../utils/audioAlert";
import { exportStudyLogsToCsv } from "../../utils/csvExporter";

interface StudyTrackerTabProps {
  sessionLogs: StudySessionLog[];
  onAddSessionLog: (log: StudySessionLog) => void;
  onDeleteSessionLog: (id: string) => void;
  onResetDefaultSessionLogs?: () => void;
  timerRunning: boolean;
  timerSeconds: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  dailyGoalHours: number;
  onUpdateDailyGoal: (hours: number) => void;
  timerConfig?: FocusTimerConfig;
  onUpdateTimerConfig?: (config: FocusTimerConfig) => void;
  timerPhase?: TimerPhase;
  currentCycle?: number;
  onSkipInterval?: () => void;
  onSetTimerPhase?: (phase: TimerPhase) => void;
  syllabus?: SyllabusTopic[];

  currentStudySession?: {
    paper?: string;
    subject: string;
    topic: string;
    taskType: "study" | "revision" | "pyq" | "notes" | "answer_writing";
  };
}

export const StudyTrackerTab: React.FC<StudyTrackerTabProps> = ({
  sessionLogs,
  onAddSessionLog,
  onDeleteSessionLog,
  onResetDefaultSessionLogs,
  timerRunning,
  timerSeconds,
  onToggleTimer,
  onResetTimer,
  dailyGoalHours,
  onUpdateDailyGoal,
  timerConfig = {
    mode: "pomodoro_25",
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartNextFocus: false,
    soundAlertsEnabled: true,
  },
  onUpdateTimerConfig,
  timerPhase = "focus",
  currentCycle = 1,
  onSkipInterval,
  onSetTimerPhase,
  syllabus = [],

  currentStudySession = {
    subject: "राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत",
    topic: "",
    taskType: "study",
  },
}) => {
  const [activePaper, setActivePaper] = useState("Prelims GS1");
  const [focusRating, setFocusRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [sessionNotes, setSessionNotes] = useState("");
  const [showQuickLogModal, setShowQuickLogModal] = useState<boolean>(false);
  const [showQuickThoughtsModal, setShowQuickThoughtsModal] =
    useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // CSV Export & Filter State
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [historyTimeFilter, setHistoryTimeFilter] = useState<
    "all" | "today" | "week"
  >("all");
  const [historySubjectFilter, setHistorySubjectFilter] =
    useState<string>("all");
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");

  const historyListRef = useRef<HTMLDivElement>(null);

  // Today's total logged minutes
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysLogs = sessionLogs.filter((l) => l.date === todayStr);
  const totalMinutesToday =
    todaysLogs.reduce((acc, l) => acc + l.durationMinutes, 0) +
    (timerPhase === "focus" ? Math.floor(timerSeconds / 60) : 0);
  const totalHoursToday = (totalMinutesToday / 60).toFixed(1);
  const dailyProgressPct = Math.min(
    Math.round((totalMinutesToday / (dailyGoalHours * 60)) * 100),
    100
  );

  // Filtered logs for History & CSV Export
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    return sessionLogs.filter((log) => {
      // Time filter
      if (historyTimeFilter === "today" && log.date !== todayStr) return false;
      if (historyTimeFilter === "week" && log.date < sevenDaysAgoStr)
        return false;

      // Subject filter with flexible prefix & contains match
      if (historySubjectFilter !== "all") {
        const cleanFilter = historySubjectFilter.toLowerCase().trim();
        const cleanLogSub = log.subject.toLowerCase().trim();
        const matchExact = cleanLogSub === cleanFilter;
        const matchPrefix =
          cleanLogSub.includes(cleanFilter.slice(0, 6)) ||
          cleanFilter.includes(cleanLogSub.slice(0, 6));
        if (!matchExact && !matchPrefix) return false;
      }

      // Search query
      if (historySearchQuery.trim()) {
        const query = historySearchQuery.toLowerCase();
        const matchesTopic = log.topicCovered.toLowerCase().includes(query);
        const matchesSubject = log.subject.toLowerCase().includes(query);
        const matchesNotes = (log.notes || "").toLowerCase().includes(query);
        const matchesPaper = (log.paper || "").toLowerCase().includes(query);
        if (!matchesTopic && !matchesSubject && !matchesNotes && !matchesPaper)
          return false;
      }

      return true;
    });
  }, [
    sessionLogs,
    historyTimeFilter,
    historySubjectFilter,
    historySearchQuery,
    todayStr,
  ]);

  // Filtered stats
  const filteredTotalMinutes = filteredLogs.reduce(
    (acc, l) => acc + l.durationMinutes,
    0
  );
  const filteredTotalHours = (filteredTotalMinutes / 60).toFixed(1);

  // CSV Export Trigger
  const handleExportCsv = (logsToExport: StudySessionLog[], label = "all") => {
    if (!logsToExport || logsToExport.length === 0) {
      alert("No study logs available to export for this selection.");
      return;
    }
    const success = exportStudyLogsToCsv(
      logsToExport,
      `ras_study_sessions_${label}`
    );
    if (success) {
      setExportFeedback(
        `Exported ${logsToExport.length} study session${
          logsToExport.length === 1 ? "" : "s"
        } to CSV!`
      );
      setTimeout(() => setExportFeedback(null), 4000);
    }
  };

  const handleDownloadPhoto = async () => {
    if (!historyListRef.current) return;
    try {
      setExportFeedback("Generating image...");
      const canvas = await html2canvas(historyListRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        onclone: (document) => {
          const header = document.querySelector('.print-header') as HTMLElement;
          if (header) header.style.display = 'block';
        }
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      
      if (Capacitor.isNativePlatform()) {
        const fileName = `ras_study_history_${new Date().getTime()}.jpg`;
        const base64Data = dataUrl.split(",")[1];
        
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });

        await Share.share({
          title: 'My Study History',
          text: 'Here is my latest study progress!',
          url: savedFile.uri,
          dialogTitle: 'Share Study History'
        });
        setExportFeedback("Photo shared successfully!");
      } else {
        const link = document.createElement("a");
        link.download = `ras_study_history_${new Date().getTime()}.jpg`;
        link.href = dataUrl;
        link.click();
        setExportFeedback("Photo downloaded successfully!");
      }
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err) {
      console.error("Failed to generate image", err);
      setExportFeedback("Failed to generate image.");
      setTimeout(() => setExportFeedback(null), 4000);
    }
  };

  // Determine current phase duration in seconds
  const isContinuous = timerConfig.mode === "stopwatch_continuous";
  const currentTargetMinutes =
    timerPhase === "focus"
      ? timerConfig.focusMinutes
      : timerPhase === "short_break"
      ? timerConfig.shortBreakMinutes
      : timerConfig.longBreakMinutes;

  const currentTargetSeconds = currentTargetMinutes * 60;

  // Remaining or Elapsed seconds for display
  const displaySeconds = isContinuous
    ? timerSeconds
    : Math.max(currentTargetSeconds - timerSeconds, 0);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercent = isContinuous
    ? 100
    : currentTargetSeconds > 0
    ? Math.min(Math.round((timerSeconds / currentTargetSeconds) * 100), 100)
    : 0;

  const handleSaveTimerSession = () => {
    const durationMins = isContinuous
      ? Math.max(Math.round(timerSeconds / 60), 1)
      : Math.max(
          Math.round(timerSeconds / 60),
          Math.min(timerConfig.focusMinutes, 1)
        );

    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      date: todayStr,
      subject: currentStudySession.subject || "General Study",
      paper: activePaper,
      durationMinutes: durationMins,
      topicCovered:
        currentStudySession.topic.trim() ||
        `Focus Session (${timerConfig.mode.replace("_", " ").toUpperCase()})`,
      taskType: currentStudySession.taskType as "notes" | "study" | "revision" | "pyq" | "answer_writing",
      qualityRating: focusRating,
      notes: sessionNotes.trim(),
    };
    onAddSessionLog(newLog);
    onResetTimer();
    setSessionNotes("");
  };

  const handleQuickPresetSelect = (mode: TimerMode) => {
    if (!onUpdateTimerConfig) return;
    const preset = PRESET_CONFIGS.find((p) => p.id === mode);
    if (preset) {
      onUpdateTimerConfig({
        ...timerConfig,
        mode: preset.id,
        focusMinutes: preset.focus,
        shortBreakMinutes: preset.shortBreak,
        longBreakMinutes: preset.longBreak,
        cyclesBeforeLongBreak: preset.cycles,
      });
      onResetTimer();
    }
  };

  // Get current active mode preset details
  const activePreset = PRESET_CONFIGS.find((p) => p.id === timerConfig.mode);

  return (
    <div className="space-y-6">
      {/* Top Banner & Timer Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stopwatch / Pomodoro Widget Bento Card */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          {/* Header with Title & Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5 w-fit">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> RAS Focus
                  Engine
                </span>

                {/* Interval Mode Badge */}
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                  {activePreset ? activePreset.name : "Custom Interval"} (
                  {timerConfig.focusMinutes}m)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">
                Intelligent Study Interval Timer
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Thought / Scratchpad */}
              <button
                type="button"
                onClick={() => setShowQuickThoughtsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold shadow-sm transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Scratchpad</span>
              </button>

              {/* Timer Settings */}
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Settings</span>
              </button>

              {/* Manual Log Entry */}
              <button
                onClick={() => setShowQuickLogModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Offline Log</span>
              </button>
            </div>
          </div>

          {/* Active Context Display (New Feature) */}
          {timerPhase === "focus" && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Currently Studying</p>
                <h3 className="text-sm font-bold text-indigo-950 truncate">
                  {currentStudySession.subject || "General Study"}
                </h3>
                <p className="text-xs text-indigo-700 truncate mt-0.5">
                  {currentStudySession.topic || "Open session / No specific topic"}
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-2 py-1 bg-white text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100 uppercase">
                  {currentStudySession.taskType.replace("_", " ")}
                </span>
              </div>
            </div>
          )}

          {/* Cleaned Presets Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 px-2 shrink-0">
              Presets:
            </span>
            {[
              {
                id: "pomodoro_25" as TimerMode,
                label: "25m Pomodoro",
                short: "25m / 5m",
              },
              {
                id: "pomodoro_50" as TimerMode,
                label: "50m Deep Work",
                short: "50m / 10m",
              },
              {
                id: "gs_marathon_90" as TimerMode,
                label: "90m GS Marathon",
                short: "90m / 15m",
              },
              {
                id: "exam_slot_120" as TimerMode,
                label: "120m Exam Slot",
                short: "120m / 20m",
              },
              {
                id: "stopwatch_continuous" as TimerMode,
                label: "Freeflow Stopwatch",
                short: "Count-up",
              },
            ].map((preset) => {
              const isSelected = timerConfig.mode === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleQuickPresetSelect(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected
                        ? "bg-indigo-700/80 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {preset.short}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 border ${
                timerConfig.mode === "custom_interval"
                  ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                  : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Custom...</span>
            </button>
          </div>

          <div className="relative py-10 px-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-5 overflow-hidden">
            {/* Ambient Background Glow for Active Sessions */}
            {timerRunning && (
              <div
                className={`absolute inset-0 opacity-20 blur-[60px] pointer-events-none transition-colors duration-1000 ${
                  timerPhase === "focus"
                    ? "bg-amber-500/40"
                    : timerPhase === "short_break"
                    ? "bg-emerald-500/40"
                    : "bg-blue-500/40"
                }`}
              />
            )}

            {/* Current Phase & Cycle Pill */}
            <div className="flex items-center justify-center gap-3 relative z-10">
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 border shadow-xs ${
                  timerPhase === "focus"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : timerPhase === "short_break"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                }`}
              >
                {timerPhase === "focus" ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Focus Session</span>
                  </>
                ) : timerPhase === "short_break" ? (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Short Rest Break</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-blue-400" />
                    <span>Long Recharge Break</span>
                  </>
                )}
              </div>

              {!isContinuous && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-mono font-bold">
                  <span>
                    Cycle {currentCycle}/{timerConfig.cyclesBeforeLongBreak}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {Array.from({
                      length: timerConfig.cyclesBeforeLongBreak,
                    }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i + 1 < currentCycle
                            ? "bg-emerald-400"
                            : i + 1 === currentCycle
                            ? "bg-amber-400 animate-pulse"
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Time Counter */}
            <div className="font-mono text-5xl sm:text-7xl font-black tracking-wider text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)] relative z-10">
              {formatTimer(displaySeconds)}
            </div>

            {/* Visual Interval Progress Bar */}
            {!isContinuous && (
              <div className="max-w-md mx-auto relative z-10 space-y-1.5">
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      timerPhase === "focus"
                        ? "bg-gradient-to-r from-amber-500 to-amber-300"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-300"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>{timerSeconds}s elapsed</span>
                  <span>{progressPercent}% completed</span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 font-medium relative z-10">
              {timerRunning
                ? timerPhase === "focus"
                  ? "🔥 High-focus mode active — protect your concentration from all distractions."
                  : "☕ Rest interval active — hydrate, stretch, and rest your eyes."
                : "Timer paused. Press Start Session to begin counting."}
            </p>
          </div>

          {/* Quick Subject & Topic Selection for this Focus Session */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Focus Target</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">{currentStudySession.subject || 'Select Subject on Home'}</span>
                {currentStudySession.topic && <span className="text-sm font-bold text-slate-800">{currentStudySession.topic}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Type</span>
               <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-bold uppercase">{currentStudySession.taskType}</span>
            </div>
          </div>

          {/* Timer Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer ${
                  timerRunning
                    ? "bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-500/20"
                }`}
              >
                {timerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>{timerRunning ? "Pause Session" : "Start Session"}</span>
              </button>

              <button
                onClick={onResetTimer}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition shadow-xs cursor-pointer"
                title="Reset current interval timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Skip to Next Interval Button */}
              {onSkipInterval && !isContinuous && (
                <button
                  onClick={onSkipInterval}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                  title={
                    timerPhase === "focus" ? "Skip to Break" : "Skip to Focus"
                  }
                >
                  <SkipForward className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">
                    {timerPhase === "focus" ? "Take Break" : "Next Focus"}
                  </span>
                </button>
              )}
            </div>

            {/* Save to Daily Log Button */}
            {timerSeconds >= 30 && (
              <button
                onClick={handleSaveTimerSession}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer animate-in fade-in"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Save to Daily Log (
                  {Math.max(Math.round(timerSeconds / 60), 1)}m)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Daily Goal & Progress Dial Bento Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Today's Target Gauge</span>
              <span className="text-indigo-600 font-extrabold">
                {dailyProgressPct}% Done
              </span>
            </div>

            <div className="mt-4 text-center">
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalHoursToday} hrs
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Logged out of {dailyGoalHours} hrs daily target
              </p>
            </div>

            <div className="mt-4 w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${dailyProgressPct}%` }}
              />
            </div>
          </div>

          {/* Active Configuration Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active Cadence</span>
              </span>
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-[10px] text-indigo-600 hover:underline font-bold"
              >
                Edit Settings
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-slate-400 uppercase font-bold">Focus</div>
                <div className="font-mono font-extrabold text-indigo-600 text-xs mt-0.5">
                  {timerConfig.focusMinutes}m
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-slate-400 uppercase font-bold">Break</div>
                <div className="font-mono font-extrabold text-amber-600 text-xs mt-0.5">
                  {timerConfig.shortBreakMinutes}m
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-slate-400 uppercase font-bold">Cycles</div>
                <div className="font-mono font-extrabold text-emerald-600 text-xs mt-0.5">
                  {timerConfig.cyclesBeforeLongBreak}x
                </div>
              </div>
            </div>
          </div>

          {/* Daily Goal Quick Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-bold">Daily Study Target:</span>
              <div className="flex items-center gap-1">
                {[6, 8, 10, 12].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => onUpdateDailyGoal(hrs)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold shadow-xs transition cursor-pointer ${
                      dailyGoalHours === hrs
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic text-center font-medium">
              "7 focused hours beats 14 distracted hours. Build consistency."
            </p>
          </div>
        </div>
      </div>

      {/* Today's & Historical Study Log Repository with CSV Export Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        {/* Card Header & Primary Export Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5 w-fit">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-600" /> Study
                History Repository
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                {sessionLogs.length} Total Sessions Logged
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Study Session Logs & CSV Export Engine
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export Filtered CSV Button */}
            <button
              id="export-filtered-csv-btn"
              onClick={() => handleExportCsv(filteredLogs, historyTimeFilter)}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download CSV for currently filtered study logs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100 shrink-0" />
              <span>Export CSV ({filteredLogs.length} Records)</span>
            </button>

            {/* Export All CSV Button */}
            {filteredLogs.length !== sessionLogs.length &&
              sessionLogs.length > 0 && (
                <button
                  onClick={() => handleExportCsv(sessionLogs, "all_records")}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                  title="Export entire study log history to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export All ({sessionLogs.length})</span>
                </button>
              )}

            <button
              id="export-photo-btn"
              onClick={handleDownloadPhoto}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download currently filtered study logs as an image"
            >
              <ImageIcon className="w-4 h-4 text-blue-100 shrink-0" />
              <span>Download Photo</span>
            </button>
          </div>
        </div>

        {/* Export Success Toast Notification */}
        {exportFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {exportFeedback} Compatible with Microsoft Excel, Google Sheets,
                LibreOffice & Apple Numbers.
              </span>
            </div>
            <button
              onClick={() => setExportFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          {/* Time Range Segmented Selector */}
          <div className="sm:col-span-4 flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {[
              { id: "all" as const, label: `All (${sessionLogs.length})` },
              { id: "today" as const, label: `Today (${todaysLogs.length})` },
              { id: "week" as const, label: "Past 7 Days" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setHistoryTimeFilter(t.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center transition cursor-pointer ${
                  historyTimeFilter === t.id
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <div className="sm:col-span-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={historySubjectFilter}
              onChange={(e) => setHistorySubjectFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Subjects ({sessionLogs.length})</option>
              {Array.from(new Set(syllabus.map(s => s.subject))).map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search topic or notes..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none"
            />
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery("")}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Summary Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 font-medium gap-2">
          <div>
            Showing{" "}
            <strong className="text-slate-900">{filteredLogs.length}</strong>{" "}
            matching sessions • Total Time:{" "}
            <strong className="text-indigo-600 font-mono">
              {filteredTotalHours} hrs
            </strong>{" "}
            ({filteredTotalMinutes} mins)
          </div>
          {(historySubjectFilter !== "all" ||
            historySearchQuery ||
            historyTimeFilter !== "all") && (
            <button
              onClick={() => {
                setHistoryTimeFilter("all");
                setHistorySubjectFilter("all");
                setHistorySearchQuery("");
              }}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Log Entries List */}
        {filteredLogs.length === 0 ? (
          <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs font-medium space-y-2">
            <div>No study sessions match your current filter.</div>
            <button
              onClick={() => {
                setHistoryTimeFilter("all");
                setHistorySubjectFilter("all");
                setHistorySearchQuery("");
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 text-xs font-bold hover:bg-indigo-50 transition cursor-pointer"
            >
              Clear filters to view all logs
            </button>
          </div>
        ) : (
          <div ref={historyListRef} className="p-2 bg-white rounded-lg space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {/* Header for Image Export */}
            <div className="hidden print-header p-2 bg-indigo-50 border-b border-indigo-100 mb-4 rounded-xl">
               <h2 className="text-sm font-bold text-indigo-900">RAS Study Session History</h2>
               <p className="text-xs text-indigo-700">Generated on: {new Date().toLocaleString()}</p>
            </div>

            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex flex-col gap-1 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-center text-[11px]">
                      {log.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono text-center">
                      {log.date}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{log.topicCovered}</span>
                      {log.paper && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 font-semibold">
                          {log.paper}
                        </span>
                      )}
                    </div>
                    {log.notes && (
                      <div className="text-slate-600 text-xs mt-0.5 font-medium leading-relaxed">
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <div className="flex items-center gap-2">
                    {log.qualityRating && (
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                        ⭐ {log.qualityRating}/5
                      </span>
                    )}
                    {log.startTime && log.endTime && (
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
                        {(() => {
                          const f = (t:string) => {
                             const [h, m] = t.split(":");
                             let hours = parseInt(h);
                             const ampm = hours >= 12 ? "PM" : "AM";
                             hours = hours % 12 || 12;
                             return `${hours}:${m} ${ampm}`;
                          };
                          return `${f(log.startTime)} - ${f(log.endTime)}`;
                        })()}
                      </span>
                    )}
                    <span className="font-mono font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 shadow-2xs">
                      {log.durationMinutes} mins
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteSessionLog(log.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete session log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <TimerConfigModal
          config={timerConfig}
          onSaveConfig={(newConfig) => {
            if (onUpdateTimerConfig) {
              onUpdateTimerConfig(newConfig);
              onResetTimer();
            }
          }}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
};
