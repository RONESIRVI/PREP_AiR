package com.example.ui.screens.focus

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.CircularTimerRing
import com.example.ui.theme.PrepBlueAccent
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepOrangeDistracting
import com.example.ui.theme.PrepRedAlert
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary

enum class FocusMode(val title: String, val defaultMinutes: Int) {
    TIMER("Focus Timer", 45),
    STOPWATCH("Stopwatch", 0),
    POMODORO("Pomodoro", 25)
}

@Composable
fun FocusScreen(
    currentMode: FocusMode,
    secondsRemaining: Int,
    initialDurationSeconds: Int,
    isRunning: Boolean,
    deepFocusEnabled: Boolean,
    todayFocusMinutes: Int,
    todayScreenTimeMinutes: Int,
    activeAudioTrackTitle: String?,
    isAudioPlaying: Boolean,
    onModeChange: (FocusMode) -> Unit,
    onStartPauseToggle: () -> Unit,
    onResetTimer: () -> Unit,
    onPresetDurationSelected: (Int) -> Unit,
    onDeepFocusToggled: (Boolean) -> Unit,
    onOpenAudioPlayer: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    val progress = if (currentMode == FocusMode.STOPWATCH) {
        ((secondsRemaining % 3600) / 3600f).coerceIn(0f, 1f)
    } else {
        if (initialDurationSeconds > 0) {
            (secondsRemaining.toFloat() / initialDurationSeconds).coerceIn(0f, 1f)
        } else 1f
    }

    val displayTime = formatSeconds(secondsRemaining)
    val dailyGoalMinutes = 480 // 8 hours as per Blueprint
    val dailyPercentage = ((todayFocusMinutes * 100) / dailyGoalMinutes).coerceAtMost(100)

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(horizontal = 20.dp, vertical = 8.dp)
    ) {
        // Mode Selector Bar (Timer / Stopwatch / Pomodoro)
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .background(PrepSurfaceCard, RoundedCornerShape(16.dp))
                .border(1.dp, PrepCardBorder, RoundedCornerShape(16.dp))
                .padding(4.dp)
        ) {
            FocusMode.values().forEach { mode ->
                val isSelected = currentMode == mode
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) PrepGreenDark else Color.Transparent)
                        .clickable { onModeChange(mode) }
                        .padding(vertical = 10.dp)
                ) {
                    Text(
                        text = mode.title,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) PrepGreenBright else PrepTextMuted
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Circular Focus Ring Canvas
        CircularTimerRing(
            progress = progress,
            timeText = displayTime,
            modeTitle = currentMode.title,
            isRunning = isRunning,
            dailyProgressText = "Goal: 8h ($dailyPercentage% today)"
        )

        Spacer(modifier = Modifier.height(18.dp))

        // Preset Duration Selector (15m, 25m, 45m, 60m, 90m) if not Stopwatch
        if (currentMode != FocusMode.STOPWATCH) {
            val presets = listOf(15, 25, 45, 60, 90)
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(presets) { minutes ->
                    val isSelected = initialDurationSeconds == minutes * 60
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) PrepGreenDark else PrepSurfaceCard)
                            .border(
                                1.dp,
                                if (isSelected) PrepGreenBright else PrepCardBorder,
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { onPresetDurationSelected(minutes) }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = "${minutes}m",
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) PrepGreenBright else PrepTextPrimary
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }

        // Primary Start/Pause & Reset Action Controls
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (isRunning || secondsRemaining != initialDurationSeconds) {
                IconButton(
                    onClick = onResetTimer,
                    modifier = Modifier
                        .size(52.dp)
                        .background(PrepSurfaceCard, CircleShape)
                        .border(1.dp, PrepCardBorder, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Reset",
                        tint = PrepTextMuted
                    )
                }
                Spacer(modifier = Modifier.width(16.dp))
            }

            Button(
                onClick = onStartPauseToggle,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isRunning) PrepGoldPro else PrepGreenBright,
                    contentColor = Color.Black
                ),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .weight(1f)
                    .height(54.dp)
            ) {
                Icon(
                    imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isRunning) "Pause" else "Start",
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = if (isRunning) "PAUSE SESSION" else "START FOCUS",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Focus Music Bar / Audio Pill
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(PrepSurfaceCard)
                .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                .clickable { onOpenAudioPlayer() }
                .padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                if (isAudioPlaying) PrepGreenDark else PrepSurfaceVariant,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.GraphicEq,
                            contentDescription = "Music",
                            tint = if (isAudioPlaying) PrepGreenBright else PrepTextMuted,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (isAudioPlaying) "Playing: ${activeAudioTrackTitle ?: "Ambient Sound"}" else "Focus Music & Ambient Sounds",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = if (isAudioPlaying) "Science-backed noise active" else "White noise, Brown noise, Binaural beats",
                            fontSize = 11.sp,
                            color = if (isAudioPlaying) PrepGreenBright else PrepTextMuted
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .background(PrepGoldPro.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "PRO",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepGoldPro
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Deep Focus Mode Toggle Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(if (deepFocusEnabled) Color(0xFF1B2313) else PrepSurfaceCard)
                .border(
                    1.dp,
                    if (deepFocusEnabled) PrepGreenBright else PrepCardBorder,
                    RoundedCornerShape(14.dp)
                )
                .padding(14.dp)
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
                        imageVector = if (deepFocusEnabled) Icons.Default.Lock else Icons.Default.Security,
                        contentDescription = "Deep Focus",
                        tint = if (deepFocusEnabled) PrepGreenBright else PrepTextMuted,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Deep Focus Shield",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = if (deepFocusEnabled) "Interruption shield locked • Strictly anti-distraction" else "Prevent exiting focus & mute distracting alerts",
                            fontSize = 11.sp,
                            color = if (deepFocusEnabled) PrepGreenBright else PrepTextMuted
                        )
                    }
                }

                Switch(
                    checked = deepFocusEnabled,
                    onCheckedChange = onDeepFocusToggled,
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.Black,
                        checkedTrackColor = PrepGreenBright,
                        uncheckedTrackColor = PrepSurfaceVariant
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Weekly Consistency Ribbon
        WeeklyConsistencyRibbon()

        Spacer(modifier = Modifier.height(14.dp))

        // Screen Time vs Focus Time Stats Card (Blueprint Section 2)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(PrepSurfaceCard)
                .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                .padding(16.dp)
        ) {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Today's Discipline Balance",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepTextPrimary
                    )
                    Text(
                        text = "Updated real-time",
                        fontSize = 10.sp,
                        color = PrepTextMuted
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = "${todayFocusMinutes / 60}h ${todayFocusMinutes % 60}m",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = PrepGreenBright
                        )
                        Text(
                            text = "Focused Study",
                            fontSize = 11.sp,
                            color = PrepTextMuted
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "${todayScreenTimeMinutes / 60}h ${todayScreenTimeMinutes % 60}m",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = PrepOrangeDistracting
                        )
                        Text(
                            text = "Distracting Screen Time",
                            fontSize = 11.sp,
                            color = PrepTextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Dual progress bar
                val totalMinutes = (todayFocusMinutes + todayScreenTimeMinutes).coerceAtLeast(1)
                val focusRatio = todayFocusMinutes.toFloat() / totalMinutes

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .weight(focusRatio.coerceAtLeast(0.01f))
                            .fillMaxSize()
                            .background(PrepGreenBright)
                    )
                    Box(
                        modifier = Modifier
                            .weight((1f - focusRatio).coerceAtLeast(0.01f))
                            .fillMaxSize()
                            .background(PrepOrangeDistracting)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}

private fun formatSeconds(seconds: Int): String {
    val hrs = seconds / 3600
    val mins = (seconds % 3600) / 60
    val secs = seconds % 60
    return if (hrs > 0) {
        String.format("%02d:%02d:%02d", hrs, mins, secs)
    } else {
        String.format("%02d:%02d", mins, secs)
    }
}

@Composable
fun WeeklyConsistencyRibbon() {
    val days = listOf("M", "T", "W", "T", "F", "S", "S")
    val completed = listOf(true, true, true, true, true, false, false)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(PrepSurfaceCard)
            .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
            .padding(14.dp)
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🔥", fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "5-Day Focus Streak",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepTextPrimary
                    )
                }
                Text(
                    text = "Weekly Target: 85%",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PrepGreenBright
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                days.forEachIndexed { index, day ->
                    val isDone = completed[index]
                    val isToday = index == 4 // Friday
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(
                                    when {
                                        isToday -> PrepGreenDark
                                        isDone -> PrepGreenBright.copy(alpha = 0.2f)
                                        else -> PrepSurfaceVariant
                                    }
                                )
                                .border(
                                    1.dp,
                                    when {
                                        isToday -> PrepGreenBright
                                        isDone -> PrepGreenBright.copy(alpha = 0.5f)
                                        else -> PrepCardBorder
                                    },
                                    CircleShape
                                )
                        ) {
                            if (isDone) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = if (isToday) PrepGreenBright else PrepGreenBright.copy(alpha = 0.8f),
                                    modifier = Modifier.size(16.dp)
                                )
                            } else {
                                Text(
                                    text = "·",
                                    fontSize = 18.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = day,
                            fontSize = 11.sp,
                            fontWeight = if (isToday) FontWeight.Bold else FontWeight.Normal,
                            color = if (isToday) PrepGreenBright else PrepTextMuted
                        )
                    }
                }
            }
        }
    }
}
