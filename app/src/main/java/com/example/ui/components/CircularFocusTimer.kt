package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedIconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepBlueAccent
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepGreenPrimary
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepThemeState

/**
 * Reusable Circular Focus Timer component that displays countdown progress.
 *
 * Supports:
 * - Animated progress interpolation (glides smoothly during countdown)
 * - Pulsing outer aura when running
 * - Glowing leading indicator bead along the perimeter
 * - Configurable session badge, time text, subtitle, and optional interactive control buttons
 * - 3D tactile theme integration matching the Prep application aesthetic
 */
@Composable
fun CircularFocusTimer(
    progress: Float, // 0.0f to 1.0f
    formattedTime: String,
    modifier: Modifier = Modifier,
    sessionLabel: String = "Focus",
    sublabel: String? = null,
    isRunning: Boolean = false,
    size: Dp = 270.dp,
    strokeWidth: Dp = 14.dp,
    progressColors: List<Color> = listOf(
        PrepGreenPrimary,
        PrepGreenBright,
        PrepBlueAccent,
        PrepGreenBright
    ),
    trackColor: Color? = null,
    showTicks: Boolean = true,
    showIndicatorBead: Boolean = true,
    showControls: Boolean = false,
    onPlayPauseClick: (() -> Unit)? = null,
    onResetClick: (() -> Unit)? = null
) {
    CircularFocusTimerContainer(
        progress = progress,
        isRunning = isRunning,
        modifier = modifier.testTag("circular_focus_timer"),
        size = size,
        strokeWidth = strokeWidth,
        progressColors = progressColors,
        trackColor = trackColor,
        showTicks = showTicks,
        showIndicatorBead = showIndicatorBead
    ) {
        val isLight = PrepThemeState.isLight3D

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(horizontal = 12.dp)
        ) {
            // Mode / Session Badge Chip
            Box(
                modifier = Modifier
                    .testTag("timer_session_badge")
                    .shadow(
                        elevation = 2.dp,
                        shape = RoundedCornerShape(10.dp),
                        spotColor = Color(0x18000000)
                    )
                    .clip(RoundedCornerShape(10.dp))
                    .background(
                        if (isLight) Color(0xFFD1FAE5) else Color(0xFF142416)
                    )
                    .border(
                        1.dp,
                        if (isLight) Color(0xFFA7F3D0) else PrepGreenBright.copy(alpha = 0.5f),
                        RoundedCornerShape(10.dp)
                    )
                    .padding(horizontal = 10.dp, vertical = 3.dp)
            ) {
                Text(
                    text = sessionLabel.uppercase(),
                    color = if (isLight) Color(0xFF047857) else PrepGreenBright,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.2.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Primary Time Readout (Monospace)
            Text(
                text = formattedTime,
                color = PrepTextPrimary,
                fontSize = if (formattedTime.length > 5) 34.sp else 42.sp,
                fontWeight = FontWeight.Black,
                fontFamily = FontFamily.Monospace,
                letterSpacing = (-1.5).sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.testTag("timer_display_text")
            )

            // Optional Sublabel (e.g. goal or percentage)
            if (!sublabel.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = sublabel,
                    color = PrepTextMuted,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.testTag("timer_sublabel_text")
                )
            }

            // Optional Quick Interactive Controls
            if (showControls && (onPlayPauseClick != null || onResetClick != null)) {
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    if (onResetClick != null) {
                        OutlinedIconButton(
                            onClick = onResetClick,
                            modifier = Modifier
                                .size(36.dp)
                                .defaultMinSize(minWidth = 36.dp, minHeight = 36.dp)
                                .testTag("timer_reset_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reset timer",
                                tint = PrepTextMuted,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    if (onPlayPauseClick != null) {
                        if (onResetClick != null) {
                            Spacer(modifier = Modifier.width(8.dp))
                        }
                        FilledIconButton(
                            onClick = onPlayPauseClick,
                            colors = IconButtonDefaults.filledIconButtonColors(
                                containerColor = if (isRunning) Color(0xFFE05252) else PrepGreenBright,
                                contentColor = if (isRunning) Color.White else Color(0xFF07210E)
                            ),
                            modifier = Modifier
                                .size(36.dp)
                                .defaultMinSize(minWidth = 36.dp, minHeight = 36.dp)
                                .testTag("timer_play_pause_button")
                        ) {
                            Icon(
                                imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = if (isRunning) "Pause timer" else "Start timer",
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Convenience overload accepting remaining and total seconds directly.
 */
@Composable
fun CircularFocusTimer(
    remainingSeconds: Int,
    totalSeconds: Int,
    modifier: Modifier = Modifier,
    sessionLabel: String = "Focus",
    sublabel: String? = null,
    isRunning: Boolean = false,
    size: Dp = 270.dp,
    showControls: Boolean = false,
    onPlayPauseClick: (() -> Unit)? = null,
    onResetClick: (() -> Unit)? = null
) {
    val progress = if (totalSeconds > 0) {
        (remainingSeconds.toFloat() / totalSeconds).coerceIn(0f, 1f)
    } else 0f

    val formattedTime = formatTimerDisplay(remainingSeconds)

    CircularFocusTimer(
        progress = progress,
        formattedTime = formattedTime,
        modifier = modifier,
        sessionLabel = sessionLabel,
        sublabel = sublabel,
        isRunning = isRunning,
        size = size,
        showControls = showControls,
        onPlayPauseClick = onPlayPauseClick,
        onResetClick = onResetClick
    )
}

/**
 * Base Container for Circular Focus Timer providing the 3D ring canvas,
 * gradient progress sweep, perimeter indicator bead, and flexible center slot.
 */
@Composable
fun CircularFocusTimerContainer(
    progress: Float,
    isRunning: Boolean,
    modifier: Modifier = Modifier,
    size: Dp = 270.dp,
    strokeWidth: Dp = 14.dp,
    progressColors: List<Color> = listOf(
        PrepGreenPrimary,
        PrepGreenBright,
        PrepBlueAccent,
        PrepGreenBright
    ),
    trackColor: Color? = null,
    showTicks: Boolean = true,
    showIndicatorBead: Boolean = true,
    centerContent: @Composable () -> Unit
) {
    val isLight = PrepThemeState.isLight3D

    // Smoothly animated progress transition to eliminate abrupt jumps
    val animatedProgress by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 400, easing = LinearOutSlowInEasing),
        label = "timer_animated_progress"
    )

    // Pulsing aura animation when timer is active
    val infiniteTransition = rememberInfiniteTransition(label = "timer_pulse_transition")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.25f,
        targetValue = if (isRunning) 0.85f else 0.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "timer_pulse_alpha"
    )

    val resolvedTrackColor = trackColor ?: if (isLight) Color(0xFFDFE9E2) else Color(0xFF132316)

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(size)
            .shadow(
                elevation = if (isLight) 8.dp else 4.dp,
                shape = CircleShape,
                spotColor = if (isLight) Color(0x280D2A18) else Color(0x60000000),
                ambientColor = if (isLight) Color(0x180D2A18) else Color(0x40000000)
            )
            .clip(CircleShape)
            .background(
                brush = if (isLight) {
                    Brush.radialGradient(
                        listOf(
                            Color(0xFFFFFFFF),
                            Color(0xFFF3F7F4),
                            Color(0xFFE4ECE6)
                        )
                    )
                } else {
                    Brush.radialGradient(
                        listOf(
                            Color(0xFF1B2B1E),
                            Color(0xFF131F15),
                            Color(0xFF0D160E)
                        )
                    )
                }
            )
            .drawBehind {
                // Outer 3D Bevel Rim Highlight (Simulating top-left light source)
                drawCircle(
                    brush = if (isLight) {
                        Brush.linearGradient(
                            listOf(
                                Color.White,
                                Color(0xFFE2ECE5),
                                Color(0xFFCBDCD0)
                            ),
                            start = Offset(0f, 0f),
                            end = Offset(this.size.width, this.size.height)
                        )
                    } else {
                        Brush.linearGradient(
                            listOf(
                                Color(0x604CEF8D),
                                Color(0xFF1A291D),
                                Color(0xFF0C140E)
                            ),
                            start = Offset(0f, 0f),
                            end = Offset(this.size.width, this.size.height)
                        )
                    },
                    style = Stroke(width = 3.dp.toPx())
                )
            }
    ) {
        // Concave Track & Progress Arc Canvas
        Canvas(
            modifier = Modifier
                .size(size - 24.dp)
                .testTag("timer_progress_canvas")
        ) {
            val strokePx = strokeWidth.toPx()
            val diameter = this.size.minDimension - strokePx - 8.dp.toPx()
            val radius = diameter / 2f
            val topLeft = Offset((this.size.width - diameter) / 2f, (this.size.height - diameter) / 2f)
            val arcSize = Size(diameter, diameter)

            val trackShadowColor = if (isLight) Color(0x14000000) else Color(0x38000000)

            // Recessed Track Inset Shadow
            drawArc(
                color = trackShadowColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft.copy(y = topLeft.y + 1.2f),
                size = arcSize,
                style = Stroke(width = strokePx + 2f, cap = StrokeCap.Round)
            )

            // Background Track Bed
            drawArc(
                color = resolvedTrackColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )

            val currentSweep = 360f * animatedProgress

            // Active Pulsing Halo Glow (visible while running)
            if (isRunning && currentSweep > 0.5f) {
                drawArc(
                    color = PrepGreenBright.copy(alpha = pulseAlpha * 0.32f),
                    startAngle = -90f,
                    sweepAngle = currentSweep,
                    useCenter = false,
                    topLeft = topLeft.copy(x = topLeft.x - 4f, y = topLeft.y - 4f),
                    size = Size(arcSize.width + 8f, arcSize.height + 8f),
                    style = Stroke(width = strokePx + 8f, cap = StrokeCap.Round)
                )
            }

            // Foreground Active Progress Arc with Sweep Gradient
            if (currentSweep > 0f) {
                val sweepGradient = Brush.sweepGradient(progressColors)
                drawArc(
                    brush = sweepGradient,
                    startAngle = -90f,
                    sweepAngle = currentSweep,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokePx, cap = StrokeCap.Round)
                )
            }

            // Dynamic Leading Indicator Bead at current position
            if (showIndicatorBead && animatedProgress > 0.005f) {
                val currentAngleRad = Math.toRadians((currentSweep - 90f).toDouble())
                val beadX = this.size.width / 2f + radius * Math.cos(currentAngleRad).toFloat()
                val beadY = this.size.height / 2f + radius * Math.sin(currentAngleRad).toFloat()

                // Bead Drop Shadow
                drawCircle(
                    color = Color(0x35000000),
                    radius = 8.5.dp.toPx(),
                    center = Offset(beadX + 1.dp.toPx(), beadY + 1.5.dp.toPx())
                )
                // Bead White Outer Ring
                drawCircle(
                    color = Color.White,
                    radius = 7.dp.toPx(),
                    center = Offset(beadX, beadY)
                )
                // Bead Glowing Core
                drawCircle(
                    color = PrepGreenBright,
                    radius = 4.5.dp.toPx(),
                    center = Offset(beadX, beadY)
                )
            }

            // Radial Perimeter Dial Tick Marks
            if (showTicks) {
                val totalTicks = 36
                for (i in 0 until totalTicks) {
                    val angleRad = Math.toRadians((i * (360f / totalTicks) - 90f).toDouble())
                    val tickRadius = radius - 16.dp.toPx()
                    val tickX = this.size.width / 2f + tickRadius * Math.cos(angleRad).toFloat()
                    val tickY = this.size.height / 2f + tickRadius * Math.sin(angleRad).toFloat()
                    val active = (i.toFloat() / totalTicks) <= animatedProgress

                    val tickColor = if (active) {
                        PrepGreenBright
                    } else {
                        if (isLight) Color(0xFFCAD8CF) else Color(0x304CEF8D)
                    }

                    drawCircle(
                        color = tickColor,
                        radius = if (i % 9 == 0) 2.5.dp.toPx() else 1.2.dp.toPx(),
                        center = Offset(tickX, tickY)
                    )
                }
            }
        }

        // Center Elevated Pedestal Disc
        val centerDiscSize = size * 0.65f
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(centerDiscSize)
                .shadow(
                    elevation = if (isLight) 6.dp else 4.dp,
                    shape = CircleShape,
                    spotColor = if (isLight) Color(0x220D2A18) else Color(0x70000000)
                )
                .clip(CircleShape)
                .background(
                    brush = if (isLight) {
                        Brush.verticalGradient(
                            listOf(
                                Color(0xFFFFFFFF),
                                Color(0xFFF7FAF7)
                            )
                        )
                    } else {
                        Brush.verticalGradient(
                            listOf(
                                Color(0xFF1E2F23),
                                Color(0xFF142217)
                            )
                        )
                    }
                )
                .drawBehind {
                    // Disc Top Edge Specular Highlight
                    if (isLight) {
                        drawCircle(
                            color = Color.White,
                            radius = this.size.width / 2f - 1.dp.toPx(),
                            style = Stroke(width = 1.5.dp.toPx())
                        )
                    }
                }
                .border(
                    width = 1.dp,
                    color = if (isLight) Color(0xFFD8E5DC) else Color(0xFF263D2B),
                    shape = CircleShape
                )
        ) {
            centerContent()
        }
    }
}

/**
 * Format raw seconds into standard MM:SS or HH:MM:SS timer representation.
 */
fun formatTimerDisplay(totalSeconds: Int): String {
    val sec = totalSeconds.coerceAtLeast(0)
    val hours = sec / 3600
    val minutes = (sec % 3600) / 60
    val seconds = sec % 60
    return if (hours > 0) {
        String.format("%02d:%02d:%02d", hours, minutes, seconds)
    } else {
        String.format("%02d:%02d", minutes, seconds)
    }
}
