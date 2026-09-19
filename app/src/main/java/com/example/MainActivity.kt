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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.ota.UpdateStatus
import com.example.ui.components.OtaFloatingBanner
import com.example.ui.components.OtaUpdateCenterSheet
import com.example.ui.components.SettingsPreferencesSheet
import com.example.ui.screens.welcome.WelcomeScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.PrepBackground
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepThemeState
import com.example.ui.viewmodel.MainViewModel

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
    var showOtaSheet by remember { mutableStateOf(false) }
    var showSettingsSheet by remember { mutableStateOf(false) }

    // Collect Viewmodel States for In-App OTA Update System
    val otaStatus by viewModel.otaStatus.collectAsState()
    val postponedUpdate by viewModel.postponedUpdate.collectAsState()

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
                        // 3D Theme Mode Switcher (Light 3D vs Dark)
                        IconButton(
                            onClick = {
                                PrepThemeState.isLight3D = !PrepThemeState.isLight3D
                            },
                            modifier = Modifier
                                .size(34.dp)
                                .shadow(2.dp, CircleShape)
                                .background(PrepSurfaceCard, CircleShape)
                                .border(1.dp, PrepCardBorder, CircleShape)
                                .testTag("theme_toggle_button")
                        ) {
                            Icon(
                                imageVector = if (PrepThemeState.isLight3D) Icons.Default.DarkMode else Icons.Default.LightMode,
                                contentDescription = if (PrepThemeState.isLight3D) "Switch to Dark Mode" else "Switch to Light 3D Mode",
                                tint = if (PrepThemeState.isLight3D) Color(0xFF6366F1) else Color(0xFFFBBF24),
                                modifier = Modifier.size(17.dp)
                            )
                        }

                        // OTA Version Badge & Status Indicator (Pulsing gold if update ready)
                        val hasUpdate = otaStatus is UpdateStatus.UpdateAvailable ||
                                otaStatus is UpdateStatus.ReadyToInstall ||
                                otaStatus is UpdateStatus.Downloading

                        Box(
                            modifier = Modifier
                                .shadow(2.dp, RoundedCornerShape(20.dp))
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (hasUpdate) PrepGoldPro.copy(alpha = 0.2f) else PrepSurfaceCard)
                                .border(
                                    1.dp,
                                    if (hasUpdate) PrepGoldPro else PrepCardBorder,
                                    RoundedCornerShape(20.dp)
                                )
                                .clickable { showOtaSheet = true }
                                .padding(horizontal = 9.dp, vertical = 5.dp)
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
                                Spacer(modifier = Modifier.width(5.dp))
                                Text(
                                    text = if (hasUpdate) "OTA UPDATE" else "v${BuildConfig.VERSION_NAME}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = if (hasUpdate) PrepGoldPro else PrepTextPrimary
                                )
                            }
                        }

                        // Settings & CI/CD Hub Button
                        IconButton(
                            onClick = { showSettingsSheet = true },
                            modifier = Modifier
                                .size(34.dp)
                                .shadow(2.dp, CircleShape)
                                .background(PrepSurfaceCard, CircleShape)
                                .border(1.dp, PrepCardBorder, CircleShape)
                                .testTag("settings_sheet_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Settings,
                                contentDescription = "Settings & CI/CD Hub",
                                tint = PrepTextPrimary,
                                modifier = Modifier.size(17.dp)
                            )
                        }
                    }
                }

                // Floating Banner for OTA updates (Auto-shows when GitHub has a new release)
                OtaFloatingBanner(
                    status = otaStatus,
                    onOpenUpdateCenter = { showOtaSheet = true },
                    onDismiss = { viewModel.dismissUpdate() }
                )
            }
        },
        containerColor = PrepBackground,
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        // Single Dedicated Welcome Screen with CSS Graphics & Integrated OTA System
        WelcomeScreen(
            otaStatus = otaStatus,
            postponedUpdate = postponedUpdate,
            onCheckForUpdates = { viewModel.checkForUpdates() },
            onSimulateTestUpdate = { viewModel.simulateLiveRelease() },
            onOpenOtaSheet = { showOtaSheet = true },
            onDownloadUpdate = { updateInfo -> viewModel.downloadUpdate(updateInfo) },
            onInstallApk = { apkFile -> viewModel.installApk(apkFile) },
            onPostponeToUpdateSetup = { updateInfo -> viewModel.postponeToUpdateSetup(updateInfo) },
            onClearPostponedUpdate = { viewModel.clearPostponedUpdate() },
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        )
    }

    // OTA Auto-Update Center Modal Sheet (Preserved & Fully Functional)
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

    // Settings & CI/CD Hub Modal Sheet (Preserved)
    SettingsPreferencesSheet(
        isOpen = showSettingsSheet,
        currentRepo = viewModel.otaUpdateManager.githubRepo,
        onOpenUpdateCenter = {
            showSettingsSheet = false
            showOtaSheet = true
        },
        onDismiss = { showSettingsSheet = false }
    )
}
