import React, { useMemo } from "react";
import {
  MainTab,
  DailyTask,
  StudySessionLog,
  SyllabusTopic,
  WeakAreaItem,
  RevisionItem,
  StudyPlanPhase,
  SmartRecommendation,
  PreparationHealth,
  MockTestLog,
  UserProfile,
} from "../../types";
import { CommandCenter } from "./CommandCenter";
import { ProfileCard3D } from "./ProfileCard3D";
import { SmartAlerts } from "./SmartAlerts";
import { PreparationHealthScore } from "./PreparationHealth";
import { PersonalizedPlan } from "./PersonalizedPlan";
import { AudioRecorderModal } from "./AudioRecorderModal";
import { TaskLoggerModal } from "./TaskLoggerModal";
import { Play, Target, Mic, BookOpen, Type, Layers } from "lucide-react";

interface HomeSectionProps {
  userProfile?: UserProfile;
  onOpenProfileEdit?: () => void;
  onOpenSettings?: () => void;
  setActiveTab: (tab: MainTab) => void;
  dailyTasks: DailyTask[];
  setDailyTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
  sessionLogs: StudySessionLog[];
  syllabus: SyllabusTopic[];
  dailyGoalHours: number;
  studyStreak: number;
  weakAreas: WeakAreaItem[];
  revisionQueue: RevisionItem[];
  studyPlanPhases: StudyPlanPhase[];
  currentStudySession: {
    paper?: string;
    subject: string;
    topic: string;
    taskType: "study" | "revision" | "pyq" | "notes" | "answer_writing";
  };
  setCurrentStudySession: React.Dispatch<React.SetStateAction<{
    paper?: string;
    subject: string;
    topic: string;
    taskType: "study" | "revision" | "pyq" | "notes" | "answer_writing";
  }>>;
  mockLogs?: MockTestLog[];
  onSaveAudioNote: (note: any) => void;
  onAddSessionLog: (log: StudySessionLog) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  userProfile,
  onOpenProfileEdit,
  onOpenSettings,
  setActiveTab,
  dailyTasks,
  setDailyTasks,
  sessionLogs,
  syllabus,
  dailyGoalHours,
  studyStreak,
  weakAreas,
  revisionQueue,
  currentStudySession,
  setCurrentStudySession,
  mockLogs = [],
  onSaveAudioNote,
  onAddSessionLog,
}) => {
  const [isAudioModalOpen, setIsAudioModalOpen] = React.useState(false);
  const [isTaskLoggerOpen, setIsTaskLoggerOpen] = React.useState(false);
  const [taskToLog, setTaskToLog] = React.useState<DailyTask | null>(null);
  // Calculate total study time today
  const totalStudyTimeToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return sessionLogs
      .filter((log) => log.date === today)
      .reduce((sum, log) => sum + log.durationMinutes * 60, 0); // Convert mins to seconds for consistency
  }, [sessionLogs]);

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;

  // Compute Health Score
  const healthScore = useMemo<PreparationHealth>(() => {
    // Calculate Study Hours Score (e.g. against dailyGoalHours)
    const studyHoursScore = dailyGoalHours > 0 
      ? Math.min(100, Math.round(((totalStudyTimeToday / 3600) / dailyGoalHours) * 100))
      : 0;
    
    // Calculate Syllabus Score (Partial credits for in_progress / revised_1)
    const masteredSyllabus = syllabus.filter((s) => s.status === "mastered" || s.status === "revised_2").length;
    const partialSyllabus = syllabus.filter((s) => s.status === "in_progress" || s.status === "revised_1").length;
    const totalTopics = Math.max(syllabus.length, 1);
    
    const syllabusScore = Math.min(
      100,
      Math.round(((masteredSyllabus * 1 + partialSyllabus * 0.5) / totalTopics) * 100)
    ) || 0;

    // Target Mocks: 3 tests per subtopic in the entire syllabus
    const totalSubtopics = syllabus.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0);
    const totalTargetMocks = totalSubtopics * 3;
    const targetMocks = Math.max(1, Math.round(totalTargetMocks * (syllabusScore / 100)));
    
    // Only count mocks where score >= cutoff + 12
    const validMocksCount = mockLogs.filter(m => (m.marksObtained ?? 0) >= ((m.cutoffScore ?? 80) + 12)).length;
    const testsScore = Math.min(100, Math.round((validMocksCount / targetMocks) * 100)) || 0;
      
    const answersScore = 0; // TBD

    // The user specifically requested that the Profile overall progress should be based 
    // ENTIRELY on Total Syllabus completion.
    const overallScore = syllabusScore;

    return {
      overallScore,
      metrics: {
        studyHours: studyHoursScore,
        pyq: 0,
        revision: 0,
        tests: testsScore,
        answers: answersScore,
        syllabus: syllabusScore,
      },
    };
  }, [totalStudyTimeToday, dailyGoalHours, syllabus]);

  // SmartRecommendation logic removed as requested
  const handleToggleTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const overdueRevisions = revisionQueue.filter((r) => r.isOverdue);
  const criticalWeakAreas = weakAreas.filter((w) => w.severity === "Critical");
  const weeklyGoalRemaining = Math.max(
    0,
    40 - Math.floor(totalStudyTimeToday / 3600)
  ); // Assuming 40h weekly goal

  return (
    <div className="space-y-6">
      {/* Top Main 3D Profile Dashboard */}
      <ProfileCard3D 
        name={userProfile?.name || "AARIZ MANSURI"}
        role={userProfile?.role || "RAS Aspirant"}
        avatarUrl={userProfile?.avatarUrl}
        onOpenProfileEdit={onOpenProfileEdit}
        onOpenSettings={onOpenSettings}
        totalStudyHours={Math.floor(sessionLogs.reduce((acc, log) => acc + log.durationMinutes, 0) / 60)}
        currentStreak={studyStreak}
        completedTests={mockLogs?.length || 0}
        targetExam={userProfile?.targetExam || "RAS CSE 2027"}
        progressPercent={healthScore.overallScore}
        currentFocus={syllabus.filter(s => s.status === "in_progress").slice(0, 3).map(s => s.subject)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col gap-6">
            <SmartAlerts
              overdueRevisions={overdueRevisions}
              criticalWeakAreas={criticalWeakAreas}
              weeklyGoalRemaining={weeklyGoalRemaining}
            />
          </div>

          {/* New Start Study Session Quick Form */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Quick Start Study Session</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" /> Exam / Paper
                </label>
                <select
                  value={currentStudySession.paper || ""}
                  onChange={(e) => setCurrentStudySession(prev => ({ ...prev, paper: e.target.value, subject: "", topic: "" }))}
                  className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="">Select Exam</option>
                  {Array.from(new Set(syllabus.filter(t => t.status !== "not_started").map(t => t.paper).filter(Boolean))).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Subject
                </label>
                <select
                  value={currentStudySession.subject}
                  onChange={(e) => setCurrentStudySession(prev => ({ ...prev, subject: e.target.value, topic: "" }))}
                  className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="">Select Subject</option>
                  {Array.from(new Set(syllabus.filter(t => (!currentStudySession.paper || t.paper === currentStudySession.paper) && t.status !== "not_started").map(t => t.subject).filter(Boolean))).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-500" /> What are you doing?
                </label>
                <select
                  value={currentStudySession.taskType}
                  onChange={(e) => setCurrentStudySession(prev => ({ ...prev, taskType: e.target.value as any }))}
                  className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="study">Study New Topic</option>
                  <option value="revision">Revision</option>
                  <option value="pyq">PYQ Practice</option>
                  <option value="notes">Note Making</option>
                  <option value="answer_writing">Answer Writing</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-500" /> Topic Name
                </label>
                {currentStudySession.subject ? (
                  <select
                    value={currentStudySession.topic}
                    onChange={(e) => setCurrentStudySession(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full bg-indigo-50/40 border border-indigo-100 text-indigo-900 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">Select Topic</option>
                    {syllabus
                      .filter(t => (!currentStudySession.paper || t.paper === currentStudySession.paper) && t.subject === currentStudySession.subject && t.status !== "not_started")
                      .flatMap(t => {
                        // Include main title
                        const topics = [t.title];
                        // Include subtopics if any
                        if (t.subtopics) {
                          topics.push(...t.subtopics.map(sub => typeof sub === "string" ? sub : sub.title));
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
                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 text-xs rounded-xl px-3.5 py-2.5 outline-none font-medium cursor-not-allowed"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 ml-auto w-full sm:w-auto">
              <button
                onClick={() => setIsAudioModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold uppercase tracking-wider text-xs transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Audio Note</span>
              </button>
              <button
                onClick={() => setActiveTab("prep")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-xs shadow-md shadow-indigo-500/30 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Tracker</span>
              </button>
            </div>
          </div>

          <PreparationHealthScore 
            health={healthScore} 
            sessionLogs={sessionLogs}
            totalStudyTimeToday={totalStudyTimeToday}
          />
        </div>

        {/* Right Column (Side Panel) */}
        <div className="xl:col-span-1">
          <PersonalizedPlan
            tasks={dailyTasks}
            dailyGoalHours={dailyGoalHours}
            onToggleTask={handleToggleTask}
            onNavigateToTracker={(taskId) => {
              const task = dailyTasks.find((t) => t.id === taskId);
              if (task) {
                setTaskToLog(task);
                setIsTaskLoggerOpen(true);
              }
            }}
          />
        </div>
      </div>

      <TaskLoggerModal
        isOpen={isTaskLoggerOpen}
        onClose={() => setIsTaskLoggerOpen(false)}
        task={taskToLog}
        syllabus={syllabus}
        onSave={(log) => {
          onAddSessionLog(log);
          if (taskToLog) {
             // mark task as complete automatically
             if (!taskToLog.completed) {
               handleToggleTask(taskToLog.id);
             }
          }
        }}
      />

      <AudioRecorderModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onSave={onSaveAudioNote}
        syllabus={syllabus}
      />
    </div>
  );
};
