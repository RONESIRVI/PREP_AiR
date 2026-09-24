import {
  CutoffBenchmark,
  MockTestLog,
  WeakAreaItem,
  TimeVsWeightageGap,
  RevisionItem,
  GapAnalysisMetric,
} from "../types";

// ─── RAS/RPSC Historical Cutoffs ──────────────────────────────────────────
export const HISTORICAL_CUTOFFS: CutoffBenchmark[] = [
  {
    year: 2023,
    examStage: "RAS Prelims (GS1 /200)",
    generalCutoff: 90.88,
    obcCutoff: 85.44,
    ewsCutoff: 82.56,
    scCutoff: 75.12,
    stCutoff: 68.44,
    prelimsGeneral: 90.88,
    mainsGeneral: 681,
    finalGeneral: 855,
    rank1Marks: 940,
  },
  {
    year: 2021,
    examStage: "RAS Prelims (GS1 /200)",
    generalCutoff: 88.17,
    obcCutoff: 83.22,
    ewsCutoff: 79.55,
    scCutoff: 72.44,
    stCutoff: 65.11,
    prelimsGeneral: 88.17,
    mainsGeneral: 674,
    finalGeneral: 842,
    rank1Marks: 927,
  },
  {
    year: 2018,
    examStage: "RAS Prelims (GS1 /200)",
    generalCutoff: 94.66,
    obcCutoff: 90.33,
    ewsCutoff: 86.12,
    scCutoff: 78.22,
    stCutoff: 72.00,
    prelimsGeneral: 94.66,
    mainsGeneral: 689,
    finalGeneral: 864,
    rank1Marks: 951,
  },
  {
    year: 2016,
    examStage: "RAS Prelims (GS1 /200)",
    generalCutoff: 97.33,
    obcCutoff: 93.11,
    ewsCutoff: 88.44,
    scCutoff: 80.77,
    stCutoff: 74.55,
    prelimsGeneral: 97.33,
    mainsGeneral: 695,
    finalGeneral: 872,
    rank1Marks: 963,
  },
  {
    year: 2013,
    examStage: "RAS Prelims (GS1 /200)",
    generalCutoff: 99.11,
    obcCutoff: 95.44,
    ewsCutoff: 90.22,
    scCutoff: 82.33,
    stCutoff: 76.11,
    prelimsGeneral: 99.11,
    mainsGeneral: 702,
    finalGeneral: 880,
    rank1Marks: 970,
  },
];

export const DEFAULT_MOCKS: MockTestLog[] = [];
export const DEFAULT_MOCK_LOGS = DEFAULT_MOCKS;

export const DEFAULT_WEAK_AREAS: WeakAreaItem[] = [
  {
    id: "wa-1",
    topic: "स्थापत्य कला: मंदिर, किले, महल, बावड़ियाँ",
    subject: "राजस्थान GK",
    paper: "Prelims GS1",
    failedQuestionsCount: 8,
    accuracyInMocks: 35,
    severity: "Critical",
    recommendedAction: "UNESCO किले list + fort style + location map; निर्माता + शैली identify करें",
    priorityBook: "सुरेश शर्मा राजस्थान GK",
  },
  {
    id: "wa-2",
    topic: "राजस्थान की राजव्यवस्था एवं प्रशासन",
    subject: "राज्यव्यवस्था",
    paper: "Prelims GS1",
    failedQuestionsCount: 5,
    accuracyInMocks: 55,
    severity: "Moderate",
    recommendedAction: "Article number chart; Admin hierarchy pyramid; High Court, Governor, RPSC, RSSC, Lokayukt",
    priorityBook: "Laxmikant + राजस्थान Polity Notes",
  },
  {
    id: "wa-3",
    topic: "राजस्थान का बजट एवं आर्थिक परिदृश्य",
    subject: "अर्थव्यवस्था",
    paper: "Prelims GS1",
    failedQuestionsCount: 3,
    accuracyInMocks: 72,
    severity: "Minor",
    recommendedAction: "Latest Rajasthan Economic Review पढ़ें; Budget 2024-25 key numbers याद करें",
    priorityBook: "Rajasthan Economic Review",
  },
];

// ─── RAS Gap Analysis — Derived from Excel Priority & Estimated Questions ──
// Source: RAS_Master_Pre_Mains.xlsx → 📊 Master Table (App Import)
// Subjects ordered by Priority (★) and Estimated MCQ count
export const DEFAULT_GAP_ANALYSIS: TimeVsWeightageGap[] = [
  {
    subject: "राज्यव्यवस्था (भारत + राजस्थान प्रशासन)",
    idealWeightagePercent: 17,  // ★★★★★ avg 4.8 | ~25 MCQ estimated
    actualTimePercent: 12,
    deltaPercent: -5,
    status: "Under-Allocated",
    recommendation:
      "Article number chart + राजस्थान Admin hierarchy pyramid बनाएं। High Court, Governor, RPSC, RSSC, Lokayukt पर focus करें। RAS में 20-25 MCQ guaranteed हैं।",
  },
  {
    subject: "विज्ञान एवं प्रौद्योगिकी",
    idealWeightagePercent: 16,  // ★★★★★ avg 4.8 | ~20 MCQ estimated
    actualTimePercent: 10,
    deltaPercent: -6,
    status: "Under-Allocated",
    recommendation:
      "ISRO mission diary; Disease-vector table; ICT glossary; गति के नियम, कार्य-ऊर्जा, प्रकाश पर practice sets करें। Daily 10 Science MCQ target रखें।",
  },
  {
    subject: "भूगोल (विश्व + भारत + राजस्थान)",
    idealWeightagePercent: 15,  // ★★★★★ avg 4.6 | ~25 MCQ estimated
    actualTimePercent: 13,
    deltaPercent: -2,
    status: "Under-Allocated",
    recommendation:
      "Map daily practice; Mineral-District-Rank table; River-Sea direction; Rajasthan के district level geography पर ज्यादा focus करें।",
  },
  {
    subject: "राजस्थान GK (History + Art + Culture + Heritage)",
    idealWeightagePercent: 20,  // ★★★★★ avg 4.2 | ~30 MCQ estimated
    actualTimePercent: 25,
    deltaPercent: +5,
    status: "Over-Allocated",
    recommendation:
      "Ruler→Battle→Year chart बना लिया है, अब Art-Culture section पर ज्यादा time दें। UNESCO किले + Dance forms + Festival-Region map पर focus करें।",
  },
  {
    subject: "तर्कशक्ति एवं गणित",
    idealWeightagePercent: 14,  // ★★★★★ avg 4.6 | ~25 MCQ estimated
    actualTimePercent: 8,
    deltaPercent: -6,
    status: "Under-Allocated",
    recommendation:
      "Daily 30 Qs timed practice करें। Formula cards बनाएं। RS Aggarwal से Series, Ratio, Time-Work, Percentage पर मास्टरी जरूरी है।",
  },
  {
    subject: "अर्थव्यवस्था एवं समसामयिक",
    idealWeightagePercent: 10,  // ★★★★★ avg 4.5 | ~15 MCQ estimated
    actualTimePercent: 12,
    deltaPercent: +2,
    status: "Balanced",
    recommendation:
      "Current = Balance। Noble Prize, New appointments (CJI/RBI/CAG), Budget 2024-25 key data पर monthly revision करें।",
  },
  {
    subject: "भारत इतिहास",
    idealWeightagePercent: 8,   // ★★★★☆ avg 4.3 | ~18 MCQ estimated
    actualTimePercent: 18,
    deltaPercent: +10,
    status: "Over-Allocated",
    recommendation:
      "Dynasty-ruler-achievement table बनाकर revision mode में shift करें। Spectrum से modern history के key movements पर notes बनाएं। अब नया reading कम करें।",
  },
];

export const GAP_ANALYSIS_METRICS = DEFAULT_GAP_ANALYSIS;

export const DEFAULT_REVISION_QUEUE: RevisionItem[] = [];
