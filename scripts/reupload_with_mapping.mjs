import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Firebase Admin Init ───────────────────────────────────────────────────
const serviceAccountPath = path.join(__dirname, "../firebase-service-account.json");
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
} catch (e) {
  console.error("❌ firebase-service-account.json not found!");
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ─── Subject Mapping for Prelims GS1 ───────────────────────────────────────
function mapSubject(subject, title, paper) {
  if (paper !== "Prelims GS1") return subject; // Apply only to Prelims
  
  if (subject === "राजस्थान GK") return "राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत";
  if (subject === "भारत इतिहास") return "भारत का इतिहास";
  if (subject === "भूगोल") {
    if (title && title.includes("राजस्थान")) return "राजस्थान का भूगोल";
    return "विश्व एवं भारत का भूगोल";
  }
  if (subject === "राज्यव्यवस्था") {
    if (title && (title.includes("राजस्थान") || title.includes("RPSC") || title.includes("CM") || title.includes("सचिवालय"))) {
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

// ─── Parse Excel ───────────────────────────────────────────────────────────
const excelPath = path.join(__dirname, "../Update_App_Data/ras_syllabus_data.xlsx");
console.log("📂 Reading Excel:", excelPath);

const wb = XLSX.readFile(excelPath);
const ws = wb.Sheets["Syllabus"];
const dataRows = XLSX.utils.sheet_to_json(ws);

console.log(`📊 Total rows found: ${dataRows.length}`);

// ─── Convert rows to SyllabusTopic objects ─────────────────────────────────
const syllabusTopics = dataRows.map((row) => {
  const paper = row.paper || "Prelims GS1";
  const mappedSubject = mapSubject(row.subject || "", row.title || "", paper);

  const subtopicList = row.subtopics
    ? String(row.subtopics).split(/[;,]/).map(s => s.trim()).filter(Boolean).map(t => ({
        title: t,
        status: "not_started"
      }))
    : [];

  return {
    id: row.id,
    paper: paper,
    subject: mappedSubject,
    module: String(row.module || "—"),
    title: String(row.title || ""),
    subtopics: subtopicList,
    yield: row.yield || "📘 Standard",
    priority: String(row.priority || ""),
    questionEstimate: String(row.questionEstimate || ""),
    questionType: String(row.questionType || "MCQ"),
    source: String(row.source || ""),
    commonPreMains: String(row.commonPreMains || "No") === "Yes",
    examTips: String(row.examTips || ""),
    studyGuide: String(row.studyGuide || ""),
    paperFullName: String(row.paperFullName || ""),
    status: row.status || "not_started",
    weightagePercentage: row.weightagePercentage || 0,
    pyqFrequencyLast5Years: row.pyqFrequencyLast5Years || 0,
    notes: row.notes || ""
  };
});

// ─── Upload to Firestore ───────────────────────────────────────────────────
async function uploadToFirestore() {
  console.log("🚀 Starting upload to Firestore (SYLLABUS_TOPICS)...");
  
  const batch = db.batch();
  const collectionRef = db.collection("appData").doc("SYLLABUS_TOPICS").collection("topics");

  let count = 0;
  for (const topic of syllabusTopics) {
    if (!topic.id) continue;
    const docRef = collectionRef.doc(topic.id);
    batch.set(docRef, topic, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✅ Successfully uploaded/updated ${count} topics!`);
  
  // Also save a snapshot back to the excel file to keep it in sync locally
  const newWsData = [
    [
      "id", "paper", "subject", "module", "title", "subtopics", "yield", "priority", 
      "questionEstimate", "questionType", "source", "commonPreMains", "examTips", 
      "studyGuide", "paperFullName", "status", "notes", "weightagePercentage", "pyqFrequencyLast5Years"
    ]
  ];
  
  syllabusTopics.forEach(t => {
    newWsData.push([
      t.id, t.paper, t.subject, t.module, t.title, t.subtopics.map(s=>s.title).join(", "),
      t.yield, t.priority, t.questionEstimate, t.questionType, t.source, t.commonPreMains ? "Yes" : "No",
      t.examTips, t.studyGuide, t.paperFullName, t.status, t.notes, t.weightagePercentage, t.pyqFrequencyLast5Years
    ]);
  });
  
  const newWs = XLSX.utils.aoa_to_sheet(newWsData);
  wb.Sheets["Syllabus"] = newWs;
  XLSX.writeFile(wb, excelPath);
  console.log(`✅ Successfully updated local Excel file as well!`);

  process.exit(0);
}

uploadToFirestore().catch(console.error);
