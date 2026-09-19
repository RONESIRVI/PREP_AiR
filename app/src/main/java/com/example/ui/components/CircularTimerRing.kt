package com.example.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Backward-compatible wrapper delegating to the reusable [CircularFocusTimer].
 */
@Composable
fun CircularTimerRing(
    progress: Float, // 0.0f to 1.0f
    timeText: String,
    modeTitle: String,
    isRunning: Boolean,
    dailyProgressText: String,
    modifier: Modifier = Modifier
) {
    CircularFocusTimer(
        progress = progress,
        formattedTime = timeText,
        sessionLabel = modeTitle,
        sublabel = dailyProgressText,
        isRunning = isRunning,
        modifier = modifier
    )
}


