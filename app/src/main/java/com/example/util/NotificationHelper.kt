package com.example.util

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.example.MainActivity
import com.example.R

/**
 * Notifications Allowed System for PREP_AiR
 * Handles:
 * - Runtime permission checking (POST_NOTIFICATIONS for Android 13+)
 * - Dedicated Notification Channels (System Updates & App Alerts)
 * - Safe dispatch of Version Upgrade & OTA alerts
 * - Direct intent linking to System Update setup
 */
object NotificationHelper {

    const val CHANNEL_ID_UPDATES = "channel_system_updates"
    const val CHANNEL_ID_ALERTS = "channel_app_alerts"

    const val NOTIFICATION_ID_UPDATE_AVAILABLE = 1001
    const val NOTIFICATION_ID_UPDATE_READY = 1002
    const val NOTIFICATION_ID_DOWNLOAD_PROGRESS = 1003
    const val NOTIFICATION_ID_TEST = 1004

    /**
     * Checks if the app is allowed to post notifications.
     */
    fun areNotificationsAllowed(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            NotificationManagerCompat.from(context).areNotificationsEnabled()
        }
    }

    /**
     * Initializes notification channels required on Android 8.0+ (API 26+).
     */
    fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val updateChannel = NotificationChannel(
                CHANNEL_ID_UPDATES,
                "System Version & OTA Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifies when a new system version is available or ready to install without external links."
                enableLights(true)
                enableVibration(true)
            }

            val alertChannel = NotificationChannel(
                CHANNEL_ID_ALERTS,
                "App Alerts & Schedule Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Focus sessions and schedule notifications."
            }

            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            manager?.createNotificationChannel(updateChannel)
            manager?.createNotificationChannel(alertChannel)
        }
    }

    /**
     * Shows a heads-up notification when a new system version is released.
     */
    fun showUpdateAvailableNotification(
        context: Context,
        versionName: String,
        releaseTitle: String
    ) {
        if (!areNotificationsAllowed(context)) return

        createNotificationChannels(context)

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("OPEN_UPDATE_DIALOG", true)
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID_UPDATES)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("⚡ PREP_AiR New Version v$versionName")
            .setContentText(releaseTitle.ifEmpty { "नया सिस्टम अपडेट उपलब्ध है। 1-क्लिक में इंस्टॉल करें।" })
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("PREP_AiR v$versionName उपलब्ध है: ${releaseTitle.ifEmpty { "बिना किसी बाहरी लिंक के सुरक्षित इन-ऐप इंस्टॉलेशन।" }}")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_SYSTEM)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_UPDATE_AVAILABLE, notification)
        } catch (_: SecurityException) {
            // Handled safely
        }
    }

    /**
     * Shows a notification when the APK download has completed and is ready for 1-click install.
     */
    fun showUpdateReadyNotification(
        context: Context,
        versionName: String
    ) {
        if (!areNotificationsAllowed(context)) return

        createNotificationChannels(context)

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("OPEN_UPDATE_DIALOG", true)
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            1,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID_UPDATES)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("📦 Update Ready: PREP_AiR v$versionName")
            .setContentText("APK डाउनलोड पूरा हो गया। 1-क्लिक में अपग्रेड पूरा करने के लिए टैप करें।")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            // Cancel progress notification if any
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID_DOWNLOAD_PROGRESS)
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_UPDATE_READY, notification)
        } catch (_: SecurityException) {
            // Handled safely
        }
    }

    /**
     * Cancels any active system update notification.
     */
    fun cancelUpdateNotification(context: Context) {
        try {
            val manager = NotificationManagerCompat.from(context)
            manager.cancel(NOTIFICATION_ID_UPDATE_AVAILABLE)
            manager.cancel(NOTIFICATION_ID_UPDATE_READY)
            manager.cancel(NOTIFICATION_ID_DOWNLOAD_PROGRESS)
        } catch (_: Exception) {}
    }

    /**
     * Sends an immediate test notification to confirm the notifications system is working and clicking.
     */
    fun sendTestNotification(context: Context): Boolean {
        createNotificationChannels(context)
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            2,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )
        val notification = NotificationCompat.Builder(context, CHANNEL_ID_ALERTS)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("🔔 PREP_AiR Notification System Active")
            .setContentText("नोटिफिकेशन सिस्टम सक्रिय और टेस्ट पास हो चुका है! ✓")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()
        return try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_TEST, notification)
            true
        } catch (_: SecurityException) {
            false
        }
    }

    /**
     * Opens system notification settings page for the app so the user can easily manage permissions.
     */
    fun openNotificationSettings(context: Context) {
        val intent = Intent().apply {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                action = Settings.ACTION_APP_NOTIFICATION_SETTINGS
                putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
            } else {
                action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                data = Uri.fromParts("package", context.packageName, null)
            }
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            context.startActivity(intent)
        } catch (_: Exception) {}
    }
}
