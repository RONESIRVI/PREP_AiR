import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, 'Update_App_Data/upsc_toppers_data.xlsx');
const fileData = fs.readFileSync(excelPath);
const wb = XLSX.read(fileData, { type: 'buffer' });

const routinesSheet = wb.Sheets['Routines'];
if (routinesSheet) {
  const routinesDataRaw = XLSX.utils.sheet_to_json(routinesSheet, { header: 1 });
  console.log('First 20 rows in Routines sheet:');
  console.log(routinesDataRaw.slice(0, 20));
} else {
  console.log('No Routines sheet found!');
}
