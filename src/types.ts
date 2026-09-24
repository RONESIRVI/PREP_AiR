export type MainTab = "home" | "toppers" | "prep" | "analytics" | "ocr" | "ai-mentor";

export type TopperSubTab =
  | "strategy"
  | "books"
  | "routine"
  | "notes"
  | "copies"
  | "interviews";
export type PrepSubTab =
  | "syllabus"
  | "tracker"
  | "revision"
  | "mindmaps"
  | "pyq";
export type AnalyticsSubTab =
  | "progress"
  | "performance"
  | "weak-areas"
  | "gap-analysis"
  | "rank-benchmark";

export interface ActivityMap {
  [date: string]: { duration: number; sessions: number };
}

export interface UserProfile {
  name: string;
  role: string;
  targetExam: string;
  avatarUrl?: string;
}

export interface TopperProfile {
  id: string;
  name: string;
  rank: number;
  year: number;
  optional: string;
  attempt: number;
  background: string;
  avatar: string;
  quote: string;
  keyStrategy: string;
  gsStrategy: {
    gs1: string;
    gs2: string;
    gs3: string;
    gs4: string;
  };
  essayStrategy: string;
  optionalStrategy: string;
  prelimsStrategy: string;
  csatStrategy: string;
  interviewScore?: number;
  mainsScore?: number;
  goldenRules: string[];
  mainDetails?: {
    prelimsGsMarks?: string;
    prelimsCsatMarks?: string;
    essayMarks?: string;
    gs1Marks?: string;
    gs2Marks?: string;
    gs3Marks?: string;
    gs4Marks?: string;
  };
  extraData?: Record<string, string>;
}

export interface AudioNote {
  id: string;
  audioUrl: string; // Base64 data URL for persistence
  subject: string;
  topic: string;
  timestamp: string; // ISO date string
  durationSecs: number;
}


export interface StrategySetupItem {
  id: string;
  title: string;
  content: string;
  extraData?: Record<string, string>;
}

export interface RoutineSlot {
  time: string;
  activity: string;
  category:
    | "GS"
    | "Optional"
    | "Current Affairs"
    | "CSAT / Revision"
    | "Answer Writing"
    | "Break / Health";
  description: string;
}

export interface TopperRoutine {
  id: string;
  title: string;
  type:
    | "Full Time (10-12h)"
    | "Working Professional (5-6h)"
    | "College Student (4h)"
    | "Prelims Sprint (Last 60 Days)"
    | "Mains Sprint";
  topperRef: string;
  totalStudyHours: number;
  wakeUpTime: string;
  sleepTime: string;
  schedule: RoutineSlot[];
  tips: string[];
  extraData?: Record<string, string>;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  paper: string;
  topperSource: string;
  type:
    | "Diagram / Mindmap"
    | "Framework / Template"
    | "Supreme Court Verdicts"
    | "Committee Summaries"
    | "Data Bank";
  summary: string;
  keyPoints: string[];
  diagramDescription?: string;
  svgDiagramType?:
    | "pestle"
    | "constitution-flow"
    | "ethics-matrix"
    | "economy-cycle"
    | "intro-body-conclusion";
}

export interface InterviewTranscript {
  id: string;
  candidateName: string;
  year: number;
  rank: number;
  boardChairperson: string;
  score: number;
  durationMinutes: number;
  background: string;
  dafHighlights: string[];
  qaExcerpts: {
    question: string;
    askedBy: string;
    answer: string;
    analysis: string;
  }[];
  keyTakeaways: string[];
  extraData?: Record<string, string>;
}

export interface SyllabusTopic {
  id: string;
  paper:
    | "Prelims GS1"
    | "Mains GS1"
    | "Mains GS2"
    | "Mains GS3"
    | "Mains GS4"
    | "Pre Paper"
    | "Mains Paper I"
    | "Mains Paper II"
    | "Mains Paper III"
    | "Mains Paper IV"
    | string;   // allow any future paper
  subject: string;
  module: string;
  title: string;
  yield: "🔥 High Yield" | "⭐ Medium Yield" | "📘 Standard";
  weightagePercentage: number;
  pyqFrequencyLast5Years: number;
  status:
    | "not_started"
    | "in_progress"
    | "revised_1"
    | "revised_2"
    | "revised_3"
    | "revised_4"
    | "revised_5"
    | "mastered";
  notes?: string;
  subtopics: {
    title: string;
    status:
      | "not_started"
      | "in_progress"
      | "revised_1"
      | "revised_2"
      | "revised_3"
      | "revised_4"
      | "revised_5"
      | "mastered";
  }[];
  failedMockQuestions?: number;
  // RAS/RPSC Extra fields (from Excel)
  priority?: string;          // e.g. "★★★★★"
  questionEstimate?: string;  // e.g. "2-3"
  questionType?: string;      // "MCQ" | "Descriptive"
  source?: string;            // e.g. "RPSC Raj. GK"
  commonPreMains?: boolean;   // true if appears in both Pre & Mains
  examTips?: string;          // exam tip / notes from Excel
  studyGuide?: string;        // "Kya Taiyar Karen" column
  paperFullName?: string;     // full paper title
}

export interface StudyPlanPhase {
  id: string;
  phaseName: string;
  durationMonths: string;
  focusArea: string;
  status: "upcoming" | "in_progress" | "completed";
  milestones: {
    id: string;
    title: string;
    targetDate: string;
    completed: boolean;
  }[];
}

export interface StudySessionLog {
  id: string;
  date: string;
  subject: string;
  paper: string;
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
  topicCovered: string;
  taskType?: "study" | "revision" | "pyq" | "notes" | "answer_writing";
  qualityRating: 1 | 2 | 3 | 4 | 5; // 5 = High focus
  notes?: string;
}

export type TimerMode =
  | "pomodoro_25"
  | "pomodoro_50"
  | "gs_marathon_90"
  | "exam_slot_120"
  | "custom_interval"
  | "stopwatch_continuous";

export type TimerPhase = "focus" | "short_break" | "long_break";

export interface PreparationHealth {
  overallScore: number;
  metrics: {
    studyHours: number; // 0-100
    pyq: number; // 0-100
    revision: number; // 0-100
    tests: number; // 0-100
    answers: number; // 0-100
    syllabus: number; // 0-100
  };
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  type: "study" | "revision" | "pyq" | "notes" | "answer_writing";
  timeSlot?: string;
  subject?: string;
}

export interface SmartRecommendation {
  subject: string;
  topic: string;
  reason: string;
  tags: string[];
  taskId?: string;
  isFuture?: boolean;
  startTimeMinutes?: number;
}

export interface FocusTimerConfig {
  mode: TimerMode;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartNextFocus: boolean;
  soundAlertsEnabled: boolean;
  nativeNotificationsEnabled?: boolean;
}

export interface RevisionItem {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  paper: string;
  lastStudiedDate: string;
  intervalStage: 1 | 2 | 3 | 4 | 5; // Day 1, 3, 7, 15, 30
  nextDueDate: string;
  isOverdue: boolean;
  quickSummary: string[];
  flashcardQuestions: {
    q: string;
    a: string;
  }[];
}

export interface PYQQuestion {
  id: string;
  type: "Prelims" | "Mains";
  year: number;
  paper: string;
  subject: string;
  topic: string;
  questionText: string;
  // For Prelims
  options?: {
    label: "A" | "B" | "C" | "D";
    text: string;
  }[];
  correctOption?: "A" | "B" | "C" | "D";
  correctAnswer?: string;
  explanation?: string;
  eliminationTechnique?: string;
  // For Mains
  marks?: 10 | 15 | 20 | 125 | 250;
  wordLimit?: 150 | 250 | 1000;
  mainsModelAnswer?: string;
  modelAnswerOutline?: string;
  modelAnswerStructure?: {
    introduction: string;
    subheadingsAndPoints: { heading: string; points: string[] }[];
    diagramSuggestion: string;
    conclusion: string;
    recommendedKeywords: string[];
  };
}

export type PYQItem = PYQQuestion;

export interface MockTestLog {
  id: string;
  testSeriesName: string; // e.g. "Vision IAS FLT 1", "ForumIAS SFG"
  testName?: string;
  testType?: "Full Length" | "Topic Wise";
  subject?: string;
  topic?: string;
  date: string;
  type: "Prelims GS1" |  "Mains GS1" | "Mains GS2" | "Mains GS3" | "Mains GS4";
  totalMarks: number;
  marksObtained: number;
  cutoffScore: number;
  totalQuestions?: number;
  questionsAttempted?: number;
  correctCount?: number;
  incorrectCount?: number;
  accuracyRate?: number;
  analysisNotes: string;
}

export interface WeakAreaItem {
  id: string;
  subject: string;
  topic: string;
  paper: string;
  severity: "Critical" | "Moderate" | "Minor";
  rootCause?: string;
  recommendedAction: string;
  priorityBook: string;
  pyqPracticeCountNeeded?: number;
  accuracyInMocks?: number;
  estimatedMarkLoss?: number;
  recommendedPYQCount?: number;
  failedQuestionsCount?: number;
  totalAttemptedInMocks?: number;
}

export interface TimeVsWeightageGap {
  subject: string;
  paper?: string;
  upscMarksWeightagePct?: number; // e.g. Polity is 17% in Prelims
  timeInvestedPct?: number; // e.g. user spent 8% or 30%
  gapStatus?:
    | "Under-investing (High Risk)"
    | "Balanced"
    | "Over-investing (Low Yield)";
  actionAdvice?: string;
  actualTimePercent?: number;
  idealWeightagePercent?: number;
  deltaPercent?: number;
  status?: "Under-Allocated" | "Balanced" | "Over-Allocated";
  recommendation?: string;
}

export type GapAnalysisMetric = TimeVsWeightageGap;

export interface CutoffBenchmark {
  year: number;
  examStage?:
    | "Prelims (GS1 /200)"
    | "Mains (GS+Opt+Essay /1750)"
    | "Final Selection (/2025)";
  generalCutoff?: number;
  obcCutoff?: number;
  ewsCutoff?: number;
  scCutoff?: number;
  stCutoff?: number;
  prelimsGeneral?: number;
  mainsGeneral?: number;
  finalGeneral?: number;
  rank1Marks?: number;
}

export interface AIEvaluationResult {
  estimatedScore: number;
  maxMarks: number;
  scoreCategory: "Excellent" | "Good" | "Average" | "Needs Improvement";
  rubricBreakdown: {
    introduction?: string;
    bodyDimensions?: string;
    structureAndKeywords?: string;
    conclusion?: string;
    [key: string]: any;
  };
  strengths: string[];
  missingElements: string[];
  topperUpgradeSuggestions: string[];
  modelAnswerOutline: string;
  overallVerdict?: string;
}

export interface QuickRevisionNote {
  id: string;
  topicId?: string;
  topicTitle: string;
  paper: string;
  subject: string;
  bulletPoints: string[];
  tags: string[];
  importance: "🔥 High Yield" | "⭐ Important" | "📘 Standard";
  updatedAt: string;
}

export interface Mindmap {
  id: string;
  title: string;
  subject: string;
  driveUrl: string;
  tags?: string[];
  createdAt?: string;
}
