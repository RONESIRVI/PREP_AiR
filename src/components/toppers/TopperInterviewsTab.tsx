import React, { useState } from "react";
import { TOPPER_INTERVIEWS } from "../../data/toppersData";
import { InterviewTranscript, AudioNote } from "../../types";
import {
  Users,
  MessageSquare,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Briefcase,
  Mic,
  Trash2,
  Play,
  CalendarDays,
} from "lucide-react";

interface TopperInterviewsTabProps {
  audioNotes?: AudioNote[];
  setAudioNotes?: React.Dispatch<React.SetStateAction<AudioNote[]>>;
}

export const TopperInterviewsTab: React.FC<TopperInterviewsTabProps> = ({ audioNotes = [], setAudioNotes }) => {
  const [selectedTranscript, setSelectedTranscript] =
    useState<InterviewTranscript>(TOPPER_INTERVIEWS[0]);
  const [activeDafCategory, setActiveDafCategory] = useState<string>("All");

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> RAS
                Personality Test Vault
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Score 190+ Marks in Interview
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Real Interview Transcripts & DAF Grilling Analysis
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Read authentic RAS interview board transcripts, psychological
              composure techniques, situational reaction questions, and DAF
              (Detailed Application Form) defense strategies.
            </p>
          </div>

          {/* Transcript Switcher Bento Box */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0 shadow-sm">
            <select
              value={selectedTranscript.id}
              onChange={(e) => {
                const found = TOPPER_INTERVIEWS.find(
                  (t) => t.id === e.target.value
                );
                if (found) setSelectedTranscript(found);
              }}
              className="bg-transparent text-slate-900 text-xs font-bold outline-none cursor-pointer"
            >
              {TOPPER_INTERVIEWS.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  className="bg-white text-slate-900 font-medium"
                >
                  {t.candidateName} (AIR {t.rank}, Score {t.score}/275)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audio Notes Section */}
      {audioNotes && audioNotes.length > 0 && (
        <div className="bg-white border-2 border-rose-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-800">My Recorded Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audioNotes.map((note) => (
              <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{note.subject}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{note.topic}</p>
                  </div>
                  <button
                    onClick={() => setAudioNotes?.(prev => prev.filter(n => n.id !== note.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <audio src={note.audioUrl} controls className="w-full h-8" />
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(note.timestamp).toLocaleDateString()}
                  <span>•</span>
                  {Math.floor(note.durationSecs / 60)}:{(note.durationSecs % 60).toString().padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Showcase Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs shadow-xs">
                AIR {selectedTranscript.rank} (CSE {selectedTranscript.year})
              </span>
              <span className="text-xs font-medium text-slate-500">
                Board:{" "}
                <strong className="text-slate-800">
                  {selectedTranscript.boardChairperson}
                </strong>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {selectedTranscript.candidateName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Background:{" "}
              <span className="text-slate-800 font-semibold">
                {selectedTranscript.background}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Interview Marks
              </div>
              <div className="text-base font-extrabold text-emerald-600">
                {selectedTranscript.score} / 275
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Duration
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {selectedTranscript.durationMinutes} Mins
              </div>
            </div>
          </div>
        </div>

        {/* DAF Highlights Bento Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>DAF Keywords Targeted by the Board</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTranscript.dafHighlights.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Real QA Excerpts */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>High-Stakes Dialogue & Psychological Analysis</span>
          </h4>

          <div className="space-y-4">
            {selectedTranscript.qaExcerpts.map((qa, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs"
              >
                {/* Question */}
                <div className="flex items-start gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold shrink-0 mt-0.5">
                    {qa.askedBy}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    "{qa.question}"
                  </p>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-2.5 pl-3 border-l-2 border-indigo-400">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                    "{qa.answer}"
                  </p>
                </div>

                {/* Tactical Analysis Bento Box */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                  <span className="font-bold text-emerald-700">
                    Topper Tactics & Tone Analysis:{" "}
                  </span>
                  {qa.analysis}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways Bento Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Golden Rules for the 30-Minute Personality Test</span>
          </div>
          <div className="space-y-1.5">
            {selectedTranscript.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-800 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Extra Data */}
        {selectedTranscript.extraData && Object.keys(selectedTranscript.extraData).length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Additional Info</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(selectedTranscript.extraData).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{key}</div>
                  <div className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
