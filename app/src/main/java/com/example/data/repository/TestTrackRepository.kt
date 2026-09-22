package com.example.data.repository

import com.example.data.local.dao.AppLimitDao
import com.example.data.local.dao.FocusSessionDao
import com.example.data.local.dao.GroupDao
import com.example.data.local.dao.ScheduleDao
import com.example.data.local.dao.TestRecordDao
import com.example.data.local.entity.AppLimitEntity
import com.example.data.local.entity.FocusSessionEntity
import com.example.data.local.entity.GroupEntity
import com.example.data.local.entity.ScheduleEntity
import com.example.data.local.entity.TestRecordEntity
import kotlinx.coroutines.flow.Flow

class TestTrackRepository(
    private val testRecordDao: TestRecordDao,
    private val focusSessionDao: FocusSessionDao,
    private val scheduleDao: ScheduleDao,
    private val appLimitDao: AppLimitDao,
    private val groupDao: GroupDao
) {
    // Test Records (Section 01 & Section 02)
    val allTestRecords: Flow<List<TestRecordEntity>> = testRecordDao.getAllRecords()

    fun getRecordsBySubject(subject: String): Flow<List<TestRecordEntity>> =
        testRecordDao.getRecordsBySubject(subject)

    suspend fun insertTestRecord(record: TestRecordEntity): Long =
        testRecordDao.insertRecord(record)

    suspend fun updateTestRecord(record: TestRecordEntity) =
        testRecordDao.updateRecord(record)

    suspend fun deleteTestRecord(id: Long) =
        testRecordDao.deleteRecordById(id)

    suspend fun clearAllTestRecords() =
        testRecordDao.clearAllRecords()

    // Legacy/Companion Sessions & Planner
    val allFocusSessions: Flow<List<FocusSessionEntity>> = focusSessionDao.getAllSessions()
    fun getTodayFocusMinutes(todayDate: String): Flow<Int?> = focusSessionDao.getTodayFocusMinutes(todayDate)
    suspend fun insertFocusSession(session: FocusSessionEntity): Long = focusSessionDao.insertSession(session)

    val allSchedules: Flow<List<ScheduleEntity>> = scheduleDao.getAllSchedules()
    suspend fun insertSchedule(schedule: ScheduleEntity): Long = scheduleDao.insertSchedule(schedule)
    suspend fun updateSchedule(schedule: ScheduleEntity) = scheduleDao.updateSchedule(schedule)
    suspend fun deleteSchedule(id: Long) = scheduleDao.deleteSchedule(id)

    val allLimits: Flow<List<AppLimitEntity>> = appLimitDao.getAllLimits()
    suspend fun insertLimit(limit: AppLimitEntity): Long = appLimitDao.insertLimit(limit)
    suspend fun updateLimit(limit: AppLimitEntity) = appLimitDao.updateLimit(limit)
    suspend fun deleteLimit(id: Long) = appLimitDao.deleteLimit(id)

    val allGroups: Flow<List<GroupEntity>> = groupDao.getAllGroups()
    suspend fun insertGroup(group: GroupEntity): Long = groupDao.insertGroup(group)
}
