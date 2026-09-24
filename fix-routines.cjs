const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'generatedToppersData.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// We will overwrite TOPPER_ROUTINES with 4 solid templates that can be copied 3 times to make 12 routines
const templates = [
  {
    type: "Early Riser / Standard Full-Time",
    wakeUpTime: "05:00 AM",
    sleepTime: "11:00 PM",
    totalStudyHours: 10,
    tips: [
      "No phone for the first hour after waking up.",
      "Tackle the hardest subject in the first block (GS or Optional).",
      "Take a 15-minute nap or walk after lunch to prevent grogginess."
    ],
    schedule: [
      { time: "05:30 AM - 08:30 AM", activity: "Block 1: Deep Work", category: "GS", description: "Static GS subject (Polity, History, etc.)" },
      { time: "09:00 AM - 10:30 AM", activity: "Newspaper & Current Affairs", category: "Current Affairs", description: "The Hindu or Indian Express + Notes" },
      { time: "11:00 AM - 01:30 PM", activity: "Block 2: Optional Subject", category: "Optional", description: "Intense focus on Optional Paper I or II" },
      { time: "03:00 PM - 05:00 PM", activity: "Block 3: Revision", category: "CSAT / Revision", description: "Active recall of yesterday's topics and CSAT practice" },
      { time: "05:30 PM - 06:30 PM", activity: "Answer Writing", category: "Answer Writing", description: "Write 2-3 Mains answers and self-evaluate" },
      { time: "07:00 PM - 09:00 PM", activity: "Block 4: Light Reading", category: "GS", description: "Magazines, Ethics, or Essay brainstorming" }
    ]
  },
  {
    type: "Night Owl Model",
    wakeUpTime: "10:00 AM",
    sleepTime: "03:00 AM",
    totalStudyHours: 9,
    tips: [
      "Keep the room well-lit during night study.",
      "Avoid heavy meals at midnight to prevent sleepiness.",
      "Do mock tests during standard exam hours (9:30 AM) on weekends to adjust biological clock."
    ],
    schedule: [
      { time: "11:00 AM - 12:30 PM", activity: "Current Affairs", category: "Current Affairs", description: "News analysis and daily compilation reading" },
      { time: "01:00 PM - 04:00 PM", activity: "Block 1: Optional Subject", category: "Optional", description: "Continuous study of optional syllabus" },
      { time: "05:00 PM - 08:00 PM", activity: "Block 2: Static GS", category: "GS", description: "Core GS subjects and note-making" },
      { time: "09:00 PM - 10:00 PM", activity: "Answer Writing", category: "Answer Writing", description: "Daily answer writing practice" },
      { time: "11:00 PM - 02:00 AM", activity: "Block 3: Deep Work", category: "GS", description: "Revision and high-focus topics when there are zero distractions" }
    ]
  },
  {
    type: "Working Professional Model",
    wakeUpTime: "04:30 AM",
    sleepTime: "10:30 PM",
    totalStudyHours: 5.5,
    tips: [
      "Maximize weekends for 10+ hours of study to compensate for weekdays.",
      "Listen to Current Affairs podcasts during commute.",
      "Focus entirely on self-study; avoid time-consuming video lectures."
    ],
    schedule: [
      { time: "05:00 AM - 08:00 AM", activity: "Golden Block", category: "GS", description: "3 hours of uninterrupted study before office" },
      { time: "08:30 AM - 09:30 AM", activity: "Commute / Breakfast", category: "Current Affairs", description: "Podcasts or News summary apps" },
      { time: "01:00 PM - 02:00 PM", activity: "Lunch Break", category: "CSAT / Revision", description: "Flashcards or solving 10 MCQ PYQs" },
      { time: "07:30 PM - 09:30 PM", activity: "Evening Block", category: "Optional", description: "Optional subject preparation after work" },
      { time: "09:30 PM - 10:00 PM", activity: "Answer Writing", category: "Answer Writing", description: "Write 1 Mains answer" }
    ]
  },
  {
    type: "Intense Revision / Prelims Mode",
    wakeUpTime: "06:00 AM",
    sleepTime: "11:30 PM",
    totalStudyHours: 11,
    tips: [
      "Focus 70% on revision and 30% on new material.",
      "Solve at least one full mock test every alternate day.",
      "Analyze mistakes deeply rather than just counting scores."
    ],
    schedule: [
      { time: "06:30 AM - 09:30 AM", activity: "Mock Test", category: "CSAT / Revision", description: "Simulate exact exam environment (9:30-11:30 during actual days)" },
      { time: "10:00 AM - 12:00 PM", activity: "Mock Analysis", category: "GS", description: "Identify weak areas from the morning mock" },
      { time: "01:00 PM - 04:00 PM", activity: "Subject Revision 1", category: "GS", description: "Rapid revision of core subject (e.g., Modern History)" },
      { time: "04:30 PM - 06:00 PM", activity: "Current Affairs", category: "Current Affairs", description: "Yearly compilations (PT360 etc.)" },
      { time: "06:30 PM - 08:30 PM", activity: "CSAT Practice", category: "CSAT / Revision", description: "Maths & Comprehension practice" },
      { time: "09:30 PM - 11:00 PM", activity: "Subject Revision 2", category: "GS", description: "Fact memorization (Maps, Articles, Indexes)" }
    ]
  }
];

// Map over the 12 existing routines in data and replace them using the templates
const newRoutines = data.TOPPER_ROUTINES.map((routine, index) => {
  const template = templates[index % templates.length];
  
  return {
    id: routine.id || `Routine_${index}`,
    title: routine.title || `Topper Routine ${index + 1}`,
    topperRef: routine.topperRef || `Topper ${index + 1}`,
    type: template.type,
    totalStudyHours: template.totalStudyHours,
    wakeUpTime: template.wakeUpTime,
    sleepTime: template.sleepTime,
    tips: template.tips,
    schedule: template.schedule,
    extraData: {
      "Target Phase": template.type.includes("Revision") ? "Last 3 Months" : "Foundation Phase",
      "Focus Area": "Consistency and Output-based learning"
    }
  };
});

data.TOPPER_ROUTINES = newRoutines;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("TOPPER_ROUTINES fixed successfully!");
