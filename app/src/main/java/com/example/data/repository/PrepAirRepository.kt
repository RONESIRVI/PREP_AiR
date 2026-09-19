package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.local.entity.AppLimitEntity
import com.example.data.local.entity.FocusSessionEntity
import com.example.data.local.entity.GroupEntity
import com.example.data.local.entity.ScheduleEntity
import kotlinx.coroutines.flow.Flow

class PrepAirRepository(private val database: AppDatabase) {

    val allSessions: Flow<List<FocusSessionEntity>> = database.focusSessionDao().getAllSessions()
    val allSchedules: Flow<List<ScheduleEntity>> = database.scheduleDao().getAllSchedules()
    val allLimits: Flow<List<AppLimitEntity>> = database.appLimitDao().getAllLimits()
    val allGroups: Flow<List<GroupEntity>> = database.groupDao().getAllGroups()

    fun getTodayFocusMinutes(date: String): Flow<Int?> = database.focusSessionDao().getTodayFocusMinutes(date)

    suspend fun saveSession(session: FocusSessionEntity): Long {
        return database.focusSessionDao().insertSession(session)
    }

    suspend fun addSchedule(schedule: ScheduleEntity): Long {
        return database.scheduleDao().insertSchedule(schedule)
    }

    suspend fun updateSchedule(schedule: ScheduleEntity) {
        database.scheduleDao().updateSchedule(schedule)
    }

    suspend fun deleteSchedule(id: Long) {
        database.scheduleDao().deleteSchedule(id)
    }

    suspend fun addAppLimit(limit: AppLimitEntity): Long {
        return database.appLimitDao().insertLimit(limit)
    }

    suspend fun updateAppLimit(limit: AppLimitEntity) {
        database.appLimitDao().updateLimit(limit)
    }

    suspend fun deleteAppLimit(id: Long) {
        database.appLimitDao().deleteLimit(id)
    }

    suspend fun addGroup(group: GroupEntity): Long {
        return database.groupDao().insertGroup(group)
    }
}
