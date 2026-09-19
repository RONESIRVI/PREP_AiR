package com.example.ui.components

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
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.BuildConfig
import com.example.ui.theme.PrepBlueAccent
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsPreferencesSheet(
    isOpen: Boolean,
    currentRepo: String,
    onOpenUpdateCenter: () -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val clipboardManager = LocalClipboardManager.current
    var copiedNotice by remember { mutableStateOf(false) }

    var defaultDuration by remember { mutableStateOf(45) }
    var breakDuration by remember { mutableStateOf(10) }
    var vibrationEnabled by remember { mutableStateOf(true) }
    var keepScreenAwake by remember { mutableStateOf(true) }

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
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(36.dp)
                            .background(PrepGreenDark, CircleShape)
                            .border(1.dp, PrepGreenBright, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = PrepGreenBright,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Settings & CI/CD Hub",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "PREP_AiR Focus & Deployment Controls",
                            fontSize = 12.sp,
                            color = PrepTextMuted
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .background(PrepSurfaceVariant, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "v${BuildConfig.VERSION_NAME}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepGreenBright,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Section 1: GitHub CI/CD & Live OTA Release Card
            Text(
                text = "GitHub CI/CD & Live OTA Updates",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = PrepTextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(PrepSurfaceCard)
                    .border(1.dp, PrepGreenBright.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Code,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Automated GitHub Release Pipeline",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepTextPrimary
                            )
                        }
                        Box(
                            modifier = Modifier
                                .background(PrepGreenDark, RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "CI/CD ACTIVE",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepGreenBright
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "To publish a new live update to this app from your computer or GitHub, run:",
                        fontSize = 11.sp,
                        color = PrepTextSecondary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Code snippet box
                    val gitCmd = "git tag v1.0.1 && git push origin v1.0.1"
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF07120A))
                            .border(1.dp, PrepCardBorder, RoundedCornerShape(8.dp))
                            .padding(10.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "$ $gitCmd",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = PrepGreenBright,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                imageVector = Icons.Default.ContentCopy,
                                contentDescription = "Copy",
                                tint = PrepTextMuted,
                                modifier = Modifier
                                    .size(16.dp)
                                    .clickable {
                                        clipboardManager.setText(AnnotatedString(gitCmd))
                                        copiedNotice = true
                                    }
                            )
                        }
                    }

                    if (copiedNotice) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Copied to clipboard!",
                            fontSize = 10.sp,
                            color = PrepGreenBright
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Button(
                            onClick = {
                                onDismiss()
                                onOpenUpdateCenter()
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = PrepGreenDark,
                                contentColor = PrepGreenBright
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                imageVector = Icons.Default.SystemUpdate,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Open Update Center", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Section 2: Focus & Timer Customization
            Text(
                text = "Focus Timer Preferences",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = PrepTextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(PrepSurfaceCard)
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                // Default Focus Duration
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = "Default Focus Session",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "Target length for deep focus blocks",
                            fontSize = 11.sp,
                            color = PrepTextMuted
                        )
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf(25, 45, 60).forEach { mins ->
                            val isSel = defaultDuration == mins
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSel) PrepGreenDark else PrepSurfaceVariant)
                                    .border(
                                        1.dp,
                                        if (isSel) PrepGreenBright else PrepCardBorder,
                                        RoundedCornerShape(6.dp)
                                    )
                                    .clickable { defaultDuration = mins }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "${mins}m",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSel) PrepGreenBright else PrepTextMuted
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Short Break Length
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = "Short Break Interval",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "Rest between study cycles",
                            fontSize = 11.sp,
                            color = PrepTextMuted
                        )
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf(5, 10, 15).forEach { mins ->
                            val isSel = breakDuration == mins
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSel) PrepGreenDark else PrepSurfaceVariant)
                                    .border(
                                        1.dp,
                                        if (isSel) PrepGreenBright else PrepCardBorder,
                                        RoundedCornerShape(6.dp)
                                    )
                                    .clickable { breakDuration = mins }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "${mins}m",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSel) PrepGreenBright else PrepTextMuted
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Vibration feedback
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Vibration,
                            contentDescription = null,
                            tint = PrepGreenBright,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Haptic & Vibration Alerts",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PrepTextPrimary
                            )
                            Text(
                                text = "Vibrate phone when session or break finishes",
                                fontSize = 11.sp,
                                color = PrepTextMuted
                            )
                        }
                    }
                    Switch(
                        checked = vibrationEnabled,
                        onCheckedChange = { vibrationEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.Black,
                            checkedTrackColor = PrepGreenBright,
                            uncheckedTrackColor = PrepSurfaceVariant
                        )
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Keep screen awake
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Timer,
                            contentDescription = null,
                            tint = PrepGreenBright,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Keep Screen On During Focus",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PrepTextPrimary
                            )
                            Text(
                                text = "Always view the countdown timer without locking",
                                fontSize = 11.sp,
                                color = PrepTextMuted
                            )
                        }
                    }
                    Switch(
                        checked = keepScreenAwake,
                        onCheckedChange = { keepScreenAwake = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.Black,
                            checkedTrackColor = PrepGreenBright,
                            uncheckedTrackColor = PrepSurfaceVariant
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Section 3: App Build & Engine Info
            Text(
                text = "Application Specifications",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = PrepTextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(PrepSurfaceCard)
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    SpecRow(label = "Application ID", value = "com.aistudio.prepair.app")
                    SpecRow(label = "Version Name", value = BuildConfig.VERSION_NAME)
                    SpecRow(label = "Version Code", value = "${BuildConfig.VERSION_CODE}")
                    SpecRow(label = "Target Android SDK", value = "API 36 (Android 15+)")
                    SpecRow(label = "Architecture", value = "MVVM + Jetpack Compose M3")
                    SpecRow(label = "Local Storage", value = "Android Room SQLite Database")
                    SpecRow(label = "Update Mechanism", value = "GitHub Releases Direct OTA")
                }
            }

            Spacer(modifier = Modifier.height(28.dp))
        }
    }
}

@Composable
private fun SpecRow(label: String, value: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text = label, fontSize = 12.sp, color = PrepTextMuted)
        Text(
            text = value,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace,
            color = PrepTextPrimary
        )
    }
}
