import { useState, useEffect, useRef } from 'react';
import { db } from '../store/db';

export function useTimerEngine(initialMinutes: number, mode: 'TIMER' | 'POMODORO', tagId: number) {
  const [durationSec] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save to database
    if (sessionStartTime) {
      try {
        await db.focus_sessions.add({
          start_time: sessionStartTime,
          end_time: Date.now(),
          duration_min: initialMinutes,
          mode: mode,
          tag_id: tagId,
          completed: true
        });
        console.log("Session saved to database!");
      } catch (err) {
        console.error("Failed to save session:", err);
      }
    }
  };

  const toggleTimer = () => {
    if (!isRunning && timeLeft > 0) {
      if (!sessionStartTime) setSessionStartTime(Date.now());
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationSec);
    setSessionStartTime(null);
  };

  // Format time as MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // SVG Ring Progress (0 = full, 282.7 = empty)
  const maxDashOffset = 282.7;
  const progressPercent = timeLeft / durationSec;
  const dashOffset = maxDashOffset - (maxDashOffset * progressPercent);

  return {
    timeLeft,
    formattedTime,
    isRunning,
    dashOffset,
    toggleTimer,
    resetTimer
  };
}
