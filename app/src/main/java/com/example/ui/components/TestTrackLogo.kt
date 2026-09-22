package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.ui.theme.GoldBright
import com.example.ui.theme.GoldDeep
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.Navy900
import com.example.ui.theme.Navy950

/**
 * Procedural Vector & Canvas render of the official TestTrack Pro Logo:
 * - 3D Rounded-square container with subtle gold bevel
 * - Open academic book (Learning & test knowledge base)
 * - 4 Rising performance bars (Ascending scores)
 * - Upward gold arrow (Progress & score improvement)
 * - Minimalist, vector-grade crisp rendering
 */
@Composable
fun TestTrackLogo(
    size: Dp = 44.dp,
    modifier: Modifier = Modifier
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(size)
            .shadow(4.dp, RoundedCornerShape(size * 0.26f), spotColor = Color(0x60F59E0B))
            .clip(RoundedCornerShape(size * 0.26f))
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF0F1B3E), Navy900, Navy950)
                )
            )
            .border(
                width = 1.2.dp,
                brush = Brush.linearGradient(
                    colors = listOf(GoldBright, Color(0x60F59E0B), Color(0x20F59E0B))
                ),
                shape = RoundedCornerShape(size * 0.26f)
            )
    ) {
        Canvas(modifier = Modifier.size(size * 0.78f)) {
            val w = this.size.width
            val h = this.size.height

            // 1. OPEN BOOK at bottom (Learning Base)
            val leftPage = Path().apply {
                moveTo(w * 0.5f, h * 0.82f)
                cubicTo(w * 0.42f, h * 0.78f, w * 0.25f, h * 0.76f, w * 0.12f, h * 0.81f)
                lineTo(w * 0.12f, h * 0.65f)
                cubicTo(w * 0.25f, h * 0.60f, w * 0.42f, h * 0.62f, w * 0.5f, h * 0.66f)
                close()
            }
            drawPath(
                path = leftPage,
                brush = Brush.horizontalGradient(
                    colors = listOf(Color(0xFFE2E8F0), Color.White)
                )
            )
            drawPath(
                path = leftPage,
                color = GoldDeep,
                style = Stroke(width = w * 0.02f)
            )

            val rightPage = Path().apply {
                moveTo(w * 0.5f, h * 0.82f)
                cubicTo(w * 0.58f, h * 0.78f, w * 0.75f, h * 0.76f, w * 0.88f, h * 0.81f)
                lineTo(w * 0.88f, h * 0.65f)
                cubicTo(w * 0.75f, h * 0.60f, w * 0.58f, h * 0.62f, w * 0.5f, h * 0.66f)
                close()
            }
            drawPath(
                path = rightPage,
                brush = Brush.horizontalGradient(
                    colors = listOf(Color.White, Color(0xFFCBD5E1))
                )
            )
            drawPath(
                path = rightPage,
                color = GoldPrimary,
                style = Stroke(width = w * 0.02f)
            )

            // Book spine line
            drawLine(
                color = GoldDeep,
                start = Offset(w * 0.5f, h * 0.66f),
                end = Offset(w * 0.5f, h * 0.83f),
                strokeWidth = w * 0.04f,
                cap = StrokeCap.Round
            )

            // 2. RISING PERFORMANCE BARS (4 bars ascending)
            val barWidth = w * 0.08f
            // Bar 1
            drawRect(
                brush = Brush.verticalGradient(listOf(GoldPrimary, GoldDeep)),
                topLeft = Offset(w * 0.22f, h * 0.50f),
                size = Size(barWidth, h * 0.17f)
            )
            // Bar 2
            drawRect(
                brush = Brush.verticalGradient(listOf(GoldBright, GoldPrimary)),
                topLeft = Offset(w * 0.36f, h * 0.38f),
                size = Size(barWidth, h * 0.29f)
            )
            // Bar 3
            drawRect(
                brush = Brush.verticalGradient(listOf(Color(0xFF34D399), GoldBright)),
                topLeft = Offset(w * 0.52f, h * 0.26f),
                size = Size(barWidth, h * 0.41f)
            )
            // Bar 4 (Peak)
            drawRect(
                brush = Brush.verticalGradient(listOf(Color(0xFF10B981), Color(0xFF059669))),
                topLeft = Offset(w * 0.66f, h * 0.16f),
                size = Size(barWidth, h * 0.51f)
            )

            // 3. UPWARD ARROW (Progress / continuous improvement)
            val arrowPath = Path().apply {
                moveTo(w * 0.22f, h * 0.52f)
                lineTo(w * 0.40f, h * 0.40f)
                lineTo(w * 0.56f, h * 0.28f)
                lineTo(w * 0.78f, h * 0.12f)
            }
            drawPath(
                path = arrowPath,
                brush = Brush.horizontalGradient(listOf(GoldPrimary, GoldBright, Color.White)),
                style = Stroke(width = w * 0.055f, cap = StrokeCap.Round)
            )

            // Arrowhead
            val arrowHead = Path().apply {
                moveTo(w * 0.68f, h * 0.10f)
                lineTo(w * 0.84f, h * 0.08f)
                lineTo(w * 0.82f, h * 0.24f)
                close()
            }
            drawPath(
                path = arrowHead,
                brush = Brush.linearGradient(listOf(Color.White, GoldBright)),
                style = Fill
            )
        }
    }
}
