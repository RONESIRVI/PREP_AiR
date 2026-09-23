package com.sadhna.focus

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Sadhna Application class.
 * @HiltAndroidApp triggers Hilt's code generation and
 * sets up the dependency injection graph.
 */
@HiltAndroidApp
class SadhnaApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Any app-level init here (e.g. Timber, Firebase, etc.)
    }
}

// ══════════════════════════════════════════════════════════════════════════
//  HILT DI MODULES  (di/AppModule.kt)
// ══════════════════════════════════════════════════════════════════════════
/*
package com.sadhna.focus.di

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

    // ── Network (Retrofit) ──────────────────────────────────────────────
    @Provides @Singleton
    fun provideOkHttpClient(): OkHttpClient =
        OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .build()

    @Provides @Singleton
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl("https://api.github.com/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
}
*/
