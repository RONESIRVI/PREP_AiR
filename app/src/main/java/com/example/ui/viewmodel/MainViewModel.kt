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
import com.example.data.local.entity.TestRecordEntity
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

    // --- Section 01 & Section 02: TestTrack Pro Records ---
    val testRecords: StateFlow<List<TestRecordEntity>> = repository.allTestRecords
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun saveTestRecord(record: TestRecordEntity) {
        viewModelScope.launch {
            repository.insertTestRecord(record)
        }
    }

    fun updateTestRecord(record: TestRecordEntity) {
        viewModelScope.launch {
            repository.updateTestRecord(record)
        }
    }

    fun deleteTestRecord(id: Long) {
        viewModelScope.launch {
            repository.deleteTestRecord(id)
        }
    }

    fun clearAllTestRecords() {
        viewModelScope.launch {
            repository.clearAllTestRecords()
        }
    }

    // --- Auxiliary / Companion Flows ---
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
    private val _todayFocusMinutes = MutableStateFlow(165)
    val todayFocusMinutes: StateFlow<Int> = _todayFocusMinutes.asStateFlow()

    private val _todayScreenTimeMinutes = MutableStateFlow(95)
    val todayScreenTimeMinutes: StateFlow<Int> = _todayScreenTimeMinutes.asStateFlow()

    // Focus Music State
    private val _activeAudioTrackId = MutableStateFlow("brown")
    val activeAudioTrackId: StateFlow<String> = _activeAudioTrackId.asStateFlow()

    private val _isAudioPlaying = MutableStateFlow(false)
    val isAudioPlaying: StateFlow<Boolean> = _isAudioPlaying.asStateFlow()

    private val _audioVolume = MutableStateFlow(0.7f)
    val audioVolume: StateFlow<Float> = _audioVolume.asStateFlow()

    // App Blocker & Discipline States
    private val _blockShortsEnabled = MutableStateFlow(true)
    val blockShortsEnabled: StateFlow<Boolean> = _blockShortsEnabled.asStateFlow()

    private val _strictModeEnabled = MutableStateFlow(false)
    val strictModeEnabled: StateFlow<Boolean> = _strictModeEnabled.asStateFlow()

    private val _uninstallProtectionEnabled = MutableStateFlow(true)
    val uninstallProtectionEnabled: StateFlow<Boolean> = _uninstallProtectionEnabled.asStateFlow()

    private val _websiteBlockerEnabled = MutableStateFlow(true)
    val websiteBlockerEnabled: StateFlow<Boolean> = _websiteBlockerEnabled.asStateFlow()

    // OTA Status Flow from Manager
    val otaStatus: StateFlow<UpdateStatus> = otaUpdateManager.updateStatus

    // Postponed update state
    private val _postponedUpdate = MutableStateFlow<UpdateInfo?>(null)
    val postponedUpdate: StateFlow<UpdateInfo?> = _postponedUpdate.asStateFlow()

    fun setFocusMode(mode: FocusMode) {
        _focusMode.value = mode
        val defaultMins = when (mode) {
            FocusMode.POMODORO -> 25
            FocusMode.TIMER -> 45
            FocusMode.STOPWATCH -> 0
        }
        setPresetDuration(defaultMins)
    }

    fun setPresetDuration(minutes: Int) {
        if (!_isTimerRunning.value) {
            _initialDurationSeconds.value = minutes * 60
            _secondsRemaining.value = minutes * 60
        }
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
            while (_isTimerRunning.value && _secondsRemaining.value > 0) {
                delay(1000L)
                _secondsRemaining.value -= 1
            }
            if (_secondsRemaining.value <= 0) {
                onTimerCompleted()
            }
        }
    }

    private fun pauseTimer() {
        _isTimerRunning.value = false
        timerJob?.cancel()
    }

    private fun onTimerCompleted() {
        _isTimerRunning.value = false
        val durationMins = _initialDurationSeconds.value / 60
        _todayFocusMinutes.value += durationMins
        viewModelScope.launch {
            repository.saveSession(
                FocusSessionEntity(
                    startTime = System.currentTimeMillis() - (_initialDurationSeconds.value * 1000L),
                    endTime = System.currentTimeMillis(),
                    durationMin = durationMins,
                    mode = _focusMode.value.name,
                    tagName = "Focus Session",
                    completed = true,
                    dateStr = "Today"
                )
            )
        }
    }

    fun setDeepFocusEnabled(enabled: Boolean) {
        _deepFocusEnabled.value = enabled
    }

    fun selectAudioTrack(trackId: String) {
        _activeAudioTrackId.value = trackId
    }

    fun toggleAudioPlayPause() {
        _isAudioPlaying.value = !_isAudioPlaying.value
    }

    fun setAudioVolume(vol: Float) {
        _audioVolume.value = vol
    }

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
        pauseTimer()
        val durationMin = 45
        _initialDurationSeconds.value = durationMin * 60
        _secondsRemaining.value = durationMin * 60
        _focusMode.value = FocusMode.TIMER
        startTimer()
    }

    fun joinGroup(code: String) {
        viewModelScope.launch {
            val newGroup = GroupEntity(
                name = "Study Squad #${code.take(4)}",
                code = code,
                description = "Custom study accountability squad joined via invitation code.",
                memberCount = 1,
                totalHours = 0f,
                myRank = 1,
                joined = true
            )
            repository.addGroup(newGroup)
        }
    }

    fun createGroup(group: GroupEntity) {
        viewModelScope.launch {
            repository.addGroup(group)
        }
    }

    fun setBlockShorts(enabled: Boolean) {
        _blockShortsEnabled.value = enabled
    }

    fun setStrictMode(enabled: Boolean) {
        _strictModeEnabled.value = enabled
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
