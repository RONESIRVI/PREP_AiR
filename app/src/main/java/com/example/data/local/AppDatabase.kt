package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.local.dao.AppLimitDao
import com.example.data.local.dao.FocusSessionDao
import com.example.data.local.dao.GroupDao
import com.example.data.local.dao.ScheduleDao
import com.example.data.local.entity.AppLimitEntity
import com.example.data.local.entity.FocusSessionEntity
import com.example.data.local.entity.GroupEntity
import com.example.data.local.entity.ScheduleEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        FocusSessionEntity::class,
        ScheduleEntity::class,
        AppLimitEntity::class,
        GroupEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun focusSessionDao(): FocusSessionDao
    abstract fun scheduleDao(): ScheduleDao
    abstract fun appLimitDao(): AppLimitDao
    abstract fun groupDao(): GroupDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "prep_air_database"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database)
                    }
                }
            }

            private suspend fun populateInitialData(db: AppDatabase) {
                // Initial Schedules from Blueprint
                val scheduleDao = db.scheduleDao()
                scheduleDao.insertSchedule(
                    ScheduleEntity(
                        name = "Morning Deep Work",
                        icon = "⚡",
                        startTime = "08:30 AM",
                        endTime = "10:30 AM",
                        repeatDays = "Mon, Tue, Wed, Thu, Fri",
                        breakMins = 10,
                        tag = "Deep Focus",
                        blockNotifs = true,
                        isEnabled = true
                    )
                )
                scheduleDao.insertSchedule(
                    ScheduleEntity(
                        name = "Core Concepts Revision",
                        icon = "📚",
                        startTime = "02:00 PM",
                        endTime = "03:45 PM",
                        repeatDays = "Mon, Wed, Fri",
                        breakMins = 5,
                        tag = "Study",
                        blockNotifs = true,
                        isEnabled = true
                    )
                )
                scheduleDao.insertSchedule(
                    ScheduleEntity(
                        name = "Problem Solving & Quiz",
                        icon = "🔬",
                        startTime = "06:00 PM",
                        endTime = "07:30 PM",
                        repeatDays = "Daily",
                        breakMins = 15,
                        tag = "Practice",
                        blockNotifs = true,
                        isEnabled = false
                    )
                )

                // Initial App Limits
                val appLimitDao = db.appLimitDao()
                appLimitDao.insertLimit(
                    AppLimitEntity(
                        packageName = "com.instagram.android",
                        appName = "Instagram",
                        iconEmoji = "📷",
                        dailyLimitMin = 45,
                        usedTodayMin = 32,
                        isBlockedShorts = true,
                        isStrict = false
                    )
                )
                appLimitDao.insertLimit(
                    AppLimitEntity(
                        packageName = "com.google.android.youtube",
                        appName = "YouTube",
                        iconEmoji = "▶️",
                        dailyLimitMin = 60,
                        usedTodayMin = 48,
                        isBlockedShorts = true,
                        isStrict = false
                    )
                )
                appLimitDao.insertLimit(
                    AppLimitEntity(
                        packageName = "com.snapchat.android",
                        appName = "Snapchat",
                        iconEmoji = "👻",
                        dailyLimitMin = 30,
                        usedTodayMin = 15,
                        isBlockedShorts = false,
                        isStrict = true
                    )
                )
                appLimitDao.insertLimit(
                    AppLimitEntity(
                        packageName = "com.facebook.katana",
                        appName = "Facebook",
                        iconEmoji = "📘",
                        dailyLimitMin = 30,
                        usedTodayMin = 10,
                        isBlockedShorts = true,
                        isStrict = false
                    )
                )

                // Initial Study Groups
                val groupDao = db.groupDao()
                groupDao.insertGroup(
                    GroupEntity(
                        name = "PREP_AiR Elite 2026",
                        code = "AIR-2026",
                        description = "Aiming for top 100 ranks with consistent 8-hour daily deep focus blocks.",
                        memberCount = 142,
                        totalHours = 840.5f,
                        myRank = 14,
                        joined = true
                    )
                )
                groupDao.insertGroup(
                    GroupEntity(
                        name = "Morning 5 AM Club",
                        code = "MORN-05",
                        description = "Early risers locking in 3 hours before 9 AM every day.",
                        memberCount = 89,
                        totalHours = 412.0f,
                        myRank = 6,
                        joined = true
                    )
                )
                groupDao.insertGroup(
                    GroupEntity(
                        name = "Coding & System Design",
                        code = "CODE-77",
                        description = "Solving algorithms & building projects in focused Pomodoro sprints.",
                        memberCount = 63,
                        totalHours = 295.2f,
                        myRank = 22,
                        joined = false
                    )
                )

                // Initial Recent Session
                val focusDao = db.focusSessionDao()
                focusDao.insertSession(
                    FocusSessionEntity(
                        startTime = System.currentTimeMillis() - 7200000,
                        endTime = System.currentTimeMillis() - 3600000,
                        durationMin = 60,
                        mode = "POMODORO",
                        tagName = "Morning Deep Work",
                        completed = true,
                        dateStr = "2026-09-19"
                    )
                )
            }
        }
    }
}
