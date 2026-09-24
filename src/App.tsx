import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Navbar } from "./components/Navbar";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { HomeSection } from "./components/home/HomeSection";
import { ToppersSection } from "./components/toppers/ToppersSection";
import { PrepSection } from "./components/prep/PrepSection";
import { AnalyticsSection } from "./components/analytics/AnalyticsSection";
import { ProfileEditModal } from "./components/profile/ProfileEditModal";
import { SettingsModal } from "./components/settings/SettingsModal";

import { SmartExtractorTab } from "./components/prep/SmartExtractorTab";
import { SplashScreen } from "./components/SplashScreen";
import { UIGallery } from "./components/UIGallery";
import {
  Home,
  Trophy,
  BookOpen,
  BarChart3,
  Sparkles,
  Search,
  Flame,
  ScanSearch,
} from "lucide-react";

import { STRATEGY_SETUP, TOPPERS_PROFILES, TOPPER_ROUTINES } from "./data/toppersData";
import { DEFAULT_SYLLABUS, DEFAULT_STUDY_PLAN } from "./data/syllabusData";
import {
  DEFAULT_REVISION_QUEUE,
  DEFAULT_MOCK_LOGS,
  DEFAULT_WEAK_AREAS,
} from "./data/analyticsDefaults";
import { PYQ_DATABASE } from "./data/pyqData";
import {
  MainTab,
  TopperSubTab,
  PrepSubTab,
  AnalyticsSubTab,
  StrategySetupItem,
  SyllabusTopic,
  StudyPlanPhase,
  StudySessionLog,
  RevisionItem,
  MockTestLog,
  WeakAreaItem,
  TopperRoutine,
  PYQQuestion,
  DailyTask,
  PreparationHealth,
  TopperProfile,
  AudioNote,
} from "./types";

import { usePushNotifications } from "./hooks/usePushNotifications";
import { UpdateModal } from "./components/ui/UpdateModal";
export default function App() {
  // Initialize Push Notifications
  usePushNotifications();
  const [updateInfo, setUpdateInfo] = useState<{ version: string; body: string; url: string } | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<number | null>(null);
  // Silent Auto-Update Engine on App Open
  useEffect(() => {
    const initApp = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Request Native Permissions
          await LocalNotifications.requestPermissions();

          // Tell Capacitor Updater the app loaded successfully
          await CapacitorUpdater.notifyAppReady();

          // Check if user disabled auto-updates
          const disableAutoUpdate = localStorage.getItem("disable_auto_update") === "true";
          if (disableAutoUpdate) {
            console.log("Auto-update check disabled by user settings.");
            return;
          }

          // Check for GitHub Releases
          const res = await fetch(
            "https://api.github.com/repos/RONESIRVI/PREP_AiR/releases/latest"
          );
          const data = await res.json();

          if (data && data.assets) {
            const asset = data.assets.find((a: any) => a.name === "dist.zip");
            if (asset) {
              const currentVersion =
                localStorage.getItem("app_version") || "v1.0.0";
              if (data.tag_name !== currentVersion && data.tag_name) {
                console.log(`Update found: ${data.tag_name}, waiting for user...`);
                
                // Set update info so the Update Modal can display it
                setUpdateInfo({
                  version: data.tag_name,
                  body: data.body || "Performance improvements and bug fixes.",
                  url: asset.browser_download_url
                });

                // Notify user that an update is available
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "🆕 PREP AiR Update!",
                      body: `Version ${data.tag_name} उपलब्ध है। App में जाकर 'Update Now' पर क्लिक करें।`,
                      id: 10,
                      schedule: { at: new Date(Date.now() + 500) },
                      sound: undefined,
                      attachments: undefined,
                      actionTypeId: "",
                      extra: null,
                    },
                  ],
                });

                // Listen for notification tap to open modal
                LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
                  if (notification.notification.id === 10) {
                    setIsUpdateModalOpen(true);
                  }
                });

                // Auto-open modal if user is active in the app
                setIsUpdateModalOpen(true);
              }
            }
          }
        } else {
          // Web Fallback
          if (
            "Notification" in window &&
            Notification.permission !== "granted"
          ) {
            await Notification.requestPermission();
          }
        }
      } catch (e) {
        console.warn("Auto-update check failed:", e);
      }
    };
    initApp();

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, []);

  // Expose test function to window for debugging
  useEffect(() => {
    (window as any).testUpdateModal = () => {
      setUpdateInfo({
        version: "v2.1.0",
        body: "### 🚀 What's New in v2.1.0\n\n- 🆕 New OCR improvements\n- 📚 New Study Material\n- ⚡ Performance improvements\n- 🛠️ Bug fixes\n- 🎨 UI improvements\n\n![Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)",
        url: ""
      });
      setIsUpdateModalOpen(true);
    };
  }, []);

  const handleUpdateNow = async () => {
    if (!updateInfo) return;
    try {
      setUpdateProgress(0);
      
      // Attach progress listener
      CapacitorUpdater.addListener('download', (info: any) => {
        setUpdateProgress(info.percent);
      });

      const version = await CapacitorUpdater.download({
        url: updateInfo.url,
        version: updateInfo.version,
      });
      
      setUpdateProgress(100);
      localStorage.setItem("app_version", updateInfo.version);
      
      // Success Notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "✓ RAS CSE Master Hub Updated",
            body: `Version ${updateInfo.version} installed successfully.`,
            id: 2,
            schedule: { at: new Date(Date.now() + 1000) }
          }
        ]
      });

      // Set the update and reload app
      setTimeout(async () => {
        await CapacitorUpdater.set({ id: version.id });
      }, 1000);
      
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to download the update. Please check your internet connection.");
      setUpdateProgress(null);
    }
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [topperSubTab, setTopperSubTab] = useState<TopperSubTab>("strategy");
  const [prepSubTab, setPrepSubTab] = useState<PrepSubTab>("syllabus");
  const [analyticsSubTab, setAnalyticsSubTab] =
    useState<AnalyticsSubTab>("progress");

  // Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("ras_user_profile");
    return saved ? JSON.parse(saved) : { 
      name: "AARIZ MANSURI", 
      role: "RAS Aspirant", 
      targetExam: "RAS CSE 2027" 
    };
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("ras_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);




  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const [currentStudySession, setCurrentStudySession] = useState<{
    paper?: string;
    subject: string;
    topic: string;
    subtopic?: string;
    taskType: "study" | "revision" | "pyq" | "notes" | "answer_writing";
    triggerTimerStart?: boolean;
  }>({
    paper: "",
    subject: "राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत",
    topic: "",
    taskType: "study",
    triggerTimerStart: false,
  });

  const [dailyGoalHours] = useState<number>(8);

  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Core Data States with LocalStorage Hydration
  const [strategies, setStrategies] = useState<StrategySetupItem[]>(() => {
    const saved = localStorage.getItem("ras_strategies");
    const local = saved ? JSON.parse(saved) : [];
    if (!saved || local.length === 0) return STRATEGY_SETUP;
    const localMap = new Map(local.map((item: StrategySetupItem) => [item.id, item]));
    const merged = STRATEGY_SETUP.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, localItem, item) : item; });
    const remoteIds = new Set(STRATEGY_SETUP.map(item => item.id));
    local.forEach((item: StrategySetupItem) => { if (!remoteIds.has(item.id)) merged.push(item); });
    return merged;
  });

  const [toppers, setToppers] = useState<TopperProfile[]>(() => {
    const saved = localStorage.getItem("ras_toppers_v1") || localStorage.getItem("ras_toppers");
    const local = saved ? JSON.parse(saved) : [];
    if (!saved || local.length === 0) return TOPPERS_PROFILES;
    const localMap = new Map(local.map((item: TopperProfile) => [item.id, item]));
    const merged = TOPPERS_PROFILES.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, localItem, item) : item; });
    const remoteIds = new Set(TOPPERS_PROFILES.map(item => item.id));
    local.forEach((item: TopperProfile) => { if (!remoteIds.has(item.id)) merged.push(item); });
    return merged;
  });

  const [topperRoutines, setTopperRoutines] = useState<TopperRoutine[]>(() => {
    const saved = localStorage.getItem("ras_topper_routines_v1") || localStorage.getItem("ras_topper_routines");
    const local = saved ? JSON.parse(saved) : [];
    if (!saved || local.length === 0) return TOPPER_ROUTINES;
    const localMap = new Map(local.map((item: TopperRoutine) => [item.id, item]));
    const merged = TOPPER_ROUTINES.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, localItem, item) : item; });
    const remoteIds = new Set(TOPPER_ROUTINES.map(item => item.id));
    local.forEach((item: TopperRoutine) => { if (!remoteIds.has(item.id)) merged.push(item); });
    return merged;
  });

  const [notes, setNotes] = useState<any[]>([]);

  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>(() => {
    const saved = localStorage.getItem("ras_syllabus_v2") || localStorage.getItem("ras_syllabus");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((topic: any) => ({
        ...topic,
        subtopics: topic.subtopics.map((sub: any) =>
          typeof sub === 'string' ? { title: sub, status: "not_started" } : sub
        )
      }));
    }
    return DEFAULT_SYLLABUS; // temporary fallback
  });

  const [studyPlanPhases, setStudyPlanPhases] = useState<StudyPlanPhase[]>(
    () => {
      const saved = localStorage.getItem("ras_study_plan_v1") || localStorage.getItem("ras_study_plan");
      return saved ? JSON.parse(saved) : DEFAULT_STUDY_PLAN;
    }
  );

  const [sessionLogs, setSessionLogs] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem("ras_session_logs_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [mockLogs, setMockLogs] = useState<MockTestLog[]>(() => {
    const saved = localStorage.getItem("ras_mock_logs_v2") || localStorage.getItem("ras_mock_logs");
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_LOGS;
  });

  const [revisionQueue, setRevisionQueue] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem("ras_revision_queue_v2") || localStorage.getItem("ras_revision_queue");
    return saved ? JSON.parse(saved) : DEFAULT_REVISION_QUEUE;
  });

  const [pyqs, setPyqs] = useState<PYQQuestion[]>(() => {
    const saved = localStorage.getItem("ras_pyqs_v2") || localStorage.getItem("ras_pyqs");
    return saved ? JSON.parse(saved) : PYQ_DATABASE;
  });

  const weakAreas = useMemo<WeakAreaItem[]>(() => {
    const topicStats: Record<string, {
       subject: string;
       topic: string;
       lastMockScore: number;
       lastMockCutoff: number;
       tests: number;
       totalMarksObtained: number;
       totalMarks: number;
       incorrectCount: number;
       studyMinutes: number;
    }> = {};

    mockLogs.forEach(log => {
      if (!log.subject || !log.topic) return;
      const syllabusTopic = syllabus.find(s => s.subject === log.subject && s.title === log.topic);
      if (syllabusTopic?.status === "not_started" || syllabusTopic?.status === "in_progress") return;

      const key = `${log.subject}-${log.topic}`;
      if (!topicStats[key]) {
        topicStats[key] = {
           subject: log.subject,
           topic: log.topic,
           lastMockScore: log.marksObtained,
           lastMockCutoff: log.cutoffScore || 80,
           tests: 0,
           totalMarksObtained: 0,
           totalMarks: 0,
           incorrectCount: 0,
           studyMinutes: 0,
        };
      }
      topicStats[key].tests += 1;
      topicStats[key].lastMockScore = log.marksObtained;
      topicStats[key].lastMockCutoff = log.cutoffScore || 80;
      topicStats[key].totalMarksObtained += log.marksObtained;
      topicStats[key].totalMarks += log.totalMarks;
      topicStats[key].incorrectCount += (log.incorrectCount || 0);
    });

    sessionLogs.forEach(log => {
      if (!log.subject || !log.topicCovered) return;
      const syllabusTopic = syllabus.find(s => s.subject === log.subject && s.title === log.topicCovered);
      if (syllabusTopic?.status === "not_started" || syllabusTopic?.status === "in_progress") return;

      const key = `${log.subject}-${log.topicCovered}`;
      if (!topicStats[key]) {
        topicStats[key] = {
           subject: log.subject,
           topic: log.topicCovered,
           lastMockScore: 0,
           lastMockCutoff: 80,
           tests: 0,
           totalMarksObtained: 0,
           totalMarks: 0,
           incorrectCount: 0,
           studyMinutes: 0,
        };
      }
      topicStats[key].studyMinutes += log.durationMinutes;
    });

    const calculatedWeakAreas: WeakAreaItem[] = [];
    Object.keys(topicStats).forEach((key, idx) => {
       const stat = topicStats[key];
       
       if (stat.tests > 0 && stat.lastMockScore >= stat.lastMockCutoff + 15) {
          return; // Topic mastered according to strict RAS criteria
       }

       const percentage = stat.totalMarks > 0 ? (stat.totalMarksObtained / stat.totalMarks) * 100 : 0;
       
       let severity: "Critical" | "Moderate" | "Minor" = "Minor";
       if (percentage < 40) severity = "Critical";
       else if (percentage < 60) severity = "Moderate";
       
       let trend: "improving" | "declining" | "stagnant" = "stagnant";
       if (percentage < 50) trend = "declining";
       else if (percentage > 70) trend = "improving";
       
       if (stat.studyMinutes > 120 && trend === "declining") {
          trend = "improving"; // Lots of study time might be turning it around
       }

       calculatedWeakAreas.push({
         id: `dynamic-weak-${idx}`,
         subject: stat.subject,
         topic: stat.topic,
         paper: "Mock Analysis",
         severity: severity,
         failedQuestionsCount: stat.incorrectCount,
         estimatedMarkLoss: (stat.incorrectCount * 0.66),
         priorityBook: "Standard Source",
         recommendedAction: stat.studyMinutes > 0 
           ? `Revise your notes. You have studied this for ${Math.floor(stat.studyMinutes/60)}h ${stat.studyMinutes%60}m.`
           : `Focus on ${stat.topic} core concepts and solve PYQs.`,
       });
    });
    
    return calculatedWeakAreas.sort((a, b) => {
       if (a.severity === "Critical" && b.severity !== "Critical") return -1;
       if (b.severity === "Critical" && a.severity !== "Critical") return 1;
       return 0;
    });
  }, [mockLogs, sessionLogs]);

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem("ras_daily_tasks_v2") || localStorage.getItem("ras_daily_tasks");
    const savedDate = localStorage.getItem("ras_daily_tasks_date");
    const today = new Date().toISOString().split("T")[0];
    
    if (savedDate !== today) {
      localStorage.setItem("ras_daily_tasks_date", today);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Keep the schedule, but reset the checkboxes for the new day
          const resetTasks = parsed.map((task: any) => ({ ...task, completed: false }));
          localStorage.setItem("ras_daily_tasks_v2", JSON.stringify(resetTasks));
          return resetTasks;
        } catch (e) {
          return [];
        }
      }
      return [];
    }
    
    return saved ? JSON.parse(saved) : [];
  });

  const [audioNotes, setAudioNotes] = useState<AudioNote[]>(() => {
    const saved = localStorage.getItem("ras_audio_notes_v2") || localStorage.getItem("ras_audio_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [studyStreak, setStudyStreak] = useState<number>(() => {
    const saved = localStorage.getItem("ras_study_streak_v1");
    return saved ? JSON.parse(saved) : 0;
  });

  // Modals State
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Maintain a stable ref of the current state so we don't need to detach/reattach the native listener
  const backStateRef = useRef({ isUpdateModalOpen, searchOpen, activeTab });
  useEffect(() => {
    backStateRef.current = { isUpdateModalOpen, searchOpen, activeTab };
  }, [isUpdateModalOpen, searchOpen, activeTab]);

  // Handle Hardware Back Button for Android
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: any = null;
    const registerListener = async () => {
      listener = await CapacitorApp.addListener('backButton', () => {
        const state = backStateRef.current;
        if (state.isUpdateModalOpen) {
          setIsUpdateModalOpen(false);
        } else if (state.searchOpen) {
          setSearchOpen(false);
        } else if (state.activeTab !== "home") {
          setActiveTab("home");
        } else {
          CapacitorApp.exitApp();
        }
      });
    };
    
    registerListener();

    return () => {
      if (listener) listener.remove();
    };
  }, []); // Run exactly once

  // Sync to LocalStorage
  // Sync to LocalStorage & Cloud
  useEffect(() => {
    // The splash screen now waits for a button click, so we remove the auto-timeout here.
  }, []);

  useEffect(() => {
    localStorage.setItem("ras_toppers_v1", JSON.stringify(toppers));
  }, [toppers]);

  useEffect(() => {
    localStorage.setItem("ras_topper_routines_v1", JSON.stringify(topperRoutines));
  }, [topperRoutines]);

  useEffect(() => {
    localStorage.setItem("ras_strategies", JSON.stringify(strategies));
    localStorage.setItem("ras_toppers", JSON.stringify(toppers));
    localStorage.setItem("ras_syllabus_v2", JSON.stringify(syllabus));
    localStorage.setItem(
      "ras_study_plan_v1",
      JSON.stringify(studyPlanPhases)
    );
    localStorage.setItem("ras_session_logs_v2", JSON.stringify(sessionLogs));
    localStorage.setItem("ras_mock_logs_v2", JSON.stringify(mockLogs));
    localStorage.setItem(
      "ras_revision_queue_v2",
      JSON.stringify(revisionQueue)
    );
    localStorage.setItem("ras_pyqs_v2", JSON.stringify(pyqs));
    localStorage.setItem("ras_audio_notes_v2", JSON.stringify(audioNotes));
    localStorage.setItem("ras_daily_tasks_v2", JSON.stringify(dailyTasks));
    localStorage.setItem("ras_study_streak_v1", JSON.stringify(studyStreak));
    

  }, [
    strategies,
    toppers,
    syllabus,
    studyPlanPhases,
    sessionLogs,
    mockLogs,
    revisionQueue,
    pyqs,
    audioNotes,
    dailyTasks,
    studyStreak,
  ]);

  // Keyboard shortcut for Global Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers for Syllabus
  const handleUpdateTopicStatus = (
    topicId: string,
    nextStatus: SyllabusTopic["status"]
  ) => {
    setSyllabus((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const newSubtopics = t.subtopics.map(sub => ({ ...sub, status: nextStatus }));
          return { ...t, status: nextStatus, subtopics: newSubtopics };
        }
        return t;
      })
    );
  };

  const handleUpdateMicroTopicStatus = (
    topicId: string,
    subtopicIndex: number,
    nextStatus: SyllabusTopic["status"]
  ) => {
    setSyllabus((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const newSubtopics = [...t.subtopics];
          newSubtopics[subtopicIndex] = { ...newSubtopics[subtopicIndex], status: nextStatus };
          
          let newParentStatus = t.status;
          const allMastered = newSubtopics.every(sub => sub.status === "mastered");
          const anyInProgress = newSubtopics.some(sub => sub.status !== "not_started");
          
          if (allMastered && newSubtopics.length > 0) newParentStatus = "mastered";
          else if (anyInProgress && t.status === "not_started") newParentStatus = "in_progress";

          return { ...t, subtopics: newSubtopics, status: newParentStatus };
        }
        return t;
      })
    );
  };

  const handleAddTopic = (newTopic: SyllabusTopic) => {
    setSyllabus((prev) => [newTopic, ...prev]);
  };

  const handleDeleteTopic = (topicId: string) => {
    setSyllabus((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleResetDefaultSyllabus = () => {
    setSyllabus(DEFAULT_SYLLABUS);
    localStorage.setItem("ras_syllabus", JSON.stringify(DEFAULT_SYLLABUS));
  };

  // Handlers for Study Plan Milestones
  const handleToggleMilestone = (phaseId: string, milestoneId: string) => {
    setStudyPlanPhases((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            return { ...m, completed: !m.completed };
          }),
        };
      })
    );
  };

  const handleAddMilestone = (
    phaseId: string,
    title: string,
    targetDate: string
  ) => {
    setStudyPlanPhases((prev) =>
      prev.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: [
              ...p.milestones,
              {
                id: `milestone-${Date.now()}`,
                title,
                targetDate: targetDate || "Upcoming",
                completed: false,
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const handleDeleteMilestone = (phaseId: string, milestoneId: string) => {
    setStudyPlanPhases((prev) =>
      prev.map((p) => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.filter((m) => m.id !== milestoneId),
          };
        }
        return p;
      })
    );
  };

  const handleResetDefaultStudyPlan = () => {
    setStudyPlanPhases(DEFAULT_STUDY_PLAN);
    localStorage.setItem("ras_study_plan", JSON.stringify(DEFAULT_STUDY_PLAN));
  };

  // Handlers for Study Session Logs
  const handleAddSessionLog = (log: StudySessionLog) => {
    setSessionLogs((prev) => [log, ...prev]);
  };

  const handleDeleteSessionLog = (id: string) => {
    setSessionLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleResetDefaultSessionLogs = () => {
    const defaults: StudySessionLog[] = [
      {
        id: "init-1",
        date: new Date().toISOString().split("T")[0],
        subject: "राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत",
        paper: "Prelims GS1",
        durationMinutes: 120,
        topicCovered: "Preamble & Fundamental Rights Articles 14-18",
        qualityRating: 5,
        notes: "Revised landmark case laws (Maneka Gandhi, Kesavananda)",
      },
      {
        id: "init-2",
        date: new Date().toISOString().split("T")[0],
        subject: "Current Affairs",
        paper: "Prelims GS1",
        durationMinutes: 60,
        topicCovered:
          "The Hindu Editorial: India-US Trade & Semiconductor Mission",
        qualityRating: 4,
      },
    ];
    setSessionLogs(defaults);
    localStorage.setItem("ras_study_logs", JSON.stringify(defaults));
  };

  // Handlers for Mock Test Logs
  const handleAddMockLog = (log: MockTestLog) => {
    setMockLogs((prev) => [log, ...prev]);
  };

  const handleDeleteMockLog = (id: string) => {
    setMockLogs((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers for Spaced Revision Queue
  const handleCompleteRevision = (itemId: string) => {
    setRevisionQueue((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddRevisionItem = (item: RevisionItem) => {
    setRevisionQueue((prev) => [item, ...prev]);
  };

  const handleDeleteRevisionItem = (itemId: string) => {
    setRevisionQueue((prev) => prev.filter((r) => r.id !== itemId));
  };

  const handleResetDefaultRevisionQueue = () => {
    setRevisionQueue(DEFAULT_REVISION_QUEUE);
    localStorage.setItem(
      "ras_revision_queue",
      JSON.stringify(DEFAULT_REVISION_QUEUE)
    );
  };

  // Handlers for PYQs
  const handleAddPYQ = (newPyq: PYQQuestion) => {
    setPyqs((prev) => [newPyq, ...prev]);
  };

  const handleDeletePYQ = (id: string) => {
    setPyqs((prev) => prev.filter((q) => q.id !== id));
  };

  const handleResetDefaultPYQs = () => {
    setPyqs(PYQ_DATABASE);
    localStorage.setItem("ras_pyqs", JSON.stringify(PYQ_DATABASE));
  };



  const handleAdoptRoutine = (routine: TopperRoutine) => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("ras_daily_tasks_date", today);
    // Convert TopperRoutine schedule to DailyTasks
    const newTasks: DailyTask[] = [
      {
        id: `adopted-task-wakeup-${Date.now()}`,
        title: "Wake Up & Morning Routine",
        completed: false,
        type: "study",
        timeSlot: routine.wakeUpTime || "06:00 AM",
        subject: "Health & Routine",
      },
      ...routine.schedule.map((item, idx) => ({
        id: `adopted-task-${Date.now()}-${idx}`,
        title: item.activity,
        completed: false,
        type: item.category.toLowerCase().includes("break") || item.category.toLowerCase().includes("sleep") 
              ? "revision" // Fallback type, not perfect but works for UI
              : "study",
        timeSlot: item.time,
        subject: item.category,
      }) as DailyTask),
      {
        id: `adopted-task-sleep-${Date.now()}`,
        title: "Sleep & Recovery",
        completed: false,
        type: "study",
        timeSlot: routine.sleepTime || "11:00 PM",
        subject: "Health & Routine",
      }
    ];
    
    setDailyTasks(newTasks);
    localStorage.setItem("ras_daily_tasks_v2", JSON.stringify(newTasks));
    setActiveTab("home"); // Navigate home where daily tasks are visible
  };

  const handleGlobalNavigate = (tab: MainTab, subTab?: string) => {
    setActiveTab(tab);
    if (tab === "toppers" && subTab) setTopperSubTab(subTab as TopperSubTab);
    if (tab === "prep" && subTab) setPrepSubTab(subTab as PrepSubTab);
    if (tab === "analytics" && subTab)
      setAnalyticsSubTab(subTab as AnalyticsSubTab);
  };

  return (
    <>
      {window.location.search.includes('mode=gallery') ? (
        <UIGallery />
      ) : (
        <>
          {/* App Shell Modals */}
          <AnimatePresence>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}</AnimatePresence>


      <div
        className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* Main Top Navigation Header */}
        <div className="sticky top-0 z-50 w-full">
          <Navbar
            userProfile={userProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSearch={() => setSearchOpen(true)}

            studyStreak={studyStreak}
            timerRunning={timerRunning}
            timerSeconds={timerSeconds}
            onToggleTimer={() => setTimerRunning(!timerRunning)}
            hasUpdate={true} // Always show green animation for Sync Data based on user request
            onOpenUpdateModal={async () => {
              // 1. First sync Excel data immediately
              setTopperRoutines(prev => {
                const localMap = new Map(prev.map(item => [item.id, item]));
                const merged = TOPPER_ROUTINES.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, localItem, item) : item; });
                const remoteIds = new Set(TOPPER_ROUTINES.map(item => item.id));
                prev.forEach(item => { if (!remoteIds.has(item.id)) merged.push(item); });
                return merged;
              });
              
              setToppers(prev => {
                const localMap = new Map(prev.map(item => [item.id, item]));
                const merged = TOPPERS_PROFILES.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, localItem, item) : item; });
                const remoteIds = new Set(TOPPERS_PROFILES.map(item => item.id));
                prev.forEach(item => { if (!remoteIds.has(item.id)) merged.push(item); });
                return merged;
              });

              setStrategies(prev => {
                const localMap = new Map(prev.map(item => [item.id, item]));
                const merged = STRATEGY_SETUP.map(item => { const localItem = localMap.get(item.id); return localItem ? Object.assign({}, item, localItem) : item; });
                const remoteIds = new Set(STRATEGY_SETUP.map(item => item.id));
                prev.forEach(item => { if (!remoteIds.has(item.id)) merged.push(item); });
                return merged;
              });

              // 2. If on Android, force-fetch and apply latest GitHub release
              if (Capacitor.isNativePlatform()) {
                try {
                  alert("🔄 Checking for latest update from GitHub...");
                  const res = await fetch(
                    "https://api.github.com/repos/RONESIRVI/PREP_AiR/releases/latest"
                  );
                  const data = await res.json();
                  const asset = data?.assets?.find((a: any) => a.name === "dist.zip");

                  if (asset) {
                    alert(`📥 Downloading latest version: ${data.tag_name}. App will restart automatically.`);
                    const version = await CapacitorUpdater.download({
                      url: asset.browser_download_url,
                      version: data.tag_name,
                    });
                    localStorage.setItem("app_version", data.tag_name);
                    await CapacitorUpdater.set({ id: version.id });
                  } else {
                    alert("✅ Data synced! No new app update found.");
                  }
                } catch (e) {
                  alert("✅ Excel Data Synced! (App update check failed - check internet)");
                }
              } else {
                // Web version - just reload page to get fresh assets
                alert("✅ Data synced! Reloading to apply latest changes...");
                setTimeout(() => window.location.reload(), 500);
              }
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Core Content Canvas */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Pillar 0: HOME / COMMAND CENTER */}
                {activeTab === "home" && (
                  <HomeSection
                    userProfile={userProfile}
                    onOpenProfileEdit={() => setIsProfileModalOpen(true)}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    setActiveTab={setActiveTab}
                    dailyTasks={dailyTasks}
                    setDailyTasks={setDailyTasks}
                    sessionLogs={sessionLogs}
                    syllabus={syllabus}
                    dailyGoalHours={dailyGoalHours}
                    studyStreak={studyStreak}
                    weakAreas={weakAreas}
                    revisionQueue={revisionQueue}
                    studyPlanPhases={studyPlanPhases}
                    currentStudySession={currentStudySession}
                    setCurrentStudySession={setCurrentStudySession}
                    mockLogs={mockLogs}
                    onSaveAudioNote={(note) => {
                      setAudioNotes(prev => [note, ...prev]);
                      // Auto switch to toppers interview tab to show the saved note
                      setActiveTab("toppers");
                      setTopperSubTab("interviews");
                    }}
                    onAddSessionLog={handleAddSessionLog}
                  />
                )}

                {/* Pillar 1: TOPPERS */}
                {activeTab === "toppers" && (
                  <ToppersSection
                    activeSubTab={topperSubTab}
                    setActiveSubTab={setTopperSubTab}
                    strategies={strategies}
                    onAdoptRoutine={handleAdoptRoutine}
                    toppers={toppers}
                    setToppers={setToppers}
                    routines={topperRoutines}
                    setRoutines={setTopperRoutines}
                    audioNotes={audioNotes}
                    setAudioNotes={setAudioNotes}
                    notes={notes}
                  />
                )}

                {/* Pillar 2: PREPARATION */}
                {activeTab === "prep" && (
                  <PrepSection
                    activeSubTab={prepSubTab}
                    setActiveSubTab={setPrepSubTab}
                    syllabus={syllabus}
                    setSyllabus={setSyllabus}
                    onUpdateTopicStatus={handleUpdateTopicStatus}
                    onUpdateMicroTopicStatus={handleUpdateMicroTopicStatus}
                    onAddTopic={handleAddTopic}
                    onDeleteTopic={handleDeleteTopic}
                    onResetDefaultSyllabus={handleResetDefaultSyllabus}
                    phases={studyPlanPhases}
                    onToggleMilestone={handleToggleMilestone}
                    onAddMilestone={handleAddMilestone}
                    onDeleteMilestone={handleDeleteMilestone}
                    onResetDefaultStudyPlan={handleResetDefaultStudyPlan}
                    sessionLogs={sessionLogs}
                    onAddSessionLog={handleAddSessionLog}
                    onDeleteSessionLog={handleDeleteSessionLog}
                    onResetDefaultSessionLogs={handleResetDefaultSessionLogs}
                    revisionQueue={revisionQueue}
                    onCompleteRevision={handleCompleteRevision}
                    onAddRevisionItem={handleAddRevisionItem}
                    onDeleteRevisionItem={handleDeleteRevisionItem}
                    onResetDefaultRevisionQueue={
                      handleResetDefaultRevisionQueue
                    }
                    pyqs={pyqs}
                    onAddPYQ={handleAddPYQ}
                    onDeletePYQ={handleDeletePYQ}
                    onResetDefaultPYQs={handleResetDefaultPYQs}
                    currentStudySession={currentStudySession}
                    setCurrentStudySession={setCurrentStudySession}
                    onStartTimer={() => setTimerRunning(true)}
                  />
                )}

                {/* Pillar 3: ANALYTICS */}
                {activeTab === "analytics" && (
                  <AnalyticsSection
                    activeSubTab={analyticsSubTab}
                    setActiveSubTab={setAnalyticsSubTab}
                    syllabus={syllabus}
                    sessionLogs={sessionLogs}
                    studyStreak={studyStreak}
                    mockLogs={mockLogs}
                    onAddMockLog={handleAddMockLog}
                    onDeleteMockLog={handleDeleteMockLog}
                    weakAreas={weakAreas}
                  />
                )}

                {/* Pillar 4: SMART OCR */}
                {activeTab === "ocr" && <SmartExtractorTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Floating Active Timer Widget */}
        {(timerRunning || timerSeconds > 0) && (
          <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-[100] bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-3xl p-4 shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`${timerRunning ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75`}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Active Focus
              </span>
              <span className="font-mono text-3xl font-black text-white leading-none tracking-tighter">
                {Math.floor(timerSeconds / 3600).toString().padStart(2, "0")}:
                {Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, "0")}:
                {(timerSeconds % 60).toString().padStart(2, "0")}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-1.5 truncate max-w-[160px]">
                {currentStudySession.topic || currentStudySession.subject || "General Session"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className={`w-[72px] h-10 rounded-xl flex items-center justify-center transition-all border ${timerRunning ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'}`}
              >
                <span className="text-xs font-black tracking-wider uppercase">{timerRunning ? 'Pause' : 'Resume'}</span>
              </button>
              <button 
                onClick={() => {
                   setTimerRunning(false);
                   handleAddSessionLog({
                     id: Date.now().toString(),
                     date: new Date().toISOString().split("T")[0],
                     subject: currentStudySession.subject || "General Session",
                     paper: "General", // Placeholder
                     durationMinutes: Math.max(1, Math.floor(timerSeconds / 60)),
                     topicCovered: currentStudySession.topic || "Self Study",
                     qualityRating: 5,
                     notes: currentStudySession.subtopic ? `Sub-topic: ${currentStudySession.subtopic}` : "",
                   });
                   setTimerSeconds(0);
                   setCurrentStudySession({ 
                     paper: "",
                     subject: "", 
                     topic: "", 
                     subtopic: "",
                     taskType: "study",
                     triggerTimerStart: false 
                  });
                }}
                className="w-[72px] h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/20 transition-all"
              >
                <span className="text-xs font-black tracking-wider uppercase">End</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Floating Bottom App Bar (Native Android App Experience) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-bottom px-2 py-1.5 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
              activeTab === "home"
                ? "text-indigo-600 font-bold bg-indigo-50/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Home
              className={`w-5 h-5 mb-0.5 ${
                activeTab === "home" ? "text-indigo-600" : "text-slate-500"
              }`}
            />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("toppers")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
              activeTab === "toppers"
                ? "text-indigo-600 font-bold bg-indigo-50/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Trophy
              className={`w-5 h-5 mb-0.5 ${
                activeTab === "toppers" ? "text-indigo-600" : "text-slate-500"
              }`}
            />
            <span className="text-[10px] tracking-tight">Toppers</span>
          </button>

          <button
            onClick={() => setActiveTab("prep")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
              activeTab === "prep"
                ? "text-indigo-600 font-bold bg-indigo-50/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen
              className={`w-5 h-5 mb-0.5 ${
                activeTab === "prep" ? "text-indigo-600" : "text-slate-500"
              }`}
            />
            <span className="text-[10px] tracking-tight">Prep</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
              activeTab === "analytics"
                ? "text-indigo-600 font-bold bg-indigo-50/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3
              className={`w-5 h-5 mb-0.5 ${
                activeTab === "analytics" ? "text-indigo-600" : "text-slate-500"
              }`}
            />
            <span className="text-[10px] tracking-tight">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("ocr")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
              activeTab === "ocr"
                ? "text-indigo-600 font-bold bg-indigo-50/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ScanSearch className={`w-5 h-5 mb-0.5 ${
                activeTab === "ocr" ? "text-indigo-600" : "text-slate-500"
              }`} />
            <span className="text-[10px] tracking-tight">OCR</span>
          </button>

        </div>

        {/* Update Modal */}
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          updateInfo={updateInfo}
          onUpdateNow={handleUpdateNow}
          progress={updateProgress}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={handleGlobalNavigate}
        />

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={userProfile}
          onSave={(newProfile) => {
            setUserProfile(newProfile);
          }}
        />        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white pt-6 pb-24 lg:pb-6 text-slate-500 text-xs text-center mt-12 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                C
              </span>
              <span className="font-semibold text-slate-700">
                PREP AiR Master Hub
              </span>
              <span>• Bento Grid Preparation Suite</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>PREP AiR App</span>
              <span className="text-indigo-600 font-bold">
                • 100% Offline-Safe Storage
              </span>
            </div>
          </div>
        </footer>
      </div>
        </>
      )}
    </>
  );
}
