/**
 * syllabusData.ts
 *
 * NOTE: The actual syllabus data is now managed via Firebase Firestore.
 * Document: appData/SYLLABUS_TOPICS
 *
 * This file provides an EMPTY fallback array so the app doesn't crash
 * before Firebase data loads. Once Firebase loads, it will replace this.
 *
 * To upload/update syllabus: node scripts/uploadSyllabusToFirebase.mjs
 */

import { SyllabusTopic, StudyPlanPhase } from "../types";

// Empty fallback — Firebase will populate this on app load
export const DEFAULT_SYLLABUS: SyllabusTopic[] = [];

export const DEFAULT_STUDY_PLAN: StudyPlanPhase[] = [];
