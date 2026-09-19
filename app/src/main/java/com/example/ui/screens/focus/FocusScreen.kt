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
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
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
import com.example.ui.theme.PrepThemeState
import com.example.ui.theme.Tactile3DButton
import com.example.ui.theme.Tactile3DChip
import com.example.ui.theme.threeDCard
import com.example.ui.theme.threeDWell

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
        // 3D Mode Selector Bar (Timer / Stopwatch / Pomodoro)
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .threeDWell(RoundedCornerShape(16.dp))
                .padding(4.dp)
        ) {
            FocusMode.values().forEach { mode ->
                val isSelected = currentMode == mode
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .then(
                            if (isSelected) {
                                Modifier
                                    .shadow(2.dp, RoundedCornerShape(12.dp))
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (PrepThemeState.isLight3D) Color.White else PrepGreenDark)
                                    .border(
                                        1.dp,
                                        if (PrepThemeState.isLight3D) Color(0xFFD4E2D8) else PrepGreenBright,
                                        RoundedCornerShape(12.dp)
                                    )
                            } else {
                                Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.Transparent)
                            }
                        )
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

        // 3D Preset Duration Selector (15m, 25m, 45m, 60m, 90m) if not Stopwatch
        if (currentMode != FocusMode.STOPWATCH) {
            val presets = listOf(15, 25, 45, 60, 90)
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(presets) { minutes ->
                    val isSelected = initialDurationSeconds == minutes * 60
                    Tactile3DChip(
                        text = "${minutes}m",
                        isSelected = isSelected,
                        onClick = { onPresetDurationSelected(minutes) }
                    )
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }

        // Primary 3D Start/Pause & Reset Action Controls
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (isRunning || secondsRemaining != initialDurationSeconds) {
                IconButton(
                    onClick = onResetTimer,
                    modifier = Modifier
                        .size(54.dp)
                        .threeDCard(CircleShape, elevation = 3.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Reset",
                        tint = PrepTextSecondary
                    )
                }
                Spacer(modifier = Modifier.width(16.dp))
            }

            Tactile3DButton(
                onClick = onStartPauseToggle,
                text = if (isRunning) "PAUSE SESSION" else "START FOCUS",
                icon = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                isAccentGold = isRunning,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Focus Music Bar / 3D Audio Pill
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .threeDCard(RoundedCornerShape(14.dp))
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
                            .size(38.dp)
                            .shadow(2.dp, CircleShape)
                            .clip(CircleShape)
                            .background(
                                if (isAudioPlaying) PrepGreenDark else PrepSurfaceVariant
                            )
                            .border(
                                1.dp,
                                if (isAudioPlaying) PrepGreenBright else PrepCardBorder,
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
                        .shadow(1.dp, RoundedCornerShape(6.dp))
                        .clip(RoundedCornerShape(6.dp))
                        .background(PrepGoldPro.copy(alpha = 0.2f))
                        .border(1.dp, PrepGoldPro.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "PRO",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = PrepGoldPro
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Weekly Consistency Ribbon
        WeeklyConsistencyRibbon()

        Spacer(modifier = Modifier.height(14.dp))

        // 3D Screen Time vs Focus Time Stats Card (Blueprint Section 2)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .threeDCard(RoundedCornerShape(14.dp))
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
                                .size(34.dp)
                                .shadow(
                                    elevation = if (isToday) 3.dp else 1.dp,
                                    shape = CircleShape,
                                    spotColor = if (isToday) PrepGreenBright.copy(alpha = 0.5f) else Color(0x20000000)
                                )
                                .clip(CircleShape)
                                .background(
                                    when {
                                        isToday -> PrepGreenDark
                                        isDone -> if (PrepThemeState.isLight3D) Color(0xFFD1FAE5) else PrepGreenBright.copy(alpha = 0.2f)
                                        else -> PrepSurfaceVariant
                                    }
                                )
                                .border(
                                    1.dp,
                                    when {
                                        isToday -> PrepGreenBright
                                        isDone -> if (PrepThemeState.isLight3D) Color(0xFFA7F3D0) else PrepGreenBright.copy(alpha = 0.5f)
                                        else -> PrepCardBorder
                                    },
                                    CircleShape
                                )
                        ) {
                            if (isDone) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = if (isToday) PrepGreenBright else if (PrepThemeState.isLight3D) Color(0xFF047857) else PrepGreenBright.copy(alpha = 0.8f),
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
