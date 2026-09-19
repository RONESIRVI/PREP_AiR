package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "focus_sessions")
data class FocusSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val startTime: Long,
    val endTime: Long,
    val durationMin: Int,
    val mode: String, // TIMER, STOPWATCH, POMODORO
    val tagName: String,
    val completed: Boolean,
    val dateStr: String
)

@Entity(tableName = "schedules")
data class ScheduleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val icon: String,
    val startTime: String,
    val endTime: String,
    val repeatDays: String,
    val breakMins: Int = 5,
    val tag: String = "Study",
    val blockNotifs: Boolean = true,
    val isEnabled: Boolean = true
)

@Entity(tableName = "app_limits")
data class AppLimitEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val packageName: String,
    val appName: String,
    val iconEmoji: String,
    val dailyLimitMin: Int,
    val usedTodayMin: Int,
    val isBlockedShorts: Boolean = false,
    val isStrict: Boolean = false
)

@Entity(tableName = "study_groups")
data class GroupEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val code: String,
    val description: String,
    val memberCount: Int,
    val totalHours: Float,
    val myRank: Int,
    val joined: Boolean = true
)
