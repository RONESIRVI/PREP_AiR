package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        TestRecordEntity::class,
        FocusSessionEntity::class,
        ScheduleEntity::class,
        AppLimitEntity::class,
        GroupEntity::class
    ],
    version = 3,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun testRecordDao(): TestRecordDao
    abstract fun focusSessionDao(): FocusSessionDao
    abstract fun scheduleDao(): ScheduleDao
    abstract fun appLimitDao(): AppLimitDao
    abstract fun groupDao(): GroupDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `study_groups` (
                        `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        `name` TEXT NOT NULL,
                        `code` TEXT NOT NULL,
                        `description` TEXT NOT NULL,
                        `memberCount` INTEGER NOT NULL,
                        `totalHours` REAL NOT NULL,
                        `myRank` INTEGER NOT NULL,
                        `joined` INTEGER NOT NULL
                    )
                """.trimIndent())
            }
        }

        val MIGRATION_2_3 = object : Migration(2, 3) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `test_records` (
                        `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        `testType` TEXT NOT NULL,
                        `subject` TEXT NOT NULL,
                        `topicChapter` TEXT NOT NULL,
                        `testName` TEXT NOT NULL,
                        `dateStr` TEXT NOT NULL,
                        `totalMarks` REAL NOT NULL,
                        `marksObtained` REAL NOT NULL,
                        `questionsAttempted` INTEGER NOT NULL,
                        `correctCount` INTEGER NOT NULL,
                        `wrongCount` INTEGER NOT NULL,
                        `unattemptedCount` INTEGER NOT NULL,
                        `accuracy` REAL NOT NULL,
                        `timeTakenMin` INTEGER NOT NULL,
                        `difficulty` TEXT NOT NULL,
                        `mistakeType` TEXT NOT NULL,
                        `personalNotes` TEXT NOT NULL,
                        `createdAt` INTEGER NOT NULL
                    )
                """.trimIndent())
            }
        }

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "testtrack_pro_database"
                )
                .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
                .fallbackToDestructiveMigrationOnDowngrade()
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
                val testDao = db.testRecordDao()
                // Populate realistic initial test records across various subjects and dates
                testDao.insertRecord(
                    TestRecordEntity(
                        testType = "Mock Test",
                        subject = "Physics",
                        topicChapter = "Electromagnetism & Optics",
                        testName = "All India Mock Test 01",
                        dateStr = "2026-09-15",
                        totalMarks = 100f,
                        marksObtained = 82f,
                        questionsAttempted = 25,
                        correctCount = 21,
                        wrongCount = 4,
                        unattemptedCount = 5,
                        accuracy = 84f,
                        timeTakenMin = 55,
                        difficulty = "Moderate",
                        mistakeType = "Calculation",
                        personalNotes = "Calculation blunder in magnetic flux question #14. Formula recall was good."
                    )
                )
                testDao.insertRecord(
                    TestRecordEntity(
                        testType = "Chapter Test",
                        subject = "Chemistry",
                        topicChapter = "Organic Reactions & Mechanisms",
                        testName = "Aldehydes & Ketones Drill",
                        dateStr = "2026-09-17",
                        totalMarks = 60f,
                        marksObtained = 54f,
                        questionsAttempted = 15,
                        correctCount = 14,
                        wrongCount = 1,
                        unattemptedCount = 0,
                        accuracy = 93.3f,
                        timeTakenMin = 30,
                        difficulty = "Hard",
                        mistakeType = "Misread Question",
                        personalNotes = "Misread acidic vs basic medium in Cannizzaro reaction. Excellent speed."
                    )
                )
                testDao.insertRecord(
                    TestRecordEntity(
                        testType = "Speed Test",
                        subject = "Mathematics",
                        topicChapter = "Calculus & Integration",
                        testName = "Definite Integrals Sprint",
                        dateStr = "2026-09-19",
                        totalMarks = 80f,
                        marksObtained = 68f,
                        questionsAttempted = 20,
                        correctCount = 17,
                        wrongCount = 3,
                        unattemptedCount = 2,
                        accuracy = 85f,
                        timeTakenMin = 40,
                        difficulty = "Hard",
                        mistakeType = "Time Pressure",
                        personalNotes = "Ran out of time on last 2 questions. Need to skip 4-step algebra traps earlier."
                    )
                )
                testDao.insertRecord(
                    TestRecordEntity(
                        testType = "Full Syllabus",
                        subject = "General Studies",
                        topicChapter = "Indian Polity & Modern History",
                        testName = "Prelims Comprehensive Mock",
                        dateStr = "2026-09-21",
                        totalMarks = 200f,
                        marksObtained = 168f,
                        questionsAttempted = 90,
                        correctCount = 80,
                        wrongCount = 10,
                        unattemptedCount = 10,
                        accuracy = 88.9f,
                        timeTakenMin = 110,
                        difficulty = "Moderate",
                        mistakeType = "Conceptual",
                        personalNotes = "Polity articles 32 vs 226 scope confused. Revision of fundamental rights required."
                    )
                )
            }
        }
    }
}
