package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entity.AppLimitEntity
import com.example.data.local.entity.FocusSessionEntity
import com.example.data.local.entity.GroupEntity
import com.example.data.local.entity.ScheduleEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FocusSessionDao {
    @Query("SELECT * FROM focus_sessions ORDER BY id DESC")
    fun getAllSessions(): Flow<List<FocusSessionEntity>>

    @Query("SELECT SUM(durationMin) FROM focus_sessions WHERE dateStr = :todayDate")
    fun getTodayFocusMinutes(todayDate: String): Flow<Int?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: FocusSessionEntity): Long
}

@Dao
interface ScheduleDao {
    @Query("SELECT * FROM schedules ORDER BY id ASC")
    fun getAllSchedules(): Flow<List<ScheduleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSchedule(schedule: ScheduleEntity): Long

    @Update
    suspend fun updateSchedule(schedule: ScheduleEntity)

    @Query("DELETE FROM schedules WHERE id = :id")
    suspend fun deleteSchedule(id: Long)
}

@Dao
interface AppLimitDao {
    @Query("SELECT * FROM app_limits ORDER BY dailyLimitMin DESC")
    fun getAllLimits(): Flow<List<AppLimitEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLimit(limit: AppLimitEntity): Long

    @Update
    suspend fun updateLimit(limit: AppLimitEntity)

    @Query("DELETE FROM app_limits WHERE id = :id")
    suspend fun deleteLimit(id: Long)
}

@Dao
interface GroupDao {
    @Query("SELECT * FROM study_groups ORDER BY totalHours DESC")
    fun getAllGroups(): Flow<List<GroupEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroup(group: GroupEntity): Long
}
