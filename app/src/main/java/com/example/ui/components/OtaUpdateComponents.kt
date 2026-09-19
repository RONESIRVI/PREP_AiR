package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
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
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.ota.UpdateInfo
import com.example.data.ota.UpdateStatus
import com.example.ui.theme.PrepBlueAccent
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepGreenPrimary
import com.example.ui.theme.PrepRedAlert
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary

/**
 * Top floating pill / banner when an OTA update is discovered or active.
 */
@Composable
fun OtaFloatingBanner(
    status: UpdateStatus,
    onOpenUpdateCenter: () -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isVisible = status is UpdateStatus.UpdateAvailable ||
            status is UpdateStatus.Downloading ||
            status is UpdateStatus.ReadyToInstall

    AnimatedVisibility(
        visible = isVisible,
        enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
        modifier = modifier
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(PrepSurfaceVariant)
                .border(1.dp, PrepGreenBright.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
                .clickable { onOpenUpdateCenter() }
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(36.dp)
                            .background(PrepGreenBright.copy(alpha = 0.2f), CircleShape)
                    ) {
                        when (status) {
                            is UpdateStatus.Downloading -> {
                                CircularProgressIndicator(
                                    progress = { status.progressPercent / 100f },
                                    modifier = Modifier.size(24.dp),
                                    color = PrepGreenBright,
                                    strokeWidth = 2.5.dp
                                )
                            }
                            is UpdateStatus.ReadyToInstall -> {
                                Icon(
                                    imageVector = Icons.Default.SystemUpdate,
                                    contentDescription = "Install",
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            else -> {
                                Icon(
                                    imageVector = Icons.Default.CloudDownload,
                                    contentDescription = "Update",
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        when (status) {
                            is UpdateStatus.UpdateAvailable -> {
                                Text(
                                    text = "OTA Update v${status.updateInfo.versionName} Available!",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Tap to view changelog & install automatically",
                                    fontSize = 11.sp,
                                    color = PrepGreenBright
                                )
                            }
                            is UpdateStatus.Downloading -> {
                                Text(
                                    text = "Downloading APK: ${status.progressPercent}%",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "${status.bytesRead / 1024} KB / ${status.totalBytes / 1024} KB",
                                    fontSize = 11.sp,
                                    color = PrepBlueAccent
                                )
                            }
                            is UpdateStatus.ReadyToInstall -> {
                                Text(
                                    text = "Update Ready to Install!",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Tap to launch package installer",
                                    fontSize = 11.sp,
                                    color = PrepGreenBright
                                )
                            }
                            else -> {}
                        }
                    }
                }

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Dismiss",
                        tint = PrepTextMuted,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

/**
 * Full OTA Update Center Modal Bottom Sheet
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OtaUpdateCenterSheet(
    isOpen: Boolean,
    status: UpdateStatus,
    currentVersion: String,
    currentRepo: String,
    autoCheckEnabled: Boolean,
    onRepoChanged: (String) -> Unit,
    onAutoCheckToggled: (Boolean) -> Unit,
    onCheckForUpdates: () -> Unit,
    onSimulateLiveRelease: () -> Unit,
    onDownloadUpdate: (UpdateInfo) -> Unit,
    onInstallApk: (java.io.File) -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var editingRepo by remember { mutableStateOf(currentRepo) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = PrepSurface,
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(vertical = 10.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .background(PrepCardBorder, RoundedCornerShape(2.dp))
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 6.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.SystemUpdate,
                        contentDescription = "OTA",
                        tint = PrepGreenBright,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "OTA Auto-Update Center",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "GitHub Live Releases OTA Pipeline",
                            fontSize = 12.sp,
                            color = PrepTextMuted
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .background(PrepGreenDark, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "INSTALLED: v$currentVersion",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepGreenBright,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Main Status Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(PrepSurfaceCard)
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                    .padding(16.dp)
            ) {
                when (status) {
                    is UpdateStatus.Idle -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Status",
                                tint = PrepGreenBright,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Ready to Check for Updates",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Connected repository: $currentRepo",
                                    fontSize = 12.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                    }
                    is UpdateStatus.Checking -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = PrepGreenBright,
                                strokeWidth = 2.5.dp
                            )
                            Spacer(modifier = Modifier.width(14.dp))
                            Column {
                                Text(
                                    text = "Checking GitHub Releases...",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Fetching tags & APK assets from ${status.repository}",
                                    fontSize = 12.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                    }
                    is UpdateStatus.UpToDate -> {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Up To Date",
                                tint = PrepGreenBright,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "App is Up to Date!",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "You are running the latest version (v${status.currentVersion})",
                                    fontSize = 12.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                    }
                    is UpdateStatus.UpdateAvailable -> {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .background(PrepGoldPro.copy(alpha = 0.2f), CircleShape)
                                        .padding(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.AutoAwesome,
                                        contentDescription = "New Release",
                                        tint = PrepGoldPro,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "NEW VERSION AVAILABLE: v${status.updateInfo.versionName}",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                    Text(
                                        text = status.updateInfo.releaseTitle,
                                        fontSize = 12.sp,
                                        color = PrepTextSecondary
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Changelog
                            Text(
                                text = "What's New in this Release:",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PrepTextPrimary
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(PrepSurface, RoundedCornerShape(8.dp))
                                    .padding(10.dp)
                            ) {
                                Text(
                                    text = status.updateInfo.releaseNotes,
                                    fontSize = 12.sp,
                                    color = PrepTextSecondary,
                                    lineHeight = 18.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = { onDownloadUpdate(status.updateInfo) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = PrepGreenBright,
                                    contentColor = Color.Black
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Download,
                                    contentDescription = "Download",
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Download & Auto-Update APK",
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                    is UpdateStatus.Downloading -> {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "Downloading v${status.updateInfo.versionName}...",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "${status.progressPercent}%",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepGreenBright
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = { status.progressPercent / 100f },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp)),
                                color = PrepGreenBright,
                                trackColor = PrepCardBorder
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Received: ${status.bytesRead / 1024} KB / ${status.totalBytes / 1024} KB",
                                fontSize = 11.sp,
                                color = PrepTextMuted
                            )
                        }
                    }
                    is UpdateStatus.ReadyToInstall -> {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = "Ready",
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "APK Download Complete!",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "Package: ${status.apkFile.name}",
                                        fontSize = 11.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Button(
                                onClick = { onInstallApk(status.apkFile) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = PrepGreenBright,
                                    contentColor = Color.Black
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(
                                    imageVector = Icons.Default.SystemUpdate,
                                    contentDescription = "Install Now",
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Install Update Now",
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                    is UpdateStatus.Error -> {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.ErrorOutline,
                                    contentDescription = "Error",
                                    tint = PrepRedAlert,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "Release Fetch Notice",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = status.message,
                                fontSize = 12.sp,
                                color = PrepTextSecondary,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Action Buttons Row: Check GitHub & Test Live Simulation
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Button(
                    onClick = onCheckForUpdates,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrepGreenDark,
                        contentColor = PrepGreenBright
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Check",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Check GitHub", fontSize = 13.sp)
                }

                OutlinedButton(
                    onClick = onSimulateLiveRelease,
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = PrepBlueAccent
                    ),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = androidx.compose.ui.graphics.SolidColor(PrepBlueAccent.copy(alpha = 0.5f))
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = "Simulate",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Simulate v1.1.0", fontSize = 13.sp)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // GitHub Configuration Section
            Text(
                text = "GitHub Release Settings",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = PrepTextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = editingRepo,
                onValueChange = { editingRepo = it },
                label = { Text("GitHub Repo (owner/repository)") },
                placeholder = { Text("e.g. aariz/PREP_AiR") },
                singleLine = true,
                trailingIcon = {
                    if (editingRepo != currentRepo) {
                        Button(
                            onClick = { onRepoChanged(editingRepo) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = PrepGreenBright,
                                contentColor = Color.Black
                            ),
                            shape = RoundedCornerShape(6.dp),
                            modifier = Modifier.padding(end = 6.dp)
                        ) {
                            Text("Save", fontSize = 11.sp)
                        }
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrepGreenBright,
                    unfocusedBorderColor = PrepCardBorder,
                    focusedTextColor = PrepTextPrimary,
                    unfocusedTextColor = PrepTextPrimary,
                    focusedLabelColor = PrepGreenBright,
                    unfocusedLabelColor = PrepTextMuted
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Auto-Check on App Launch Toggle
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PrepSurfaceCard, RoundedCornerShape(10.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Auto-Check on App Launch",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PrepTextPrimary
                    )
                    Text(
                        text = "Silently queries GitHub for newer versions when opening PREP_AiR",
                        fontSize = 11.sp,
                        color = PrepTextMuted
                    )
                }
                Switch(
                    checked = autoCheckEnabled,
                    onCheckedChange = onAutoCheckToggled,
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.Black,
                        checkedTrackColor = PrepGreenBright,
                        uncheckedTrackColor = PrepSurfaceVariant
                    )
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
