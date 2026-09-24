import React, { useState, useRef, useEffect } from "react";
import {
  AnalyticsSubTab,
  SyllabusTopic,
  StudySessionLog,
  MockTestLog,
  WeakAreaItem,
  UserProfile,
} from "../../types";
import { ProgressTab } from "./ProgressTab";
import { PerformanceTab } from "./PerformanceTab";
import { WeakAreasTab } from "./WeakAreasTab";
import { GapAnalysisTab } from "./GapAnalysisTab";
import { RankBenchmarkTab } from "./RankBenchmarkTab";
import { AnalyticsExportModal } from "./AnalyticsExportModal";
import {
  TrendingUp,
  BarChart2,
  AlertTriangle,
  Scale,
  Trophy,
  ChevronDown,
  Check,
  Layers,
  Award,
  Download,
} from "lucide-react";

interface AnalyticsSectionProps {
  userProfile?: UserProfile;
  activeSubTab: AnalyticsSubTab;
  setActiveSubTab: (subTab: AnalyticsSubTab) => void;
  syllabus: SyllabusTopic[];
  sessionLogs: StudySessionLog[];
  studyStreak: number;
  mockLogs: MockTestLog[];
  onAddMockLog: (log: MockTestLog) => void;
  onDeleteMockLog: (id: string) => void;
  weakAreas: WeakAreaItem[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  userProfile,
  activeSubTab,
  setActiveSubTab,
  syllabus,
  sessionLogs,
  studyStreak,
  mockLogs,
  onAddMockLog,
  onDeleteMockLog,
  weakAreas,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subTabOptions: {
    key: AnalyticsSubTab;
    label: string;
    description: string;
    icon: any;
    badge: string;
    color: string;
  }[] = [
    {
      key: "progress",
      label: "Progress Dashboard",
      description:
        "Real-time syllabus completion %, study streaks, and study logs export",
      icon: TrendingUp,
      badge: `${syllabus.length} Topics`,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      key: "performance",
      label: "Performance & Mocks",
      description:
        "Mock test score tracker, negative marks analysis & accuracy trends",
      icon: BarChart2,
      badge: `${mockLogs.length} Tests`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      key: "weak-areas",
      label: "Weak Areas Heatmap",
      description:
        "Identified high-negative topics & AI diagnostic recovery blueprints",
      icon: AlertTriangle,
      badge: `${weakAreas.length} Areas`,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      key: "gap-analysis",
      label: "Effort Gap Analysis",
      description: "RAS weightage vs actual study hours parity analysis",
      icon: Scale,
      badge: "Weightage vs Hours",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      key: "rank-benchmark",
      label: "Rank Benchmark & Cutoffs",
      description:
        "Yearly Prelims & Mains RAS official cutoffs and topper marks benchmark",
      icon: Trophy,
      badge: "AIR 1 Cutoffs",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  const currentOption =
    subTabOptions.find((t) => t.key === activeSubTab) || subTabOptions[0];
  const CurrentIcon = currentOption.icon;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar with Interactive Dropdown Selector */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Dropdown Selector */}
          <div className="relative flex-1 max-w-md" ref={dropdownRef}>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-600" />
              <span>Select Analytics View:</span>
            </label>

            {/* Interactive Dropdown Button */}
            <button
              id="analytics-module-dropdown-button"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-300 hover:border-indigo-500 text-slate-900 font-bold text-xs transition cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg border ${currentOption.color} shrink-0`}
                >
                  <CurrentIcon className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-2">
                    <span>{currentOption.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-100">
                      {currentOption.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal truncate hidden sm:block">
                    {currentOption.description}
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${
                  dropdownOpen ? "rotate-180 text-indigo-600" : ""
                }`}
              />
            </button>

            {/* Native Mobile Fallback Select (Accessible) */}
            <select
              id="analytics-module-native-select"
              aria-label="Select Analytics View"
              value={activeSubTab}
              onChange={(e) =>
                setActiveSubTab(e.target.value as AnalyticsSubTab)
              }
              className="sr-only"
            >
              {subTabOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label} ({opt.badge})
                </option>
              ))}
            </select>

            {/* Dropdown Popover Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Analytics Modules ({subTabOptions.length})</span>
                  <span className="text-[9px] font-mono text-indigo-600 font-bold">
                    Deep Telemetry
                  </span>
                </div>

                {subTabOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = activeSubTab === option.key;

                  return (
                    <button
                      key={option.key}
                      id={`analytics-dropdown-opt-${option.key}`}
                      onClick={() => {
                        setActiveSubTab(option.key);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/80 border border-indigo-200 text-indigo-950 shadow-2xs font-bold"
                          : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg border ${option.color} shrink-0 shadow-2xs`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-2">
                            <span>{option.label}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              {option.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal truncate">
                            {option.description}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Header Action Buttons & Stats */}
          <div className="flex items-center gap-2">
            {/* Export Comprehensive Analytics (PDF / Image) Button */}
            <button
              id="analytics-export-report-btn"
              type="button"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs transition shadow-md shadow-indigo-600/20 cursor-pointer"
              title="Export performance gap data and progress trends as a PDF or high-res Image with visual heatmap"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export Report (PDF / Image)</span>
            </button>

            <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs hidden lg:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 font-medium">Telemetry:</span>
              <span className="font-extrabold text-indigo-700">
                {currentOption.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Contents */}
      {activeSubTab === "progress" && (
        <ProgressTab
          syllabus={syllabus}
          sessionLogs={sessionLogs}
          studyStreak={studyStreak}
          mockLogs={mockLogs}
          onOpenExportReport={() => setShowExportModal(true)}
        />
      )}

      {activeSubTab === "performance" && (
        <PerformanceTab
          syllabus={syllabus}
          mockLogs={mockLogs}
          onAddMockLog={onAddMockLog}
          onDeleteMockLog={onDeleteMockLog}
          onOpenExportReport={() => setShowExportModal(true)}
        />
      )}

      {activeSubTab === "weak-areas" && (
        <WeakAreasTab
          weakAreas={weakAreas}
          sessionLogs={sessionLogs}
          syllabus={syllabus}
          mockLogs={mockLogs}
          onOpenExportReport={() => setShowExportModal(true)}
        />
      )}

      {activeSubTab === "gap-analysis" && (
        <GapAnalysisTab
          syllabus={syllabus}
          sessionLogs={sessionLogs}
          onOpenExportReport={() => setShowExportModal(true)}
        />
      )}

      {activeSubTab === "rank-benchmark" && <RankBenchmarkTab />}

      {/* Analytics Export Modal */}
      <AnalyticsExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        userProfile={userProfile}
        syllabus={syllabus}
        sessionLogs={sessionLogs}
        studyStreak={studyStreak}
        mockLogs={mockLogs}
        weakAreas={weakAreas}
      />
    </div>
  );
};
