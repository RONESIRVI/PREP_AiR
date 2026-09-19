package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AppBlocking
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.HourglassBottom
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.ota.UpdateStatus
import com.example.ui.components.FocusMusicPlayerSheet
import com.example.ui.components.OtaFloatingBanner
import com.example.ui.components.OtaUpdateCenterSheet
import com.example.ui.screens.blocks.BlocksScreen
import com.example.ui.screens.focus.FocusScreen
import com.example.ui.screens.groups.GroupsScreen
import com.example.ui.screens.planner.PlannerScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.PrepBackground
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.viewmodel.MainViewModel

enum class MainTab(val title: String, val icon: ImageVector) {
    FOCUS("Focus", Icons.Default.HourglassBottom),
    PLANNER("Planner", Icons.Default.CalendarMonth),
    GROUPS("Groups", Icons.Default.Groups),
    BLOCKS("Blocks", Icons.Default.AppBlocking)
}

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                PrepAirApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun PrepAirApp(viewModel: MainViewModel) {
    var currentTab by remember { mutableStateOf(MainTab.FOCUS) }
    var selectedPlannerDayIndex by remember { mutableStateOf(4) } // Today Friday
    var showMusicSheet by remember { mutableStateOf(false) }
    var showOtaSheet by remember { mutableStateOf(false) }

    // Collect Viewmodel States
    val otaStatus by viewModel.otaStatus.collectAsState()
    val focusMode by viewModel.focusMode.collectAsState()
    val secondsRemaining by viewModel.secondsRemaining.collectAsState()
    val initialDurationSeconds by viewModel.initialDurationSeconds.collectAsState()
    val isTimerRunning by viewModel.isTimerRunning.collectAsState()
    val deepFocusEnabled by viewModel.deepFocusEnabled.collectAsState()
    val todayFocusMinutes by viewModel.todayFocusMinutes.collectAsState()
    val todayScreenTimeMinutes by viewModel.todayScreenTimeMinutes.collectAsState()

    val activeAudioTrackId by viewModel.activeAudioTrackId.collectAsState()
    val isAudioPlaying by viewModel.isAudioPlaying.collectAsState()
    val audioVolume by viewModel.audioVolume.collectAsState()

    val schedules by viewModel.schedules.collectAsState()
    val appLimits by viewModel.appLimits.collectAsState()
    val groups by viewModel.groups.collectAsState()

    val blockShortsEnabled by viewModel.blockShortsEnabled.collectAsState()
    val strictModeEnabled by viewModel.strictModeEnabled.collectAsState()
    val uninstallProtectionEnabled by viewModel.uninstallProtectionEnabled.collectAsState()
    val websiteBlockerEnabled by viewModel.websiteBlockerEnabled.collectAsState()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PrepBackground)
                    .statusBarsPadding()
            ) {
                // Top App Bar
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 10.dp)
                ) {
                    // Logo & App Name
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.testTag("app_branding_header")
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(32.dp)
                                .background(PrepGreenDark, CircleShape)
                                .border(1.dp, PrepGreenBright, CircleShape)
                        ) {
                            Text(
                                text = "⚡",
                                fontSize = 16.sp
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "PREP_AiR",
                            fontSize = 19.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.5).sp,
                            color = PrepTextPrimary
                        )
                    }

                    // Top Action Icons
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // OTA Version Badge & Status Indicator (Pulsing gold if update ready)
                        val hasUpdate = otaStatus is UpdateStatus.UpdateAvailable ||
                                otaStatus is UpdateStatus.ReadyToInstall ||
                                otaStatus is UpdateStatus.Downloading

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (hasUpdate) PrepGoldPro.copy(alpha = 0.2f) else PrepSurfaceCard)
                                .border(
                                    1.dp,
                                    if (hasUpdate) PrepGoldPro else PrepCardBorder,
                                    RoundedCornerShape(20.dp)
                                )
                                .clickable { showOtaSheet = true }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                                .testTag("ota_update_chip")
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(7.dp)
                                        .background(
                                            if (hasUpdate) PrepGoldPro else PrepGreenBright,
                                            CircleShape
                                        )
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (hasUpdate) "OTA UPDATE" else "v${BuildConfig.VERSION_NAME}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = if (hasUpdate) PrepGoldPro else PrepTextPrimary
                                )
                            }
                        }

                        // Audio Player Icon Button
                        IconButton(
                            onClick = { showMusicSheet = true },
                            modifier = Modifier
                                .size(36.dp)
                                .background(
                                    if (isAudioPlaying) PrepGreenDark else PrepSurfaceCard,
                                    CircleShape
                                )
                                .border(1.dp, PrepCardBorder, CircleShape)
                                .testTag("music_sheet_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.GraphicEq,
                                contentDescription = "Focus Music",
                                tint = if (isAudioPlaying) PrepGreenBright else PrepTextMuted,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // PRO Badge
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(PrepGoldPro.copy(alpha = 0.15f))
                                .border(1.dp, PrepGoldPro.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 5.dp)
                        ) {
                            Text(
                                text = "PRO",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = PrepGoldPro
                            )
                        }
                    }
                }

                // Floating Banner for OTA updates
                OtaFloatingBanner(
                    status = otaStatus,
                    onOpenUpdateCenter = { showOtaSheet = true },
                    onDismiss = { viewModel.dismissUpdate() }
                )
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = PrepSurface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .navigationBarsPadding()
                    .border(width = 0.5.dp, color = PrepCardBorder)
                    .testTag("main_bottom_nav")
            ) {
                MainTab.values().forEach { tab ->
                    val isSelected = currentTab == tab
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { currentTab = tab },
                        icon = {
                            Icon(
                                imageVector = tab.icon,
                                contentDescription = tab.title
                            )
                        },
                        label = {
                            Text(
                                text = tab.title,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.Black,
                            selectedTextColor = PrepGreenBright,
                            indicatorColor = PrepGreenBright,
                            unselectedIconColor = PrepTextMuted,
                            unselectedTextColor = PrepTextMuted
                        )
                    )
                }
            }
        },
        containerColor = PrepBackground,
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Crossfade(
                targetState = currentTab,
                label = "tab_crossfade"
            ) { tab ->
                when (tab) {
                    MainTab.FOCUS -> {
                        FocusScreen(
                            currentMode = focusMode,
                            secondsRemaining = secondsRemaining,
                            initialDurationSeconds = initialDurationSeconds,
                            isRunning = isTimerRunning,
                            deepFocusEnabled = deepFocusEnabled,
                            todayFocusMinutes = todayFocusMinutes,
                            todayScreenTimeMinutes = todayScreenTimeMinutes,
                            activeAudioTrackTitle = activeAudioTrackId,
                            isAudioPlaying = isAudioPlaying,
                            onModeChange = { viewModel.setFocusMode(it) },
                            onStartPauseToggle = { viewModel.toggleStartPause() },
                            onResetTimer = { viewModel.resetTimer() },
                            onPresetDurationSelected = { viewModel.setPresetDuration(it) },
                            onDeepFocusToggled = { viewModel.setDeepFocusEnabled(it) },
                            onOpenAudioPlayer = { showMusicSheet = true }
                        )
                    }
                    MainTab.PLANNER -> {
                        PlannerScreen(
                            schedules = schedules,
                            selectedDayIndex = selectedPlannerDayIndex,
                            onDaySelected = { selectedPlannerDayIndex = it },
                            onToggleSchedule = { viewModel.toggleSchedule(it) },
                            onAddSchedule = { viewModel.addSchedule(it) },
                            onDeleteSchedule = { viewModel.deleteSchedule(it) },
                            onStartSessionForSchedule = {
                                viewModel.startSessionForSchedule(it)
                                currentTab = MainTab.FOCUS
                            }
                        )
                    }
                    MainTab.GROUPS -> {
                        GroupsScreen(
                            groups = groups,
                            onJoinGroupWithCode = { viewModel.joinGroup(it) },
                            onCreateGroup = { viewModel.createGroup(it) }
                        )
                    }
                    MainTab.BLOCKS -> {
                        BlocksScreen(
                            appLimits = appLimits,
                            blockShortsEnabled = blockShortsEnabled,
                            strictModeEnabled = strictModeEnabled,
                            uninstallProtectionEnabled = uninstallProtectionEnabled,
                            websiteBlockerEnabled = websiteBlockerEnabled,
                            onToggleShorts = { viewModel.setBlockShorts(it) },
                            onToggleStrictMode = { viewModel.setStrictMode(it) },
                            onToggleUninstallProtection = { viewModel.setUninstallProtection(it) },
                            onToggleWebsiteBlocker = { viewModel.setWebsiteBlocker(it) },
                            onAddAppLimit = { viewModel.addAppLimit(it) },
                            onDeleteAppLimit = { viewModel.deleteAppLimit(it) }
                        )
                    }
                }
            }
        }
    }

    // Focus Music Player Modal Sheet
    FocusMusicPlayerSheet(
        isOpen = showMusicSheet,
        isPlaying = isAudioPlaying,
        selectedTrackId = activeAudioTrackId,
        volume = audioVolume,
        onTrackSelect = { viewModel.selectAudioTrack(it) },
        onPlayPauseToggle = { viewModel.toggleAudioPlayPause() },
        onVolumeChange = { viewModel.setAudioVolume(it) },
        onDismiss = { showMusicSheet = false }
    )

    // OTA Auto-Update Center Modal Sheet
    OtaUpdateCenterSheet(
        isOpen = showOtaSheet,
        status = otaStatus,
        currentVersion = BuildConfig.VERSION_NAME,
        currentRepo = viewModel.otaUpdateManager.githubRepo,
        autoCheckEnabled = viewModel.otaUpdateManager.autoCheckOnStart,
        onRepoChanged = { viewModel.setGithubRepo(it) },
        onAutoCheckToggled = { viewModel.setAutoCheckEnabled(it) },
        onCheckForUpdates = { viewModel.checkForUpdates() },
        onSimulateLiveRelease = { viewModel.simulateLiveRelease() },
        onDownloadUpdate = { updateInfo -> viewModel.downloadUpdate(updateInfo) },
        onInstallApk = { apkFile -> viewModel.installApk(apkFile) },
        onDismiss = { showOtaSheet = false }
    )
}
