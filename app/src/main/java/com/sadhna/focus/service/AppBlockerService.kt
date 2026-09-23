package com.sadhna.focus.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import dagger.hilt.android.AndroidEntryPoint
import com.sadhna.focus.data.local.dao.AppLimitDao
import com.sadhna.focus.data.usage.UsageStatsHelper
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.first
import javax.inject.Inject

/**
 * Sadhna — AppBlockerService
 *
 * AccessibilityService that:
 *  1. Watches every foreground app change
 *  2. If the app is in the blocked list AND we are in a focus session →
 *     shows a full-screen overlay blocking access
 *  3. Automatically hides the overlay when the user navigates away
 *
 * Must be declared in AndroidManifest.xml:
 *   <service android:name=".service.AppBlockerService"
 *            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
 *     <intent-filter>
 *       <action android:name="android.accessibilityservice.AccessibilityService"/>
 *     </intent-filter>
 *     <meta-data
 *       android:name="android.accessibilityservice"
 *       android:resource="@xml/accessibility_service_config"/>
 *   </service>
 */
@AndroidEntryPoint
class AppBlockerService : AccessibilityService() {

    @Inject lateinit var appLimitDao: AppLimitDao
    @Inject lateinit var usageHelper: UsageStatsHelper

    private val scope   = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val handler = Handler(Looper.getMainLooper())

    // Overlay view shown on top of blocked apps
    private var overlayView: View? = null
    private var windowManager: WindowManager? = null

    // Cache of currently blocked package names (refreshed every 30s)
    private var blockedPackages = setOf<String>()
    private var currentFocusSession = false

    override fun onServiceConnected() {
        super.onServiceConnected()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // Configure what events to watch
        serviceInfo = serviceInfo.apply {
            eventTypes         = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType       = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags              = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
            notificationTimeout= 100
        }

        // Start periodic refresh of blocked list
        startBlockedPackageRefresh()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val pkg = event.packageName?.toString() ?: return

        // Don't block our own app or system UI
        if (pkg == packageName || pkg == "com.android.systemui") return

        if (currentFocusSession && pkg in blockedPackages) {
            showBlockOverlay(pkg)
        } else {
            hideBlockOverlay()
        }
    }

    override fun onInterrupt() {
        hideBlockOverlay()
    }

    override fun onDestroy() {
        scope.cancel()
        hideBlockOverlay()
        super.onDestroy()
    }

    // ── Overlay management ────────────────────────────────────────────────

    private fun showBlockOverlay(blockedPkg: String) {
        if (overlayView != null) return   // Already showing

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.START }

        // Build a simple blocker view (use Compose or XML layout in production)
        val view = buildBlockerView(blockedPkg)
        overlayView = view

        handler.post {
            try { windowManager?.addView(view, params) }
            catch (_: Exception) { overlayView = null }
        }
    }

    private fun hideBlockOverlay() {
        overlayView?.let { v ->
            handler.post {
                try { windowManager?.removeView(v) }
                catch (_: Exception) {}
                overlayView = null
            }
        }
    }

    private fun buildBlockerView(pkg: String): View {
        // In production: inflate a proper Compose/XML layout
        // For now: returns a simple tinted full-screen view
        return View(this).apply {
            setBackgroundColor(0xF5000000.toInt())
            setOnClickListener {
                // Go back to home / Sadhna
                performGlobalAction(GLOBAL_ACTION_HOME)
            }
        }
    }

    // ── Refresh blocked packages list ─────────────────────────────────────

    private fun startBlockedPackageRefresh() {
        scope.launch {
            while (isActive) {
                try {
                    blockedPackages = appLimitDao.getAllBlockedPackageNames().toSet()
                } catch (_: Exception) {}
                delay(30_000L)   // Refresh every 30 seconds
            }
        }
    }

    // ── Called by FocusTimerService to toggle blocking ────────────────────

    companion object {
        const val ACTION_SESSION_STARTED = "in.sadhna.focus.SESSION_START"
        const val ACTION_SESSION_STOPPED = "in.sadhna.focus.SESSION_STOP"
        const val EXTRA_PACKAGES         = "blocked_packages"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SESSION_STARTED -> {
                currentFocusSession = true
                val pkgs = intent.getStringArrayExtra(EXTRA_PACKAGES) ?: emptyArray()
                blockedPackages     = pkgs.toSet()
            }
            ACTION_SESSION_STOPPED -> {
                currentFocusSession = false
                hideBlockOverlay()
            }
        }
        return START_STICKY
    }
}

// ── res/xml/accessibility_service_config.xml ─────────────────────────────
/*
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagReportViewIds"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_service_description"
    android:notificationTimeout="100"
    android:settingsActivity="in.sadhna.focus.ui.SettingsActivity"/>
*/
