import React, { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { LocalNotifications } from "@capacitor/local-notifications";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { UpdateModal } from "./components/ui/UpdateModal";
import { AnimatePresence } from "framer-motion";

export default function App() {
  // Initialize Push Notifications
  usePushNotifications();
  const [updateInfo, setUpdateInfo] = useState<{ version: string; body: string; url: string } | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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
            title: "✓ PREP AiR Updated",
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

  return (
    <>
      <div
        className="min-h-screen bg-slate-900 text-white font-sans antialiased flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-md text-center space-y-8">
          <img 
            src="/welcome-image.png" 
            alt="Welcome Update Soon" 
            className="w-full h-auto rounded-3xl shadow-2xl object-cover ring-4 ring-white/10"
          />
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-amber-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
            Welcome
          </h1>
          <p className="text-slate-400 text-lg font-medium tracking-wide uppercase" style={{ letterSpacing: '0.2em' }}>
            Update Soon
          </p>
        </div>
      </div>
      
      <AnimatePresence>
        {isUpdateModalOpen && updateInfo && (
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={handleUpdateNow}
            updateInfo={updateInfo}
            updateProgress={updateProgress}
          />
        )}
      </AnimatePresence>
    </>
  );
}
