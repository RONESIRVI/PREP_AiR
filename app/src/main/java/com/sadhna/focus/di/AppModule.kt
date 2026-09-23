package com.sadhna.focus.di

import android.content.Context
import com.sadhna.focus.data.local.SadhnaDatabase
import com.sadhna.focus.data.usage.UsageStatsHelper
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    // ── Database ────────────────────────────────────────────────────────
    @Provides @Singleton
    fun provideDatabase(@ApplicationContext ctx: Context): SadhnaDatabase =
        SadhnaDatabase.getInstance(ctx)

    @Provides fun provideFocusSessionDao(db: SadhnaDatabase) = db.focusSessionDao()
    @Provides fun provideScheduleDao    (db: SadhnaDatabase) = db.scheduleDao()
    @Provides fun provideAppLimitDao    (db: SadhnaDatabase) = db.appLimitDao()
    @Provides fun provideTagDao         (db: SadhnaDatabase) = db.tagDao()
    @Provides fun provideUserSettingDao (db: SadhnaDatabase) = db.userSettingDao()

    // ── UsageStats ──────────────────────────────────────────────────────
    @Provides @Singleton
    fun provideUsageStatsHelper(@ApplicationContext ctx: Context): UsageStatsHelper =
        UsageStatsHelper(ctx)

}
