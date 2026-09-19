package com.example.ui.theme

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color

/**
 * Global Theme Controller for PREP_AiR
 * Defaults to Light 3D-styled design as requested!
 */
object PrepThemeState {
    var isLight3D by mutableStateOf(true)
}

// PREP_AiR Dynamic Light 3D / Dark Theme Colors
val PrepBackground: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFF1F5F2) else Color(0xFF070B08)

val PrepSurface: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else Color(0xFF101912)

val PrepSurfaceVariant: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFE2EBE4) else Color(0xFF17241A)

val PrepSurfaceCard: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else Color(0xFF142016)

val PrepCardBorder: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFD6E4DA) else Color(0xFF223625)

// Brand Vibrant Accents
val PrepGreenPrimary: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF10B981) else Color(0xFF4CAF50)

val PrepGreenBright: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF059669) else Color(0xFF4CEF8D)

val PrepGreenDark: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFD1FAE5) else Color(0xFF1B5E20)

val PrepGreenGlow: Color
    get() = if (PrepThemeState.isLight3D) Color(0x3510B981) else Color(0x334CEF8D)

val PrepBlueAccent: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF0284C7) else Color(0xFF38BDF8)

val PrepGoldPro: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFD97706) else Color(0xFFFBBF24)

val PrepOrangeDistracting: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFEA580C) else Color(0xFFF97316)

val PrepRedAlert: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFFDC2626) else Color(0xFFEF4444)

// High-contrast clean typography tokens
val PrepTextPrimary: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF0F172A) else Color(0xFFF0FDF4)

val PrepTextSecondary: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF475569) else Color(0xFF94A3B8)

val PrepTextMuted: Color
    get() = if (PrepThemeState.isLight3D) Color(0xFF64748B) else Color(0xFF64748B)


