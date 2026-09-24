import {
  TopperProfile,
  StrategySetupItem,
  TopperRoutine,
  NoteItem,
  InterviewTranscript,
} from "../types";

import generatedData from "./generatedToppersData.json";

export const TOPPERS_PROFILES: TopperProfile[] = generatedData.TOPPERS_PROFILES as TopperProfile[];
export const STRATEGY_SETUP: StrategySetupItem[] = generatedData.STRATEGY_SETUP as StrategySetupItem[];
export const TOPPER_ROUTINES: TopperRoutine[] = generatedData.TOPPER_ROUTINES as TopperRoutine[];
export const TOPPER_INTERVIEWS: InterviewTranscript[] = generatedData.INTERVIEW_TRANSCRIPTS as InterviewTranscript[];

export const TOPPER_NOTES_VAULT: NoteItem[] = generatedData.TOPPER_NOTES as NoteItem[] || [];
