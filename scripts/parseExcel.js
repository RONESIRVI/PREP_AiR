import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Parsing Excel Data...');

try {
  let excelPath = path.join(__dirname, '../Update_App_Data/Toppers Strategy & Interviews.xlsx');
  
  if (!fs.existsSync(excelPath)) {
    // Fallback to old name just in case it hasn't been renamed yet
    excelPath = path.join(__dirname, '../Update_App_Data/upsc_toppers_data.xlsx');
  }

  if (!fs.existsSync(excelPath)) {
    console.log('No Toppers Strategy & Interviews.xlsx found. Skipping parsing and using default data.');
    process.exit(0);
  }

  const fileData = fs.readFileSync(excelPath);
  const wb = XLSX.read(fileData, { type: 'buffer' });

  function parseTransposedSheet(sheet) {
    if (!sheet) return [];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length === 0) return [];
    
    const numCols = rows[0].length;
    const result = [];
    
    for (let col = 1; col < numCols; col++) {
      const obj = {};
      const extraData = {};
      const coreKeys = ['id', 'name', 'rank', 'year', 'optional', 'attempt', 'background', 'avatar', 'quote', 'keyStrategy', 'gs1', 'gs2', 'gs3', 'gs4', 'essayStrategy', 'optionalStrategy', 'prelimsStrategy', 'csatStrategy', 'interviewScore', 'mainsScore', 'goldenRules', 'prelimsGsMarks', 'prelimsCsatMarks', 'essayMarks', 'gs1Marks', 'gs2Marks', 'gs3Marks', 'gs4Marks', 'title', 'authorOrPublication', 'subject', 'paper', 'priority', 'recommendedBy', 'keyChapters', 'tipsForReading', 'status', 'routineId', 'topperName', 'profileType', 'totalStudyHours', 'wakeUpTime', 'sleepTime', 'time', 'activity', 'category', 'description', 'tips', 'candidate', 'board', 'score', 'duration', 'dafHighlights', 'question', 'askedBy', 'answer', 'analysis', 'keyTakeaways'];
      
      for (let row = 0; row < rows.length; row++) {
        const rawKey = rows[row][0];
        let val = rows[row][col];
        
        if (!rawKey) continue;
        if (val === undefined) val = '';
        
        let key = String(rawKey).trim();
        let normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (key.toLowerCase() === 'ranker' || key.toLowerCase() === 'name') normalizedKey = 'name';
        
        if (coreKeys.includes(normalizedKey)) {
          obj[normalizedKey] = val;
        } else {
          if (val !== '') {
            extraData[key] = val;
          }
        }
      }
      
      if (!obj.name && obj.id) obj.name = obj.id;
      if (!obj.name && extraData.Ranker) obj.name = extraData.Ranker;
      
      if (obj.name) {
          obj.id = String(obj.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      } else {
          obj.id = `profile-${Date.now()}-${col}`;
      }
      
      if (Object.keys(obj).length > 0 || Object.keys(extraData).length > 0) {
        obj.extraData = extraData;
        result.push(obj);
      }
    }
    return result;
  }
  
  // 1. Strategy & Blueprints (TopperProfiles)
  const strategySheet = wb.Sheets['TopperProfiles'] || wb.Sheets['Strategy'];
  const strategyData = strategySheet ? parseTransposedSheet(strategySheet) : [];
  
  // 2. Strategy Setup - Use dedicated sheet or auto-generate from Toppers profiles
  const strategySetupSheet = wb.Sheets['Strategy Setup'];
  let strategySetupData = [];

  if (strategySetupSheet) {
    // Dedicated sheet exists - use it
    const strategySetupDataRaw = XLSX.utils.sheet_to_json(strategySetupSheet);
    strategySetupData = strategySetupDataRaw.map(s => ({
      id: s.id || `strategy-${Math.random()}`,
      title: s.title || 'Strategy',
      content: s.content || '',
      extraData: {}
    }));
  } else {
    // Auto-generate Strategy Setup cards from Toppers profiles
    strategySetupData = strategyData
      .filter(t => t.id && (t.name || t.extraData?.Ranker))
      .map(t => {
        const topperName = t.name || t.extraData?.Ranker || t.id;
        return {
          id: `strategy-${topperName}`.toLowerCase().replace(/\s+/g, '-'),
          title: `${topperName} की रणनीति`,
          content: t.keyStrategy || '',
          extraData: {
            'Ranker': topperName,
            'GS1 Strategy': t.gs1 || '',
            'GS2 Strategy': t.gs2 || '',
            'GS3 Strategy': t.gs3 || '',
            'GS4 Strategy': t.gs4 || '',
            'Essay Strategy': t.essayStrategy || '',
            'Optional Strategy': t.optionalStrategy || '',
            'Prelims Strategy': t.prelimsStrategy || '',
            'Golden Rules': t.goldenRules || ''
          }
        };
      });
  }

  // 3. Routines
  const routinesSheet = wb.Sheets['Routines'];
  const routinesDataRaw = routinesSheet ? XLSX.utils.sheet_to_json(routinesSheet, { header: 1 }) : [];
  
  // Convert flat routines to nested structure using positional index to ignore header names
  const routinesMap = new Map();
  const routinesRows = routinesDataRaw.length > 1 ? routinesDataRaw.slice(1) : [];
  
  routinesRows.forEach((row) => {
    if (!row || row.length === 0) return;
    const routineId = row[0] || '';
    const topperName = row[1] || '';
    
    if (!routinesMap.has(routineId)) {
      routinesMap.set(routineId, {
        id: routineId || `routine-${(topperName || 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: `Routine for ${topperName || 'Working Professional'}`,
        type: row[2] || 'Working Professional (5-6h)',
        topperRef: topperName || 'Various',
        totalStudyHours: 0,
        wakeUpTime: '',
        sleepTime: '',
        schedule: [],
        tips: []
      });
    }
    const routine = routinesMap.get(routineId);
    routine.schedule.push({
      time: row[3] || '00:00',
      activity: row[4] || 'Study',
      category: row[5] || 'GS',
      description: ''
    });
  });
  
  // Try to infer wake up and sleep time from the schedule time strings
  const routinesData = Array.from(routinesMap.values()).map(routine => {
    const timePattern = /\b(1[0-2]|0?[1-9]):([0-5][0-9])\s*([AaPp][Mm])\b/g;
    let earliestTimeStr = "";
    let latestTimeStr = "";
    let earliestVal = 9999;
    let latestVal = -1;
    
    routine.schedule.forEach(slot => {
      let match;
      while ((match = timePattern.exec(slot.time)) !== null) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        
        let val = h * 60 + m;
        // Shift night owls so times like 1AM, 2AM are considered latest (val > 1440)
        if (val < 240) val += 1440; // 00:00 - 04:00 AM shifted to end of day
        
        if (val < earliestVal) {
          earliestVal = val;
          earliestTimeStr = match[0].toUpperCase();
        }
        if (val > latestVal) {
          latestVal = val;
          latestTimeStr = match[0].toUpperCase();
        }
      }
    });
    
    routine.wakeUpTime = earliestTimeStr;
    routine.sleepTime = latestTimeStr;
    return routine;
  });

  // 4. Interviews
  const interviewsSheet = wb.Sheets['Interviews'];
  const interviewsDataRaw = interviewsSheet ? XLSX.utils.sheet_to_json(interviewsSheet, { header: 1 }) : [];
  
  const interviewsMap = new Map();
  const interviewsRows = interviewsDataRaw.length > 1 ? interviewsDataRaw.slice(1) : [];
  
  interviewsRows.forEach((row) => {
    if (!row || row.length === 0) return;
    const candidateName = row[1] || 'Unknown';
    if (!interviewsMap.has(candidateName)) {
      interviewsMap.set(candidateName, {
        id: row[0] || `interview-${candidateName.toLowerCase().replace(/\\s+/g, '-')}`,
        candidateName: candidateName,
        year: parseInt(row[3]) || 2023,
        rank: 1,
        boardChairperson: row[2] || 'UPSC Board',
        score: parseInt(row[4]) || 200,
        durationMinutes: 30,
        background: '',
        dafHighlights: row[7] ? String(row[7]).split('|').map(s => s.trim()) : [],
        qaExcerpts: [],
        keyTakeaways: []
      });
    }
    const transcript = interviewsMap.get(candidateName);
    if (row[5] || row[6]) {
      transcript.qaExcerpts.push({
        question: row[5] || '',
        askedBy: 'Member',
        answer: row[6] || '',
        analysis: ''
      });
    }
  });
  const interviewsData = Array.from(interviewsMap.values());

  // Format Profiles
  const formattedProfiles = strategyData.map(t => {
    const topperName = t.name || (t.extraData && t.extraData.Ranker) || t.id;
    return {
      id: t.id,
      name: topperName,
      rank: typeof t.rank === 'number' ? t.rank : (parseInt((t.rank || '').toString().replace(/\D/g, '')) || 1),
      year: typeof t.year === 'number' ? t.year : (parseInt((t.year || '').toString().replace(/\D/g, '')) || 2024),
      optional: t.optional,
      attempt: typeof t.attempt === 'number' ? t.attempt : (parseInt((t.attempt || '').toString().replace(/\D/g, '')) || 1),
      background: t.background,
      avatar: t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      quote: t.quote,
      keyStrategy: t.keyStrategy,
      gsStrategy: {
        gs1: t.gs1 || '',
        gs2: t.gs2 || '',
        gs3: t.gs3 || '',
        gs4: t.gs4 || ''
      },
      essayStrategy: t.essayStrategy,
      optionalStrategy: t.optionalStrategy,
      prelimsStrategy: t.prelimsStrategy,
      csatStrategy: t.csatStrategy,
      interviewScore: typeof t.interviewScore === 'number' ? t.interviewScore : (parseInt((t.interviewScore || '').toString().replace(/\\D/g, '')) || undefined),
      mainsScore: typeof t.mainsScore === 'number' ? t.mainsScore : (parseInt((t.mainsScore || '').toString().replace(/\\D/g, '')) || undefined),
      goldenRules: typeof t.goldenRules === 'string' ? t.goldenRules.split('|').map(r => r.trim()) : [],
      mainDetails: {
        prelimsGsMarks: t.prelimsGsMarks || '',
        prelimsCsatMarks: t.prelimsCsatMarks || '',
        essayMarks: t.essayMarks || '',
        gs1Marks: t.gs1Marks || '',
        gs2Marks: t.gs2Marks || '',
        gs3Marks: t.gs3Marks || '',
        gs4Marks: t.gs4Marks || ''
      },
      extraData: t.extraData
    };
  });

  // 5. Notes & Mindmaps
  const notesSheet = wb.Sheets['Notes'];
  const notesDataRaw = notesSheet ? XLSX.utils.sheet_to_json(notesSheet, { header: 1 }) : [];
  const notesRows = notesDataRaw.length > 1 ? notesDataRaw.slice(1) : [];
  
  const notesData = notesRows.map(row => {
    if (!row || row.length === 0) return null;
    const title = row[1] || 'Topper Note';
    const subject = row[2] || '';
    return {
      id: row[0] || `note-${(title || subject || 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: title,
      subject: subject,
      paper: row[3] || '',
      topperSource: row[4] || '',
      type: row[5] || 'Mindmap',
      summary: row[6] || '',
      keyPoints: row[7] ? String(row[7]).split('|').map(s => s.trim()) : [],
      diagramDescription: row[8] || '',
      svgDiagramType: row[9] || ''
    };
  }).filter(Boolean);

  const finalData = {
    TOPPERS_PROFILES: formattedProfiles,
    STRATEGY_SETUP: strategySetupData,
    TOPPER_ROUTINES: routinesData,
    INTERVIEW_TRANSCRIPTS: interviewsData,
    TOPPER_NOTES: notesData
  };

  const outputPath = path.join(__dirname, '../src/data/generatedToppersData.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log('Successfully generated src/data/generatedToppersData.json from Excel!');

} catch (error) {
  console.error('Error parsing Excel:', error);
  process.exit(1);
}
