package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme =
  darkColorScheme(
    primary = PrepGreenBright,
    onPrimary = Color.Black,
    primaryContainer = PrepGreenDark,
    onPrimaryContainer = PrepGreenBright,
    secondary = PrepBlueAccent,
    onSecondary = Color.Black,
    tertiary = PrepGoldPro,
    onTertiary = Color.Black,
    background = PrepBackground,
    onBackground = PrepTextPrimary,
    surface = PrepSurface,
    onSurface = PrepTextPrimary,
    surfaceVariant = PrepSurfaceVariant,
    onSurfaceVariant = PrepTextSecondary,
    outline = PrepCardBorder,
    error = PrepRedAlert,
    onError = Color.White
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = true, // PREP_AiR is intentionally an immersive dark focus app
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  MaterialTheme(
    colorScheme = DarkColorScheme,
    typography = Typography,
    content = content
  )
}

