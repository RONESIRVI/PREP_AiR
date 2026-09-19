package com.example.ui.theme

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * 3D Tactile Card Modifier with overhead light specular highlight,
 * physical extruded bottom lip, and soft ambient drop shadow.
 */
fun Modifier.threeDCard(
    shape: Shape = RoundedCornerShape(16.dp),
    elevation: Dp = 5.dp,
    borderWidth: Dp = 1.dp
): Modifier = this
    .shadow(
        elevation = if (PrepThemeState.isLight3D) elevation else 3.dp,
        shape = shape,
        spotColor = if (PrepThemeState.isLight3D) Color(0x280D2A18) else Color(0x60000000),
        ambientColor = if (PrepThemeState.isLight3D) Color(0x140D2A18) else Color(0x40000000)
    )
    .clip(shape)
    .background(
        brush = if (PrepThemeState.isLight3D) {
            Brush.verticalGradient(
                listOf(
                    Color(0xFFFFFFFF),
                    Color(0xFFF9FBF9)
                )
            )
        } else {
            Brush.verticalGradient(
                listOf(
                    Color(0xFF18261B),
                    Color(0xFF121D14)
                )
            )
        }
    )
    .drawBehind {
        if (PrepThemeState.isLight3D) {
            // Top specular highlight line
            drawLine(
                color = Color.White.copy(alpha = 0.95f),
                start = Offset(16.dp.toPx(), 1.dp.toPx()),
                end = Offset(size.width - 16.dp.toPx(), 1.dp.toPx()),
                strokeWidth = 1.5.dp.toPx()
            )
            // Bottom extruded 3D bevel shadow line
            drawLine(
                color = Color(0xFFD2E0D5),
                start = Offset(16.dp.toPx(), size.height - 1.dp.toPx()),
                end = Offset(size.width - 16.dp.toPx(), size.height - 1.dp.toPx()),
                strokeWidth = 2.dp.toPx()
            )
        }
    }
    .border(
        width = borderWidth,
        color = if (PrepThemeState.isLight3D) Color(0xFFD6E4DB) else Color(0xFF223625),
        shape = shape
    )

/**
 * 3D Recessed Well Modifier for input containers, search bars, and segmented tracks.
 */
fun Modifier.threeDWell(
    shape: Shape = RoundedCornerShape(12.dp)
): Modifier = this
    .clip(shape)
    .background(
        if (PrepThemeState.isLight3D) Color(0xFFE4ECE6) else Color(0xFF0C140E)
    )
    .drawBehind {
        if (PrepThemeState.isLight3D) {
            // Inset top shadow (darker edge at top)
            drawLine(
                color = Color(0x25000000),
                start = Offset(8.dp.toPx(), 1.dp.toPx()),
                end = Offset(size.width - 8.dp.toPx(), 1.dp.toPx()),
                strokeWidth = 1.5.dp.toPx()
            )
            // Inset bottom highlight (lighter edge at bottom)
            drawLine(
                color = Color.White.copy(alpha = 0.85f),
                start = Offset(8.dp.toPx(), size.height - 1.dp.toPx()),
                end = Offset(size.width - 8.dp.toPx(), size.height - 1.dp.toPx()),
                strokeWidth = 1.5.dp.toPx()
            )
        }
    }
    .border(
        width = 1.dp,
        color = if (PrepThemeState.isLight3D) Color(0xFFD0DED4) else Color(0xFF1B2B1E),
        shape = shape
    )

/**
 * Interactive 3D Tactile Push Button with physical extruded lip and press animation.
 */
@Composable
fun Tactile3DButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String,
    icon: ImageVector? = null,
    isAccentGold: Boolean = false,
    enabled: Boolean = true
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val extrusionHeight = 4.dp
    val animatedOffset by animateDpAsState(
        targetValue = if (isPressed) extrusionHeight else 0.dp,
        animationSpec = tween(100),
        label = "button_press"
    )

    val topFaceColor = when {
        isAccentGold -> Brush.verticalGradient(
            listOf(Color(0xFFFBBF24), Color(0xFFD97706))
        )
        PrepThemeState.isLight3D -> Brush.verticalGradient(
            listOf(Color(0xFF10B981), Color(0xFF059669))
        )
        else -> Brush.verticalGradient(
            listOf(Color(0xFF4CEF8D), Color(0xFF22C55E))
        )
    }

    val bottomExtrusionColor = when {
        isAccentGold -> Color(0xFF92400E)
        PrepThemeState.isLight3D -> Color(0xFF047857)
        else -> Color(0xFF14532D)
    }

    val contentColor = when {
        isAccentGold -> Color.Black
        PrepThemeState.isLight3D -> Color.White
        else -> Color.Black
    }

    Box(
        modifier = modifier
            .height(56.dp)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick
            )
    ) {
        // Physical 3D Extrusion base (bottom layer)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .offset(y = extrusionHeight)
                .clip(RoundedCornerShape(22.dp))
                .background(bottomExtrusionColor)
        )

        // Front Face Button (moves down when pressed)
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .offset(y = animatedOffset)
                .shadow(
                    elevation = if (isPressed) 0.dp else 4.dp,
                    shape = RoundedCornerShape(22.dp),
                    spotColor = bottomExtrusionColor.copy(alpha = 0.5f)
                )
                .clip(RoundedCornerShape(22.dp))
                .background(topFaceColor)
                .drawBehind {
                    // Specular gloss strip along top rim
                    drawLine(
                        color = Color.White.copy(alpha = 0.45f),
                        start = Offset(24.dp.toPx(), 2.dp.toPx()),
                        end = Offset(size.width - 24.dp.toPx(), 2.dp.toPx()),
                        strokeWidth = 2.dp.toPx()
                    )
                }
                .border(
                    width = 1.dp,
                    color = Color.White.copy(alpha = 0.35f),
                    shape = RoundedCornerShape(22.dp)
                )
                .padding(horizontal = 20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (icon != null) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = contentColor,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                }
                Text(
                    text = text,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp,
                    color = contentColor
                )
            }
        }
    }
}

/**
 * 3D Tactile Chip / Pill for presets and filters
 */
@Composable
fun Tactile3DChip(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .shadow(
                elevation = if (isSelected) 3.dp else 2.dp,
                shape = RoundedCornerShape(12.dp),
                spotColor = if (isSelected) Color(0x35059669) else Color(0x180D2A18)
            )
            .clip(RoundedCornerShape(12.dp))
            .background(
                brush = if (isSelected) {
                    if (PrepThemeState.isLight3D) {
                        Brush.verticalGradient(
                            listOf(Color(0xFF10B981), Color(0xFF059669))
                        )
                    } else {
                        Brush.verticalGradient(
                            listOf(Color(0xFF22C55E), Color(0xFF16A34A))
                        )
                    }
                } else {
                    if (PrepThemeState.isLight3D) {
                        Brush.verticalGradient(
                            listOf(Color(0xFFFFFFFF), Color(0xFFF3F7F4))
                        )
                    } else {
                        Brush.verticalGradient(
                            listOf(Color(0xFF1E2F22), Color(0xFF142217))
                        )
                    }
                }
            )
            .drawBehind {
                if (isSelected) {
                    // Specular highlight
                    drawLine(
                        color = Color.White.copy(alpha = 0.5f),
                        start = Offset(10.dp.toPx(), 1.dp.toPx()),
                        end = Offset(size.width - 10.dp.toPx(), 1.dp.toPx()),
                        strokeWidth = 1.dp.toPx()
                    )
                } else if (PrepThemeState.isLight3D) {
                    drawLine(
                        color = Color.White,
                        start = Offset(8.dp.toPx(), 1.dp.toPx()),
                        end = Offset(size.width - 8.dp.toPx(), 1.dp.toPx()),
                        strokeWidth = 1.dp.toPx()
                    )
                    drawLine(
                        color = Color(0xFFD4E2D8),
                        start = Offset(8.dp.toPx(), size.height - 1.dp.toPx()),
                        end = Offset(size.width - 8.dp.toPx(), size.height - 1.dp.toPx()),
                        strokeWidth = 1.5.dp.toPx()
                    )
                }
            }
            .border(
                width = 1.dp,
                color = if (isSelected) {
                    if (PrepThemeState.isLight3D) Color(0xFF047857) else Color(0xFF4CEF8D)
                } else {
                    if (PrepThemeState.isLight3D) Color(0xFFD3E2D7) else Color(0xFF223625)
                },
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) {
                if (PrepThemeState.isLight3D) Color.White else Color.Black
            } else {
                PrepTextPrimary
            }
        )
    }
}
