package com.sadhna.focus.data.local.dao

import androidx.room.*
import com.sadhna.focus.data.local.entity.*
import kotlinx.coroutines.flow.Flow

// ═══════════════════════════════════════════════════════════════════
//  DAO 1 — FocusSessionDao
// ═══════════════════════════════════════════════════════════════════
@Dao
interface FocusSessionDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(session: FocusSessionEntity): Long

    @Delete
    suspend fun delete(session: FocusSessionEntity)

    // Today's total focused seconds (for ring progress)
    @Query("""
        SELECT COALESCE(SUM(durationMin), 0) * 60
        FROM focus_sessions
        WHERE startTime >= :sinceMs
    """)
    suspend fun getTotalSecondsSince(sinceMs: Long): Long?

    // All sessions for a specific day (for Progress screen)
    @Query("""
        SELECT * FROM focus_sessions
        WHERE startTime >= :dayStartMs AND startTime < :dayEndMs
        ORDER BY startTime DESC
    """)
    fun getSessionsForDay(dayStartMs: Long, dayEndMs: Long): Flow<List<FocusSessionEntity>>

    // Last 7 days — for weekly bar chart
    @Query("""
        SELECT * FROM focus_sessions
        WHERE startTime >= :sinceMs
        ORDER BY startTime DESC
    """)
    fun getSessionsSince(sinceMs: Long): Flow<List<FocusSessionEntity>>

    // Streak helper — did user focus yesterday?
    @Query("""
        SELECT COUNT(*) FROM focus_sessions
        WHERE startTime >= :dayStartMs AND startTime < :dayEndMs AND durationMin >= 1
    """)
    suspend fun getSessionCountForDay(dayStartMs: Long, dayEndMs: Long): Int
}

// ═══════════════════════════════════════════════════════════════════
//  DAO 2 — ScheduleDao
// ═══════════════════════════════════════════════════════════════════
@Dao
interface ScheduleDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(schedule: ScheduleEntity): Long

    @Delete
    suspend fun delete(schedule: ScheduleEntity)

    @Query("DELETE FROM schedules WHERE id = :id")
    suspend fun deleteById(id: Int)

    // All schedules that repeat on a given day (Planner tab list)
    @Query("""
        SELECT * FROM schedules
        WHERE repeatDaysJson LIKE '%' || :dayOfWeek || '%'
        ORDER BY startTime ASC
    """)
    suspend fun getSchedulesForDay(dayOfWeek: Int): List<ScheduleEntity>

    // Next upcoming schedule after now (for Focus tab card)
    @Query("""
        SELECT * FROM schedules
        WHERE startTime > :currentTime
        ORDER BY startTime ASC
        LIMIT 1
    """)
    suspend fun getNextScheduleAfter(currentTime: Long): ScheduleEntity?

    // Reactive list for Planner tab
    @Query("SELECT * FROM schedules ORDER BY createdAt DESC")
    fun getAllSchedules(): Flow<List<ScheduleEntity>>

    @Query("SELECT * FROM schedules WHERE id = :id")
    suspend fun getById(id: Int): ScheduleEntity?
}

// ═══════════════════════════════════════════════════════════════════
//  DAO 3 — AppLimitDao
// ═══════════════════════════════════════════════════════════════════
@Dao
interface AppLimitDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(limit: AppLimitEntity)

    @Delete
    suspend fun delete(limit: AppLimitEntity)

    @Query("DELETE FROM app_limits WHERE packageName = :pkg")
    suspend fun deleteByPackage(pkg: String)

    // All limits — for Blocks tab list
    @Query("SELECT * FROM app_limits ORDER BY appName ASC")
    fun getAllLimits(): Flow<List<AppLimitEntity>>

    // Lookup single app limit
    @Query("SELECT * FROM app_limits WHERE packageName = :pkg")
    suspend fun getByPackage(pkg: String): AppLimitEntity?

    // Apps with strict mode active
    @Query("SELECT * FROM app_limits WHERE strictUntilMs > :nowMs")
    fun getStrictApps(nowMs: Long): Flow<List<AppLimitEntity>>

    // Apps with shorts blocked
    @Query("SELECT * FROM app_limits WHERE isBlockShorts = 1")
    fun getShortsBlockedApps(): Flow<List<AppLimitEntity>>

    // All blocked package names (used by AppBlockerService)
    @Query("SELECT packageName FROM app_limits WHERE dailyLimitMin > 0")
    suspend fun getAllBlockedPackageNames(): List<String>
}

// ═══════════════════════════════════════════════════════════════════
//  DAO 4 — TagDao
// ═══════════════════════════════════════════════════════════════════
@Dao
interface TagDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(tag: TagEntity)

    @Delete
    suspend fun delete(tag: TagEntity)

    @Query("SELECT * FROM tags ORDER BY name ASC")
    fun getAllTags(): Flow<List<TagEntity>>

    @Query("SELECT * FROM tags WHERE id = :id")
    suspend fun getById(id: Int): TagEntity?
}

// ═══════════════════════════════════════════════════════════════════
//  DAO 5 — UserSettingDao
// ═══════════════════════════════════════════════════════════════════
@Dao
interface UserSettingDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun set(setting: UserSettingEntity)

    @Query("SELECT value FROM user_settings WHERE key = :key")
    suspend fun get(key: String): String?

    @Query("DELETE FROM user_settings WHERE key = :key")
    suspend fun delete(key: String)

    // Helper extensions
    suspend fun getInt(key: String, defaultValue: Int = 0): Int =
        get(key)?.toIntOrNull() ?: defaultValue

    suspend fun getBool(key: String, defaultValue: Boolean = false): Boolean =
        get(key)?.toBooleanStrictOrNull() ?: defaultValue

    suspend fun setInt(key: String, value: Int) =
        set(UserSettingEntity(key, value.toString()))

    suspend fun setBool(key: String, value: Boolean) =
        set(UserSettingEntity(key, value.toString()))
}
