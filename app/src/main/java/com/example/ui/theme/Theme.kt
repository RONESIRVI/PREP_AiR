package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme =
  lightColorScheme(
    primary = Color(0xFF059669),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD1FAE5),
    onPrimaryContainer = Color(0xFF065F46),
    secondary = Color(0xFF0284C7),
    onSecondary = Color.White,
    tertiary = Color(0xFFD97706),
    onTertiary = Color.White,
    background = Color(0xFFF1F5F2),
    onBackground = Color(0xFF0F172A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFE2EBE4),
    onSurfaceVariant = Color(0xFF475569),
    outline = Color(0xFFD6E4DA),
    error = Color(0xFFDC2626),
    onError = Color.White
  )

private val DarkColorScheme =
  darkColorScheme(
    primary = Color(0xFF4CEF8D),
    onPrimary = Color.Black,
    primaryContainer = Color(0xFF1B5E20),
    onPrimaryContainer = Color(0xFF4CEF8D),
    secondary = Color(0xFF38BDF8),
    onSecondary = Color.Black,
    tertiary = Color(0xFFFBBF24),
    onTertiary = Color.Black,
    background = Color(0xFF070B08),
    onBackground = Color(0xFFF0FDF4),
    surface = Color(0xFF101912),
    onSurface = Color(0xFFF0FDF4),
    surfaceVariant = Color(0xFF17241A),
    onSurfaceVariant = Color(0xFF94A3B8),
    outline = Color(0xFF223625),
    error = Color(0xFFEF4444),
    onError = Color.White
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = !PrepThemeState.isLight3D,
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme = if (PrepThemeState.isLight3D) LightColorScheme else DarkColorScheme
  MaterialTheme(
    colorScheme = colorScheme,
    typography = Typography,
    content = content
  )
}


