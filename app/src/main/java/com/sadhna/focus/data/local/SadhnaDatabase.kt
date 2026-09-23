package com.sadhna.focus.data.local

import android.content.Context
import androidx.room.*
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.sadhna.focus.data.local.dao.*
import com.sadhna.focus.data.local.entity.*

@Database(
    entities = [
        FocusSessionEntity::class,
        ScheduleEntity::class,
        AppLimitEntity::class,
        TagEntity::class,
        UserSettingEntity::class,
    ],
    version  = 1,
    exportSchema = true,
)
abstract class SadhnaDatabase : RoomDatabase() {

    abstract fun focusSessionDao(): FocusSessionDao
    abstract fun scheduleDao(): ScheduleDao
    abstract fun appLimitDao(): AppLimitDao
    abstract fun tagDao(): TagDao
    abstract fun userSettingDao(): UserSettingDao

    companion object {
        const val DB_NAME = "sadhna_db"

        @Volatile
        private var INSTANCE: SadhnaDatabase? = null

        fun getInstance(context: Context): SadhnaDatabase =
            INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    SadhnaDatabase::class.java,
                    DB_NAME,
                )
                .addCallback(PrepopulateCallback())
                .build()
                .also { INSTANCE = it }
            }
    }

    // ── Pre-populate default tags on first launch ──────────────────────
    private class PrepopulateCallback : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            // Insert default tags
            db.execSQL("""
                INSERT INTO tags (name, colorHex, isDistracting) VALUES
                ('Study',    '#FF6B00', 0),
                ('Break',    '#60A5FA', 0),
                ('Revision', '#A78BFA', 0),
                ('Office',   '#34D399', 0)
            """.trimIndent())

            // Insert default settings
            db.execSQL("""
                INSERT INTO user_settings (key, value) VALUES
                ('focus_goal_hours', '8'),
                ('is_pro', 'false'),
                ('daily_streak', '0'),
                ('pomodoro_work_mins', '25'),
                ('pomodoro_break_mins', '5'),
                ('onboarding_done', 'false'),
                ('profile_emoji', '🧑')
            """.trimIndent())
        }
    }
}

// ── Hilt Module ────────────────────────────────────────────────────────────
// (put in di/DatabaseModule.kt)
/*
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides @Singleton
    fun provideDatabase(@ApplicationContext ctx: Context): SadhnaDatabase =
        SadhnaDatabase.getInstance(ctx)

    @Provides fun provideFocusSessionDao(db: SadhnaDatabase) = db.focusSessionDao()
    @Provides fun provideScheduleDao(db: SadhnaDatabase)     = db.scheduleDao()
    @Provides fun provideAppLimitDao(db: SadhnaDatabase)     = db.appLimitDao()
    @Provides fun provideTagDao(db: SadhnaDatabase)          = db.tagDao()
    @Provides fun provideUserSettingDao(db: SadhnaDatabase)  = db.userSettingDao()
}
*/
