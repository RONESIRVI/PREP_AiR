import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  let excelPath = path.join(__dirname, '../Update_App_Data/Toppers Strategy & Interviews.xlsx');
  if (!fs.existsSync(excelPath)) {
    excelPath = path.join(__dirname, '../Update_App_Data/upsc_toppers_data.xlsx');
  }

  const fileData = fs.readFileSync(excelPath);
  const wb = XLSX.read(fileData, { type: 'buffer' });

  if (!wb.Sheets['Notes']) {
    const notesData = [
      {
        id: "note-pestle-framework",
        title: "Universal PESTLE & 360° Mains Framework",
        subject: "General Studies 1, 2, 3 & Essay",
        paper: "All GS Papers",
        topperSource: "Aditya Srivastava (AIR 1)",
        type: "Framework / Template",
        summary: "When stuck on any broad 15-marker UPSC question, use the PESTLE framework to instantly generate 6 distinct dimensions with 3 points each.",
        keyPoints: "P - Political / Constitutional | E - Economic | S - Social / Cultural | T - Technological | L - Legal / Statutory | E - Environmental / Ecological",
        diagramDescription: "A circular 6-spoke hub with Core Problem in center and 6 PESTLE nodes radiating outward.",
        svgDiagramType: "pestle"
      }
    ];
    
    const wsNotes = XLSX.utils.json_to_sheet(notesData);
    XLSX.utils.book_append_sheet(wb, wsNotes, "Notes");
    
    XLSX.writeFile(wb, excelPath);
    console.log('Successfully added Notes sheet to Excel!');
  } else {
    console.log('Notes sheet already exists.');
  }
} catch (error) {
  console.error(error);
}
