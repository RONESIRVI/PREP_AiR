import React, { useState } from "react";
import { SyllabusTopic } from "../../types";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Layers,
  Flame,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Plus,
  Trash2,
  RotateCcw,
  BookMarked,
  StickyNote,
} from "lucide-react";

interface SyllabusTabProps {
  syllabus: SyllabusTopic[];
  onUpdateTopicStatus: (
    topicId: string,
    nextStatus: SyllabusTopic["status"]
  ) => void;
  onUpdateMicroTopicStatus?: (
    topicId: string,
    subtopicIndex: number,
    nextStatus: SyllabusTopic["status"]
  ) => void;

  onAddTopic?: (topic: SyllabusTopic) => void;
  onDeleteTopic?: (topicId: string) => void;
  onResetDefaultSyllabus?: () => void;
  onNavigateToNotes?: (topic?: SyllabusTopic) => void;
}

export const SyllabusTab: React.FC<SyllabusTabProps> = ({
  syllabus,
  onUpdateTopicStatus,
  onUpdateMicroTopicStatus,
  onAddTopic,
  onDeleteTopic,
  onResetDefaultSyllabus,
  onNavigateToNotes,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // New Custom Topic Modal / Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPaper, setNewPaper] =
    useState<SyllabusTopic["paper"]>("Prelims GS1");
  const [newSubject, setNewSubject] = useState("राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत");
  const [newModule, setNewModule] = useState("");
  const [newYield, setNewYield] =
    useState<SyllabusTopic["yield"]>("🔥 High Yield");
  const [newSubtopicsInput, setNewSubtopicsInput] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const papers = React.useMemo(() => {
    const p = new Set<string>();
    syllabus.forEach(t => {
      if (t.paper) p.add(t.paper);
    });
    return ["All", ...Array.from(p)];
  }, [syllabus]);

  const subjects = React.useMemo(() => {
    const s = new Set<string>();
    syllabus.forEach(t => {
      if ((selectedPaper === "All" || t.paper === selectedPaper) && t.subject) {
        s.add(t.subject);
      }
    });
    return ["All", ...Array.from(s)];
  }, [syllabus, selectedPaper]);

  const filteredTopics = syllabus.filter((t) => {
    if (selectedPaper !== "All" && t.paper !== selectedPaper) return false;
    if (selectedSubject !== "All" && t.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSubject = t.subject.toLowerCase().includes(q);
      const matchSubtopics = t.subtopics.some((sub) =>
        sub.title.toLowerCase().includes(q)
      );
      return matchTitle || matchSubject || matchSubtopics;
    }
    return true;
  });

  const masteredCount = syllabus.filter((t) => t.status === "mastered").length;
  const inProgressCount = syllabus.filter(
    (t) =>
      t.status === "in_progress" ||
      t.status === "revised_1" ||
      t.status === "revised_2" ||
      t.status === "revised_3" ||
      t.status === "revised_4" ||
      t.status === "revised_5"
  ).length;
  const totalCount = syllabus.length;
  const completionPercentage =
    totalCount > 0
      ? Math.round(
          ((masteredCount * 1 + inProgressCount * 0.5) / totalCount) * 100
        )
      : 0;

  const getStatusBadge = (status: SyllabusTopic["status"]) => {
    switch (status) {
      case "mastered":
        return {
          label: "Mastered",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "revised_5":
        return {
          label: "Revised (5x)",
          color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
        };
      case "revised_4":
        return {
          label: "Revised (4x)",
          color: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "revised_3":
        return {
          label: "Revised (3x)",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "revised_2":
        return {
          label: "Revised (2x)",
          color: "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "revised_1":
        return {
          label: "Revised (1x)",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "in_progress":
        return {
          label: "In Progress",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          label: "Not Started",
          color: "bg-slate-100 text-slate-600 border-slate-200",
        };
    }
  };

  const getNextStatus = (
    current: SyllabusTopic["status"]
  ): SyllabusTopic["status"] => {
    if (current === "not_started") return "in_progress";
    if (current === "in_progress") return "revised_1";
    if (current === "revised_1") return "revised_2";
    if (current === "revised_2") return "revised_3";
    if (current === "revised_3") return "revised_4";
    if (current === "revised_4") return "revised_5";
    if (current === "revised_5") return "mastered";
    return "not_started";
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const subtopics = newSubtopicsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const newTopic: SyllabusTopic = {
      id: `custom-topic-${Date.now()}`,
      paper: newPaper,
      subject: newSubject || "General Studies",
      module: newModule || newTitle,
      title: newTitle.trim(),
      yield: newYield,
      weightagePercentage: 5,
      pyqFrequencyLast5Years: 3,
      status: "not_started",
      notes: newNotes.trim() || undefined,
      subtopics: subtopics.length > 0 
        ? subtopics.map(t => ({ title: t, status: "not_started" as const })) 
        : [{ title: newTitle.trim(), status: "not_started" as const }],
    };

    if (onAddTopic) {
      onAddTopic(newTopic);
    }

    // Reset Form
    setNewTitle("");
    setNewModule("");
    setNewSubtopicsInput("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Coverage Gauge Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{" "}
                RAS Syllabus Engine
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Flexible & Customizable
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Hierarchical Syllabus Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Track official RAS syllabus micro-topics or add your own custom
              optional/mains subjects. Cycle your revisions and track your mastery.
            </p>
          </div>

          {/* Action Buttons & Progress Widget */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 min-w-[200px] shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Overall Syllabus Mastery</span>
                <span className="text-indigo-600 font-extrabold">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
                <span>{masteredCount} Mastered</span>
                <span>{inProgressCount} Active</span>
                <span>{totalCount - masteredCount - inProgressCount} Left</span>
              </div>
            </div>


          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search micro-topics, concepts, acts, or articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs whitespace-nowrap"
            >
              {papers.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All Papers / Exams" : p}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs whitespace-nowrap max-w-[200px] truncate"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Subjects" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Custom Syllabus Topic Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Add Syllabus Topic / Module
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fundamental Rights (Articles 12-35) or Ethics Case Studies"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Paper / Exam
                  </label>
                  <input
                    type="text"
                    list="new-paper-options"
                    value={newPaper}
                    onChange={(e) => setNewPaper(e.target.value)}
                    placeholder="Type or select a paper..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="new-paper-options">
                    {Array.from(new Set(syllabus.map((t) => t.paper).filter(Boolean))).map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    list="new-subject-options"
                    placeholder="e.g. Polity, History, Economy, Optional"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="new-subject-options">
                    {Array.from(
                      new Set(
                        syllabus
                          .filter((t) => !newPaper || t.paper === newPaper)
                          .map((t) => t.subject)
                          .filter(Boolean)
                      )
                    ).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Module / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Constitution"
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Yield Level
                  </label>
                  <select
                    value={newYield}
                    onChange={(e) => setNewYield(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold"
                  >
                    <option value="🔥 High Yield">🔥 High Yield</option>
                    <option value="⭐ Medium Yield">⭐ Medium Yield</option>
                    <option value="📘 Standard">📘 Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Micro-Subtopics (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Right to Equality (Art 14-18)&#10;Right to Freedom (Art 19-22)&#10;Writs & Judicial Review"
                  value={newSubtopicsInput}
                  onChange={(e) => setNewSubtopicsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Strategy / Reference Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Refer Laxmikanth Ch 7 + PYQs 2018-2023"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
                >
                  Save to Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No syllabus topics found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or filter, or click "Add Custom
            Topic" to create your own syllabus modules.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
          >
            Add New Topic Now
          </button>
        </div>
      )}

      {/* Syllabus Topics Accordion List */}
      <div className="space-y-3.5">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;
          const statusInfo = getStatusBadge(topic.status);

          return (
            <div
              key={topic.id}
              className={`rounded-2xl border-2 transition-all ${
                topic.status === "mastered"
                  ? "bg-white border-emerald-300 shadow-sm"
                  : topic.status !== "not_started"
                  ? "bg-white border-indigo-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Topic Header Line */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  className="space-y-1.5 flex-1 cursor-pointer"
                  onClick={() =>
                    setExpandedTopicId(isExpanded ? null : topic.id)
                  }
                >
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100 whitespace-nowrap">
                      {topic.paper}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {topic.subject}
                    </span>
                    <span className="text-xs text-amber-700 font-bold whitespace-nowrap">
                      • {topic.yield}
                    </span>
                    {topic.pyqFrequencyLast5Years !== undefined && (
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium border border-slate-200 whitespace-nowrap">
                        ~{topic.pyqFrequencyLast5Years} PYQs in 5 yrs
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {topic.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {topic.module && topic.module !== '—' && (
                      <p className="text-xs text-slate-500 font-medium">{topic.module}</p>
                    )}
                    {topic.priority && (
                      <span className="text-xs text-yellow-700 font-bold bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-md">
                        {topic.priority}
                      </span>
                    )}
                    {topic.questionEstimate && (
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        ~{topic.questionEstimate} MCQ
                      </span>
                    )}
                    {topic.commonPreMains && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Pre+Mains दोनों
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center shrink-0">
                  {/* Status Toggle Cycle */}
                  <button
                    onClick={() =>
                      onUpdateTopicStatus(topic.id, getNextStatus(topic.status))
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${statusInfo.color} w-[115px] sm:w-[120px] shrink-0`}
                    title="Click to cycle completion status"
                  >
                    {topic.status === "mastered" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="whitespace-nowrap">
                      {statusInfo.label}
                    </span>
                  </button>



                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() =>
                      setExpandedTopicId(isExpanded ? null : topic.id)
                    }
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200 shadow-xs cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Micro-Subtopics Sub-tree */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 rounded-b-2xl">

                  {/* Exam Tips */}
                  {topic.examTips && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        Exam Tips
                      </div>
                      <p className="text-amber-900 leading-relaxed">{topic.examTips}</p>
                    </div>
                  )}

                  {/* User Notes */}
                  {topic.notes && (
                    <div className="text-xs text-slate-800 bg-slate-100 p-3 rounded-xl border border-slate-200">
                      <strong className="text-slate-900">📝 My Notes: </strong>
                      {topic.notes}
                    </div>
                  )}

                  {/* Meta info row */}
                  {(topic.source || topic.questionType || topic.questionEstimate) && (
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {topic.questionType && (
                        <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                          {topic.questionType}
                        </span>
                      )}
                      {topic.questionEstimate && (
                        <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                          Est. {topic.questionEstimate} MCQ
                        </span>
                      )}
                      {topic.source && (
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          📚 {topic.source}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>
                        Micro-Subtopics Breakdown ({topic.subtopics.length}{" "}
                        items)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {topic.subtopics.map((sub, index) => {
                        const microStatus = getStatusBadge(sub.status);
                        return (
                          <div
                            key={index}
                            className={`flex items-start gap-2 text-xs p-2.5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer active:scale-[0.97] ${
                              sub.status === "not_started" 
                                ? "bg-white border-slate-200 hover:border-indigo-200" 
                                : microStatus.color
                            }`}
                            onClick={() => {
                              if (onUpdateMicroTopicStatus) {
                                onUpdateMicroTopicStatus(topic.id, index, getNextStatus(sub.status));
                              }
                            }}
                          >
                            <span className={microStatus.color.split(' ')[1] + " font-bold shrink-0 mt-0.5"}>
                              {sub.status === "mastered" ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </span>
                            <span className={`flex-1 ${sub.status === "mastered" ? "line-through opacity-70" : ""}`}>
                              {sub.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-3">
                      <span>Syllabus Tracking & Revision Loop</span>
                      {onNavigateToNotes && (
                        <button
                          onClick={() => onNavigateToNotes(topic)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <StickyNote className="w-3.5 h-3.5 shrink-0" />
                          <span>View / Add Quick Notes</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
