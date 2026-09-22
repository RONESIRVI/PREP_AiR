package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Academic Premium Palette: Deep Navy, Gold / Amber, Emerald Accent, Crisp Slate
val Navy950 = Color(0xFF070C1E) // Deepest academic midnight
val Navy900 = Color(0xFF0B132B) // Main background
val Navy800 = Color(0xFF131D3B) // Card surface background
val Navy700 = Color(0xFF1C2B54) // Raised surface
val Navy600 = Color(0xFF263A70) // Elevated borders & dividers
val NavyBorder = Color(0x35F59E0B) // Subtle gold outline on dark

// Gold & Amber Accents (Achievement / Progress / Premium)
val GoldPrimary = Color(0xFFF59E0B) // Amber-500
val GoldBright = Color(0xFFFBBF24) // Amber-400
val GoldDeep = Color(0xFFD97706) // Amber-600
val GoldMuted = Color(0x28F59E0B) // Gold subtle container
val GoldGlow = Color(0x40FBBF24)

// Supporting Metrics Colors
val EmeraldSuccess = Color(0xFF10B981) // High Accuracy / Correct
val EmeraldGlow = Color(0x2810B981)
val RoseError = Color(0xFFEF4444) // Wrong Questions / Errors
val RoseGlow = Color(0x28EF4444)
val CyanMetric = Color(0xFF06B6D4) // Speed / Time Taken
val IndigoAccent = Color(0xFF6366F1) // Difficulty / Subjects
val PurpleAccent = Color(0xFF8B5CF6) // Mistake patterns

// Light Academic Palette
val AcademicPaperLight = Color(0xFFF8FAFC)
val AcademicCardLight = Color(0xFFFFFFFF)
val AcademicBorderLight = Color(0xFFE2E8F0)
val AcademicTextDark = Color(0xFF0F172A)
val AcademicTextMuted = Color(0xFF64748B)

// Text Colors
val TextWhite = Color(0xFFF8FAFC)
val TextMutedSlate = Color(0xFF94A3B8)
val TextDim = Color(0xFF64748B)

// Dynamic Palette State
object TestTrackThemeState {
    var isLightMode: Boolean = false
}

// Backward compatibility alias for legacy components if accessed
object PrepThemeState {
    var isLight3D: Boolean
        get() = TestTrackThemeState.isLightMode
        set(value) { TestTrackThemeState.isLightMode = value }
}

val AppBackground: Color
    get() = if (TestTrackThemeState.isLightMode) AcademicPaperLight else Navy900

val AppCardSurface: Color
    get() = if (TestTrackThemeState.isLightMode) AcademicCardLight else Navy800

val AppCardSurfaceRaised: Color
    get() = if (TestTrackThemeState.isLightMode) Color(0xFFF1F5F9) else Navy700

val AppCardBorder: Color
    get() = if (TestTrackThemeState.isLightMode) AcademicBorderLight else Color(0x26F59E0B)

val AppTextPrimary: Color
    get() = if (TestTrackThemeState.isLightMode) AcademicTextDark else TextWhite

val AppTextSecondary: Color
    get() = if (TestTrackThemeState.isLightMode) AcademicTextMuted else TextMutedSlate

// Backward-compatible color aliases for auxiliary components
val PrepBackground: Color get() = AppBackground
val PrepSurface: Color get() = AppCardSurface
val PrepSurfaceCard: Color get() = AppCardSurface
val PrepSurfaceVariant: Color get() = AppCardSurfaceRaised
val PrepCardBorder: Color get() = AppCardBorder
val PrepTextPrimary: Color get() = AppTextPrimary
val PrepTextSecondary: Color get() = AppTextSecondary
val PrepTextMuted: Color get() = TextMutedSlate
val PrepGreenPrimary: Color = GoldPrimary
val PrepGreenBright: Color = GoldBright
val PrepGreenDark: Color = Navy800
val PrepGoldPro: Color = GoldPrimary
val PrepRedAlert: Color = RoseError
val PrepBlueAccent: Color = CyanMetric
val PrepOrangeDistracting: Color = Color(0xFFFB923C)

val GoldGradient = Brush.horizontalGradient(
    colors = listOf(GoldDeep, GoldPrimary, GoldBright)
)

val NavyCardGradient = Brush.verticalGradient(
    colors = listOf(Navy800, Navy900)
)
