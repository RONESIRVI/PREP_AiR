import React, { useState, useEffect } from "react";
import { FocusTimerConfig, TimerMode } from "../../types";
import {
  Sliders,
  Clock,
  Coffee,
  Volume2,
  VolumeX,
  Play,
  Zap,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Bell,
  BellRing,
  BellOff,
  X,
} from "lucide-react";
import { playTimerChime } from "../../utils/audioAlert";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  triggerTimerEndNotification,
} from "../../utils/browserNotifications";

interface TimerConfigModalProps {
  config: FocusTimerConfig;
  onSaveConfig: (newConfig: FocusTimerConfig) => void;
  onClose: () => void;
}

export const PRESET_CONFIGS: {
  id: TimerMode;
  name: string;
  badge: string;
  focus: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  description: string;
  tagColor: string;
}[] = [
  {
    id: "pomodoro_25",
    name: "Pomodoro Standard",
    badge: "25 / 5 min",
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4,
    description:
      "Classic high-intensity cadence. Best for retention and preventing mental fatigue.",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "pomodoro_50",
    name: "Extended Deep Work",
    badge: "50 / 10 min",
    focus: 50,
    shortBreak: 10,
    longBreak: 20,
    cycles: 3,
    description:
      "Extended flow state. Ideal for dense chapters in Laxmikanth, Spectrum, or Mrunal.",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "gs_marathon_90",
    name: "RAS GS Marathon",
    badge: "90 / 15 min",
    focus: 90,
    shortBreak: 15,
    longBreak: 30,
    cycles: 2,
    description:
      "Deep immersion marathon. Mimics a standard 1.5-hour coaching slot or PYQ analysis block.",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "exam_slot_120",
    name: "Exam Slot Simulation",
    badge: "120 / 20 min",
    focus: 120,
    shortBreak: 20,
    longBreak: 40,
    cycles: 2,
    description:
      "Authentic 2-hour RAS exam slot simulation (9:30-11:30 AM GS1 or CSAT Paper II).",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "stopwatch_continuous",
    name: "Continuous Stopwatch",
    badge: "Freeflow",
    focus: 0,
    shortBreak: 0,
    longBreak: 0,
    cycles: 1,
    description:
      "Pure count-up timer. Study at your own pace without preset alarms or break limits.",
    tagColor: "bg-slate-100 text-slate-700 border-slate-300",
  },
];

export const TimerConfigModal: React.FC<TimerConfigModalProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<TimerMode>(config.mode);
  const [focusMins, setFocusMins] = useState<number>(config.focusMinutes || 25);
  const [shortBreakMins, setShortBreakMins] = useState<number>(
    config.shortBreakMinutes || 5
  );
  const [longBreakMins, setLongBreakMins] = useState<number>(
    config.longBreakMinutes || 15
  );
  const [cycles, setCycles] = useState<number>(
    config.cyclesBeforeLongBreak || 4
  );
  const [autoBreaks, setAutoBreaks] = useState<boolean>(config.autoStartBreaks);
  const [autoNextFocus, setAutoNextFocus] = useState<boolean>(
    config.autoStartNextFocus
  );
  const [soundAlerts, setSoundAlerts] = useState<boolean>(
    config.soundAlertsEnabled
  );
  const [nativeNotifications, setNativeNotifications] = useState<boolean>(
    config.nativeNotificationsEnabled !== false
  );
  const [permissionStatus, setPermissionStatus] = useState<string>(
    getNotificationPermission()
  );
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermissionStatus(perm);
    if (perm === "granted") {
      setNativeNotifications(true);
      triggerTimerEndNotification({
        phase: "focus",
        topic:
          "Browser Notifications Active! You will be alerted when study intervals complete even in background.",
        playSound: soundAlerts,
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleTestNotification = () => {
    triggerTimerEndNotification({
      phase: "focus",
      topic: "GS1 Indian Polity Revision (Test)",
      playSound: soundAlerts,
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  const handleApplyPreset = (preset: (typeof PRESET_CONFIGS)[0]) => {
    setActiveMode(preset.id);
    if (preset.id !== "stopwatch_continuous") {
      setFocusMins(preset.focus);
      setShortBreakMins(preset.shortBreak);
      setLongBreakMins(preset.longBreak);
      setCycles(preset.cycles);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      mode: activeMode,
      focusMinutes: focusMins,
      shortBreakMinutes: shortBreakMins,
      longBreakMinutes: longBreakMins,
      cyclesBeforeLongBreak: cycles,
      autoStartBreaks: autoBreaks,
      autoStartNextFocus: autoNextFocus,
      soundAlertsEnabled: soundAlerts,
      nativeNotificationsEnabled: nativeNotifications,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Focus Timer Intervals & Mode Configuration
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Customize Pomodoro cadences, exam marathon blocks, or freeflow
                stopwatches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Interval Presets */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Focus Preset</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_CONFIGS.map((preset) => {
              const isSelected = activeMode === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-600 shadow-xs ring-2 ring-indigo-500/20 scale-[1.01]"
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{preset.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${preset.tagColor}`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              );
            })}

            {/* Custom Option Button */}
            <button
              type="button"
              onClick={() => setActiveMode("custom_interval")}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                activeMode === "custom_interval"
                  ? "bg-indigo-50/70 border-indigo-600 shadow-xs ring-2 ring-indigo-500/20 scale-[1.01]"
                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>Custom Interval Builder</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border bg-purple-50 text-purple-700 border-purple-200">
                  Custom
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Set bespoke focus durations, custom breaks, and personalized
                cycle counts.
              </p>
            </button>
          </div>
        </div>

        {/* Section 2: Interval Sliders & Numeric Config (If not continuous stopwatch) */}
        {activeMode !== "stopwatch_continuous" && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Interval Durations (Minutes)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Fine-tune numbers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Focus Duration */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" /> Focus Block
                  </span>
                  <span className="font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {focusMins}m
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="180"
                  step="1"
                  value={focusMins}
                  onChange={(e) => {
                    setFocusMins(Number(e.target.value));
                    if (activeMode !== "custom_interval")
                      setActiveMode("custom_interval");
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1m</span>
                  <span>90m</span>
                  <span>180m</span>
                </div>
              </div>

              {/* Short Break */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5 text-amber-600" /> Short
                    Break
                  </span>
                  <span className="font-mono font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    {shortBreakMins}m
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={shortBreakMins}
                  onChange={(e) => {
                    setShortBreakMins(Number(e.target.value));
                    if (activeMode !== "custom_interval")
                      setActiveMode("custom_interval");
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1m</span>
                  <span>15m</span>
                  <span>30m</span>
                </div>
              </div>

              {/* Long Break */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5 text-emerald-600" /> Long
                    Break
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {longBreakMins}m
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={longBreakMins}
                  onChange={(e) => {
                    setLongBreakMins(Number(e.target.value));
                    if (activeMode !== "custom_interval")
                      setActiveMode("custom_interval");
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5m</span>
                  <span>30m</span>
                  <span>60m</span>
                </div>
              </div>
            </div>

            {/* Cycles before long break */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Cycles Before Long Break
                </div>
                <p className="text-[11px] text-slate-500">
                  Number of focus intervals before triggering the extended rest
                  break.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCycles(c);
                      if (activeMode !== "custom_interval")
                        setActiveMode("custom_interval");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      cycles === c
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {c}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Smart Automation & Chimes */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
            Automation & Audio Feedback
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Auto Start Breaks */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition">
              <input
                type="checkbox"
                checked={autoBreaks}
                onChange={(e) => setAutoBreaks(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">
                  Auto-Start Breaks
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Begins rest period automatically when focus session completes.
                </div>
              </div>
            </label>

            {/* Auto Start Next Focus */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition">
              <input
                type="checkbox"
                checked={autoNextFocus}
                onChange={(e) => setAutoNextFocus(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">
                  Auto-Start Focus
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Resumes study session automatically after break concludes.
                </div>
              </div>
            </label>

            {/* Sound Alert Chimes */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">
                    Audio Chimes
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Plays soft Tibetan bell when interval ends.
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => playTimerChime("focus_end")}
                className="w-fit self-end text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>Test Chime</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Browser-Native Background Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-indigo-600" />
              <span>Browser-Native Notifications (Background Alert)</span>
            </label>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                permissionStatus === "granted"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : permissionStatus === "denied"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {permissionStatus === "granted"
                ? "● Permission Granted"
                : permissionStatus === "denied"
                ? "● Permission Blocked"
                : "● Permission Required"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200/80 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Send Native System Alerts on Interval Finish</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold uppercase">
                    Tab Inactive Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
                  Pushes a native OS notification and flashes the browser tab
                  bar when your study timer ends, even if you are reading a PDF
                  in another tab or have minimized your browser.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {permissionStatus !== "granted" ? (
                  <button
                    type="button"
                    onClick={handleRequestPermission}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Enable Notifications</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-2xs transition cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {testSent ? "Alert Dispatched!" : "Test Background Alert"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {permissionStatus === "denied" && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-2">
                <BellOff className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Browser notifications are currently blocked in your browser
                  settings. To enable them, click the padlock/settings icon in
                  your browser URL bar.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleApplyPreset(PRESET_CONFIGS[0])}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Pomodoro</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
