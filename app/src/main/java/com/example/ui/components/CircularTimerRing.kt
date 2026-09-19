package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenPrimary
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary

@Composable
fun CircularTimerRing(
    progress: Float, // 0.0f to 1.0f
    timeText: String,
    modeTitle: String,
    isRunning: Boolean,
    dailyProgressText: String,
    modifier: Modifier = Modifier
) {
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
        modifier = modifier.size(270.dp)
    ) {
        Canvas(modifier = Modifier.size(260.dp)) {
            val strokeWidth = 14.dp.toPx()
            val diameter = size.minDimension - strokeWidth
            val radius = diameter / 2f
            val topLeft = Offset((size.width - diameter) / 2f, (size.height - diameter) / 2f)
            val arcSize = Size(diameter, diameter)

            // Background Track
            drawArc(
                color = Color(0xFF142416),
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Outer subtle glow track when running
            if (isRunning) {
                drawArc(
                    color = PrepGreenBright.copy(alpha = pulseAlpha * 0.25f),
                    startAngle = -90f,
                    sweepAngle = 360f * progress.coerceIn(0f, 1f),
                    useCenter = false,
                    topLeft = topLeft.copy(
                        x = topLeft.x - 4f,
                        y = topLeft.y - 4f
                    ),
                    size = Size(arcSize.width + 8f, arcSize.height + 8f),
                    style = Stroke(width = strokeWidth + 8f, cap = StrokeCap.Round)
                )
            }

            // Foreground Active Progress Arc with Gradient
            val sweepGradient = Brush.sweepGradient(
                listOf(
                    PrepGreenPrimary,
                    PrepGreenBright,
                    PrepBlueAccent,
                    PrepGreenBright
                )
            )

            drawArc(
                brush = sweepGradient,
                startAngle = -90f,
                sweepAngle = 360f * progress.coerceIn(0f, 1f),
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Small dial indicator dots around rim
            val totalTicks = 24
            for (i in 0 until totalTicks) {
                val angleRad = Math.toRadians((i * (360f / totalTicks) - 90f).toDouble())
                val tickRadius = radius - 18.dp.toPx()
                val tickX = size.width / 2f + tickRadius * Math.cos(angleRad).toFloat()
                val tickY = size.height / 2f + tickRadius * Math.sin(angleRad).toFloat()
                val active = (i.toFloat() / totalTicks) <= progress

                drawCircle(
                    color = if (active) PrepGreenBright.copy(alpha = 0.8f) else Color(0x334CEF8D),
                    radius = if (i % 6 == 0) 2.5.dp.toPx() else 1.5.dp.toPx(),
                    center = Offset(tickX, tickY)
                )
            }
        }

        // Center Content Info
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(16.dp)
        ) {
            // Mode Tag Pill
            Box(
                modifier = Modifier
                    .background(
                        color = PrepSurfaceCard,
                        shape = RoundedCornerShape(12.dp)
                    )
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(
                    text = modeTitle.uppercase(),
                    color = PrepGreenBright,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Main Big Time Display
            Text(
                text = timeText,
                color = PrepTextPrimary,
                fontSize = 46.sp,
                fontWeight = FontWeight.Black,
                fontFamily = FontFamily.Monospace,
                letterSpacing = (-1.5).sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Daily Goal indicator
            Text(
                text = dailyProgressText,
                color = PrepTextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
