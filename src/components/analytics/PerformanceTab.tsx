import React, { useState, useEffect } from "react";
import { MockTestLog, SyllabusTopic } from "../../types";
import {
  BarChart2,
  CheckCircle2,
  TrendingUp,
  Plus,
  Trash2,
  Award,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface PerformanceTabProps {
  syllabus: SyllabusTopic[];
  mockLogs: MockTestLog[];
  onAddMockLog: (log: MockTestLog) => void;
  onDeleteMockLog: (id: string) => void;
  onOpenExportReport?: () => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  syllabus,
  mockLogs,
  onAddMockLog,
  onDeleteMockLog,
  onOpenExportReport,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [testName, setTestName] = useState("");
  const [seriesName, setSeriesName] = useState("Insight");
  const [testType, setTestType] = useState<string>("Prelims GS1");
  const [score, setScore] = useState<number>(92);
  const [totalMarks, setTotalMarks] = useState<number>(200);
  const [accuracyPct, setAccuracyPct] = useState<number>(75);
  const [cutoffMarks, setCutoffMarks] = useState<number>(88);
  const [analysisNotes, setAnalysisNotes] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [mockTestType, setMockTestType] = useState<"Full Length" | "Topic Wise">("Topic Wise");
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [questionsAttempted, setQuestionsAttempted] = useState<number | "">("");
  const [correctCount, setCorrectCount] = useState<number | "">("");
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(2);
  const [negativeMarks, setNegativeMarks] = useState<number>(0.66);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const subjects = Array.from(new Set(syllabus.filter((t: any) => t.status !== "not_started" && t.status !== "in_progress").map((t: any) => t.subject).filter(Boolean)));
  const subtopicsForSubject = syllabus
    .filter((t: any) => t.subject === subject)
    .flatMap((t: any) => {
      const topics = [t.title];
      if (t.subtopics) {
        topics.push(...t.subtopics.map((sub: any) => typeof sub === "string" ? sub : sub.title));
      }
      return topics;
    });
  const prelimsLogs = mockLogs.filter((m) => m.type === "Prelims GS1");
  const avgPrelimsScore =
    prelimsLogs.length > 0
      ? Math.round(
          prelimsLogs.reduce((acc, l) => acc + (l.marksObtained ?? 0), 0) /
            prelimsLogs.length
        )
      : 0;

  useEffect(() => {
    // Auto-detect exam pattern based on Paper name
    if (testType.toUpperCase().includes("CSAT") || testType.toUpperCase().includes("GS2") || testType.toUpperCase().includes("GS-2") || testType.toUpperCase().includes("GS 2")) {
      setTotalQuestions(80);
    } else if (testType.toUpperCase().includes("GS1") || testType.toUpperCase().includes("GS-1") || testType.toUpperCase().includes("GS 1") || testType.toUpperCase().includes("PRELIMS")) {
      setTotalQuestions(100);
    }
  }, [testType]);

  useEffect(() => {
    if (totalQuestions > 0) {
      const newMarks = parseFloat((200 / totalQuestions).toFixed(2));
      setMarksPerQuestion(newMarks);
      setNegativeMarks(parseFloat((newMarks / 3).toFixed(2)));
    }
  }, [totalQuestions]);

  useEffect(() => {
    if (typeof questionsAttempted === "number" && typeof correctCount === "number" && questionsAttempted > 0) {
      const incorrect = questionsAttempted - correctCount;
      let calcScore = 0;
      // Flexible calculation based on user inputs
      calcScore = Math.max(0, (correctCount * marksPerQuestion) - (incorrect * negativeMarks));
      
      const calcAcc = Math.round((correctCount / questionsAttempted) * 100);
      
      setScore(parseFloat(calcScore.toFixed(2)));
      setAccuracyPct(calcAcc);
    }
  }, [questionsAttempted, correctCount, testType, marksPerQuestion, negativeMarks]);



  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    if (mockTestType === "Topic Wise" && (!subject || selectedSubtopics.length === 0)) {
      setErrorMessage("Please select a subject and at least one topic for Topic Wise test.");
      return;
    }

    if (mockTestType === "Full Length" && !testName.trim()) {
      setErrorMessage("Please enter a test title for Full Length test.");
      return;
    }

    if (questionsAttempted === "" || correctCount === "") {
      setErrorMessage("Please enter both the number of Attempted and Correct questions.");
      return;
    }

    if (questionsAttempted <= 0) {
      setErrorMessage("Please enter the number of questions attempted.");
      return;
    }

    if (questionsAttempted < correctCount) {
       setErrorMessage("Correct questions cannot exceed attempted questions.");
       return;
    }

    if (questionsAttempted > totalQuestions) {
       setErrorMessage("Attempted questions cannot exceed total questions.");
       return;
    }

    // NEW VALIDATION: Ensure the syllabus topic has reached revision
    if (mockTestType === "Topic Wise") {
      const parentTopic = syllabus.find(s => s.subject === subject);
      if (parentTopic) {
        if (parentTopic.status === "not_started" || parentTopic.status === "in_progress") {
          setErrorMessage(`Cannot log mock test! The subject "${subject}" is still in progress. Please complete studying it and move it to revision in the Syllabus Tracker first.`);
          return;
        }
      }
    }

    const autoTitle = mockTestType === "Topic Wise" && subject 
       ? `${subject} — ${selectedSubtopics.join(", ")}` 
       : testName.trim() || "Full Mock Test";

    const newLog: MockTestLog = {
      id: `mock-${Date.now()}`,
      testSeriesName: `${seriesName}: ${autoTitle}`,
      testName: autoTitle,
      testType: mockTestType,
      subject: subject,
      topic: selectedSubtopics.length > 0 ? selectedSubtopics.join(", ") : undefined,
      date: new Date().toISOString().split("T")[0],
      type: testType,
      marksObtained: score,
      totalMarks,
      cutoffScore: cutoffMarks,
      totalQuestions,
      questionsAttempted: questionsAttempted as number,
      correctCount: correctCount as number,
      incorrectCount: (questionsAttempted as number) - (correctCount as number),
      accuracyRate: (questionsAttempted as number) > 0 ? Math.round(((correctCount as number) / (questionsAttempted as number)) * 100) : accuracyPct,
      analysisNotes:
        analysisNotes ||
        "Good attempt. Need faster elimination in science & tech.",
    };
    onAddMockLog(newLog);
    setShowAddModal(false);
    setTestName("");
    setAnalysisNotes("");
    setQuestionsAttempted("");
    setCorrectCount("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-600" /> Mock Test
                Score Trajectory
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Accuracy & Cut-off Delta
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Performance & Mock Analytics
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Track your scores across VisionIAS, ForumIAS, Vajiram, and
              Insights mocks. Monitor negative marks elimination and compare
              against historical cutoffs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Mock Score</span>
            </button>
          </div>
        </div>
      </div>

      {/* Score Summary Metrics Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Prelims Score
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {avgPrelimsScore} / 200
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Safe Prelims Cutoff: ~88-92 Marks
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Accuracy Rate
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {mockLogs.length > 0
              ? `${Math.round(
                  mockLogs.reduce((acc, m) => acc + (m.accuracyRate || 70), 0) /
                    mockLogs.length
                )}%`
              : "75%"}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Target for Prelims: 70%+ with 85+ attempts
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Mocks Attempted
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">
            {mockLogs.length} Tests
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Topper recommended: 40+ Prelims mocks
          </p>
        </div>
      </div>

      {/* Visual Mock Test Performance Table */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Mock Test Log Entries</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {mockLogs.length} recorded tests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Test Title</th>
                <th className="py-3 px-4 whitespace-nowrap">Score</th>
                <th className="py-3 px-4 whitespace-nowrap">Cutoff Clearance</th>
                <th className="py-3 px-4 whitespace-nowrap">Accuracy</th>
                <th className="py-3 px-4 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((m) => {
                const obtained = m.marksObtained ?? 0;
                const cutoff = m.cutoffScore ?? 80;
                const cleared = obtained >= cutoff;
                const delta = obtained - cutoff;

                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[250px]">
                      <div className="truncate" title={m.testSeriesName || m.testName || "Mock Test"}>
                        {m.testSeriesName || m.testName || "Mock Test"}
                      </div>
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-indigo-600 text-sm whitespace-nowrap">
                      {obtained}{" "}
                      <span className="text-xs text-slate-400 font-normal">
                        / {m.totalMarks}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                          cleared
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {cleared
                          ? `+${delta.toFixed(1)} Above Cutoff`
                          : `${delta.toFixed(1)} Below Cutoff`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {m.accuracyRate ? `${m.accuracyRate}%` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap">
                      {m.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteMockLog(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-slate-100"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Mock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                Log Mock Test Score
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setErrorMessage(null); }} 
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
              >
                ×
              </button>
            </div>
            
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSaveMock} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Test Series
                  </label>
                  <select
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="Insight">Insight</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paper
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="">Select Paper</option>
                    {Array.from(new Set(syllabus.filter(t => t.status !== "not_started" && t.status !== "in_progress").map(t => t.paper).filter(Boolean))).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Type
                  </label>
                  <select
                    value={mockTestType}
                    onChange={(e) => setMockTestType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  >
                    <option value="Topic Wise">Topic Wise</option>
                    <option value="Full Length">Full Length</option>
                  </select>
                </div>
              </div>

              {mockTestType === "Topic Wise" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        setSelectedSubtopics([]);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                    >
                      <option value="">Select Subject</option>
                      {Array.from(new Set(syllabus.filter(t => (!testType || t.paper === testType) && t.status !== "not_started" && t.status !== "in_progress").map(t => t.subject).filter(Boolean))).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sub-topics
                    </label>
                    <div className="max-h-24 overflow-y-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 space-y-1">
                      {subtopicsForSubject.length === 0 ? (
                        <span className="text-xs text-slate-400">Select a subject first...</span>
                      ) : (
                        subtopicsForSubject.map((sub: string) => (
                          <label key={sub} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedSubtopics.includes(sub)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSubtopics([...selectedSubtopics, sub]);
                                } else {
                                  setSelectedSubtopics(selectedSubtopics.filter(s => s !== sub));
                                }
                              }}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-xs text-slate-700">{sub}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mockTestType === "Full Length" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Test Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Insight Prelims Mock #5"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Total Q's
                  </label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Attempted
                  </label>
                  <input
                    type="number"
                    value={questionsAttempted === "" ? "" : questionsAttempted}
                    onChange={(e) => setQuestionsAttempted(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Correct
                  </label>
                  <input
                    type="number"
                    value={correctCount === "" ? "" : correctCount}
                    onChange={(e) => setCorrectCount(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Marks per Q
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marksPerQuestion}
                    readOnly
                    className="w-full bg-slate-200/50 border border-slate-200 text-slate-500 text-xs rounded-xl px-3 py-2 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Negative per Q
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={negativeMarks}
                    readOnly
                    className="w-full bg-slate-200/50 border border-slate-200 text-slate-500 text-xs rounded-xl px-3 py-2 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={score}
                    onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Accuracy %
                  </label>
                  <input
                    type="number"
                    value={accuracyPct}
                    onChange={(e) => setAccuracyPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cutoff
                  </label>
                  <input
                    type="number"
                    value={cutoffMarks}
                    onChange={(e) =>
                      setCutoffMarks(parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Analysis & Mistakes Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lost 12 marks in Ancient History wild guesses."
                  value={analysisNotes}
                  onChange={(e) => setAnalysisNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setErrorMessage(null);
                  }}
                  className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
