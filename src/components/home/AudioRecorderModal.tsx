import React, { useState, useRef, useEffect } from "react";
import { AudioNote } from "../../types";
import { Mic, Square, Play, Pause, Save, X, Trash2 } from "lucide-react";

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: AudioNote) => void;
  syllabus: any[];
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  syllabus,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [paper, setPaper] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const resetState = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setAudioBlob(null);
    setRecordingTime(0);
    setPaper("");
    setSubject("");
    setTopic("");
    chunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone permission denied or not available.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleSave = () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const newNote: AudioNote = {
        id: `audio-${Date.now()}`,
        audioUrl: base64data,
        subject: subject.trim() || "General Note",
        topic: topic.trim() || "Untitled",
        timestamp: new Date().toISOString(),
        durationSecs: recordingTime,
      };
      onSave(newNote);
      onClose();
    };
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-600" />
            Record Audio Note
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-6">
          {/* Recording Timer & Visuals */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-mono font-black ${isRecording && !isPaused ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
              {formatTime(recordingTime)}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
              {isRecording ? (isPaused ? 'Paused' : 'Recording...') : audioBlob ? 'Recorded' : 'Ready to record'}
            </div>
          </div>

          {/* Controls */}
          {!audioBlob ? (
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <button onClick={startRecording} className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
                  <Mic className="w-7 h-7" />
                </button>
              ) : (
                <>
                  {isPaused ? (
                    <button onClick={resumeRecording} className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md hover:scale-105 transition">
                      <Play className="w-6 h-6 fill-white" />
                    </button>
                  ) : (
                    <button onClick={pauseRecording} className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition">
                      <Pause className="w-6 h-6 fill-white" />
                    </button>
                  )}
                  <button onClick={stopRecording} className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-105 transition">
                    <Square className="w-5 h-5 fill-white" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
              
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Exam / Paper</label>
                  <select
                    value={paper}
                    onChange={(e) => {
                      setPaper(e.target.value);
                      setSubject("");
                      setTopic("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Select Exam</option>
                    {Array.from(new Set(syllabus.map(t => t.paper).filter(Boolean))).map(p => (
                      <option key={p as string} value={p as string}>{p as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setTopic("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {Array.from(new Set(syllabus.filter(t => !paper || t.paper === paper).map(t => t.subject).filter(Boolean))).map(s => (
                      <option key={s as string} value={s as string}>{s as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Topic Details</label>
                  {subject ? (
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="">Select Topic</option>
                      {syllabus
                        .filter(t => (!paper || t.paper === paper) && t.subject === subject)
                        .flatMap(t => {
                          const topics = [t.title];
                          if (t.subtopics) {
                            topics.push(...t.subtopics.map((sub: any) => typeof sub === "string" ? sub : sub.title));
                          }
                          return topics;
                        })
                        .map(title => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      placeholder="Select a subject first..."
                      className="w-full bg-slate-100 border border-slate-200 text-slate-400 text-sm rounded-xl px-3 py-2 outline-none cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {audioBlob && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setAudioBlob(null);
                setRecordingTime(0);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
