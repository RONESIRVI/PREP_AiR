import React, { useState } from "react";
import { RevisionItem, SyllabusTopic } from "../../types";
import {
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Flame,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

interface SpacedRevisionTabProps {
  revisionQueue: RevisionItem[];
  onCompleteRevision: (itemId: string) => void;
  onAddRevisionItem?: (item: RevisionItem) => void;
  onDeleteRevisionItem?: (itemId: string) => void;
  onResetDefaultRevisionQueue?: () => void;
  syllabus: SyllabusTopic[];
}

export const SpacedRevisionTab: React.FC<SpacedRevisionTabProps> = ({
  revisionQueue,
  onCompleteRevision,
  onAddRevisionItem,
  onDeleteRevisionItem,
  onResetDefaultRevisionQueue,
  syllabus,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<RevisionItem>(
    revisionQueue[0] || null
  );

  // Modal for Add Custom Revision Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTopicTitle, setFormTopicTitle] = useState("");
  const [formSubject, setFormSubject] = useState("राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत");
  const [formPaper, setFormPaper] = useState("Prelims GS1");
  const [formSummaryText, setFormSummaryText] = useState("");
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");

  const getIntervalLabel = (stage: number) => {
    switch (stage) {
      case 1:
        return "Day 1 (Immediate Recall)";
      case 2:
        return "Day 3 (Consolidation)";
      case 3:
        return "Day 7 (Weekly Retention)";
      case 4:
        return "Day 15 (Fortnightly Lock)";
      case 5:
        return "Day 30 (Long-Term Mastery)";
      default:
        return "Day 60+";
    }
  };

  const handleCreateRevisionCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopicTitle.trim()) return;

    const summaryPoints = formSummaryText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const newItem: RevisionItem = {
      id: `rev-custom-${Date.now()}`,
      topicId: `custom-rev-${Date.now()}`,
      topicTitle: formTopicTitle.trim(),
      subject: formSubject.trim() || "General Studies",
      paper: formPaper,
      lastStudiedDate: new Date().toISOString().split("T")[0],
      intervalStage: 1,
      nextDueDate: new Date().toISOString().split("T")[0],
      isOverdue: false,
      quickSummary:
        summaryPoints.length > 0
          ? summaryPoints
          : ["Key concept reviewed for active recall."],
      flashcardQuestions: [
        {
          q:
            formQuestion.trim() ||
            `What are the core exam-oriented points of ${formTopicTitle}?`,
          a:
            formAnswer.trim() ||
            summaryPoints.join(" | ") ||
            "Refer to standard study notes.",
        },
      ],
    };

    if (onAddRevisionItem) {
      onAddRevisionItem(newItem);
    }
    setSelectedItem(newItem);
    setFormTopicTitle("");
    setFormSummaryText("");
    setFormQuestion("");
    setFormAnswer("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-teal-600" /> Ebbinghaus
                Forgetting Curve Solution
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                1-3-7-15-30 Day Spaced Cycles
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Active Spaced Repetition Review Queue
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Without active revision, 80% of RAS information is forgotten
              within 48 hours. Review your scheduled flashcards and topic
              summaries to permanently anchor concepts into long-term memory.
            </p>
          </div>

          {/* Action Buttons (Add Custom Revision Card & Restore Standard) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+ Add Custom Card</span>
            </button>

            {onResetDefaultRevisionQueue && (
              <button
                onClick={() => {
                  if (confirm("Restore standard RAS Spaced Revision Queue?")) {
                    onResetDefaultRevisionQueue();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Restore Standard Revision Cards Queue"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Restore Standard Queue</span>
              </button>
            )}

            <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Due Today
              </div>
              <div className="text-base font-extrabold text-indigo-600 leading-tight">
                {revisionQueue.length} Topics
              </div>
            </div>
          </div>
        </div>
      </div>

      {revisionQueue.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            You have no pending spaced revision tasks for today. Continue
            covering new syllabus topics or add your custom active recall
            flashcards.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              + Add Custom Card
            </button>
            {onResetDefaultRevisionQueue && (
              <button
                onClick={onResetDefaultRevisionQueue}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                Restore Standard Queue
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Revision Items Queue */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Scheduled Queue
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {revisionQueue.length} total
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {revisionQueue.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 transition-all shadow-xs flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/30"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setSelectedItem(item);
                        setActiveCardIndex(0);
                        setShowAnswer(false);
                      }}
                      className="cursor-pointer flex-1 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.paper}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.subject}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.topicTitle}
                      </h4>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {getIntervalLabel(item.intervalStage)}
                        </span>
                      </div>
                    </div>

                    {onDeleteRevisionItem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm("Remove this card from revision queue?")
                          ) {
                            onDeleteRevisionItem(item.id);
                            if (selectedItem?.id === item.id) {
                              const remaining = revisionQueue.filter(
                                (r) => r.id !== item.id
                              );
                              setSelectedItem(remaining[0] || null);
                            }
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Active Recall Stage */}
          {selectedItem && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                {/* Active Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                        {selectedItem.paper} • {selectedItem.subject}
                      </span>
                      <span className="text-xs font-semibold text-teal-700">
                        {getIntervalLabel(selectedItem.intervalStage)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedItem.topicTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => onCompleteRevision(selectedItem.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Cycle Mastered</span>
                  </button>
                </div>

                {/* Micro Summary Checklist */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Key Conceptual Anchor Points</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {selectedItem.quickSummary.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flashcard Recall Interactive Box */}
                {selectedItem.flashcardQuestions &&
                  selectedItem.flashcardQuestions.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl p-5 border-2 border-indigo-100 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-indigo-600" />{" "}
                          Active Recall Flashcard #{activeCardIndex + 1}
                        </span>
                        <span className="font-mono text-slate-500 font-semibold">
                          Card {activeCardIndex + 1} of{" "}
                          {selectedItem.flashcardQuestions.length}
                        </span>
                      </div>

                      {/* Question Card */}
                      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Question / Prompt
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {selectedItem.flashcardQuestions[activeCardIndex]?.q}
                        </p>
                      </div>

                      {/* Reveal Button / Answer Box */}
                      {showAnswer ? (
                        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] uppercase font-bold text-emerald-800">
                              Model Key / Recall Answer
                            </div>
                            <button
                              onClick={() => setShowAnswer(false)}
                              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium">
                            {
                              selectedItem.flashcardQuestions[activeCardIndex]
                                ?.a
                            }
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAnswer(true)}
                          className="w-full py-3 bg-white hover:bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Click to Reveal Answer & Test Memory</span>
                        </button>
                      )}

                      {/* Next / Prev Flashcard Navigation */}
                      {selectedItem.flashcardQuestions.length > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <button
                            disabled={activeCardIndex === 0}
                            onClick={() => {
                              setActiveCardIndex((prev) => prev - 1);
                              setShowAnswer(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ← Previous
                          </button>
                          <button
                            disabled={
                              activeCardIndex ===
                              selectedItem.flashcardQuestions.length - 1
                            }
                            onClick={() => {
                              setActiveCardIndex((prev) => prev + 1);
                              setShowAnswer(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next Card →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Add Custom Revision Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Create Custom Revision Flashcard
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRevisionCard} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paper / Exam
                  </label>
                  <select
                    value={formPaper}
                    onChange={(e) => {
                      setFormPaper(e.target.value);
                      setFormSubject("");
                      setFormTopicTitle("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold cursor-pointer"
                  >
                    <option value="">Select Paper</option>
                    {Array.from(new Set(syllabus.map((t) => t.paper).filter(Boolean))).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => {
                      setFormSubject(e.target.value);
                      setFormTopicTitle("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {Array.from(
                      new Set(
                        syllabus
                          .filter((t) => !formPaper || t.paper === formPaper)
                          .map((t) => t.subject)
                          .filter(Boolean)
                      )
                    ).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic Title *
                </label>
                {formSubject ? (
                  <select
                    required
                    value={formTopicTitle}
                    onChange={(e) => setFormTopicTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="">Select Topic</option>
                    {syllabus
                      .filter((t) => (!formPaper || t.paper === formPaper) && t.subject === formSubject)
                      .flatMap((t) => {
                        const topics = [t.title];
                        if (t.subtopics) {
                          topics.push(
                            ...t.subtopics.map((sub) =>
                              typeof sub === "string" ? sub : sub.title
                            )
                          );
                        }
                        return topics;
                      })
                      .map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    placeholder="Select a subject first..."
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-400 outline-none cursor-not-allowed font-medium"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Summary Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Kesavananda Bharati (1973): 13-judge bench, 7:6 majority.&#10;Parliament cannot alter basic structure under Art 368."
                  value={formSummaryText}
                  onChange={(e) => setFormSummaryText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Recall Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. What constitutes the Basic Structure according to Supreme Court?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recall Answer / Key Points
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Supremacy of Constitution, Rule of law, Judicial review, Federalism, Free and fair elections, Secularism."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
                >
                  Save Revision Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
