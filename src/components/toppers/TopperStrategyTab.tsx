import React, { useState } from "react";
import { TopperProfile } from "../../types";
import {
  Trophy,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  GraduationCap,
  Filter,
  FileText,
} from "lucide-react";

interface TopperStrategyTabProps {
  toppers: TopperProfile[];
  setToppers: React.Dispatch<React.SetStateAction<TopperProfile[]>>;
}

export const TopperStrategyTab: React.FC<TopperStrategyTabProps> = ({
  toppers,
}) => {
  const [selectedTopper, setSelectedTopper] = useState<TopperProfile>(
    toppers[0]
  );
  const [optionalFilter, setOptionalFilter] = useState<string>("All");

  const optionals = [
    "All",
    ...Array.from(new Set(toppers.map((t) => t.optional))),
  ];

  const filteredToppers = toppers.filter((t) => {
    if (optionalFilter === "All") return true;
    return t.optional === optionalFilter;
  });

  const marksFields = [
    { key: "prelimsGsMarks", label: "प्रेलिम्स GS Marks", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { key: "prelimsCsatMarks", label: "प्रेलिम्स CSAT Marks", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200" },
    { key: "essayMarks", label: "Essay (P-I)", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    { key: "gs1Marks", label: "GS-I (P-II)", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { key: "gs2Marks", label: "GS-II (P-III)", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    { key: "gs3Marks", label: "GS-III (P-IV)", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
    { key: "gs4Marks", label: "GS-IV (P-V)", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Philosophy Bento Header */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-indigo-600" /> Rank 1
              Blueprint
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Decoded RAS Scoring Strategies
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Topper Strategy & Subject Masterclass
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Analyze the exact micro-strategies, answer presentation frameworks,
            notes methodology, and optional subject tactics that propelled rank
            holders to the top of the Civil Services Examination.
          </p>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col gap-2 w-full md:w-auto md:self-start md:shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-full">
            <Filter className="w-4 h-4 text-indigo-600 shrink-0" />
            <label className="text-xs text-slate-600 font-bold shrink-0">Optional:</label>
            <select
              value={optionalFilter}
              onChange={(e) => setOptionalFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2 py-1.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer flex-1 min-w-0"
            >
              {optionals.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toppers Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredToppers.map((topper) => {
          const isSelected = selectedTopper.id === topper.id;
          return (
            <div
              key={topper.id}
              onClick={() => setSelectedTopper(topper)}
              className={`cursor-pointer rounded-2xl p-5 transition-all relative border-2 ${
                isSelected
                  ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20 col-span-1 sm:col-span-2 lg:col-span-4"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={"/ranker-logo.jpg"}
                  alt={topper.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-indigo-100 shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-lg truncate">
                        {topper.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-xs shadow-sm whitespace-nowrap">
                        AIR {topper.rank}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      CSE {topper.year} • Attempt #{topper.attempt}
                    </p>
                    <p className="text-xs text-indigo-600 font-bold truncate mt-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />{" "}
                      {topper.optional}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2 self-start">
                      {topper.mainsScore && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
                          <div className="text-[9px] uppercase font-bold text-slate-400">
                            Mains
                          </div>
                          <div className="text-sm font-extrabold text-indigo-600">
                            {topper.mainsScore}
                          </div>
                        </div>
                      )}
                      {topper.interviewScore && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
                          <div className="text-[9px] uppercase font-bold text-slate-400">
                            Interview
                          </div>
                          <div className="text-sm font-extrabold text-emerald-600">
                            {topper.interviewScore}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 italic line-clamp-2">
                  "{topper.quote}"
                </div>
              )}

              {!isSelected && (
                <div className="mt-3 flex items-center justify-end text-xs font-bold text-indigo-600 gap-1">
                  <span>View Strategy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}

              {/* INLINE EXPANDED CONTENT */}
              {isSelected && (
                <div
                  className="mt-5 pt-5 border-t border-slate-200 cursor-default animate-in fade-in slide-in-from-top-2 duration-300 space-y-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quote Section */}
                  <p className="text-sm text-slate-600 italic font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{topper.quote}"
                  </p>

                  <div className="text-sm text-slate-700">
                    <span className="font-bold">Background:</span>{" "}
                    {topper.background}
                  </div>

                  {/* Main Details - Marks Section */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-4">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Main Details — Exam Marks</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {marksFields.map((field) => {
                        const value = topper.mainDetails?.[field.key as keyof NonNullable<TopperProfile['mainDetails']>] || '—';
                        return (
                          <div
                            key={field.key}
                            className={`${field.bg} ${field.border} border rounded-xl p-3 text-center shadow-xs`}
                          >
                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 leading-tight">
                              {field.label}
                            </div>
                            <div className={`text-lg font-extrabold ${field.color}`}>
                              {value}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Golden Rules Bento Box */}
                  {topper.goldenRules.length > 0 && (
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5 mb-3">
                        <Flame className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                        <span>Core Golden Rules by {topper.name}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topper.goldenRules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-indigo-100 shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-medium">
                              {rule}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Extra Data Rendering */}
                  {topper.extraData && Object.keys(topper.extraData).length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-4">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>Additional Info</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(topper.extraData).map(([key, value]) => (
                          <div key={key} className="bg-white p-3 rounded-lg border border-slate-100">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{key}</div>
                            <div className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
