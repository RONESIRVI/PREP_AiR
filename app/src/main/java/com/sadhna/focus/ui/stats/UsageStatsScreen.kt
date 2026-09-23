package com.sadhna.focus.ui.stats

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sadhna.focus.data.usage.AppCategory
import com.sadhna.focus.data.usage.AppUsage
import com.sadhna.focus.ui.theme.PoppinsFamily

private val Bg    = Color(0xFF08070C)
private val S1    = Color(0xFF111018)
private val S2    = Color(0xFF1A1826)
private val S3    = Color(0xFF231F35)
private val Fire  = Color(0xFFFF6B00)
private val Green = Color(0xFF34D399)
private val Red   = Color(0xFFF87171)
private val Txt   = Color(0xFFF0EDE8)
private val Muted = Color(0xFF7C7A8A)

enum class StatsPeriod { DAILY, WEEKLY }
enum class StatsFilter  { ALL, DISTRACTING, PRODUCTIVE, OTHERS }

data class BarData(val label: String, val valueMin: Long, val isToday: Boolean = false)

// ═══════════════════════════════════════════════════════════════════════════
//  USAGE STATS SCREEN
// ═══════════════════════════════════════════════════════════════════════════
@Composable
fun UsageStatsScreen(
    onBack: () -> Unit = {},
    viewModel: UsageStatsViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    LazyColumn(
        modifier        = Modifier.fillMaxSize().background(Bg),
        contentPadding  = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {

        // ── Header ───────────────────────────────────────────────────────
        item {
            Row(
                Modifier.fillMaxWidth().padding(bottom = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment     = Alignment.CenterVertically,
            ) {
                Row(verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Surface(onClick = onBack, color = S1, shape = RoundedCornerShape(50)) {
                        Text("←", modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
                            style = TextStyle(fontSize = 16.sp, color = Txt))
                    }
                    Text("Usage Stats", style = TextStyle(fontFamily = PoppinsFamily,
                        fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Txt))
                }
                Surface(onClick = {}, color = S1, shape = RoundedCornerShape(50)) {
                    Text("Help", modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
                        style = TextStyle(fontSize = 11.sp, color = Muted))
                }
            }
        }

        // ── Period toggle: Daily / Weekly ────────────────────────────────
        item {
            Row(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp))
                    .background(S1).padding(4.dp)
            ) {
                StatsPeriod.entries.forEach { period ->
                    val sel = period == state.period
                    Box(
                        Modifier.weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (sel) Fire else Color.Transparent)
                            .clickable { viewModel.setPeriod(period) }
                            .padding(vertical = 9.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            period.name.lowercase().replaceFirstChar { it.uppercase() },
                            style = TextStyle(fontFamily = PoppinsFamily,
                                fontWeight = if (sel) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 13.sp,
                                color = if (sel) Color.White else Muted)
                        )
                    }
                }
            }
        }

        // ── Category filter pills ────────────────────────────────────────
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatsFilter.entries.forEach { f ->
                    val sel   = f == state.filter
                    val color = filterColor(f)
                    Surface(
                        onClick = { viewModel.setFilter(f) },
                        color   = if (sel) color.copy(alpha = .15f) else S1,
                        shape   = RoundedCornerShape(50),
                        border  = if (sel) BorderStroke(1.dp, color) else null,
                    ) {
                        Text(
                            text = f.name.lowercase().replaceFirstChar { it.uppercase() } +
                                   if (sel) " ✓" else "",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold,
                                color = if (sel) color else Muted)
                        )
                    }
                }
            }
        }

        // ── Big total + date ─────────────────────────────────────────────
        item {
            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    state.totalFormatted,
                    style = TextStyle(fontFamily = PoppinsFamily, fontWeight = FontWeight.ExtraBold,
                        fontSize = 36.sp, color = Txt, letterSpacing = (-1).sp)
                )
                Text(state.periodLabel, style = TextStyle(fontSize = 11.sp, color = Muted))
            }
        }

        // ── Bar chart ────────────────────────────────────────────────────
        item {
            UsageBarChart(
                bars     = state.bars,
                maxMin   = state.bars.maxOfOrNull { it.valueMin } ?: 1L,
            )
        }

        // ── Legend ───────────────────────────────────────────────────────
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                LegendDot(color = Red,   label = "${state.distractingMin}m Distracting")
                LegendDot(color = Green, label = "${state.productiveMin}m Productive")
                LegendDot(color = Muted, label = "${state.othersMin}m Others")
            }
        }

        // ── Search ───────────────────────────────────────────────────────
        item {
            Surface(color = S1, shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()) {
                Row(Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("🔍", fontSize = 16.sp)
                    Text("Search apps…", style = TextStyle(fontSize = 13.sp, color = Muted))
                }
            }
        }

        // ── App list ─────────────────────────────────────────────────────
        items(state.filteredApps, key = { it.packageName }) { app ->
            AppUsageRow(app = app)
        }

        item { Spacer(Modifier.height(80.dp)) }
    }
}

// ── Bar chart ──────────────────────────────────────────────────────────────
@Composable
private fun UsageBarChart(bars: List<BarData>, maxMin: Long) {
    Surface(color = S1, shape = RoundedCornerShape(14.dp), modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            Row(
                modifier             = Modifier.fillMaxWidth().height(80.dp),
                verticalAlignment    = Alignment.Bottom,
                horizontalArrangement= Arrangement.SpaceBetween,
            ) {
                bars.forEach { bar ->
                    val ratio = if (maxMin > 0) bar.valueMin.toFloat() / maxMin else 0f
                    val animRatio by animateFloatAsState(
                        targetValue    = ratio,
                        animationSpec  = tween(600, easing = EaseOutCubic),
                        label          = "bar_${bar.label}"
                    )
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier            = Modifier.weight(1f),
                        verticalArrangement = Arrangement.Bottom,
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(0.65f)
                                .fillMaxHeight(animRatio.coerceAtLeast(0.02f))
                                .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                                .background(
                                    if (bar.isToday)
                                        Brush.verticalGradient(listOf(Fire, Color(0xFFFF4500)))
                                    else
                                        Brush.verticalGradient(listOf(S3, S2))
                                )
                        )
                    }
                }
            }
            HorizontalDivider(color = Color(0x11FFFFFF), thickness = 1.dp,
                modifier = Modifier.padding(vertical = 6.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                bars.forEach { bar ->
                    Text(bar.label, style = TextStyle(fontSize = 10.sp,
                        color = if (bar.isToday) Fire else Muted,
                        fontWeight = if (bar.isToday) FontWeight.Bold else FontWeight.Normal),
                        modifier = Modifier.weight(1f), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                }
            }
        }
    }
}

// ── App usage row ──────────────────────────────────────────────────────────
@Composable
private fun AppUsageRow(app: AppUsage) {
    Surface(color = S1, shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
        Row(
            Modifier.padding(12.dp),
            verticalAlignment    = Alignment.CenterVertically,
            horizontalArrangement= Arrangement.spacedBy(12.dp),
        ) {
            Box(
                Modifier.size(36.dp).clip(RoundedCornerShape(9.dp)).background(S2),
                contentAlignment = Alignment.Center
            ) { Text(appEmoji(app.packageName), fontSize = 18.sp) }

            Column(Modifier.weight(1f)) {
                Text(app.appName, style = TextStyle(fontFamily = PoppinsFamily,
                    fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = Txt))
                Row(verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Box(Modifier.size(6.dp).clip(CircleShape).background(categoryColor(app.category)))
                    Text(app.category.name.lowercase().replaceFirstChar { it.uppercase() },
                        style = TextStyle(fontSize = 10.sp, color = categoryColor(app.category)))
                }
            }

            Text("${app.usedMin}m", style = TextStyle(fontFamily = PoppinsFamily,
                fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Txt))
            Text("›", style = TextStyle(fontSize = 16.sp, color = Muted))
        }
    }
}

// ── Helpers ────────────────────────────────────────────────────────────────
@Composable
private fun LegendDot(color: Color, label: String) {
    Row(verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp)) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(color))
        Text(label, style = TextStyle(fontSize = 10.sp, color = Muted))
    }
}

private fun categoryColor(cat: AppCategory) = when (cat) {
    AppCategory.DISTRACTING -> Color(0xFFF87171)
    AppCategory.PRODUCTIVE  -> Color(0xFF34D399)
    AppCategory.OTHERS      -> Color(0xFF7C7A8A)
}

private fun filterColor(f: StatsFilter) = when (f) {
    StatsFilter.DISTRACTING -> Color(0xFFF87171)
    StatsFilter.PRODUCTIVE  -> Color(0xFF34D399)
    StatsFilter.OTHERS      -> Color(0xFF7C7A8A)
    StatsFilter.ALL         -> Color(0xFFFF6B00)
}

private fun appEmoji(pkg: String) = when {
    "youtube"   in pkg -> "▶"
    "facebook"  in pkg -> "f"
    "instagram" in pkg -> "📷"
    "snapchat"  in pkg -> "👻"
    "twitter"   in pkg -> "𝕏"
    "sadhna"    in pkg -> "🔥"
    else               -> "📱"
}
