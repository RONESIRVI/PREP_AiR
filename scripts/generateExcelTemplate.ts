import * as XLSX from 'xlsx';
import { TOPPERS_PROFILES, STRATEGY_SETUP, TOPPER_ROUTINES, TOPPER_NOTES_VAULT } from '../src/data/toppersData.ts';

const wb = XLSX.utils.book_new();

// 1. Strategy Sheet (From Toppers Profiles)
const strategyData = TOPPERS_PROFILES.map(t => ({
  id: t.id,
  name: t.name,
  rank: t.rank,
  year: t.year,
  optional: t.optional,
  attempt: t.attempt,
  background: t.background,
  avatar: t.avatar,
  quote: t.quote,
  keyStrategy: t.keyStrategy,
  gs1: t.gsStrategy.gs1,
  gs2: t.gsStrategy.gs2,
  gs3: t.gsStrategy.gs3,
  gs4: t.gsStrategy.gs4,
  essayStrategy: t.essayStrategy,
  optionalStrategy: t.optionalStrategy,
  prelimsStrategy: t.prelimsStrategy,
  csatStrategy: t.csatStrategy,
  interviewScore: t.interviewScore,
  mainsScore: t.mainsScore,
  goldenRules: t.goldenRules.join(' | ')
}));
const wsStrategy = XLSX.utils.json_to_sheet(strategyData);
XLSX.utils.book_append_sheet(wb, wsStrategy, "Strategy");

// 2. Strategy Setup Sheet
const strategySetupData = STRATEGY_SETUP.map(s => ({
  id: s.id,
  title: s.title,
  content: s.content,
  ...s.extraData
}));
const wsStrategySetup = XLSX.utils.json_to_sheet(strategySetupData);
XLSX.utils.book_append_sheet(wb, wsStrategySetup, "Strategy Setup");

// 3. Routines Sheet
const routinesData: any[] = [];
TOPPER_ROUTINES.forEach(r => {
  r.schedule.forEach(s => {
    routinesData.push({
      routineId: r.id,
      time: s.time,
      activity: s.activity,
      category: s.category
    });
  });
});
const wsRoutines = XLSX.utils.json_to_sheet(routinesData);
XLSX.utils.book_append_sheet(wb, wsRoutines, "Routines");

// 4. Interviews Sheet
const interviewsData: any[] = [];
// Generate dummy interview data since it doesn't exist in toppersData.ts yet
interviewsData.push({
  id: "interview-1",
  candidate: "Aditya Srivastava",
  board: "Manoj Soni Board",
  year: 2023,
  score: 200,
  question: "Why did you leave Goldman Sachs for Civil Services?",
  answer: "While corporate life offered financial growth, I wanted to work on larger societal impact...",
  topic: "DAF / Work Experience"
});
const wsInterviews = XLSX.utils.json_to_sheet(interviewsData);
XLSX.utils.book_append_sheet(wb, wsInterviews, "Interviews");

// 5. Notes & Mindmaps Sheet
const notesData = TOPPER_NOTES_VAULT.map(n => ({
  id: n.id,
  title: n.title,
  subject: n.subject,
  paper: n.paper,
  topperSource: n.topperSource,
  type: n.type,
  summary: n.summary,
  keyPoints: n.keyPoints.join(' | '),
  diagramDescription: n.diagramDescription || '',
  svgDiagramType: n.svgDiagramType || ''
}));
const wsNotes = XLSX.utils.json_to_sheet(notesData);
XLSX.utils.book_append_sheet(wb, wsNotes, "Notes");

XLSX.writeFile(wb, 'upsc_toppers_data.xlsx');
console.log('Successfully generated upsc_toppers_data.xlsx');
