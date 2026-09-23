package com.sadhna.focus.data.usage

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Process
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.Calendar
import javax.inject.Inject
import javax.inject.Singleton

// ── Per-app usage summary ──────────────────────────────────────────────────
data class AppUsage(
    val packageName: String,
    val appName: String,
    val usedMin: Int,             // minutes used today
    val category: AppCategory,
    val iconDrawableId: Int = 0,  // loaded separately via PackageManager
)

enum class AppCategory { DISTRACTING, PRODUCTIVE, OTHERS }

// ── Known distracting apps ─────────────────────────────────────────────────
private val DISTRACTING_PACKAGES = setOf(
    "com.facebook.katana",      // Facebook
    "com.facebook.orca",        // Messenger
    "com.instagram.android",    // Instagram
    "com.google.android.youtube",// YouTube
    "com.snapchat.android",     // Snapchat
    "com.twitter.android",      // Twitter/X
    "com.zhiliaoapp.musically", // TikTok
    "com.reddit.frontpage",     // Reddit
    "com.linkedin.android",     // LinkedIn
    "com.pinterest",            // Pinterest
)

private val PRODUCTIVE_PACKAGES = setOf(
    "in.sadhna.focus",
    "com.google.android.googlequicksearchbox",
    "com.google.android.apps.docs",
    "com.google.android.apps.sheets",
    "com.microsoft.office.word",
    "com.microsoft.office.excel",
    "com.android.chrome",
    "org.telegram.messenger",   // debatable but set as productive
    "com.google.android.apps.classroom",
)

// ═══════════════════════════════════════════════════════════════════════════
//  UsageStatsHelper — wraps Android UsageStatsManager API
// ═══════════════════════════════════════════════════════════════════════════
@Singleton
class UsageStatsHelper @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val usageManager = context.getSystemService(Context.USAGE_STATS_SERVICE)
                               as UsageStatsManager
    private val packageManager: PackageManager = context.packageManager

    // ── Check if user granted PACKAGE_USAGE_STATS permission ──────────────
    fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode   = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            context.packageName,
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    // ── Today's usage (midnight → now) ────────────────────────────────────
    fun getTodayUsage(): List<AppUsage> {
        val now   = System.currentTimeMillis()
        val start = startOfDayMs()
        return getUsageInRange(start, now)
    }

    // ── Last 7 days — for weekly bar chart ────────────────────────────────
    fun getWeeklyUsageByDay(): Map<String, Long> {
        val result  = LinkedHashMap<String, Long>()
        val cal     = Calendar.getInstance()

        // Walk back 6 days (today is index 0)
        repeat(7) { daysBack ->
            val end   = cal.timeInMillis
            cal.add(Calendar.DAY_OF_YEAR, -1)
            val start = cal.timeInMillis

            val stats = usageManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, start, end
            )
            val totalMs = stats?.sumOf { it.totalTimeInForeground } ?: 0L
            val label   = dayLabel(daysBack)
            result[label] = totalMs / 60_000L  // → minutes
        }
        return result
    }

    // ── Private helpers ───────────────────────────────────────────────────
    private fun getUsageInRange(startMs: Long, endMs: Long): List<AppUsage> {
        val stats = usageManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, startMs, endMs
        ) ?: return emptyList()

        return stats
            .filter { it.totalTimeInForeground > 0 }
            .mapNotNull { stat ->
                val appName = try {
                    packageManager.getApplicationLabel(
                        packageManager.getApplicationInfo(stat.packageName, 0)
                    ).toString()
                } catch (_: Exception) { return@mapNotNull null }

                val usedMin  = (stat.totalTimeInForeground / 60_000L).toInt()
                if (usedMin < 1) return@mapNotNull null   // Skip < 1 min

                AppUsage(
                    packageName = stat.packageName,
                    appName     = appName,
                    usedMin     = usedMin,
                    category    = categorize(stat.packageName),
                )
            }
            .sortedByDescending { it.usedMin }
    }

    private fun categorize(pkg: String): AppCategory = when {
        pkg in DISTRACTING_PACKAGES -> AppCategory.DISTRACTING
        pkg in PRODUCTIVE_PACKAGES  -> AppCategory.PRODUCTIVE
        else                        -> AppCategory.OTHERS
    }

    private fun startOfDayMs(): Long {
        val cal = Calendar.getInstance()
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        return cal.timeInMillis
    }

    private fun dayLabel(daysBack: Int): String {
        val days = listOf("S","M","T","W","T","F","S")
        val cal  = Calendar.getInstance()
        cal.add(Calendar.DAY_OF_YEAR, -daysBack)
        return days[cal.get(Calendar.DAY_OF_WEEK) - 1]
    }
}
