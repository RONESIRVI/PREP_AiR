import React, { useState, useEffect } from "react";
import { DailyTask, StudySessionLog, SyllabusTopic } from "../../types";
import { X, Save, BookOpen, Clock, Layers, Type } from "lucide-react";

interface TaskLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: DailyTask | null;
  syllabus: SyllabusTopic[];
  onSave: (log: StudySessionLog) => void;
}

export const TaskLoggerModal: React.FC<TaskLoggerModalProps> = ({
  isOpen,
  onClose,
  task,
  syllabus,
  onSave,
}) => {
  const [paper, setPaper] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [amountStudied, setAmountStudied] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [taskType, setTaskType] = useState<"study" | "revision" | "pyq" | "notes" | "answer_writing">("study");

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60;
    return diff;
  };
  
  const durationMinutes = calculateDuration(startTime, endTime);

  // Show only started syllabus subjects/topics for logging
  const activeSyllabus = syllabus.filter(t => t.status !== "not_started");

  // Extract unique papers, subjects, and topics from activeSyllabus
  const uniquePapers = Array.from(new Set(activeSyllabus.map((s) => s.paper))).filter(Boolean);
  
  const subjectsForPaper = Array.from(
    new Set(activeSyllabus.filter((s) => !paper || s.paper === paper).map((s) => s.subject))
  ).filter(Boolean);
  
  const topicsForSubject = Array.from(
    new Set(
      activeSyllabus
        .filter((s) => (!paper || s.paper === paper) && (!subject || s.subject === subject))
        .map((s) => s.title)
    )
  ).filter(Boolean);

  useEffect(() => {
    if (task) {
      // Try to match task info to prefill the form
      let matchedSubject = task.subject || "";
      let matchedPaper = "";
      
      if (matchedSubject) {
        const match = syllabus.find(s => s.subject === matchedSubject);
        if (match) matchedPaper = match.paper;
      } else {
        const match = syllabus.find(s => s.title === task.title);
        if (match) {
          matchedSubject = match.subject;
          matchedPaper = match.paper;
        }
      }
      
      setPaper(matchedPaper);
      setSubject(matchedSubject);
      setTopic(task.title || "");
      setTaskType(task.type === "revision" ? "revision" : "study");
      
      // Auto duration based on timeSlot if possible
      let initialStart = "";
      let initialEnd = "";
      if (task.timeSlot) {
        try {
           const parts = task.timeSlot.split("-").map(p => p.trim());
           if (parts.length === 2) {
              const parseTime = (t: string) => {
                 const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                 if (match) {
                    let h = parseInt(match[1]);
                    const m = match[2];
                    const ampm = match[3]?.toUpperCase();
                    if (ampm === "PM" && h < 12) h += 12;
                    if (ampm === "AM" && h === 12) h = 0;
                    return `${h.toString().padStart(2, "0")}:${m}`;
                 }
                 return "";
              };
              initialStart = parseTime(parts[0]);
              initialEnd = parseTime(parts[1]);
           }
        } catch(e) {}
      }
      
      if (!initialStart || !initialEnd) {
         const now = new Date();
         initialEnd = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
         now.setHours(now.getHours() - 1);
         initialStart = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      }
      
      setStartTime(initialStart);
      setEndTime(initialEnd);
      setAmountStudied("");
    }
  }, [task, syllabus]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      subject: subject || task.subject || "General",
      paper: paper || "General",
      durationMinutes: durationMinutes,
      startTime,
      endTime,
      topicCovered: topic || task.title || "Study Session",
      taskType: taskType,
      qualityRating: 4, // Default
      notes: amountStudied ? `Amount Read: ${amountStudied}` : undefined,
    };
    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Log Study Session</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl mb-2">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">Task Selected</span>
            <span className="text-sm font-bold text-indigo-900">{task.timeSlot} • {task.title}</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5" /> Paper
            </label>
            <select
              value={paper}
              onChange={(e) => {
                setPaper(e.target.value);
                setSubject("");
                setTopic("");
              }}
              className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
            >
              <option value="">-- Select Paper --</option>
              {uniquePapers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Subject
            </label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setTopic("");
              }}
              className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
            >
              <option value="">-- Select Subject --</option>
              {subjectsForPaper.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1.5">
              <Type className="w-4 h-4 text-indigo-500" /> Topic / Subtopic
            </label>
            {topicsForSubject.length > 0 ? (
               <select
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
               >
                 <option value="">-- Select Topic --</option>
                 {topicsForSubject.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            ) : (
               <input
                 type="text"
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 placeholder="Enter topic manually..."
                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2"
               />
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1">
              Task Type
            </label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2"
            >
              <option value="study">Study</option>
              <option value="revision">Revision</option>
              <option value="pyq">PYQ</option>
              <option value="notes">Notes Making</option>
              <option value="answer_writing">Answer Writing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1">
                 Start Time
               </label>
               <input
                 type="time"
                 value={startTime}
                 onChange={(e) => setStartTime(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2"
               />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1">
                 End Time
               </label>
               <div className="relative">
                 <input
                   type="time"
                   value={endTime}
                   onChange={(e) => setEndTime(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 pr-12"
                 />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                   {durationMinutes}m
                 </span>
               </div>
             </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1">
              Amount Studied (Optional)
            </label>
            <input
              type="text"
              value={amountStudied}
              onChange={(e) => setAmountStudied(e.target.value)}
              placeholder="e.g. 15 Pages, Ch-3"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={durationMinutes <= 0 || !subject || !topic}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Session
          </button>
        </div>
      </div>
    </div>
  );
};
