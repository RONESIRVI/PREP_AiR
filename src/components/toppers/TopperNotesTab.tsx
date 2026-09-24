import React, { useState } from "react";
import { TOPPER_NOTES_VAULT } from "../../data/toppersData";
import { NoteItem } from "../../types";
import {
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  Scale,
  Share2,
  Download,
  BookOpen,
} from "lucide-react";

interface TopperNotesTabProps {
  notes?: NoteItem[];
}

export const TopperNotesTab: React.FC<TopperNotesTabProps> = ({ notes }) => {
  const vaultData = notes && notes.length > 0 ? notes : TOPPER_NOTES_VAULT;
  
  const [selectedNote, setSelectedNote] = useState<NoteItem>(
    vaultData[0] || TOPPER_NOTES_VAULT[0]
  );
  const [filterType, setFilterType] = useState<string>("All");

  const types = [
    "All",
    "Framework / Template",
    "Supreme Court Verdicts",
    "Diagram / Mindmap",
  ];

  const filteredNotes = vaultData.filter((n) => {
    if (filterType === "All") return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" /> High-Yield
                Notes Vault
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Micro-Diagrams & Frameworks
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Topper Micro-Notes & Diagram Cheatsheets
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Pre-built visual frameworks, Supreme Court case law matrices, and
              standard introduction-body-conclusion diagram templates to
              integrate into Mains answer copies.
            </p>
          </div>

          {/* Filter Bento Box */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0 shadow-sm">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-900 text-xs font-bold outline-none cursor-pointer"
            >
              {types.map((t) => (
                <option
                  key={t}
                  value={t}
                  className="bg-white text-slate-900 font-medium"
                >
                  {t === "All" ? "All Formats" : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes List & Preview Split Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Note List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Cheatsheet
          </h3>
          <div className="space-y-2.5">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                      {note.paper}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {note.type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
                    {note.summary}
                  </p>

                  <div className="text-[11px] text-indigo-600 font-bold mt-2">
                    Source: {note.topperSource}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual Note Inspector Bento Card */}
        {selectedNote ? (
          <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  {selectedNote.paper}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  {selectedNote.subject}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1.5">
                {selectedNote.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Curated from:{" "}
                <strong className="text-indigo-600">
                  {selectedNote.topperSource}
                </strong>
              </p>
            </div>

            <div className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-xs">
              {selectedNote.type}
            </div>
          </div>

          {/* Core Summary Bento Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-indigo-600">Core Utility: </span>
            {selectedNote.summary}
          </div>

          {/* Interactive SVG Diagram Visualizer Bento Box */}
          {selectedNote.svgDiagramType === "pestle" && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Universal PESTLE Decision Matrix
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
                {[
                  {
                    label: "P - Political",
                    desc: "Articles, Federalism, Institutions",
                    color: "border-sky-200 bg-sky-50 text-sky-800",
                  },
                  {
                    label: "E - Economic",
                    desc: "GDP, Fiscal, MSMEs, Inflation",
                    color: "border-emerald-200 bg-emerald-50 text-emerald-800",
                  },
                  {
                    label: "S - Social",
                    desc: "Women, Vulnerable, Health, Edu",
                    color: "border-purple-200 bg-purple-50 text-purple-800",
                  },
                  {
                    label: "T - Technological",
                    desc: "AI, DPI, Cybersecurity, R&D",
                    color: "border-amber-200 bg-amber-50 text-amber-800",
                  },
                  {
                    label: "L - Legal",
                    desc: "Acts, SC Rulings, Tribunals",
                    color: "border-rose-200 bg-rose-50 text-rose-800",
                  },
                  {
                    label: "E - Environmental",
                    desc: "COP, Biodiversity, Disaster",
                    color: "border-teal-200 bg-teal-50 text-teal-800",
                  },
                ].map((node, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border-2 ${node.color} text-center space-y-1 shadow-xs`}
                  >
                    <div className="font-extrabold text-xs">{node.label}</div>
                    <div className="text-[10px] opacity-90 font-medium">
                      {node.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedNote.svgDiagramType === "ethics-matrix" && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                7-Step Case Study Algorithm
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  "1. Direct & Indirect Stakeholders",
                  "2. Core Ethical Dilemmas",
                  "3. Constitutional Values & Nolan Principles",
                  "4. Evaluation of 3 Realistic Options",
                  "5. Justification of Chosen Course",
                  "6. Step-by-Step Administrative SOP",
                  "7. Long-Term Preventive Reforms",
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center gap-2 shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0 border border-indigo-100">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedNote.svgDiagramType === "economy-cycle" && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-center">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Economic Survey Virtuous Growth Flywheel
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-bold">
                  Public Capex
                </span>
                <span className="text-indigo-600 font-black">➔</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  Private Crowding-in
                </span>
                <span className="text-indigo-600 font-black">➔</span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-bold">
                  Job Creation
                </span>
                <span className="text-indigo-600 font-black">➔</span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                  Aggregate Demand
                </span>
                <span className="text-indigo-600 font-black">➔</span>
                <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold">
                  Viksit Bharat 2047
                </span>
              </div>
            </div>
          )}

          {/* Key Bullet Points Bento Area */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Key Points to Write in Exam Copy</span>
            </h4>

            <div className="space-y-2">
              {selectedNote.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 italic">
            No notes available to preview.
          </div>
        )}
      </div>
    </div>
  );
};
