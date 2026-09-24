import React, { useState } from "react";
import { PYQQuestion } from "../../types";
import { PYQ_DATABASE } from "../../data/pyqData";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Layers,
  Filter,
  Edit3,
  Award,
  Plus,
  Trash2,
} from "lucide-react";

interface PYQTabProps {
  pyqs?: PYQQuestion[];

  onAddPYQ?: (pyq: PYQQuestion) => void;
  onDeletePYQ?: (id: string) => void;
  onResetDefaultPYQs?: () => void;
  syllabus: SyllabusTopic[];
}

export const PYQTab: React.FC<PYQTabProps> = ({
  pyqs = PYQ_DATABASE,

  onAddPYQ,
  onDeletePYQ,
  onResetDefaultPYQs,
  syllabus,
}) => {
  const [selectedType, setSelectedType] = useState<"All" | "Prelims" | "Mains">(
    "All"
  );
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // State to hold user choices for prelims questions
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  // Modal for Add Custom PYQ
  const [showAddModal, setShowAddModal] = useState(false);
  const [formType, setFormType] = useState<"Prelims" | "Mains">("Prelims");
  const [formYear, setFormYear] = useState<number>(2024);
  const [formPaper, setFormPaper] = useState("Prelims GS1");
  const [formSubject, setFormSubject] = useState("राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत");
  const [formTopic, setFormTopic] = useState("");
  const [formQuestionText, setFormQuestionText] = useState("");
  const [formOptA, setFormOptA] = useState("");
  const [formOptB, setFormOptB] = useState("");
  const [formOptC, setFormOptC] = useState("");
  const [formOptD, setFormOptD] = useState("");
  const [formCorrectOpt, setFormCorrectOpt] = useState("A");
  const [formExplanation, setFormExplanation] = useState("");
  const [formElimination, setFormElimination] = useState("");
  const [formModelOutline, setFormModelOutline] = useState("");
  const [formMarks, setFormMarks] = useState<number>(10);

  // Filter PYQ list
  const filteredPYQs = pyqs.filter((q) => {
    if (selectedType !== "All" && q.type !== selectedType) return false;
    if (selectedSubject !== "All" && q.subject !== selectedSubject)
      return false;
    if (selectedYear !== "All" && q.year.toString() !== selectedYear)
      return false;
    return true;
  });

  const subjects = Array.from(new Set(pyqs.map((q) => q.subject)));
  const years = Array.from(new Set(pyqs.map((q) => q.year))).sort(
    (a, b) => b - a
  );

  const handleSelectOption = (questionId: string, optLabel: string) => {
    if (showResults[questionId]) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optLabel }));
  };

  const handleCheckAnswer = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuestion = (questionId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setShowResults((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleCreatePYQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim()) return;

    const newQuestion: PYQQuestion = {
      id: `pyq-custom-${Date.now()}`,
      type: formType,
      year: Number(formYear) || 2024,
      paper: formPaper,
      subject: formSubject.trim() || "General Studies",
      topic: formTopic.trim() || "General Concept",
      questionText: formQuestionText.trim(),
      ...(formType === "Prelims"
        ? {
            options: [
              { label: "A", text: formOptA.trim() || "Option A" },
              { label: "B", text: formOptB.trim() || "Option B" },
              { label: "C", text: formOptC.trim() || "Option C" },
              { label: "D", text: formOptD.trim() || "Option D" },
            ],
            correctOption: formCorrectOpt as "A" | "B" | "C" | "D",
            explanation:
              formExplanation.trim() || "Refer to standard reference sources.",
            eliminationTechnique: formElimination.trim() || undefined,
          }
        : {
            marks: (formMarks || 10) as 10 | 15 | 20 | 125 | 250,
            modelAnswerOutline:
              formModelOutline.trim() ||
              "Introduction -> Key Body Points -> Conclusion",
          }),
    };

    if (onAddPYQ) {
      onAddPYQ(newQuestion);
    }

    setFormQuestionText("");
    setFormTopic("");
    setFormOptA("");
    setFormOptB("");
    setFormOptC("");
    setFormOptD("");
    setFormExplanation("");
    setFormModelOutline("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> RAS Exam
                Vault
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Authentic Past Year Questions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Previous Year Questions (PYQs) & Model Keys
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Test your conceptual elimination techniques on genuine RAS
              Prelims questions and dissect high-scoring Mains model structures.
            </p>
          </div>

          {/* Action Buttons (Add Custom PYQ & Restore Standard) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>+ Add Custom PYQ</span>
            </button>

            {onResetDefaultPYQs && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Restore standard RAS PYQ database? Custom questions will be reset."
                    )
                  ) {
                    onResetDefaultPYQs();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Restore Standard Official RAS Questions"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Restore Standard PYQs</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold">Stage:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              <option value="All">All (Prelims & Mains)</option>
              <option value="Prelims">Prelims Only (MCQs)</option>
              <option value="Mains">Mains Only (Descriptive)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-500 ml-auto font-mono text-[11px] font-medium">
            Showing{" "}
            <strong className="text-slate-900">{filteredPYQs.length}</strong>{" "}
            questions
          </span>
        </div>
      </div>

      {/* PYQ List Cards */}
      <div className="space-y-5">
        {filteredPYQs.length === 0 ? (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No questions found matching criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your own custom PYQ or practice question, or reset your
              filters.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              + Add Custom PYQ
            </button>
          </div>
        ) : (
          filteredPYQs.map((pyq, index) => {
            const isAnswered = showResults[pyq.id];
            const chosenOption = userAnswers[pyq.id];
            const correctOpt = pyq.correctOption || pyq.correctAnswer || "A";
            const isCorrect = chosenOption === correctOpt;

            return (
              <div
                key={pyq.id}
                className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition"
              >
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100">
                      RAS {pyq.type} {pyq.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {pyq.subject}
                    </span>
                    <span className="text-xs text-amber-700 font-bold">
                      • {pyq.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {pyq.marks && (
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                        {pyq.marks} Marks
                      </span>
                    )}

                    {onDeletePYQ && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this question from vault?")) {
                            onDeletePYQ(pyq.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  <span className="text-indigo-600 mr-2">Q{index + 1}.</span>
                  {pyq.questionText}
                </div>

                {/* Prelims Mode Options */}
                {pyq.type === "Prelims" && pyq.options && (
                  <div className="space-y-2 pt-2">
                    {pyq.options.map((opt) => {
                      const label = opt.label;
                      const text = opt.text;
                      const isThisSelected = chosenOption === label;
                      const isThisCorrect = correctOpt === label;

                      let optStyle =
                        "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          optStyle =
                            "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                        } else if (isThisSelected && !isCorrect) {
                          optStyle =
                            "bg-rose-50 border-rose-400 text-rose-900 line-through";
                        } else {
                          optStyle =
                            "bg-slate-50/50 border-slate-200 text-slate-400";
                        }
                      } else if (isThisSelected) {
                        optStyle =
                          "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold";
                      }

                      return (
                        <button
                          key={label}
                          onClick={() => handleSelectOption(pyq.id, label)}
                          disabled={isAnswered}
                          className={`w-full p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm flex items-start gap-3 transition shadow-xs cursor-pointer ${optStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-slate-700 shadow-2xs">
                            {label}
                          </span>
                          <span className="leading-relaxed">{text}</span>
                        </button>
                      );
                    })}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-600 font-medium">
                        {isAnswered
                          ? isCorrect
                            ? "✅ Correct Answer (+2.0 Marks)"
                            : "❌ Incorrect (-0.66 Negative Mark)"
                          : chosenOption
                          ? "Option selected. Ready to check."
                          : "Select an option to evaluate."}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isAnswered ? (
                          <button
                            onClick={() => handleCheckAnswer(pyq.id)}
                            disabled={!chosenOption}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm cursor-pointer"
                          >
                            Check Solution
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetQuestion(pyq.id)}
                            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold border border-slate-200 shadow-xs transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Explanation & Elimination logic */}
                    {isAnswered && (
                      <div className="mt-3 space-y-2.5 animate-in fade-in duration-200">
                        {pyq.explanation && (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                            <strong className="text-indigo-950 block mb-1 font-bold">
                              Official RAS Explanation & Concept:
                            </strong>
                            {pyq.explanation}
                          </div>
                        )}

                        {pyq.eliminationTechnique && (
                          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5 font-medium">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold block">
                                Smart Elimination Strategy:
                              </strong>
                              {pyq.eliminationTechnique}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Mains Mode Descriptive Layout */}
                {pyq.type === "Mains" && (
                  <div className="space-y-4 pt-2">
                    {pyq.modelAnswerOutline && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>High-Scoring Model Answer Structure</span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                          {pyq.modelAnswerOutline}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        Practice writing a 150/250-word answer on paper.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Add Custom PYQ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Add Custom Practice / PYQ Question
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePYQ} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold"
                  >
                    <option value="Prelims">Prelims (MCQ)</option>
                    <option value="Mains">Mains (Descriptive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paper / Exam
                  </label>
                  <input
                    type="text"
                    list="pyq-paper-options"
                    value={formPaper}
                    onChange={(e) => {
                      setFormPaper(e.target.value);
                      setFormSubject("");
                    }}
                    placeholder="Type or select a paper..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="pyq-paper-options">
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
                    list="pyq-subject-options"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Polity, History, Economy, Optional"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="pyq-subject-options">
                    {Array.from(
                      new Set(
                        syllabus
                          .filter((t) => !formPaper || t.paper === formPaper)
                          .map((t) => t.subject)
                          .filter(Boolean)
                      )
                    ).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic / Theme
                </label>
                <input
                  type="text"
                  placeholder="e.g. Due Process of Law / Fiscal Deficit"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question Statement *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the complete question text..."
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {formType === "Prelims" ? (
                <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-800">
                    Multiple Choice Options
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option (A)"
                      value={formOptA}
                      onChange={(e) => setFormOptA(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Option (B)"
                      value={formOptB}
                      onChange={(e) => setFormOptB(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Option (C)"
                      value={formOptC}
                      onChange={(e) => setFormOptC(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Option (D)"
                      value={formOptD}
                      onChange={(e) => setFormOptD(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700">
                      Correct Option:
                    </label>
                    {(["A", "B", "C", "D"] as const).map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-1 text-xs font-bold cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          value={opt}
                          checked={formCorrectOpt === opt}
                          onChange={() => setFormCorrectOpt(opt)}
                        />
                        <span>({opt})</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Explanation
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Explain why the option is correct..."
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Elimination Technique (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extreme words rule / statement linkage..."
                      value={formElimination}
                      onChange={(e) => setFormElimination(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Marks
                      </label>
                      <select
                        value={formMarks}
                        onChange={(e) => setFormMarks(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold"
                      >
                        <option value={10}>10 Marks (150 words)</option>
                        <option value={15}>15 Marks (250 words)</option>
                        <option value={20}>20 Marks (Ethics Case Study)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Model Answer Outline
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Introduction (Context/Definition) &#10;• Dimension 1: Key Arguments&#10;• Dimension 2: Way Forward&#10;• Conclusion"
                      value={formModelOutline}
                      onChange={(e) => setFormModelOutline(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none font-medium"
                    />
                  </div>
                </div>
              )}

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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
