package com.prepair.app;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;

public class AppBlockerService extends AccessibilityService {
    private static final String TAG = "AppBlockerService";
    
    // Default blocks. Can be updated via Capacitor Plugin
    public static Set<String> blockedPackages = new HashSet<>(Arrays.asList(
        "com.instagram.android", "com.google.android.youtube", "com.facebook.katana", "com.zhiliaoapp.musically"
    ));
    public static boolean isStrictActive = false;

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (!isStrictActive) return;

        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            if (event.getPackageName() != null) {
                String packageName = event.getPackageName().toString();
                
                // Don't block our own app
                if (packageName.equals(getPackageName())) return;
                
                if (blockedPackages.contains(packageName)) {
                    Log.d(TAG, "BLOCKED Distracting App: " + packageName);
                    
                    // Launch MainActivity to overlay/block the app
                    Intent intent = new Intent(this, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                }
            }
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "App Blocker Interrupted");
    }
}
