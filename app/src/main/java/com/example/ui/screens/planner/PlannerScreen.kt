package com.example.ui.screens.planner

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
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.ScheduleEntity
import com.example.ui.components.BlockedAppsSelection
import com.example.ui.components.BreakDurationPickerSheet
import com.example.ui.components.SelectAppsToBlockSheet
import com.example.ui.components.StrictSystemInfoDialog
import com.example.ui.components.WeekCalendarStrip
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
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
fun PlannerScreen(
    schedules: List<ScheduleEntity>,
    selectedDayIndex: Int,
    onDaySelected: (Int) -> Unit,
    onToggleSchedule: (ScheduleEntity) -> Unit,
    onAddSchedule: (ScheduleEntity) -> Unit,
    onDeleteSchedule: (Long) -> Unit,
    onStartSessionForSchedule: (ScheduleEntity) -> Unit,
    modifier: Modifier = Modifier
) {
    // Multi-step planner wizard states
    var showDetailsDialog by remember { mutableStateOf(false) }
    var showBreakPickerSheet by remember { mutableStateOf(false) }
    var showAppBlockerSheet by remember { mutableStateOf(false) }
    var showStrictDialog by remember { mutableStateOf(false) }

    // Standalone sheet invocation for viewing/customizing blocked apps directly
    var showStandaloneAppBlockerSheet by remember { mutableStateOf(false) }

    // Temporary wizard holding state
    var pendingName by remember { mutableStateOf("") }
    var pendingEmoji by remember { mutableStateOf("📚") }
    var pendingStartTime by remember { mutableStateOf("09:00 AM") }
    var pendingEndTime by remember { mutableStateOf("11:00 AM") }
    var pendingTag by remember { mutableStateOf("Deep Study") }
    var pendingBreakMins by remember { mutableIntStateOf(10) }
    var pendingAppSelection by remember { mutableStateOf(BlockedAppsSelection()) }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
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
                        text = "Daily Planner",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepTextPrimary
                    )
                    Text(
                        text = "Scheduled study blocks, breaks & app shields",
                        fontSize = 12.sp,
                        color = PrepTextMuted
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Quick Apps Blocker shortcut
                    Box(
                        modifier = Modifier
                            .shadow(2.dp, RoundedCornerShape(8.dp))
                            .clip(RoundedCornerShape(8.dp))
                            .background(PrepSurfaceCard)
                            .border(1.dp, PrepCardBorder, RoundedCornerShape(8.dp))
                            .clickable { showStandaloneAppBlockerSheet = true }
                            .padding(horizontal = 8.dp, vertical = 5.dp)
                            .testTag("planner_block_apps_shortcut")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Block,
                                contentDescription = "Apps to Block",
                                tint = PrepGreenBright,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Apps",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepTextPrimary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Box(
                        modifier = Modifier
                            .shadow(2.dp, RoundedCornerShape(8.dp))
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (PrepThemeState.isLight3D) Color(0xFFD1FAE5) else PrepGreenDark)
                            .border(
                                1.dp,
                                if (PrepThemeState.isLight3D) Color(0xFFA7F3D0) else PrepGreenBright.copy(alpha = 0.5f),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = "${schedules.count { it.isEnabled }} ACTIVE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = if (PrepThemeState.isLight3D) Color(0xFF047857) else PrepGreenBright
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Week calendar strip
            WeekCalendarStrip(
                selectedDayIndex = selectedDayIndex,
                onDaySelected = onDaySelected
            )

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Today's Study Schedule",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )

                Text(
                    text = "+ Add Block directly asks Apps & Strict Mode",
                    fontSize = 11.sp,
                    color = PrepGreenBright,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (schedules.isEmpty()) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .threeDCard(RoundedCornerShape(16.dp))
                        .padding(20.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "📅", fontSize = 32.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No study blocks scheduled",
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = "Tap the + button to configure study block, breaks, and blocked apps",
                            fontSize = 12.sp,
                            color = PrepTextMuted
                        )
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(schedules, key = { it.id }) { schedule ->
                        ScheduleCardItem(
                            schedule = schedule,
                            onToggle = { onToggleSchedule(schedule) },
                            onDelete = { onDeleteSchedule(schedule.id) },
                            onStart = { onStartSessionForSchedule(schedule) },
                            onConfigureApps = { showStandaloneAppBlockerSheet = true }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }

        // Add Floating Action Button with 3D tactile elevation
        FloatingActionButton(
            onClick = {
                // Initialize default holding values
                pendingName = ""
                pendingEmoji = "📚"
                pendingStartTime = "09:00 AM"
                pendingEndTime = "11:00 AM"
                pendingTag = "Deep Study"
                pendingBreakMins = 10
                pendingAppSelection = BlockedAppsSelection()
                showDetailsDialog = true
            },
            containerColor = PrepGreenBright,
            contentColor = Color.Black,
            shape = CircleShape,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
                .shadow(6.dp, CircleShape, spotColor = PrepGreenBright.copy(alpha = 0.6f))
                .testTag("add_schedule_fab")
        ) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Add Schedule")
        }
    }

    // Step 1: Study Block Details Dialog
    if (showDetailsDialog) {
        AddScheduleDetailsDialog(
            name = pendingName,
            onNameChange = { pendingName = it },
            selectedEmoji = pendingEmoji,
            onEmojiChange = { pendingEmoji = it },
            startTime = pendingStartTime,
            onStartTimeChange = { pendingStartTime = it },
            endTime = pendingEndTime,
            onEndTimeChange = { pendingEndTime = it },
            tag = pendingTag,
            onTagChange = { pendingTag = it },
            onDismiss = { showDetailsDialog = false },
            onNext = {
                showDetailsDialog = false
                showBreakPickerSheet = true
            }
        )
    }

    // Step 2: Set Break Duration Picker Sheet (Matching Screenshot 3)
    BreakDurationPickerSheet(
        isOpen = showBreakPickerSheet,
        initialMinutes = pendingBreakMins,
        onConfirm = { minutes ->
            pendingBreakMins = minutes
            showBreakPickerSheet = false
            showAppBlockerSheet = true
        },
        onDismiss = {
            showBreakPickerSheet = false
        }
    )

    // Step 3: Select Apps to Block Sheet (Matching Screenshot 1 & 2)
    SelectAppsToBlockSheet(
        isOpen = showAppBlockerSheet,
        initialSelection = pendingAppSelection,
        onApplySelection = { selection ->
            pendingAppSelection = selection
            showAppBlockerSheet = false
            showStrictDialog = true
        },
        onDismiss = {
            showAppBlockerSheet = false
        }
    )

    // Step 4: Strict System Information and Decision Dialog
    StrictSystemInfoDialog(
        isOpen = showStrictDialog,
        initialStrict = true,
        onConfirm = { isStrict ->
            val blockedAppsSummaryStr = buildString {
                if (pendingAppSelection.blockYouTubeShorts) append("YouTube Shorts, ")
                if (pendingAppSelection.blockBrowserApps) append("Browser Apps, ")
                append("${pendingAppSelection.selectedAppIds.size} Distracting Apps")
            }

            onAddSchedule(
                ScheduleEntity(
                    name = pendingName.ifBlank { "Study Session" }.trim(),
                    icon = pendingEmoji,
                    startTime = pendingStartTime.trim(),
                    endTime = pendingEndTime.trim(),
                    repeatDays = "Mon-Fri",
                    breakMins = pendingBreakMins,
                    tag = pendingTag,
                    blockNotifs = true,
                    isEnabled = true,
                    isStrict = isStrict,
                    blockedAppsCount = pendingAppSelection.totalCount,
                    blockedAppsSummary = blockedAppsSummaryStr,
                    blockYouTubeShorts = pendingAppSelection.blockYouTubeShorts,
                    blockBrowserApps = pendingAppSelection.blockBrowserApps
                )
            )
            showStrictDialog = false
        },
        onDismiss = {
            showStrictDialog = false
        }
    )

    // Standalone sheet for browsing & tweaking blocked apps
    SelectAppsToBlockSheet(
        isOpen = showStandaloneAppBlockerSheet,
        initialSelection = pendingAppSelection,
        onApplySelection = { selection ->
            pendingAppSelection = selection
            showStandaloneAppBlockerSheet = false
        },
        onDismiss = {
            showStandaloneAppBlockerSheet = false
        }
    )
}

@Composable
fun ScheduleCardItem(
    schedule: ScheduleEntity,
    onToggle: () -> Unit,
    onDelete: () -> Unit,
    onStart: () -> Unit,
    onConfigureApps: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
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
                            .size(40.dp)
                            .shadow(2.dp, RoundedCornerShape(10.dp))
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (PrepThemeState.isLight3D) Color(0xFFF0FDF4) else PrepGreenDark
                            )
                            .border(
                                1.dp,
                                if (PrepThemeState.isLight3D) Color(0xFFDCFCE7) else PrepGreenBright.copy(alpha = 0.3f),
                                RoundedCornerShape(10.dp)
                            )
                    ) {
                        Text(text = schedule.icon, fontSize = 20.sp)
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = schedule.name,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Alarm,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${schedule.startTime} - ${schedule.endTime}",
                                fontSize = 12.sp,
                                color = PrepGreenBright,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                Switch(
                    checked = schedule.isEnabled,
                    onCheckedChange = { onToggle() },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = PrepGreenBright,
                        uncheckedTrackColor = PrepSurfaceVariant
                    )
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Badges row: Tag, Break duration, Strict System badge, Blocked Apps badge
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Tag Badge
                Box(
                    modifier = Modifier
                        .shadow(1.dp, RoundedCornerShape(6.dp))
                        .clip(RoundedCornerShape(6.dp))
                        .background(PrepSurfaceVariant)
                        .border(1.dp, PrepCardBorder, RoundedCornerShape(6.dp))
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = schedule.tag,
                        fontSize = 10.sp,
                        color = PrepTextSecondary,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                // Break Duration Badge (Screenshot 3 integration)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color(0xFF253B23))
                        .border(1.dp, Color(0xFF3B5D37), RoundedCornerShape(6.dp))
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "☕ ${schedule.breakMins}m Break",
                        fontSize = 10.sp,
                        color = Color(0xFF86EFAC),
                        fontWeight = FontWeight.SemiBold
                    )
                }

                // Strict System Badge
                if (schedule.isStrict) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFF3B1515))
                            .border(1.dp, PrepRedAlert.copy(alpha = 0.6f), RoundedCornerShape(6.dp))
                            .padding(horizontal = 7.dp, vertical = 3.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = null,
                                tint = PrepRedAlert,
                                modifier = Modifier.size(10.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(
                                text = "Strict System",
                                fontSize = 10.sp,
                                color = Color(0xFFFCA5A5),
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                // Blocked Apps Indicator
                val blockedCount = if (schedule.blockedAppsCount > 0) schedule.blockedAppsCount else 15
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(PrepSurfaceVariant)
                        .border(1.dp, PrepCardBorder, RoundedCornerShape(6.dp))
                        .clickable { onConfigureApps() }
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "🚫 $blockedCount Apps Blocked",
                        fontSize = 10.sp,
                        color = PrepTextSecondary,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Footer row: Repeat days & Action Buttons
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Repeats: ${schedule.repeatDays}",
                    fontSize = 11.sp,
                    color = PrepTextMuted
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = PrepTextMuted,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .shadow(2.dp, RoundedCornerShape(8.dp))
                            .clip(RoundedCornerShape(8.dp))
                            .background(
                                if (PrepThemeState.isLight3D) Color(0xFFD1FAE5) else PrepGreenDark
                            )
                            .border(
                                1.dp,
                                if (PrepThemeState.isLight3D) Color(0xFFA7F3D0) else PrepGreenBright.copy(alpha = 0.5f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { onStart() }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "START",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = if (PrepThemeState.isLight3D) Color(0xFF047857) else PrepGreenBright
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AddScheduleDetailsDialog(
    name: String,
    onNameChange: (String) -> Unit,
    selectedEmoji: String,
    onEmojiChange: (String) -> Unit,
    startTime: String,
    onStartTimeChange: (String) -> Unit,
    endTime: String,
    onEndTimeChange: (String) -> Unit,
    tag: String,
    onTagChange: (String) -> Unit,
    onDismiss: () -> Unit,
    onNext: () -> Unit
) {
    val emojis = listOf("📚", "⚡", "🔬", "💻", "📖", "🎯", "☕", "🧠")
    val tags = listOf("Deep Study", "Revision", "Practice", "Project", "Exam Prep")

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = PrepSurface,
        shape = RoundedCornerShape(18.dp),
        title = {
            Column {
                Text(
                    text = "Add Study Block (Step 1/4)",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
                Text(
                    text = "Next: Break Duration, Apps Blocker & Strict System",
                    fontSize = 11.sp,
                    color = PrepGreenBright
                )
            }
        },
        text = {
            Column {
                OutlinedTextField(
                    value = name,
                    onValueChange = onNameChange,
                    label = { Text("Block Title (e.g. Physics Revision)") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrepGreenBright,
                        unfocusedBorderColor = PrepCardBorder,
                        focusedTextColor = PrepTextPrimary,
                        unfocusedTextColor = PrepTextPrimary,
                        focusedLabelColor = PrepGreenBright,
                        unfocusedLabelColor = PrepTextMuted
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("block_title_input")
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Emoji Picker
                Text(
                    text = "Icon Emoji",
                    fontSize = 12.sp,
                    color = PrepTextMuted
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    emojis.forEach { emoji ->
                        val isSelected = selectedEmoji == emoji
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) PrepGreenDark else PrepSurfaceCard)
                                .border(
                                    1.dp,
                                    if (isSelected) PrepGreenBright else PrepCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { onEmojiChange(emoji) }
                        ) {
                            Text(text = emoji, fontSize = 18.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = startTime,
                        onValueChange = onStartTimeChange,
                        label = { Text("Start Time") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrepGreenBright,
                            unfocusedBorderColor = PrepCardBorder,
                            focusedTextColor = PrepTextPrimary,
                            unfocusedTextColor = PrepTextPrimary,
                            focusedLabelColor = PrepGreenBright,
                            unfocusedLabelColor = PrepTextMuted
                        ),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = endTime,
                        onValueChange = onEndTimeChange,
                        label = { Text("End Time") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrepGreenBright,
                            unfocusedBorderColor = PrepCardBorder,
                            focusedTextColor = PrepTextPrimary,
                            unfocusedTextColor = PrepTextPrimary,
                            focusedLabelColor = PrepGreenBright,
                            unfocusedLabelColor = PrepTextMuted
                        ),
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Focus Tag",
                    fontSize = 12.sp,
                    color = PrepTextMuted
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    tags.take(3).forEach { t ->
                        val isSelected = tag == t
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) PrepGreenDark else PrepSurfaceCard)
                                .border(
                                    1.dp,
                                    if (isSelected) PrepGreenBright else PrepCardBorder,
                                    RoundedCornerShape(6.dp)
                                )
                                .clickable { onTagChange(t) }
                                .padding(horizontal = 8.dp, vertical = 5.dp)
                        ) {
                            Text(
                                text = t,
                                fontSize = 11.sp,
                                color = if (isSelected) PrepGreenBright else PrepTextSecondary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        onNext()
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = PrepGreenBright,
                    contentColor = Color.Black
                ),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.testTag("next_step_button")
            ) {
                Text("Next: Break Duration ➔", fontWeight = FontWeight.Bold)
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
