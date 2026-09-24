import { playTimerChime } from "./audioAlert";

export type NotificationPermissionStatus =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

let titleBlinkInterval: any = null;
let originalDocumentTitle =
  typeof document !== "undefined"
    ? document.title
    : "RAS AI Preparation Suite";

/**
 * Checks if browser Native Notifications are supported
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Gets the current Notification permission status
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Requests native notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (err) {
    console.warn("Notification permission request failed:", err);
    return "denied";
  }
}

/**
 * Starts title blinking when tab is out of focus
 */
export function startTitleAlert(alertMessage: string) {
  if (typeof document === "undefined") return;

  // Stop existing blinker
  stopTitleAlert();

  originalDocumentTitle = document.title || "RAS AI Preparation Suite";
  let isAlert = true;

  titleBlinkInterval = setInterval(() => {
    document.title = isAlert ? `🔔 ${alertMessage}` : originalDocumentTitle;
    isAlert = !isAlert;
  }, 1000);

  // Clear when window gets focus
  const clearOnFocus = () => {
    stopTitleAlert();
    window.removeEventListener("focus", clearOnFocus);
    window.removeEventListener("click", clearOnFocus);
  };

  window.addEventListener("focus", clearOnFocus);
  window.addEventListener("click", clearOnFocus);
}

/**
 * Stops blinking document title
 */
export function stopTitleAlert() {
  if (titleBlinkInterval) {
    clearInterval(titleBlinkInterval);
    titleBlinkInterval = null;
    if (typeof document !== "undefined") {
      document.title = originalDocumentTitle;
    }
  }
}

/**
 * Dispatches a native browser notification when a study session or break timer ends
 */
export function triggerTimerEndNotification(options: {
  phase: "focus" | "short_break" | "long_break";
  cycle?: number;
  topic?: string;
  playSound?: boolean;
}) {
  const { phase, cycle = 1, topic, playSound = true } = options;

  let title = "🎯 RAS Focus Session Completed!";
  let body = topic
    ? `Great job! You've finished your focus block on "${topic}". Time for a well-deserved break.`
    : "Great discipline! Focus session finished. Take a rest to consolidate your memory.";

  if (phase === "short_break") {
    title = "☕ Short Break Ended";
    body = `Cycle ${cycle} is starting! Ready to resume your RAS study block?`;
  } else if (phase === "long_break") {
    title = "⚡ Long Rest Concluded";
    body =
      "Your recharge window is complete. Ready to begin the next study sprint?";
  }

  // 1. Play sound chime
  if (playSound) {
    playTimerChime(phase === "focus" ? "focus_end" : "break_end");
  }

  // 2. Alert tab title if document is hidden / not in focus
  if (typeof document !== "undefined" && document.hidden) {
    startTitleAlert(
      phase === "focus" ? "FOCUS TIME COMPLETED!" : "BREAK TIME FINISHED!"
    );
  }

  // 3. Dispatch Native Browser Notification
  if (isNotificationSupported() && Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "upsc-study-timer",
        requireInteraction: true, // Remains on screen until clicked
        silent: false,
      });

      notification.onclick = () => {
        if (typeof window !== "undefined") {
          window.focus();
        }
        notification.close();
        stopTitleAlert();
      };
    } catch (err) {
      console.warn("Could not dispatch native notification:", err);
    }
  }
}
