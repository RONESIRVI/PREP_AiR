package com.example.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * 3D Academic card modifiers providing consistent tactile elevation,
 * subtle gold/navy border highlights, and refined depth for TestTrack Pro.
 */
fun Modifier.testTrack3DCard(
    cornerRadius: Dp = 16.dp,
    elevation: Dp = 4.dp,
    borderColor: Color = Color(0x30F59E0B)
): Modifier = this
    .shadow(
        elevation = if (TestTrackThemeState.isLightMode) elevation / 2 else elevation,
        shape = RoundedCornerShape(cornerRadius),
        spotColor = if (TestTrackThemeState.isLightMode) Color(0x18000000) else Color(0x40F59E0B),
        ambientColor = if (TestTrackThemeState.isLightMode) Color(0x0C000000) else Color(0x20070C1E)
    )
    .clip(RoundedCornerShape(cornerRadius))
    .background(
        brush = if (TestTrackThemeState.isLightMode) {
            Brush.verticalGradient(
                colors = listOf(Color(0xFFFFFFFF), Color(0xFFF8FAFC))
            )
        } else {
            Brush.verticalGradient(
                colors = listOf(Navy800, Navy900)
            )
        }
    )
    .border(
        width = 1.dp,
        color = if (TestTrackThemeState.isLightMode) Color(0xFFE2E8F0) else borderColor,
        shape = RoundedCornerShape(cornerRadius)
    )

fun Modifier.threeDCard(
    shape: Shape = RoundedCornerShape(16.dp),
    elevation: Dp = 4.dp,
    borderColor: Color = Color(0x30F59E0B)
): Modifier = this
    .shadow(
        elevation = if (TestTrackThemeState.isLightMode) elevation / 2 else elevation,
        shape = shape,
        spotColor = if (TestTrackThemeState.isLightMode) Color(0x18000000) else Color(0x40F59E0B),
        ambientColor = if (TestTrackThemeState.isLightMode) Color(0x0C000000) else Color(0x20070C1E)
    )
    .clip(shape)
    .background(
        brush = if (TestTrackThemeState.isLightMode) {
            Brush.verticalGradient(
                colors = listOf(Color(0xFFFFFFFF), Color(0xFFF8FAFC))
            )
        } else {
            Brush.verticalGradient(
                colors = listOf(Navy800, Navy900)
            )
        }
    )
    .border(
        width = 1.dp,
        color = if (TestTrackThemeState.isLightMode) Color(0xFFE2E8F0) else borderColor,
        shape = shape
    )

fun Modifier.threeDWell(
    shape: Shape = RoundedCornerShape(12.dp)
): Modifier = this
    .clip(shape)
    .background(AppCardSurfaceRaised)
    .border(1.dp, AppCardBorder, shape)

fun Modifier.goldPillTag(
    cornerRadius: Dp = 20.dp
): Modifier = this
    .clip(RoundedCornerShape(cornerRadius))
    .background(Color(0x20F59E0B))
    .border(1.dp, Color(0x50F59E0B), RoundedCornerShape(cornerRadius))

@Composable
fun Tactile3DButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    isAccentGold: Boolean = false,
    isPrimary: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isAccentGold || isPrimary) GoldPrimary else AppCardSurfaceRaised,
            contentColor = if (isAccentGold || isPrimary) Color.Black else AppTextPrimary
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        if (icon != null) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(text = text, fontSize = 14.sp)
    }
}

@Composable
fun Tactile3DChip(
    text: String,
    isSelected: Boolean = false,
    selected: Boolean = isSelected,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val active = isSelected || selected
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (active) GoldPrimary else AppCardSurfaceRaised)
            .border(1.dp, if (active) GoldBright else AppCardBorder, RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            color = if (active) Color.Black else AppTextSecondary
        )
    }
}
