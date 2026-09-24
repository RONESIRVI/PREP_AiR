import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Trophy,
  BookOpen,
  HelpCircle,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  TOPPERS_PROFILES,
  STRATEGY_SETUP,
  TOPPER_NOTES_VAULT,
} from "../data/toppersData";
import { DEFAULT_SYLLABUS } from "../data/syllabusData";
import { PYQ_DATABASE } from "../data/pyqData";
import { MainTab, TopperSubTab, PrepSubTab } from "../types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: MainTab, subTab?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const results = useMemo(() => {
    if (!searchQuery.trim())
      return { toppers: [], strategies: [], syllabus: [], pyqs: [], notes: [] };
    const q = searchQuery.toLowerCase();

    const toppers = TOPPERS_PROFILES.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(q) ||
        (t.optional || "").toLowerCase().includes(q) ||
        (t.keyStrategy || "").toLowerCase().includes(q)
    ).slice(0, 3);

    const strategies = STRATEGY_SETUP.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.content || "").toLowerCase().includes(q)
    ).slice(0, 3);

    const syllabus = DEFAULT_SYLLABUS.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.subject || "").toLowerCase().includes(q) ||
        (s.subtopics || []).some((sub) => (sub.title || "").toLowerCase().includes(q))
    ).slice(0, 4);

    const pyqs = PYQ_DATABASE.filter(
      (p) =>
        (p.questionText || "").toLowerCase().includes(q) ||
        (p.topic || "").toLowerCase().includes(q) ||
        (p.subject || "").toLowerCase().includes(q)
    ).slice(0, 3);

    const notes = TOPPER_NOTES_VAULT.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.subject || "").toLowerCase().includes(q) ||
        (n.summary || "").toLowerCase().includes(q)
    ).slice(0, 3);

    return { toppers, strategies, syllabus, pyqs, notes };
  }, [searchQuery]);

  const totalResults =
    results.toppers.length +
    results.strategies.length +
    results.syllabus.length +
    results.pyqs.length +
    results.notes.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white border-2 border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50 gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search syllabus keywords, books, toppers, PYQs, judgements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchQuery.trim() ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Type any keyword to search across the entire PREP AiR.
              </p>
              <p className="text-xs text-slate-500">
                Popular: "Polity", "Laxmikanth", "Aditya Srivastava",
                "Wetlands", "Kesavananda", "CSAT"
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-700">
                No results found for "{searchQuery}".
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching broader keywords like 'Economy', 'Ethics', or
                'Prelims'.
              </p>
            </div>
          ) : (
            <>
              {/* Toppers Results */}
              {results.toppers.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Toppers ({results.toppers.length})</span>
                  </div>
                  {results.toppers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onNavigate("toppers", "strategy");
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>
                            {t.name} (AIR {t.rank}, {t.year})
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                            {t.optional}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                          {t.quote}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* Strategies Results */}
              {results.strategies.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Master Strategies ({results.strategies.length})</span>
                  </div>
                  {results.strategies.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigate("toppers", "books");
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-200 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{s.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                          {s.content}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* Syllabus Results */}
              {results.syllabus.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Syllabus Topics ({results.syllabus.length})</span>
                  </div>
                  {results.syllabus.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigate("prep", "syllabus");
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{s.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {s.paper}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                          {s.subtopics.join(", ")}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* PYQ Results */}
              {results.pyqs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Previous Year Questions ({results.pyqs.length})</span>
                  </div>
                  {results.pyqs.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigate("prep", "pyq");
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-200 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>
                            {p.type} {p.year} • {p.subject}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                          {p.questionText}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* Notes Vault Results */}
              {results.notes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Topper Notes & Mindmaps ({results.notes.length})
                    </span>
                  </div>
                  {results.notes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        onNavigate("toppers", "notes");
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-200 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{n.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                            {n.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                          {n.summary}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center font-medium">
          <span>Navigate using tabs or click any card</span>
          <span>PREP AiR Complete Database</span>
        </div>
      </div>
    </div>
  );
};
