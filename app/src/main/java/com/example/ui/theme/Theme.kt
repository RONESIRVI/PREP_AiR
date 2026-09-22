package com.example.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = GoldPrimary,
    onPrimary = Navy950,
    primaryContainer = Navy800,
    onPrimaryContainer = GoldBright,
    secondary = EmeraldSuccess,
    onSecondary = Color.Black,
    secondaryContainer = Navy700,
    onSecondaryContainer = Color.White,
    tertiary = CyanMetric,
    background = Navy900,
    onBackground = TextWhite,
    surface = Navy800,
    onSurface = TextWhite,
    surfaceVariant = Navy700,
    onSurfaceVariant = TextMutedSlate,
    outline = Color(0x35F59E0B)
)

private val LightColorScheme = lightColorScheme(
    primary = GoldDeep,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFEF3C7),
    onPrimaryContainer = Color(0xFF92400E),
    secondary = EmeraldSuccess,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFD1FAE5),
    onSecondaryContainer = Color(0xFF065F46),
    tertiary = CyanMetric,
    background = AcademicPaperLight,
    onBackground = AcademicTextDark,
    surface = AcademicCardLight,
    onSurface = AcademicTextDark,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = AcademicTextMuted,
    outline = AcademicBorderLight
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = !TestTrackThemeState.isLightMode,
    content: @Composable () -> Unit
) {
    val colorScheme = if (TestTrackThemeState.isLightMode) LightColorScheme else DarkColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = TestTrackThemeState.isLightMode
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
