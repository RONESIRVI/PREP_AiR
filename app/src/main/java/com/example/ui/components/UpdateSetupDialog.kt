package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.LinkOff
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.BuildConfig
import com.example.data.ota.UpdateInfo
import com.example.data.ota.UpdateStatus
import com.example.ui.theme.PrepBackground
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary
import com.example.ui.theme.PrepThemeState
import java.io.File

/**
 * Ultra-Premium New Update Version Card
 * Features:
 * - Multi-accent gradient rim (Emerald to Gold to Indigo)
 * - Version Transition Leap Pill (v1.0.0 ➔ v1.1.0)
 * - Verified OTA Badges (Link-Free, Android Package Manager, SHA-256)
 * - Formatted Release Highlights
 * - High-tactile action buttons (Instant 1-Click Update + Secondary Action)
 */
@Composable
fun PremiumNewVersionCard(
    updateInfo: UpdateInfo,
    currentVersion: String = BuildConfig.VERSION_NAME,
    onDownloadNow: () -> Unit,
    onSecondaryAction: (() -> Unit)? = null,
    secondaryActionText: String? = null,
    secondaryActionIcon: ImageVector? = null,
    modifier: Modifier = Modifier
) {
    val isLight = PrepThemeState.isLight3D
    val surfaceColor = if (isLight) Color(0xFFFFFFFF) else Color(0xFF0F172A)
    val borderGradient = Brush.linearGradient(
        listOf(
            Color(0xFF10B981), // Emerald
            Color(0xFFF59E0B), // Gold
            Color(0xFF6366F1)  // Indigo
        )
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .shadow(12.dp, RoundedCornerShape(20.dp))
            .clip(RoundedCornerShape(20.dp))
            .background(surfaceColor)
            .border(1.5.dp, borderGradient, RoundedCornerShape(20.dp))
            .padding(16.dp)
            .testTag("premium_new_version_card")
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Top Ribbon: Sparkle / New Release Badge + Version Leap Capsule
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Pulsing Gradient Badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(
                                    Color(0xFFF59E0B).copy(alpha = 0.2f),
                                    Color(0xFF10B981).copy(alpha = 0.2f)
                                )
                            )
                        )
                        .border(
                            1.dp,
                            Color(0xFFF59E0B).copy(alpha = 0.6f),
                            RoundedCornerShape(20.dp)
                        )
                        .padding(horizontal = 9.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = Color(0xFFF59E0B),
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "NEW VERSION RELEASED",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.8.sp,
                        color = Color(0xFFF59E0B)
                    )
                }

                // Version Transition Pill: v1.0.0 ➔ v1.1.0
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isLight) Color(0xFFE2E8F0) else Color(0xFF1E293B))
                        .border(1.dp, PrepCardBorder, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "v$currentVersion",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            color = PrepTextMuted
                        )
                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = null,
                            tint = Color(0xFF10B981),
                            modifier = Modifier
                                .size(12.dp)
                                .padding(horizontal = 1.dp)
                        )
                        Text(
                            text = "v${updateInfo.versionName}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            color = Color(0xFF10B981)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Title of the Release
            Text(
                text = updateInfo.releaseTitle.ifEmpty { "PREP_AiR Performance & Engine Upgrade" },
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = PrepTextPrimary,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Spec Pills: 100% Link-Free • Verified OTA • Instant Package Install
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                SpecPill(text = "⚡ In-App OTA", tint = Color(0xFF10B981))
                SpecPill(text = "🛡️ Link-Free", tint = Color(0xFF38BDF8))
                SpecPill(text = "📦 Direct Install", tint = Color(0xFFF59E0B))
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Release Highlights / Changelog Box
            if (updateInfo.releaseNotes.isNotBlank()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isLight) Color(0xFFF1F5F9) else Color(0xFF1E293B).copy(alpha = 0.7f))
                        .border(1.dp, PrepCardBorder.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Shield,
                                contentDescription = null,
                                tint = Color(0xFF10B981),
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(5.dp))
                            Text(
                                text = "What's New in this Build:",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepTextPrimary
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = updateInfo.releaseNotes.trim(),
                            fontSize = 11.sp,
                            lineHeight = 16.sp,
                            color = PrepTextSecondary
                        )
                    }
                }
                Spacer(modifier = Modifier.height(14.dp))
            }

            // Primary Action: Instant 1-Click Update
            Button(
                onClick = onDownloadNow,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Transparent,
                    contentColor = Color.Black
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(Color(0xFF10B981), Color(0xFFF59E0B))
                        ),
                        RoundedCornerShape(12.dp)
                    )
                    .testTag("premium_update_download_btn")
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.RocketLaunch,
                        contentDescription = null,
                        tint = Color.Black,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(horizontalAlignment = Alignment.Start) {
                        Text(
                            text = "⚡ Instant 1-Click Update (अभी अपडेट करें)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Black
                        )
                        Text(
                            text = "बिना लिंक के सीधे बैकग्राउंड में डाउनलोड और इंस्टॉल",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            // Secondary Action (e.g. Postpone to Update Setup or Remove)
            if (onSecondaryAction != null && secondaryActionText != null) {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = onSecondaryAction,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = PrepTextPrimary
                    ),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = Brush.linearGradient(
                            listOf(PrepCardBorder, PrepCardBorder)
                        )
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(40.dp)
                        .testTag("premium_update_secondary_btn")
                ) {
                    if (secondaryActionIcon != null) {
                        Icon(
                            imageVector = secondaryActionIcon,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = PrepTextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text(
                        text = secondaryActionText,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PrepTextPrimary
                    )
                }
            }
        }
    }
}

@Composable
private fun SpecPill(text: String, tint: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(tint.copy(alpha = 0.12f))
            .border(1.dp, tint.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
            .padding(horizontal = 7.dp, vertical = 3.dp)
    ) {
        Text(
            text = text,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = tint
        )
    }
}

/**
 * Dedicated Update Setup Pop-Up Dialog
 * New Design Approach - Ultra Premium Setup
 */
@Composable
fun UpdateSetupDialog(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    otaStatus: UpdateStatus,
    postponedUpdate: UpdateInfo?,
    onCheckForUpdates: () -> Unit,
    onSimulateTestUpdate: () -> Unit = {},
    onDownloadUpdate: (UpdateInfo) -> Unit,
    onInstallApk: (File) -> Unit,
    onClearPostponedUpdate: () -> Unit
) {
    if (!isOpen) return

    val isLight = PrepThemeState.isLight3D
    val popupBg = if (isLight) Color(0xFFFFFFFF) else Color(0xFF0B1120)
    val popupBorderGradient = Brush.linearGradient(
        listOf(
            Color(0xFF10B981), // Emerald
            Color(0xFFF59E0B), // Gold
            Color(0xFF6366F1)  // Indigo
        )
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .clip(RoundedCornerShape(26.dp))
                .background(popupBg)
                .border(
                    width = 1.6.dp,
                    brush = popupBorderGradient,
                    shape = RoundedCornerShape(26.dp)
                )
                .shadow(24.dp, RoundedCornerShape(26.dp))
                .padding(20.dp)
                .testTag("update_setup_modal_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                // Header Row with Glowing Crest & Close
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(38.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(Color(0xFF10B981).copy(alpha = 0.3f), Color(0xFFF59E0B).copy(alpha = 0.3f))
                                    )
                                )
                                .border(1.dp, Color(0xFF10B981).copy(alpha = 0.6f), CircleShape)
                        ) {
                            Icon(
                                imageVector = Icons.Default.SystemUpdate,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PREP_AiR OTA SUITE",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.5.sp,
                                color = PrepTextPrimary
                            )
                            Text(
                                text = "Direct In-App Updater (Link-Free)",
                                fontSize = 11.sp,
                                color = PrepTextSecondary
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(PrepSurfaceVariant)
                            .testTag("close_update_setup_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = PrepTextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Feature Ribbon: 100% In-App Direct OTA
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(PrepGreenDark.copy(alpha = 0.6f))
                        .border(1.dp, PrepGreenBright.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 9.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LinkOff,
                            contentDescription = null,
                            tint = PrepGreenBright,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "100% बिना लिंक के सुरक्षित इन-ऐप इंस्टॉलर",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepGreenBright
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Card 1: Currently Installed System Version
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(PrepSurfaceVariant)
                        .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.PhoneAndroid,
                                contentDescription = null,
                                tint = PrepTextPrimary,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Current Installed Build",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )
                                Text(
                                    text = "PREP_AiR v${BuildConfig.VERSION_NAME}",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(PrepGreenBright.copy(alpha = 0.15f))
                                .border(1.dp, PrepGreenBright.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "ACTIVE",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepGreenBright
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Section 2: NEW UPDATE VERSION CARD / DYNAMIC STATES
                when (otaStatus) {
                    is UpdateStatus.UpdateAvailable -> {
                        // ULTRA PREMIUM NEW UPDATE VERSION CARD
                        PremiumNewVersionCard(
                            updateInfo = otaStatus.updateInfo,
                            currentVersion = BuildConfig.VERSION_NAME,
                            onDownloadNow = { onDownloadUpdate(otaStatus.updateInfo) }
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    is UpdateStatus.Downloading -> {
                        // High-tech Cyberpunk Downloading Card
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(PrepSurfaceVariant)
                                .border(1.dp, PrepGreenBright.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                                .padding(16.dp)
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        CircularProgressIndicator(
                                            progress = { otaStatus.progressPercent / 100f },
                                            modifier = Modifier.size(22.dp),
                                            strokeWidth = 2.5.dp,
                                            color = PrepGreenBright
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Text(
                                            text = "Downloading APK in background...",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PrepTextPrimary
                                        )
                                    }
                                    Text(
                                        text = "${otaStatus.progressPercent}%",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Black,
                                        fontFamily = FontFamily.Monospace,
                                        color = PrepGreenBright
                                    )
                                }
                                Spacer(modifier = Modifier.height(12.dp))
                                LinearProgressIndicator(
                                    progress = { otaStatus.progressPercent / 100f },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(7.dp)
                                        .clip(RoundedCornerShape(4.dp)),
                                    color = PrepGreenBright,
                                    trackColor = PrepBackground
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "सीधे फोन में सेव हो रहा है • किसी बाहरी लिंक की ज़रूरत नहीं",
                                    fontSize = 10.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    is UpdateStatus.ReadyToInstall -> {
                        // Verified & Ready to Complete Installation Card
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(PrepGreenDark.copy(alpha = 0.5f))
                                .border(1.5.dp, PrepGreenBright, RoundedCornerShape(16.dp))
                                .padding(16.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = PrepGreenBright,
                                        modifier = Modifier.size(22.dp)
                                    )
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = "APK Downloaded & Integrity Verified!",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PrepGreenBright
                                        )
                                        Text(
                                            text = "Ready for 1-Click Android Package Installation",
                                            fontSize = 11.sp,
                                            color = PrepTextSecondary
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(14.dp))
                                Button(
                                    onClick = { onInstallApk(otaStatus.apkFile) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = PrepGreenBright,
                                        contentColor = Color.Black
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(46.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.SystemUpdate,
                                        contentDescription = null,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Complete Installation (Launch Installer)",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    is UpdateStatus.Installing -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(PrepGreenDark.copy(alpha = 0.3f))
                                .border(1.dp, PrepGreenBright.copy(alpha = 0.6f), RoundedCornerShape(14.dp))
                                .padding(14.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.RocketLaunch,
                                    contentDescription = null,
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(22.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "Installation In Progress...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                    Text(
                                        text = "Android package manager running. No repeat installs needed.",
                                        fontSize = 10.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    is UpdateStatus.Checking -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(PrepSurfaceVariant)
                                .padding(14.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    strokeWidth = 2.5.dp,
                                    color = PrepGreenBright
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "Connecting to GitHub Releases...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "Checking for new builds automatically",
                                        fontSize = 10.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    else -> {
                        // If there is a Postponed/Saved Update in Setup
                        if (postponedUpdate != null) {
                            PremiumNewVersionCard(
                                updateInfo = postponedUpdate,
                                currentVersion = BuildConfig.VERSION_NAME,
                                onDownloadNow = { onDownloadUpdate(postponedUpdate) },
                                onSecondaryAction = onClearPostponedUpdate,
                                secondaryActionText = "सेटअप से हटाएं (Remove from Saved)",
                                secondaryActionIcon = Icons.Default.DeleteOutline
                            )
                            Spacer(modifier = Modifier.height(14.dp))
                        } else {
                            // Up to date card
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(PrepSurfaceVariant)
                                    .border(1.dp, PrepGreenBright.copy(alpha = 0.3f), RoundedCornerShape(14.dp))
                                    .padding(14.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = PrepGreenBright,
                                        modifier = Modifier.size(22.dp)
                                    )
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = "सिस्टम पूरी तरह अप-टू-डेट है (LATEST)",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PrepGreenBright
                                        )
                                        Text(
                                            text = "PREP_AiR v${BuildConfig.VERSION_NAME} is active & verified",
                                            fontSize = 11.sp,
                                            color = PrepTextMuted
                                        )
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                        }
                    }
                }

                // Auto-Detect Check Button (Real GitHub In-App OTA)
                Button(
                    onClick = onCheckForUpdates,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isLight) Color(0xFF0F172A) else PrepSurfaceCard,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, PrepGreenBright.copy(alpha = 0.6f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("dialog_check_updates_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = null,
                        modifier = Modifier.size(17.dp),
                        tint = PrepGreenBright
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Auto-Detect Check (GitHub Releases)",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Explanatory Footer
                Text(
                    text = "नोट: ऑटो-डिटेक्ट आपके फोन में बिना किसी बाहरी लिंक या ब्राउज़र के सीधे नए अपडेट्स को वेरीफाई करके इंस्टॉल करता है। आप अपडेट को तुरंत इंस्टॉल कर सकते हैं या बाद में करने के लिए सुरक्षित रख सकते हैं।",
                    fontSize = 11.sp,
                    lineHeight = 16.sp,
                    color = PrepTextMuted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
