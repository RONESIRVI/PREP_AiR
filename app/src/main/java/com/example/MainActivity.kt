package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.EditCalendar
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.PostAdd
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.SettingsPreferencesSheet
import com.example.ui.components.TestTrackLogo
import com.example.ui.components.UpdateSetupDialog
import com.example.ui.screens.analysis.AnalysisBoardSection
import com.example.ui.screens.record.AddRecordSection
import com.example.ui.theme.AppBackground
import com.example.ui.theme.AppCardBorder
import com.example.ui.theme.AppCardSurface
import com.example.ui.theme.AppCardSurfaceRaised
import com.example.ui.theme.AppTextPrimary
import com.example.ui.theme.AppTextSecondary
import com.example.ui.theme.GoldBright
import com.example.ui.theme.GoldDeep
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Navy950
import com.example.ui.theme.TestTrackThemeState
import com.example.ui.theme.testTrack3DCard
import com.example.ui.viewmodel.MainViewModel
import com.example.util.NotificationHelper

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        NotificationHelper.createNotificationChannels(this)
        setContent {
            MyApplicationTheme {
                TestTrackProApp(viewModel = viewModel)
            }
        }
    }
}

/**
 * TestTrack Pro Main Application
 *
 * Interface Structure:
 * ┌──────────────────────────────┐
 * │       TestTrack Pro          │
 * │   Record • Analyze • Improve │
 * ├──────────────────────────────┤
 * │                              │
 * │  ┌────────────┐ ┌──────────┐ │
 * │  │ ADD RECORD │ │ ANALYSIS │ │
 * │  └────────────┘ └──────────┘ │
 * │                              │
 * │ ──────────────────────────── │
 * │                              │
 * │      ACTIVE SECTION          │
 * │                              │
 * └──────────────────────────────┘
 *
 * Design principle: Exactly 2 primary sections visible:
 * Section 01: ADD RECORD
 * Section 02: ANALYSIS BOARD
 */
@Composable
fun TestTrackProApp(viewModel: MainViewModel) {
    // 0 = ADD RECORD, 1 = ANALYSIS BOARD
    var activeSectionIndex by remember { mutableIntStateOf(0) }
    var showSettingsSheet by remember { mutableStateOf(false) }
    var showTopUpdateDialog by remember { mutableStateOf(false) }

    val testRecords by viewModel.testRecords.collectAsState()
    val otaStatus by viewModel.otaStatus.collectAsState()
    val postponedUpdate by viewModel.postponedUpdate.collectAsState()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(AppBackground)
                    .statusBarsPadding()
            ) {
                // Header Area
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp, vertical = 12.dp)
                ) {
                    // Logo + App Name + Subtitle
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.testTag("app_header_branding")
                    ) {
                        TestTrackLogo(size = 42.dp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "TestTrack Pro",
                                fontSize = 21.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.4).sp,
                                color = AppTextPrimary
                            )
                            Text(
                                text = "Record • Analyze • Improve",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = GoldBright,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }

                    // Action Icons
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Dark / Light Toggle
                        IconButton(
                            onClick = {
                                TestTrackThemeState.isLightMode = !TestTrackThemeState.isLightMode
                            },
                            modifier = Modifier
                                .size(34.dp)
                                .shadow(2.dp, CircleShape)
                                .background(AppCardSurface, CircleShape)
                                .border(1.dp, AppCardBorder, CircleShape)
                                .testTag("theme_toggle_btn")
                        ) {
                            Icon(
                                imageVector = if (TestTrackThemeState.isLightMode) Icons.Default.DarkMode else Icons.Default.LightMode,
                                contentDescription = "Toggle Theme",
                                tint = GoldPrimary,
                                modifier = Modifier.size(17.dp)
                            )
                        }

                        // OTA Update Setup / Version Chip
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(Color(0x28F59E0B))
                                .border(1.dp, GoldPrimary, RoundedCornerShape(20.dp))
                                .clickable { showTopUpdateDialog = true }
                                .padding(horizontal = 9.dp, vertical = 5.dp)
                                .testTag("ota_version_chip")
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(GoldBright, CircleShape)
                                )
                                Spacer(modifier = Modifier.width(5.dp))
                                Text(
                                    text = "v${BuildConfig.VERSION_NAME}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = GoldBright
                                )
                            }
                        }

                        // Settings Icon
                        IconButton(
                            onClick = { showSettingsSheet = true },
                            modifier = Modifier
                                .size(34.dp)
                                .shadow(2.dp, CircleShape)
                                .background(AppCardSurface, CircleShape)
                                .border(1.dp, AppCardBorder, CircleShape)
                                .testTag("btn_open_settings")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Settings,
                                contentDescription = "Settings",
                                tint = AppTextPrimary,
                                modifier = Modifier.size(17.dp)
                            )
                        }
                    }
                }

                // 2 Primary Section Toggle Buttons (ADD RECORD vs ANALYSIS)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Button 01: ADD RECORD
                    val isRecordActive = activeSectionIndex == 0
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                            .shadow(
                                elevation = if (isRecordActive) 4.dp else 1.dp,
                                shape = RoundedCornerShape(12.dp),
                                spotColor = if (isRecordActive) GoldPrimary else Color.Transparent
                            )
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isRecordActive) {
                                    Brush.horizontalGradient(listOf(GoldDeep, GoldPrimary, GoldBright))
                                } else {
                                    Brush.horizontalGradient(listOf(AppCardSurface, AppCardSurfaceRaised))
                                }
                            )
                            .border(
                                width = if (isRecordActive) 1.5.dp else 1.dp,
                                color = if (isRecordActive) GoldBright else AppCardBorder,
                                shape = RoundedCornerShape(12.dp)
                            )
                            .clickable { activeSectionIndex = 0 }
                            .testTag("tab_btn_add_record")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.PostAdd,
                                contentDescription = null,
                                tint = if (isRecordActive) Color.Black else AppTextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "ADD RECORD",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.8.sp,
                                color = if (isRecordActive) Color.Black else AppTextSecondary
                            )
                        }
                    }

                    // Button 02: ANALYSIS BOARD
                    val isAnalysisActive = activeSectionIndex == 1
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                            .shadow(
                                elevation = if (isAnalysisActive) 4.dp else 1.dp,
                                shape = RoundedCornerShape(12.dp),
                                spotColor = if (isAnalysisActive) GoldPrimary else Color.Transparent
                            )
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isAnalysisActive) {
                                    Brush.horizontalGradient(listOf(GoldDeep, GoldPrimary, GoldBright))
                                } else {
                                    Brush.horizontalGradient(listOf(AppCardSurface, AppCardSurfaceRaised))
                                }
                            )
                            .border(
                                width = if (isAnalysisActive) 1.5.dp else 1.dp,
                                color = if (isAnalysisActive) GoldBright else AppCardBorder,
                                shape = RoundedCornerShape(12.dp)
                            )
                            .clickable { activeSectionIndex = 1 }
                            .testTag("tab_btn_analysis_board")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Analytics,
                                contentDescription = null,
                                tint = if (isAnalysisActive) Color.Black else AppTextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "ANALYSIS",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.8.sp,
                                color = if (isAnalysisActive) Color.Black else AppTextSecondary
                            )
                        }
                    }
                }

                // Clean Section Separator
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp, vertical = 6.dp)
                        .height(1.dp)
                        .background(Color(0x28F59E0B))
                )
            }
        },
        containerColor = AppBackground,
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        // ACTIVE SECTION (Strictly only the selected primary section rendered)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (activeSectionIndex) {
                0 -> {
                    AddRecordSection(
                        onSaveRecord = { record ->
                            viewModel.saveTestRecord(record)
                            // Optionally switch to analysis board after save
                            activeSectionIndex = 1
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                }
                1 -> {
                    AnalysisBoardSection(
                        records = testRecords,
                        onDeleteRecord = { id ->
                            viewModel.deleteTestRecord(id)
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }

    // Top Update Setup Dialog (Accessible via version chip or settings)
    UpdateSetupDialog(
        isOpen = showTopUpdateDialog,
        onDismiss = { showTopUpdateDialog = false },
        otaStatus = otaStatus,
        postponedUpdate = postponedUpdate,
        onCheckForUpdates = { viewModel.checkForUpdates() },
        onSimulateTestUpdate = { viewModel.simulateLiveRelease() },
        onDownloadUpdate = { updateInfo -> viewModel.downloadUpdate(updateInfo) },
        onInstallApk = { apkFile -> viewModel.installApk(apkFile) },
        onClearPostponedUpdate = { viewModel.clearPostponedUpdate() }
    )

    // Settings Modal Sheet
    SettingsPreferencesSheet(
        isOpen = showSettingsSheet,
        currentRepo = viewModel.otaUpdateManager.githubRepo,
        onDismiss = { showSettingsSheet = false }
    )
}
