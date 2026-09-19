package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.LinkOff
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
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
 * Dedicated Update Setup Dialog
 * Fully Link-Free: Directly manages In-App downloads and installs with Android Package Installer.
 * Displays:
 * 1. Current Installed App Version
 * 2. Auto-Detect status
 * 3. Saved/Postponed updates in Update Setup for later 1-click install
 * 4. Zero external link guarantee
 */
@Composable
fun UpdateSetupDialog(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    otaStatus: UpdateStatus,
    postponedUpdate: UpdateInfo?,
    onCheckForUpdates: () -> Unit,
    onSimulateTestUpdate: () -> Unit,
    onDownloadUpdate: (UpdateInfo) -> Unit,
    onInstallApk: (File) -> Unit,
    onClearPostponedUpdate: () -> Unit
) {
    if (!isOpen) return

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .clip(RoundedCornerShape(24.dp))
                .background(
                    if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else PrepSurfaceCard
                )
                .border(
                    width = 1.5.dp,
                    brush = Brush.linearGradient(
                        listOf(PrepGreenBright, PrepGoldPro)
                    ),
                    shape = RoundedCornerShape(24.dp)
                )
                .shadow(20.dp, RoundedCornerShape(24.dp))
                .padding(20.dp)
                .testTag("update_setup_modal_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                // Header Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(PrepGreenBright.copy(alpha = 0.2f))
                        ) {
                            Icon(
                                imageVector = Icons.Default.SystemUpdate,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "UPDATE SETUP",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.5.sp,
                                color = PrepTextPrimary
                            )
                            Text(
                                text = "Auto-Detect & Link-Free Updater",
                                fontSize = 11.sp,
                                color = PrepTextSecondary
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
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

                // Zero-Link Guarantee Pill
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(PrepGreenDark.copy(alpha = 0.6f))
                        .border(1.dp, PrepGreenBright.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp)
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
                            text = "100% बिना लिंक के Direct In-App Update",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepGreenBright
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Card 1: Currently Installed Version
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(PrepSurfaceVariant)
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
                                    text = "Installed App Version",
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

                Spacer(modifier = Modifier.height(12.dp))

                // Card 2: Postponed / Saved Update in Setup (Waiting for later install)
                if (postponedUpdate != null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(PrepGoldPro.copy(alpha = 0.12f))
                            .border(1.2.dp, PrepGoldPro.copy(alpha = 0.6f), RoundedCornerShape(14.dp))
                            .padding(14.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.AutoAwesome,
                                        contentDescription = null,
                                        tint = PrepGoldPro,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Saved in Update Setup (बाद में करने के लिए रखा हुआ)",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGoldPro
                                    )
                                }

                                IconButton(
                                    onClick = onClearPostponedUpdate,
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.DeleteOutline,
                                        contentDescription = "Remove",
                                        tint = PrepTextMuted,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "New Version: v${postponedUpdate.versionName}",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = PrepTextPrimary
                            )
                            Text(
                                text = postponedUpdate.releaseTitle,
                                fontSize = 11.sp,
                                color = PrepTextSecondary
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Button(
                                onClick = {
                                    onDownloadUpdate(postponedUpdate)
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = PrepGoldPro,
                                    contentColor = Color.Black
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(42.dp)
                                    .testTag("install_postponed_update_btn")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.RocketLaunch,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Install Update Now (1-Click)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                }

                // Card 3: Dynamic Live Status (Downloading, Ready, or Checking)
                when (otaStatus) {
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
                                        text = "Auto-Detecting Latest Releases...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "Connecting to release server directly",
                                        fontSize = 10.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    is UpdateStatus.Downloading -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(PrepSurfaceVariant)
                                .padding(14.dp)
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Downloading APK package directly...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "${otaStatus.progressPercent}%",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                LinearProgressIndicator(
                                    progress = { otaStatus.progressPercent / 100f },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(6.dp)
                                        .clip(RoundedCornerShape(3.dp)),
                                    color = PrepGreenBright,
                                    trackColor = PrepBackground
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "बिना ब्राउज़र लिंक के सीधे फोन में सेव हो रहा है",
                                    fontSize = 10.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    is UpdateStatus.ReadyToInstall -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(PrepGreenDark.copy(alpha = 0.4f))
                                .border(1.2.dp, PrepGreenBright, RoundedCornerShape(14.dp))
                                .padding(14.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = PrepGreenBright,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "APK Downloaded & Verified!",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                Button(
                                    onClick = { onInstallApk(otaStatus.apkFile) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = PrepGreenBright,
                                        contentColor = Color.Black
                                    ),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(44.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.SystemUpdate,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Complete Install Now",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    is UpdateStatus.UpToDate -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(PrepSurfaceVariant)
                                .padding(14.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "You have the Latest Version",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "v${otaStatus.currentVersion} is up to date",
                                        fontSize = 10.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    else -> {}
                }

                // Control Buttons: Check Updates & Simulate
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onCheckForUpdates,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PrepGreenBright,
                            contentColor = Color.Black
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("dialog_check_updates_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = null,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Auto-Detect Check",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    OutlinedButton(
                        onClick = onSimulateTestUpdate,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("dialog_simulate_update_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = PrepGoldPro,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Test Update v1.1.0",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Explanatory Footer
                Text(
                    text = "नोट: ऑटो-डिटेक्ट आपके फोन में बिना किसी बाहरी लिंक या ब्राउज़र के सीधे नए अपडेट्स को वेरीफाई करके इंस्टॉल करता है। आप अपडेट को तुरंत इंस्टॉल कर सकते हैं या 'Update Setup' में बाद में करने के लिए सुरक्षित रख सकते हैं।",
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
