package com.sadhna.focus.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// ── Material3 dark colour scheme (all saffron-tuned) ──────────────────────
private val SadhnaDarkColors = darkColorScheme(
    primary          = FireOrange,
    onPrimary        = Color.White,
    primaryContainer = Color(0xFF3A1500),
    onPrimaryContainer = FireLight,

    secondary        = FireGold,
    onSecondary      = BgDark,
    secondaryContainer = Color(0xFF3A2A00),
    onSecondaryContainer = FireLight,

    tertiary         = Productive,
    onTertiary       = BgDark,

    background       = BgDark,
    onBackground     = TextPrimary,

    surface          = Surface1,
    onSurface        = TextPrimary,
    surfaceVariant   = Surface2,
    onSurfaceVariant = TextMuted,

    outline          = Border,
    outlineVariant   = Color(0xFF2A2838),

    error            = Distracting,
    onError          = Color.White,
    errorContainer   = Color(0xFF4A0A0A),
    onErrorContainer = Distracting,

    inverseSurface   = TextPrimary,
    inverseOnSurface = BgDark,
)

// ── Root theme composable ──────────────────────────────────────────────────
@Composable
fun SadhnaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SadhnaDarkColors,
        typography  = SadhnaTypography,
        content     = content,
    )
}

// ── Quick-access extension on MaterialTheme ────────────────────────────────
// Usage: MaterialTheme.sadhna.fire
object SadhnaColors {
    val fire        get() = FireOrange
    val gold        get() = FireGold
    val surface1    get() = Surface1
    val surface2    get() = Surface2
    val surface3    get() = Surface3
    val textPrimary get() = TextPrimary
    val textMuted   get() = TextMuted
    val productive  get() = Productive
    val distracting get() = Distracting
}

val MaterialTheme.sadhna get() = SadhnaColors
