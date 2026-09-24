import React, { useState, useRef, useEffect } from "react";
import { TopperSubTab, TopperRoutine, TopperProfile } from "../../types";
import { TopperStrategyTab } from "./TopperStrategyTab";
import { TopperStrategySetupTab } from "./TopperStrategySetupTab";
import { TopperRoutineTab } from "./TopperRoutineTab";
import { TopperNotesTab } from "./TopperNotesTab";
import { MindmapsGalleryTab } from "../prep/MindmapsGalleryTab";
import { TopperCopiesTab } from "./TopperCopiesTab";
import { TopperInterviewsTab } from "./TopperInterviewsTab";
import {
  Trophy,
  BookOpen,
  Clock,
  FileText,
  Users,
  ChevronDown,
  Check,
  Award,
  Sparkles,
  Layers,
} from "lucide-react";

interface ToppersSectionProps {
  activeSubTab: TopperSubTab;
  setActiveSubTab: (subTab: TopperSubTab) => void;
  strategies: import("../../types").StrategySetupItem[];
  onAdoptRoutine: (routine: TopperRoutine) => void;
  toppers: TopperProfile[];
  setToppers: React.Dispatch<React.SetStateAction<TopperProfile[]>>;
  routines?: import("../../types").TopperRoutine[];
  setRoutines?: React.Dispatch<React.SetStateAction<import("../../types").TopperRoutine[]>>;
  audioNotes: import("../../types").AudioNote[];
  setAudioNotes: React.Dispatch<React.SetStateAction<import("../../types").AudioNote[]>>;
  notes?: import("../../types").NoteItem[];
}

export const ToppersSection: React.FC<ToppersSectionProps> = ({
  activeSubTab,
  setActiveSubTab,
  strategies,
  onAdoptRoutine,
  toppers,
  setToppers,
  routines,
  setRoutines,
  audioNotes,
  setAudioNotes,
  notes,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subTabOptions: {
    key: TopperSubTab;
    label: string;
    description: string;
    icon: any;
    badge: string;
    color: string;
  }[] = [
    {
      key: "strategy",
      label: "Toppers प्रोफ़ाइल",
      description:
        "AIR 1 preparation roadmaps, phase breakdown & paper-wise blueprints",
      icon: Trophy,
      badge: "Rank 1 Roadmaps",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      key: "books",
      label: "Strategy & Blueprints",
      description: "Standard Prelims & Mains booklist recommended by toppers",
      icon: BookOpen,
      badge: `${strategies.length} Strategies`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      key: "routine",
      label: "Routines & Timetables",
      description:
        "Daily hourly study timetables of toppers (Full-time & Working)",
      icon: Clock,
      badge: `${routines?.length || 0} Schedules`,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      key: "notes",
      label: "Mindmaps & Notes Gallery",
      description:
        "Handwritten toppers notes, micro-diagrams & GS 1-4 high-yield mindmaps",
      icon: FileText,
      badge: `${notes?.length || 0} Notes`,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      key: "copies",
      label: "Topper Copies (PDFs)",
      description: "Answer sheets & evaluated copies of Toppers directly from Drive",
      icon: Layers,
      badge: "PDF Gallery",
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      key: "interviews",
      label: "Interview Transcripts",
      description:
        "Personality Test transcripts, DAF grilling & board panel insights",
      icon: Users,
      badge: "AIR 1-50 Q&A",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  const currentOption =
    subTabOptions.find((t) => t.key === activeSubTab) || subTabOptions[0];
  const CurrentIcon = currentOption.icon;

  // Close dropdown on click outside
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
      {/* Top Navigation Bar with Interactive Dropdown & Fast Pill Switcher */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Dropdown Selector */}
          <div className="relative flex-1 max-w-md" ref={dropdownRef}>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-600" />
              <span>Select Toppers' Resource Dropdown:</span>
            </label>

            {/* Custom Interactive Dropdown Button */}
            <button
              id="toppers-module-dropdown-button"
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

            {/* Native Mobile Fallback Select (Accessible for fast navigation) */}
            <select
              id="toppers-module-native-select"
              aria-label="Select Topper Blueprint"
              value={activeSubTab}
              onChange={(e) => setActiveSubTab(e.target.value as TopperSubTab)}
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
                  <span>
                    Toppers' Vault Blueprints ({subTabOptions.length})
                  </span>
                  <span className="text-[9px] font-mono text-indigo-600 font-bold">
                    AIR 1 Curated
                  </span>
                </div>

                {subTabOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = activeSubTab === option.key;

                  return (
                    <button
                      key={option.key}
                      id={`toppers-dropdown-opt-${option.key}`}
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

          {/* Quick Header Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified AIR 1-50 Blueprints</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Contents */}
      <div className="pt-2">
        {activeSubTab === "strategy" && <TopperStrategyTab toppers={toppers} setToppers={setToppers} />}
        {activeSubTab === "books" && (
          <TopperStrategySetupTab strategies={strategies} toppers={toppers} />
        )}
        {activeSubTab === "routine" && (
          <TopperRoutineTab onAdoptRoutine={onAdoptRoutine} routines={routines} setRoutines={setRoutines} />
        )}
        {activeSubTab === "notes" && <MindmapsGalleryTab />}
        {activeSubTab === "copies" && <TopperCopiesTab />}
        {activeSubTab === "interviews" && <TopperInterviewsTab audioNotes={audioNotes} setAudioNotes={setAudioNotes} />}
      </div>
    </div>
  );
};
