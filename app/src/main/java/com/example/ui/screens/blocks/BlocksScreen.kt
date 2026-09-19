package com.example.ui.screens.blocks

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SmartDisplay
import com.example.ui.components.BlockedAppsSelection
import com.example.ui.components.SelectAppsToBlockSheet
import com.example.ui.components.StrictSystemInfoDialog
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.AppLimitEntity
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepOrangeDistracting
import com.example.ui.theme.PrepRedAlert
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary
import com.example.ui.theme.PrepThemeState
import com.example.ui.theme.threeDCard
import com.example.ui.theme.threeDWell

@Composable
fun BlocksScreen(
    appLimits: List<AppLimitEntity>,
    blockShortsEnabled: Boolean,
    strictModeEnabled: Boolean,
    uninstallProtectionEnabled: Boolean,
    websiteBlockerEnabled: Boolean,
    onToggleShorts: (Boolean) -> Unit,
    onToggleStrictMode: (Boolean) -> Unit,
    onToggleUninstallProtection: (Boolean) -> Unit,
    onToggleWebsiteBlocker: (Boolean) -> Unit,
    onAddAppLimit: (AppLimitEntity) -> Unit,
    onDeleteAppLimit: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    var showAddLimitDialog by remember { mutableStateOf(false) }
    var showSelectAppsSheet by remember { mutableStateOf(false) }
    var showStrictSystemInfoDialog by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 8.dp)
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column {
                Text(
                    text = "App Blocker & Shields",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
                Text(
                    text = "Daily app quotas & dopamine scroll blockers",
                    fontSize = 12.sp,
                    color = PrepTextMuted
                )
            }

            Box(
                modifier = Modifier
                    .shadow(3.dp, RoundedCornerShape(10.dp))
                    .clip(RoundedCornerShape(10.dp))
                    .background(PrepGreenBright)
                    .clickable { showAddLimitDialog = true }
                    .padding(horizontal = 12.dp, vertical = 7.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = "Add", tint = Color.Black, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Add Limit", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            // Select Apps to Block Card (Exact UI Matching Screenshots)
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .threeDCard(RoundedCornerShape(16.dp))
                        .clickable { showSelectAppsSheet = true }
                        .padding(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(PrepGreenDark)
                                    .border(1.dp, PrepGreenBright.copy(alpha = 0.4f), CircleShape)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Block,
                                    contentDescription = null,
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Select Apps to Block",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "YouTube Shorts, Browsers & 14+ Apps",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(PrepGreenBright)
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "Open",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Black
                            )
                        }
                    }
                }
            }

            // Shield Toggles Section
            item {
                Text(
                    text = "Smart Focus Shields",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .threeDCard(RoundedCornerShape(16.dp))
                        .padding(16.dp)
                ) {
                    // Block Shorts & Reels
                    ShieldToggleRow(
                        title = "Block Shorts & Reels (PRO)",
                        subtitle = "Instagram Reels, YouTube Shorts, TikTok, FB Reels",
                        icon = Icons.Default.SmartDisplay,
                        isChecked = blockShortsEnabled,
                        onCheckedChange = onToggleShorts,
                        isPro = true
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Strict Mode with Info trigger
                    ShieldToggleRow(
                        title = "Strict Mode (सख्त मोड)",
                        subtitle = "Blocks app switcher, exit & uninstallation during focus",
                        icon = Icons.Default.Lock,
                        isChecked = strictModeEnabled,
                        onCheckedChange = { isChecked ->
                            if (isChecked) {
                                showStrictSystemInfoDialog = true
                            } else {
                                onToggleStrictMode(false)
                            }
                        }
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Uninstall Protection
                    ShieldToggleRow(
                        title = "Uninstall Protection (PRO)",
                        subtitle = "Prevents uninstalling PREP_AiR while study session is active",
                        icon = Icons.Default.Shield,
                        isChecked = uninstallProtectionEnabled,
                        onCheckedChange = onToggleUninstallProtection,
                        isPro = true
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Website Blocker
                    ShieldToggleRow(
                        title = "Website & Adult Filter (PRO)",
                        subtitle = "Blocks distracting sites & adult domain browsing",
                        icon = Icons.Default.Block,
                        isChecked = websiteBlockerEnabled,
                        onCheckedChange = onToggleWebsiteBlocker,
                        isPro = true
                    )
                }
            }

            // App Limits Section
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "App Time Limits (Today's Quota)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
            }

            items(appLimits, key = { it.id }) { limit ->
                AppLimitCard(
                    limit = limit,
                    onDelete = { onDeleteAppLimit(limit.id) }
                )
            }

            item {
                Spacer(modifier = Modifier.height(60.dp))
            }
        }
    }

    if (showAddLimitDialog) {
        AddLimitDialog(
            onDismiss = { showAddLimitDialog = false },
            onConfirm = { newLimit ->
                onAddAppLimit(newLimit)
                showAddLimitDialog = false
            }
        )
    }

    SelectAppsToBlockSheet(
        isOpen = showSelectAppsSheet,
        onApplySelection = { sel ->
            onToggleShorts(sel.blockYouTubeShorts)
            onToggleWebsiteBlocker(sel.blockBrowserApps)
            showSelectAppsSheet = false
        },
        onDismiss = { showSelectAppsSheet = false }
    )

    StrictSystemInfoDialog(
        isOpen = showStrictSystemInfoDialog,
        initialStrict = strictModeEnabled,
        onConfirm = { enabled ->
            onToggleStrictMode(enabled)
            showStrictSystemInfoDialog = false
        },
        onDismiss = { showStrictSystemInfoDialog = false }
    )
}

@Composable
fun ShieldToggleRow(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    isPro: Boolean = false
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
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isChecked) PrepGreenBright else PrepTextMuted,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = title,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PrepTextPrimary
                    )
                    if (isPro) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .background(PrepGoldPro.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 4.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = "PRO",
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepGoldPro
                            )
                        }
                    }
                }
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = PrepTextMuted
                )
            }
        }

        Switch(
            checked = isChecked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.Black,
                checkedTrackColor = PrepGreenBright,
                uncheckedTrackColor = PrepSurfaceVariant
            )
        )
    }
}

@Composable
fun AppLimitCard(
    limit: AppLimitEntity,
    onDelete: () -> Unit
) {
    val progress = (limit.usedTodayMin.toFloat() / limit.dailyLimitMin.coerceAtLeast(1)).coerceIn(0f, 1f)
    val isNearExhausted = progress >= 0.8f

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .threeDCard(RoundedCornerShape(14.dp))
            .padding(14.dp)
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(38.dp)
                            .shadow(1.5.dp, RoundedCornerShape(10.dp))
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (PrepThemeState.isLight3D) Color(0xFFF0FDF4) else PrepGreenDark)
                            .border(
                                1.dp,
                                if (PrepThemeState.isLight3D) Color(0xFFDCFCE7) else PrepGreenBright.copy(alpha = 0.3f),
                                RoundedCornerShape(10.dp)
                            )
                    ) {
                        Text(text = limit.iconEmoji, fontSize = 20.sp)
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = limit.appName,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "${limit.usedTodayMin}m used of ${limit.dailyLimitMin}m limit",
                            fontSize = 11.sp,
                            color = if (isNearExhausted) PrepRedAlert else PrepTextSecondary
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (limit.isBlockedShorts) {
                        Box(
                            modifier = Modifier
                                .shadow(1.dp, RoundedCornerShape(6.dp))
                                .background(PrepRedAlert.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                                .border(1.dp, PrepRedAlert.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "SHORTS BLOCKED",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepRedAlert
                            )
                        }
                    }
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(30.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = PrepTextMuted,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            LinearProgressIndicator(
                progress = { progress },
                color = if (isNearExhausted) PrepRedAlert else PrepOrangeDistracting,
                trackColor = PrepCardBorder,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp))
            )
        }
    }
}

@Composable
fun AddLimitDialog(
    onDismiss: () -> Unit,
    onConfirm: (AppLimitEntity) -> Unit
) {
    var appName by remember { mutableStateOf("") }
    var selectedEmoji by remember { mutableStateOf("📱") }
    var dailyLimitMin by remember { mutableStateOf("45") }
    var blockShorts by remember { mutableStateOf(true) }

    val emojis = listOf("📱", "📷", "▶️", "📘", "👻", "🐦", "🎮", "💬")

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = PrepSurface,
        title = {
            Text(
                text = "Set App Daily Limit",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = PrepTextPrimary
            )
        },
        text = {
            Column {
                OutlinedTextField(
                    value = appName,
                    onValueChange = { appName = it },
                    label = { Text("App Name (e.g. Instagram, Reddit)") },
                    singleLine = true,
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

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    emojis.forEach { emoji ->
                        val isSelected = selectedEmoji == emoji
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(34.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) PrepGreenDark else PrepSurfaceCard)
                                .border(
                                    1.dp,
                                    if (isSelected) PrepGreenBright else PrepCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedEmoji = emoji }
                        ) {
                            Text(text = emoji, fontSize = 16.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = dailyLimitMin,
                    onValueChange = { dailyLimitMin = it },
                    label = { Text("Daily Limit (minutes)") },
                    singleLine = true,
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
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (appName.isNotBlank()) {
                        onConfirm(
                            AppLimitEntity(
                                packageName = "com.distracting.${appName.lowercase().replace(" ", "")}",
                                appName = appName.trim(),
                                iconEmoji = selectedEmoji,
                                dailyLimitMin = dailyLimitMin.toIntOrNull() ?: 45,
                                usedTodayMin = 0,
                                isBlockedShorts = blockShorts,
                                isStrict = false
                            )
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = PrepGreenBright,
                    contentColor = Color.Black
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Set Limit", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            OutlinedButton(
                onClick = onDismiss,
                colors = ButtonDefaults.outlinedButtonColors(contentColor = PrepTextMuted),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Cancel")
            }
        }
    )
}
