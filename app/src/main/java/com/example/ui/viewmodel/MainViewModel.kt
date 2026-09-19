package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.BuildConfig
import com.example.data.local.AppDatabase
import com.example.data.local.entity.AppLimitEntity
import com.example.data.local.entity.FocusSessionEntity
import com.example.data.local.entity.GroupEntity
import com.example.data.local.entity.ScheduleEntity
import com.example.data.ota.OtaUpdateManager
import com.example.data.ota.UpdateInfo
import com.example.data.ota.UpdateStatus
import com.example.data.repository.PrepAirRepository
import com.example.ui.screens.focus.FocusMode
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val database = AppDatabase.getDatabase(application, viewModelScope)
    private val repository = PrepAirRepository(database)
    val otaUpdateManager = OtaUpdateManager(application)

    // Room Database Flows
    val schedules: StateFlow<List<ScheduleEntity>> = repository.allSchedules
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val appLimits: StateFlow<List<AppLimitEntity>> = repository.allLimits
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val groups: StateFlow<List<GroupEntity>> = repository.allGroups
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val sessions: StateFlow<List<FocusSessionEntity>> = repository.allSessions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Timer State
    private val _focusMode = MutableStateFlow(FocusMode.POMODORO)
    val focusMode: StateFlow<FocusMode> = _focusMode.asStateFlow()

    private val _initialDurationSeconds = MutableStateFlow(25 * 60)
    val initialDurationSeconds: StateFlow<Int> = _initialDurationSeconds.asStateFlow()

    private val _secondsRemaining = MutableStateFlow(25 * 60)
    val secondsRemaining: StateFlow<Int> = _secondsRemaining.asStateFlow()

    private val _isTimerRunning = MutableStateFlow(false)
    val isTimerRunning: StateFlow<Boolean> = _isTimerRunning.asStateFlow()

    private val _deepFocusEnabled = MutableStateFlow(false)
    val deepFocusEnabled: StateFlow<Boolean> = _deepFocusEnabled.asStateFlow()

    private var timerJob: Job? = null

    // Daily Stats State
    private val _todayFocusMinutes = MutableStateFlow(165) // 2h 45m initial
    val todayFocusMinutes: StateFlow<Int> = _todayFocusMinutes.asStateFlow()

    private val _todayScreenTimeMinutes = MutableStateFlow(95) // 1h 35m initial
    val todayScreenTimeMinutes: StateFlow<Int> = _todayScreenTimeMinutes.asStateFlow()

    // Focus Music State
    private val _activeAudioTrackId = MutableStateFlow("brown")
    val activeAudioTrackId: StateFlow<String> = _activeAudioTrackId.asStateFlow()

    private val _isAudioPlaying = MutableStateFlow(false)
    val isAudioPlaying: StateFlow<Boolean> = _isAudioPlaying.asStateFlow()

    private val _audioVolume = MutableStateFlow(0.7f)
    val audioVolume: StateFlow<Float> = _audioVolume.asStateFlow()

    // Shield Toggles State
    private val _blockShortsEnabled = MutableStateFlow(true)
    val blockShortsEnabled: StateFlow<Boolean> = _blockShortsEnabled.asStateFlow()

    private val _strictModeEnabled = MutableStateFlow(false)
    val strictModeEnabled: StateFlow<Boolean> = _strictModeEnabled.asStateFlow()

    private val _uninstallProtectionEnabled = MutableStateFlow(false)
    val uninstallProtectionEnabled: StateFlow<Boolean> = _uninstallProtectionEnabled.asStateFlow()

    private val _websiteBlockerEnabled = MutableStateFlow(false)
    val websiteBlockerEnabled: StateFlow<Boolean> = _websiteBlockerEnabled.asStateFlow()

    // OTA Update State
    val otaStatus: StateFlow<UpdateStatus> = otaUpdateManager.updateStatus

    // Update Setup Queue: stores postponed updates for later 1-click in-app install
    private val _postponedUpdate = MutableStateFlow<UpdateInfo?>(null)
    val postponedUpdate: StateFlow<UpdateInfo?> = _postponedUpdate.asStateFlow()

    init {
        // Automatically check GitHub for updates on launch as requested
        if (otaUpdateManager.autoCheckOnStart) {
            viewModelScope.launch {
                delay(1500) // Brief delay to allow UI to render first
                otaUpdateManager.checkForUpdates(forceSimulateIfNotFound = false)
            }
        }
    }

    // --- Timer Controls ---
    fun setFocusMode(mode: FocusMode) {
        pauseTimer()
        _focusMode.value = mode
        val defaultSecs = when (mode) {
            FocusMode.TIMER -> 45 * 60
            FocusMode.STOPWATCH -> 0
            FocusMode.POMODORO -> 25 * 60
        }
        _initialDurationSeconds.value = defaultSecs
        _secondsRemaining.value = defaultSecs
    }

    fun setPresetDuration(minutes: Int) {
        pauseTimer()
        val secs = minutes * 60
        _initialDurationSeconds.value = secs
        _secondsRemaining.value = secs
    }

    fun toggleStartPause() {
        if (_isTimerRunning.value) {
            pauseTimer()
        } else {
            startTimer()
        }
    }

    fun resetTimer() {
        pauseTimer()
        _secondsRemaining.value = _initialDurationSeconds.value
    }

    private fun startTimer() {
        _isTimerRunning.value = true
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_isTimerRunning.value) {
                delay(1000)
                if (_focusMode.value == FocusMode.STOPWATCH) {
                    _secondsRemaining.value += 1
                } else {
                    if (_secondsRemaining.value > 0) {
                        _secondsRemaining.value -= 1
                    } else {
                        // Timer completed!
                        onTimerCompleted()
                        break
                    }
                }
            }
        }
    }

    private fun pauseTimer() {
        _isTimerRunning.value = false
        timerJob?.cancel()
    }

    private fun onTimerCompleted() {
        pauseTimer()
        val durationMins = _initialDurationSeconds.value / 60
        _todayFocusMinutes.value += durationMins

        // Persist to Room
        viewModelScope.launch {
            repository.saveSession(
                FocusSessionEntity(
                    startTime = System.currentTimeMillis() - (_initialDurationSeconds.value * 1000L),
                    endTime = System.currentTimeMillis(),
                    durationMin = durationMins,
                    mode = _focusMode.value.name,
                    tagName = if (_focusMode.value == FocusMode.POMODORO) "Pomodoro Sprint" else "Deep Focus",
                    completed = true,
                    dateStr = "2026-09-19"
                )
            )
        }
        _secondsRemaining.value = _initialDurationSeconds.value
    }

    fun setDeepFocusEnabled(enabled: Boolean) {
        _deepFocusEnabled.value = enabled
    }

    // --- Audio Player ---
    fun selectAudioTrack(trackId: String) {
        _activeAudioTrackId.value = trackId
        _isAudioPlaying.value = true
    }

    fun toggleAudioPlayPause() {
        _isAudioPlaying.value = !_isAudioPlaying.value
    }

    fun setAudioVolume(vol: Float) {
        _audioVolume.value = vol
    }

    // --- Planner & Schedules ---
    fun toggleSchedule(schedule: ScheduleEntity) {
        viewModelScope.launch {
            repository.updateSchedule(schedule.copy(isEnabled = !schedule.isEnabled))
        }
    }

    fun addSchedule(schedule: ScheduleEntity) {
        viewModelScope.launch {
            repository.addSchedule(schedule)
        }
    }

    fun deleteSchedule(id: Long) {
        viewModelScope.launch {
            repository.deleteSchedule(id)
        }
    }

    fun startSessionForSchedule(schedule: ScheduleEntity) {
        setFocusMode(FocusMode.POMODORO)
        setPresetDuration(45)
        if (schedule.isStrict) {
            setStrictMode(true)
        }
        if (schedule.blockYouTubeShorts) {
            setBlockShorts(true)
        }
        if (schedule.blockBrowserApps) {
            setWebsiteBlocker(true)
        }
        startTimer()
    }

    // --- Groups ---
    fun joinGroup(code: String) {
        viewModelScope.launch {
            repository.addGroup(
                GroupEntity(
                    name = "Joined Group $code",
                    code = code,
                    description = "Peer focus squad joined via invite code",
                    memberCount = 28,
                    totalHours = 120.0f,
                    myRank = 15,
                    joined = true
                )
            )
        }
    }

    fun createGroup(group: GroupEntity) {
        viewModelScope.launch {
            repository.addGroup(group)
        }
    }

    // --- Shields & App Limits ---
    fun setBlockShorts(enabled: Boolean) {
        _blockShortsEnabled.value = enabled
    }

    fun setStrictMode(enabled: Boolean) {
        _strictModeEnabled.value = enabled
        if (enabled) {
            _deepFocusEnabled.value = true
        }
    }

    fun setUninstallProtection(enabled: Boolean) {
        _uninstallProtectionEnabled.value = enabled
    }

    fun setWebsiteBlocker(enabled: Boolean) {
        _websiteBlockerEnabled.value = enabled
    }

    fun addAppLimit(limit: AppLimitEntity) {
        viewModelScope.launch {
            repository.addAppLimit(limit)
        }
    }

    fun deleteAppLimit(id: Long) {
        viewModelScope.launch {
            repository.deleteAppLimit(id)
        }
    }

    // --- OTA Auto-Update System Methods ---
    fun checkForUpdates() {
        viewModelScope.launch {
            otaUpdateManager.checkForUpdates(forceSimulateIfNotFound = false)
        }
    }

    fun simulateLiveRelease() {
        otaUpdateManager.simulateLiveReleaseAvailable()
    }

    fun downloadUpdate(updateInfo: UpdateInfo) {
        viewModelScope.launch {
            otaUpdateManager.downloadUpdate(updateInfo)
        }
    }

    fun installApk(apkFile: File, updateInfo: UpdateInfo? = null) {
        clearPostponedUpdate()
        otaUpdateManager.installApk(apkFile, updateInfo)
    }

    fun dismissUpdate() {
        otaUpdateManager.dismissUpdate()
    }

    /**
     * Postpones the detected update and stores it in Update Setup so the user
     * can install it later with a single tap without being interrupted.
     */
    fun postponeToUpdateSetup(updateInfo: UpdateInfo) {
        _postponedUpdate.value = updateInfo
        otaUpdateManager.dismissUpdate()
    }

    fun clearPostponedUpdate() {
        _postponedUpdate.value = null
    }

    fun installFromUpdateSetup(updateInfo: UpdateInfo) {
        viewModelScope.launch {
            otaUpdateManager.downloadUpdate(updateInfo)
        }
    }

    fun setGithubRepo(repo: String) {
        otaUpdateManager.setGithubRepository(repo)
    }

    fun setAutoCheckEnabled(enabled: Boolean) {
        otaUpdateManager.setAutoCheckEnabled(enabled)
    }
}
