package com.sadhna.focus.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

// ═══════════════════════════════════════════════════════════════════
//  ENTITY 1 — focus_sessions
//  Stores every completed (or stopped) focus session.
// ═══════════════════════════════════════════════════════════════════
@Entity(tableName = "focus_sessions")
data class FocusSessionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int             = 0,
    val startTime: Long,            // Unix ms — session start
    val endTime: Long,              // Unix ms — session end
    val durationMin: Int,           // Duration in minutes
    val mode: String,               // "TIMER" | "STOPWATCH" | "POMODORO"
    val tagId: Int          = 0,    // FK → tags.id (0 = untagged)
    val completed: Boolean  = false,// true = goal was reached
)

// ═══════════════════════════════════════════════════════════════════
//  ENTITY 2 — schedules
//  Recurring or one-off study blocks shown in Planner tab.
// ═══════════════════════════════════════════════════════════════════
@Entity(tableName = "schedules")
data class ScheduleEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int                     = 0,
    val name: String,               // "Morning Sadhna"
    val icon: String,               // emoji  "☀️"
    val startTime: String,          // "05:00 AM"
    val endTime: String,            // "08:00 AM"
    val tagName: String             = "STUDY",
    val repeatDaysJson: String      = "[1,2,3,4,5,6,7]", // [Mon=1..Sun=7]
    val breakMins: Int              = 5,
    val blockAppsJson: String       = "[]",  // ["com.instagram.android",…]
    val blockNotifications: Boolean = true,
    val description: String         = "",
    val createdAt: Long             = System.currentTimeMillis(),
)

// ═══════════════════════════════════════════════════════════════════
//  ENTITY 3 — app_limits
//  Per-app daily screen-time limits shown in Blocks tab.
// ═══════════════════════════════════════════════════════════════════
@Entity(tableName = "app_limits")
data class AppLimitEntity(
    @PrimaryKey
    val packageName: String,        // "com.facebook.katana"
    val appName: String,            // "Facebook"
    val dailyLimitMin: Int,         // minutes allowed per day (0 = no limit)
    val strictUntilMs: Long = 0L,   // Strict mode expiry timestamp
    val isBlockShorts: Boolean = false, // Block Reels/Shorts for this app
    val appIconBase64: String = "",  // Cached icon (optional)
)

// ═══════════════════════════════════════════════════════════════════
//  ENTITY 4 — tags
//  Colour-coded labels attached to focus sessions & schedules.
// ═══════════════════════════════════════════════════════════════════
@Entity(tableName = "tags")
data class TagEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int           = 0,
    val name: String,               // "Study", "Break", "Revision"
    val colorHex: String,           // "#FF6B00"
    val isDistracting: Boolean = false,
)

// ═══════════════════════════════════════════════════════════════════
//  ENTITY 5 — user_settings
//  Simple key-value store for app preferences.
// ═══════════════════════════════════════════════════════════════════
@Entity(tableName = "user_settings")
data class UserSettingEntity(
    @PrimaryKey
    val key: String,
    val value: String,
)

// ── Predefined setting keys (use as constants) ─────────────────────
object SettingKeys {
    const val FOCUS_GOAL_HOURS      = "focus_goal_hours"        // "8"
    const val IS_PRO                = "is_pro"                  // "true"/"false"
    const val FOCUS_MUSIC_TYPE      = "focus_music_type"        // "WHITE_NOISE"
    const val DAILY_STREAK          = "daily_streak"            // "5"
    const val LAST_ACTIVE_DATE      = "last_active_date"        // "2026-09-23"
    const val POMODORO_WORK_MINS    = "pomodoro_work_mins"      // "25"
    const val POMODORO_BREAK_MINS   = "pomodoro_break_mins"     // "5"
    const val ONBOARDING_DONE       = "onboarding_done"         // "true"
    const val OTA_LAST_CHECKED      = "ota_last_checked"        // Unix ms
    const val PROFILE_NAME          = "profile_name"            // "Aariz"
    const val PROFILE_EMOJI         = "profile_emoji"           // "🧑"
}
