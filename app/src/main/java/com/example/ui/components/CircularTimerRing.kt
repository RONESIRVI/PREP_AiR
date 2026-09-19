package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepBlueAccent
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepGreenPrimary
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepThemeState

@Composable
fun CircularTimerRing(
    progress: Float, // 0.0f to 1.0f
    timeText: String,
    modeTitle: String,
    isRunning: Boolean,
    dailyProgressText: String,
    modifier: Modifier = Modifier
) {
    val isLight = PrepThemeState.isLight3D
    val infiniteTransition = rememberInfiniteTransition(label = "ring_pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.35f,
        targetValue = if (isRunning) 0.85f else 0.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_alpha"
    )

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(280.dp)
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
                // Outer 3D Bevel Rim Highlight (Top Left Light Source)
                drawCircle(
                    brush = if (isLight) {
                        Brush.linearGradient(
                            listOf(
                                Color.White,
                                Color(0xFFE2ECE5),
                                Color(0xFFCBDCD0)
                            ),
                            start = Offset(0f, 0f),
                            end = Offset(size.width, size.height)
                        )
                    } else {
                        Brush.linearGradient(
                            listOf(
                                Color(0x604CEF8D),
                                Color(0xFF1A291D),
                                Color(0xFF0C140E)
                            ),
                            start = Offset(0f, 0f),
                            end = Offset(size.width, size.height)
                        )
                    },
                    style = Stroke(width = 3.dp.toPx())
                )
            }
    ) {
        // Concave 3D Track & Arc Canvas
        Canvas(modifier = Modifier.size(256.dp)) {
            val strokeWidth = 14.dp.toPx()
            val diameter = size.minDimension - strokeWidth - 8.dp.toPx()
            val radius = diameter / 2f
            val topLeft = Offset((size.width - diameter) / 2f, (size.height - diameter) / 2f)
            val arcSize = Size(diameter, diameter)

            val trackColor = if (isLight) Color(0xFFDFE9E2) else Color(0xFF122015)
            val trackShadowColor = if (isLight) Color(0x18000000) else Color(0x40000000)

            // Recessed Track Inset Shadow
            drawArc(
                color = trackShadowColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft.copy(y = topLeft.y + 1f),
                size = arcSize,
                style = Stroke(width = strokeWidth + 2f, cap = StrokeCap.Round)
            )

            // Background Track Bed
            drawArc(
                color = trackColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Running Glow Halo
            if (isRunning) {
                drawArc(
                    color = PrepGreenBright.copy(alpha = pulseAlpha * 0.28f),
                    startAngle = -90f,
                    sweepAngle = 360f * progress.coerceIn(0f, 1f),
                    useCenter = false,
                    topLeft = topLeft.copy(x = topLeft.x - 4f, y = topLeft.y - 4f),
                    size = Size(arcSize.width + 8f, arcSize.height + 8f),
                    style = Stroke(width = strokeWidth + 8f, cap = StrokeCap.Round)
                )
            }

            // Foreground Active Progress Arc
            val sweepGradient = Brush.sweepGradient(
                listOf(
                    PrepGreenPrimary,
                    PrepGreenBright,
                    PrepBlueAccent,
                    PrepGreenBright
                )
            )

            val currentSweep = 360f * progress.coerceIn(0f, 1f)
            drawArc(
                brush = sweepGradient,
                startAngle = -90f,
                sweepAngle = currentSweep,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Dynamic 3D Progress Bead / Orb at current position
            if (progress > 0.01f) {
                val currentAngleRad = Math.toRadians((currentSweep - 90f).toDouble())
                val beadX = size.width / 2f + radius * Math.cos(currentAngleRad).toFloat()
                val beadY = size.height / 2f + radius * Math.sin(currentAngleRad).toFloat()

                // Bead Drop Shadow
                drawCircle(
                    color = Color(0x35000000),
                    radius = 8.5.dp.toPx(),
                    center = Offset(beadX + 1.dp.toPx(), beadY + 2.dp.toPx())
                )
                // Bead Outer Ring
                drawCircle(
                    color = Color.White,
                    radius = 7.dp.toPx(),
                    center = Offset(beadX, beadY)
                )
                // Bead Inner Core
                drawCircle(
                    color = PrepGreenBright,
                    radius = 4.5.dp.toPx(),
                    center = Offset(beadX, beadY)
                )
            }

            // 3D Perimeter Dial Ticks
            val totalTicks = 36
            for (i in 0 until totalTicks) {
                val angleRad = Math.toRadians((i * (360f / totalTicks) - 90f).toDouble())
                val tickRadius = radius - 18.dp.toPx()
                val tickX = size.width / 2f + tickRadius * Math.cos(angleRad).toFloat()
                val tickY = size.height / 2f + tickRadius * Math.sin(angleRad).toFloat()
                val active = (i.toFloat() / totalTicks) <= progress

                val tickColor = if (active) {
                    PrepGreenBright
                } else {
                    if (isLight) Color(0xFFCAD8CF) else Color(0x354CEF8D)
                }

                drawCircle(
                    color = tickColor,
                    radius = if (i % 9 == 0) 2.6.dp.toPx() else 1.4.dp.toPx(),
                    center = Offset(tickX, tickY)
                )
            }
        }

        // Center Elevated 3D Disc (Pedestal)
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(184.dp)
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
                            radius = size.width / 2f - 1.dp.toPx(),
                            style = Stroke(width = 1.5.dp.toPx())
                        )
                    }
                }
                .border(
                    width = 1.dp,
                    color = if (isLight) Color(0xFFD8E5DC) else Color(0xFF263D2B),
                    shape = CircleShape
                )
                .padding(14.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // 3D Mode Pill Badge
                Box(
                    modifier = Modifier
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
                        text = modeTitle.uppercase(),
                        color = if (isLight) Color(0xFF047857) else PrepGreenBright,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.2.sp
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // High-Contrast Monospace Time Display
                Text(
                    text = timeText,
                    color = PrepTextPrimary,
                    fontSize = 44.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = (-1.5).sp
                )

                Spacer(modifier = Modifier.height(2.dp))

                // Daily Goal Indicator
                Text(
                    text = dailyProgressText,
                    color = PrepTextMuted,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

