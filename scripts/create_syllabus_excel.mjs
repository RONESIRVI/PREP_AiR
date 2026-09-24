/**
 * create_syllabus_excel.mjs
 * 
 * Creates a clean App-ready Syllabus Excel file in Update_App_Data folder
 * matching the same style as upsc_toppers_data.xlsx
 * 
 * Run: node scripts/create_syllabus_excel.mjs
 */

import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Read from Source Excel ──────────────────────────────────────────────────
const sourcePath = "C:/Users/jlpms/Downloads/Telegram Desktop/RAS_Master_Pre_Mains.xlsx";
console.log("📂 Reading source:", sourcePath);

const sourceWb = XLSX.readFile(sourcePath);
const masterWs = sourceWb.Sheets["📊 Master Table (App Import)"];
const rawData = XLSX.utils.sheet_to_json(masterWs, { header: 1 });
const rows = rawData.slice(2).filter(r => r[0]);

console.log(`✅ Found ${rows.length} topics`);

// ─── Paper Mapping ─────────────────────────────────────────────────────────
const PAPER_MAP = {
  "Pre Paper":      "Prelims GS1",
  "Mains Paper I":  "Mains GS1",
  "Mains Paper II": "Mains GS2",
  "Mains Paper III":"Mains GS3",
  "Mains Paper IV": "Mains GS4",
};

function mapYield(priority) {
  if (!priority) return "📘 Standard";
  const stars = (priority.match(/★/g) || []).length;
  if (stars >= 4) return "🔥 High Yield";
  if (stars >= 3) return "⭐ Medium Yield";
  return "📘 Standard";
}

// ─── Subject Mapping for Prelims GS1 ───────────────────────────────────────
function mapSubject(subject, title, mappedPaper) {
  if (mappedPaper !== "Prelims GS1") return subject; // Apply only to Prelims
  
  if (subject === "राजस्थान GK") return "राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत";
  if (subject === "भारत इतिहास") return "भारत का इतिहास";
  if (subject === "भूगोल") {
    if (title && title.includes("राजस्थान")) return "राजस्थान का भूगोल";
    return "विश्व एवं भारत का भूगोल";
  }
  if (subject === "राज्यव्यवस्था") {
    if (title && (title.includes("राजस्थान") || title.includes("RPSC") || title.includes("CM"))) {
      return "राजस्थान की राजनीतिक एवं प्रशासनिक व्यवस्था";
    }
    return "भारतीय संविधान, राजनीतिक व्यवस्था और शासन";
  }
  if (subject === "अर्थव्यवस्था") {
    if (title && title.includes("राजस्थान")) return "राजस्थान की अर्थव्यवस्था";
    return "आर्थिक अवधारणाएँ एवं भारतीय अर्थव्यवस्था";
  }
  if (subject === "विज्ञान") return "विज्ञान एवं प्रौद्योगिकी";
  if (subject === "तर्कशक्ति") return "तार्किक विवेचन एवं मानसिक योग्यता";
  if (subject === "गणित") return "तार्किक विवेचन एवं मानसिक योग्यता";
  if (subject === "समसामयिक") return "समसामयिक घटनाएँ एवं मुद्दे (राजस्थान के विशेष संदर्भ में)";
  
  return subject;
}

// ─── Build Syllabus Sheet Data ─────────────────────────────────────────────
const syllabusHeaders = [
  "id",
  "paper",
  "subject",
  "module",
  "title",
  "subtopics",
  "yield",
  "priority",
  "questionEstimate",
  "questionType",
  "source",
  "commonPreMains",
  "examTips",
  "studyGuide",
  "paperFullName",
  "status",
  "notes",
  "weightagePercentage",
  "pyqFrequencyLast5Years"
];

const syllabusRows = rows.map(row => {
  const srNo      = row[0];
  const exam      = row[1];
  const paper     = row[2];
  const paperFull = row[3];
  const subject   = row[4];
  const unit      = row[5];
  const topic     = row[6];
  const subTopic  = row[7];
  const kyaTaiyar = row[8];
  const priority  = row[9];
  const preQsEst  = row[10];
  const qType     = row[11];
  const source    = row[12];
  const commonPM  = row[13];
  const tips      = row[14];

  const mappedPaper = PAPER_MAP[paper] || paper || "Prelims GS1";
  const id = `ras-${exam === "Pre" ? "pre" : "mains"}-${String(srNo).padStart(3, "0")}`;
  
  const mappedSubject = mapSubject(subject || "", topic || "", mappedPaper);

  return [
    id,
    mappedPaper,
    mappedSubject,
    unit || "—",
    topic || "",
    subTopic || "",
    mapYield(String(priority || "")),
    priority || "",
    preQsEst || "",
    qType || "MCQ",
    source || "",
    String(commonPM || "").toLowerCase() === "yes" ? "Yes" : "No",
    tips || "",
    kyaTaiyar || "",
    paperFull || "",
    "not_started",   // default status
    "",              // notes (empty)
    0,               // weightagePercentage
    0                // pyqFrequencyLast5Years
  ];
});

// ─── Build New Workbook ────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();

// Sheet 1: Syllabus (main data)
const syllabusSheetData = [syllabusHeaders, ...syllabusRows];
const syllabusSheet = XLSX.utils.aoa_to_sheet(syllabusSheetData);

// Column widths
syllabusSheet["!cols"] = [
  { wch: 20 }, // id
  { wch: 14 }, // paper
  { wch: 25 }, // subject
  { wch: 18 }, // module
  { wch: 40 }, // title
  { wch: 50 }, // subtopics
  { wch: 14 }, // yield
  { wch: 10 }, // priority
  { wch: 14 }, // questionEstimate
  { wch: 12 }, // questionType
  { wch: 20 }, // source
  { wch: 14 }, // commonPreMains
  { wch: 40 }, // examTips
  { wch: 50 }, // studyGuide
  { wch: 35 }, // paperFullName
  { wch: 14 }, // status
  { wch: 30 }, // notes
  { wch: 12 }, // weightagePercentage
  { wch: 12 }, // pyqFrequencyLast5Years
];

XLSX.utils.book_append_sheet(wb, syllabusSheet, "Syllabus");

// Sheet 2: Instructions
const instructionsData = [
  ["📋 RAS Syllabus — App Data File | Firebase Sync"],
  [""],
  ["HOW TO USE THIS FILE:"],
  ["1. Edit topics in the 'Syllabus' sheet"],
  ["2. DO NOT change column headers"],
  ["3. 'id' column must be unique (format: ras-pre-001)"],
  ["4. 'status' values: not_started | in_progress | revised_1 | revised_2 | revised_3 | revised_4 | revised_5 | mastered"],
  ["5. 'yield' values: 🔥 High Yield | ⭐ Medium Yield | 📘 Standard"],
  ["6. 'paper' values: Prelims GS1 | Mains GS1 | Mains GS2 | Mains GS3 | Mains GS4"],
  [""],
  ["TO UPLOAD TO FIREBASE:"],
  ["Run: node scripts/uploadSyllabusToFirebase.mjs"],
  ["OR double-click: Update_App_Data/Sync_Syllabus_To_Firebase.bat"],
  [""],
  ["PAPER MAPPING:"],
  ["Pre Paper → Prelims GS1"],
  ["Mains Paper I → Mains GS1"],
  ["Mains Paper II → Mains GS2"],
  ["Mains Paper III → Mains GS3"],
  ["Mains Paper IV → Mains GS4"],
  [""],
  ["TOTAL TOPICS:", rows.length],
  ["Source:", "RAS_Master_Pre_Mains.xlsx → Master Table (App Import)"],
  ["Last Generated:", new Date().toLocaleString("hi-IN")],
];

const instrSheet = XLSX.utils.aoa_to_sheet(instructionsData);
instrSheet["!cols"] = [{ wch: 60 }, { wch: 20 }];
XLSX.utils.book_append_sheet(wb, instrSheet, "Instructions");

// Sheet 3: Paper Summary
const papers = ["Prelims GS1", "Mains GS1", "Mains GS2", "Mains GS3", "Mains GS4"];
const summaryData = [
  ["Paper", "Total Topics", "MCQ Topics", "Descriptive Topics", "High Yield", "Medium Yield", "Standard"],
];

papers.forEach(paper => {
  const paperRows = syllabusRows.filter(r => r[1] === paper);
  const mcq = paperRows.filter(r => String(r[9]).includes("MCQ")).length;
  const desc = paperRows.filter(r => String(r[9]).includes("Desc")).length;
  const high = paperRows.filter(r => r[6] === "🔥 High Yield").length;
  const mid = paperRows.filter(r => r[6] === "⭐ Medium Yield").length;
  const std = paperRows.filter(r => r[6] === "📘 Standard").length;
  summaryData.push([paper, paperRows.length, mcq, desc, high, mid, std]);
});

summaryData.push(["", ""]);
summaryData.push(["TOTAL", rows.length]);

const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
summarySheet["!cols"] = [{ wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 10 }];
XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

// ─── Save File ────────────────────────────────────────────────────────────
const outputPath = path.join(__dirname, "../Update_App_Data/ras_syllabus_data.xlsx");
XLSX.writeFile(wb, outputPath);

console.log(`\n✅ Syllabus Excel created: ${outputPath}`);
console.log(`📊 Total topics: ${rows.length}`);
papers.forEach(p => {
  const count = syllabusRows.filter(r => r[1] === p).length;
  console.log(`   ${p}: ${count} topics`);
});
console.log("\n📁 File saved in: Update_App_Data/ras_syllabus_data.xlsx");
