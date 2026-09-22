package com.example.ui.screens.analysis

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Insights
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.QueryStats
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material.icons.filled.Timeline
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.TestRecordEntity
import com.example.ui.theme.AppBackground
import com.example.ui.theme.AppCardBorder
import com.example.ui.theme.AppCardSurface
import com.example.ui.theme.AppCardSurfaceRaised
import com.example.ui.theme.AppTextPrimary
import com.example.ui.theme.AppTextSecondary
import com.example.ui.theme.CyanMetric
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldBright
import com.example.ui.theme.GoldDeep
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.IndigoAccent
import com.example.ui.theme.Navy700
import com.example.ui.theme.Navy800
import com.example.ui.theme.RoseError
import com.example.ui.theme.TestTrackThemeState
import com.example.ui.theme.testTrack3DCard
import java.util.Locale

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AnalysisBoardSection(
    records: List<TestRecordEntity>,
    onDeleteRecord: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    // Filter by subject
    var selectedSubjectFilter by remember { mutableStateOf<String?>(null) }
    val filteredRecords = if (selectedSubjectFilter == null) {
        records
    } else {
        records.filter { it.subject == selectedSubjectFilter }
    }

    // Performance Overview Metrics Calculation
    val totalTests = filteredRecords.size
    val totalScore = filteredRecords.sumOf { it.marksObtained.toDouble() }.toFloat()
    val totalMaxScore = filteredRecords.sumOf { it.totalMarks.toDouble() }.toFloat()
    val avgScore = if (totalTests > 0) totalScore / totalTests else 0f
    val avgPercentage = if (totalMaxScore > 0) (totalScore / totalMaxScore) * 100f else 0f
    val highestScore = filteredRecords.maxOfOrNull { it.marksObtained } ?: 0f
    val lowestScore = filteredRecords.minOfOrNull { it.marksObtained } ?: 0f
    val avgAccuracy = if (totalTests > 0) (filteredRecords.sumOf { it.accuracy.toDouble() } / totalTests).toFloat() else 0f
    val avgTimeMin = if (totalTests > 0) (filteredRecords.sumOf { it.timeTakenMin.toDouble() } / totalTests).toFloat() else 0f

    // Subject Breakdown
    val subjectGroups = records.groupBy { it.subject }
    val topicGroups = filteredRecords.groupBy { it.topicChapter }
    val difficultyGroups = filteredRecords.groupBy { it.difficulty }
    val mistakeGroups = filteredRecords.groupBy { it.mistakeType }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AppBackground)
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section 02 Header Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .testTrack3DCard(cornerRadius = 16.dp)
                .padding(18.dp)
        ) {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0x28F59E0B))
                                .border(1.dp, GoldPrimary, CircleShape)
                        ) {
                            Text("📊", fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "SECTION 02",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = GoldBright,
                                letterSpacing = 1.2.sp
                            )
                            Text(
                                text = "Analysis Board",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = AppTextPrimary
                            )
                        }
                    }

                    // Total Tests Recorded Pill
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color(0x20F59E0B))
                            .border(1.dp, GoldPrimary, RoundedCornerShape(20.dp))
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "$totalTests Tests Tracked",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = GoldBright
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Holistic academic diagnostics: score trends, subject mastery, time efficiency, and recurring mistake patterns.",
                    fontSize = 12.sp,
                    color = AppTextSecondary,
                    lineHeight = 16.sp
                )
            }
        }

        // Subject Filter Tabs (Quick interactive segmenting)
        if (subjectGroups.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // All Subjects Pill
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (selectedSubjectFilter == null) GoldPrimary else AppCardSurface)
                        .border(1.dp, if (selectedSubjectFilter == null) GoldBright else AppCardBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedSubjectFilter = null }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                        .testTag("filter_all_subjects")
                ) {
                    Text(
                        text = "All Subjects (${records.size})",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedSubjectFilter == null) Color.Black else AppTextSecondary
                    )
                }

                subjectGroups.keys.forEach { subj ->
                    val isSelected = selectedSubjectFilter == subj
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) GoldPrimary else AppCardSurface)
                            .border(1.dp, if (isSelected) GoldBright else AppCardBorder, RoundedCornerShape(20.dp))
                            .clickable { selectedSubjectFilter = subj }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                            .testTag("filter_subject_$subj")
                    ) {
                        Text(
                            text = "$subj (${subjectGroups[subj]?.size ?: 0})",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.Black else AppTextSecondary
                        )
                    }
                }
            }
        }

        // 1. Performance Overview Grid (6 Key Metrics Required)
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Insights, contentDescription = null, tint = GoldPrimary, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Performance Overview",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = AppTextPrimary
                        )
                    }
                    Text(
                        text = "Avg ${String.format(Locale.getDefault(), "%.1f", avgPercentage)}%",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldSuccess
                    )
                }

                // 2x3 Metric Cards Grid
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MetricMiniCard(
                        title = "Total Tests",
                        value = "$totalTests",
                        subtitle = "Recorded attempts",
                        icon = Icons.Default.Analytics,
                        accentColor = GoldBright,
                        modifier = Modifier.weight(1f)
                    )
                    MetricMiniCard(
                        title = "Average Score",
                        value = String.format(Locale.getDefault(), "%.1f", avgScore),
                        subtitle = "Mean marks",
                        icon = Icons.Default.QueryStats,
                        accentColor = CyanMetric,
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MetricMiniCard(
                        title = "Highest Score",
                        value = String.format(Locale.getDefault(), "%.1f", highestScore),
                        subtitle = "Personal best",
                        icon = Icons.Default.ArrowUpward,
                        accentColor = EmeraldSuccess,
                        modifier = Modifier.weight(1f)
                    )
                    MetricMiniCard(
                        title = "Lowest Score",
                        value = String.format(Locale.getDefault(), "%.1f", lowestScore),
                        subtitle = "Scope to improve",
                        icon = Icons.Default.ArrowDownward,
                        accentColor = RoseError,
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MetricMiniCard(
                        title = "Avg Accuracy",
                        value = "${String.format(Locale.getDefault(), "%.1f", avgAccuracy)}%",
                        subtitle = "Precision rate",
                        icon = Icons.Default.Stars,
                        accentColor = EmeraldSuccess,
                        modifier = Modifier.weight(1f)
                    )
                    MetricMiniCard(
                        title = "Average Time",
                        value = "${avgTimeMin.toInt()}m",
                        subtitle = "Per test attempt",
                        icon = Icons.Default.Timer,
                        accentColor = GoldPrimary,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // 2. Score Trend (Visual progression line & bars)
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Timeline, contentDescription = null, tint = GoldPrimary, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Score Trend",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = AppTextPrimary
                        )
                    }
                    Text(
                        text = "Recent to Oldest",
                        fontSize = 10.sp,
                        color = AppTextSecondary
                    )
                }

                if (filteredRecords.isEmpty()) {
                    Text("No tests to display score trend.", fontSize = 12.sp, color = AppTextSecondary)
                } else {
                    // Vertical visual bars of recent attempts
                    filteredRecords.take(5).forEach { record ->
                        val ratio = if (record.totalMarks > 0) (record.marksObtained / record.totalMarks).coerceIn(0f, 1f) else 0f
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = record.testName,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = AppTextPrimary,
                                    maxLines = 1
                                )
                                Text(
                                    text = "${record.marksObtained.toInt()} / ${record.totalMarks.toInt()} (${(ratio * 100).toInt()}%)",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = if (ratio >= 0.75f) EmeraldSuccess else GoldBright
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { ratio },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp)),
                                color = if (ratio >= 0.8f) EmeraldSuccess else if (ratio >= 0.6f) GoldPrimary else RoseError,
                                trackColor = AppCardSurfaceRaised
                            )
                        }
                    }
                }
            }
        }

        // 3. Subject-wise Performance
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.MenuBook, contentDescription = null, tint = IndigoAccent, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Subject-wise Performance",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = AppTextPrimary
                    )
                }

                if (subjectGroups.isEmpty()) {
                    Text("No subject tests logged yet.", fontSize = 12.sp, color = AppTextSecondary)
                } else {
                    subjectGroups.forEach { (subject, subjectTests) ->
                        val subTotalObt = subjectTests.sumOf { it.marksObtained.toDouble() }
                        val subTotalMax = subjectTests.sumOf { it.totalMarks.toDouble() }
                        val subRatio = if (subTotalMax > 0) (subTotalObt / subTotalMax).toFloat().coerceIn(0f, 1f) else 0f
                        val subAccuracy = subjectTests.sumOf { it.accuracy.toDouble() } / subjectTests.size

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(AppCardSurfaceRaised)
                                .padding(10.dp)
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = subject,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AppTextPrimary
                                )
                                Text(
                                    text = "${subjectTests.size} tests • Avg: ${(subRatio * 100).toInt()}%",
                                    fontSize = 11.sp,
                                    color = GoldBright,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { subRatio },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(5.dp)
                                    .clip(RoundedCornerShape(2.dp)),
                                color = GoldPrimary,
                                trackColor = Navy800
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "Accuracy: ${String.format(Locale.getDefault(), "%.1f", subAccuracy)}%",
                                    fontSize = 10.sp,
                                    color = EmeraldSuccess
                                )
                                Text(
                                    text = "Avg Time: ${subjectTests.map { it.timeTakenMin }.average().toInt()}m",
                                    fontSize = 10.sp,
                                    color = AppTextSecondary
                                )
                            }
                        }
                    }
                }
            }
        }

        // 4. Topic-wise Analysis
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Topic-wise Analysis",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )

                if (topicGroups.isEmpty()) {
                    Text("No topic records available.", fontSize = 12.sp, color = AppTextSecondary)
                } else {
                    topicGroups.entries.take(4).forEach { (topic, topicTests) ->
                        val avgTopicAcc = topicTests.map { it.accuracy }.average().toFloat()
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(AppCardSurfaceRaised)
                                .padding(horizontal = 10.dp, vertical = 8.dp)
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = topic,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = AppTextPrimary,
                                    maxLines = 1
                                )
                                Text(
                                    text = "${topicTests.first().subject} • ${topicTests.size} test(s)",
                                    fontSize = 10.sp,
                                    color = AppTextSecondary
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (avgTopicAcc >= 80) Color(0x2810B981) else Color(0x28F59E0B))
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = "${avgTopicAcc.toInt()}% Acc",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (avgTopicAcc >= 80) EmeraldSuccess else GoldBright
                                )
                            }
                        }
                    }
                }
            }
        }

        // 5. Accuracy & Time Efficiency Duo
        Row(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            // Accuracy Analysis
            Card(
                colors = CardDefaults.cardColors(containerColor = AppCardSurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .weight(1f)
                    .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Stars, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Accuracy", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = AppTextPrimary)
                    }
                    val totalCorrect = filteredRecords.sumOf { it.correctCount }
                    val totalWrong = filteredRecords.sumOf { it.wrongCount }
                    val totalSkipped = filteredRecords.sumOf { it.unattemptedCount }

                    Text(
                        text = "${String.format(Locale.getDefault(), "%.1f", avgAccuracy)}%",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = EmeraldSuccess
                    )
                    Text("✓ Correct: $totalCorrect", fontSize = 10.sp, color = EmeraldSuccess)
                    Text("✗ Wrong: $totalWrong", fontSize = 10.sp, color = RoseError)
                    Text("- Skipped: $totalSkipped", fontSize = 10.sp, color = AppTextSecondary)
                }
            }

            // Time Efficiency
            Card(
                colors = CardDefaults.cardColors(containerColor = AppCardSurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .weight(1f)
                    .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Speed, contentDescription = null, tint = CyanMetric, modifier = Modifier.size(15.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Time Efficiency", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = AppTextPrimary)
                    }
                    val totalMins = filteredRecords.sumOf { it.timeTakenMin }
                    val totalQuestions = filteredRecords.sumOf { it.questionsAttempted }
                    val secPerQuestion = if (totalQuestions > 0) (totalMins * 60) / totalQuestions else 0

                    Text(
                        text = "${secPerQuestion}s",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = CyanMetric
                    )
                    Text("Avg / Question", fontSize = 10.sp, color = AppTextSecondary)
                    Text("Total Time: ${totalMins}m", fontSize = 10.sp, color = GoldBright)
                    Text("Attempts: $totalQuestions Qs", fontSize = 10.sp, color = AppTextSecondary)
                }
            }
        }

        // 6. Difficulty & Mistake Pattern Analysis
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Difficulty & Mistake Patterns",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )

                // Difficulty Distribution
                Text("Difficulty Breakdown", fontSize = 11.sp, color = AppTextSecondary)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    listOf("Easy", "Moderate", "Hard", "Very Hard").forEach { diff ->
                        val count = difficultyGroups[diff]?.size ?: 0
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(AppCardSurfaceRaised)
                                .padding(vertical = 6.dp)
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(diff, fontSize = 9.sp, color = AppTextSecondary)
                                Text("$count", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = GoldBright)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Mistake Patterns
                Text("Recurring Mistake Patterns", fontSize = 11.sp, color = AppTextSecondary)
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    mistakeGroups.forEach { (mistake, mistakeList) ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (mistake.contains("None", true)) Color(0x2010B981) else Color(0x20EF4444))
                                .border(
                                    1.dp,
                                    if (mistake.contains("None", true)) EmeraldSuccess else RoseError.copy(alpha = 0.5f),
                                    RoundedCornerShape(8.dp)
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "$mistake (${mistakeList.size})",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = if (mistake.contains("None", true)) EmeraldSuccess else Color(0xFFFCA5A5)
                            )
                        }
                    }
                }
            }
        }

        // 7. Recent Tests & Progress Timeline
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.History, contentDescription = null, tint = GoldPrimary, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Recent Tests & Progress Timeline",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = AppTextPrimary
                        )
                    }
                    Text(
                        text = "${filteredRecords.size} records",
                        fontSize = 10.sp,
                        color = AppTextSecondary
                    )
                }

                if (filteredRecords.isEmpty()) {
                    Text(
                        text = "No test records found. Tap ADD RECORD to log your first test.",
                        fontSize = 12.sp,
                        color = AppTextSecondary
                    )
                } else {
                    filteredRecords.forEach { record ->
                        TestRecordItemCard(
                            record = record,
                            onDelete = { onDeleteRecord(record.id) }
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun MetricMiniCard(
    title: String,
    value: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(AppCardSurfaceRaised)
            .border(1.dp, Color(0x15F59E0B), RoundedCornerShape(10.dp))
            .padding(10.dp)
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = title, fontSize = 10.sp, color = AppTextSecondary)
                Icon(imageVector = icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(13.dp))
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                color = accentColor
            )
            Text(text = subtitle, fontSize = 9.sp, color = AppTextSecondary)
        }
    }
}

@Composable
private fun TestRecordItemCard(
    record: TestRecordEntity,
    onDelete: () -> Unit
) {
    var isExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(AppCardSurfaceRaised)
            .border(1.dp, Color(0x20F59E0B), RoundedCornerShape(10.dp))
            .clickable { isExpanded = !isExpanded }
            .padding(12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = record.testName,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )
                Text(
                    text = "${record.subject} • ${record.testType} • ${record.dateStr}",
                    fontSize = 10.sp,
                    color = AppTextSecondary
                )
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${record.marksObtained.toInt()} / ${record.totalMarks.toInt()}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.Monospace,
                    color = GoldBright
                )
                Text(
                    text = "${record.accuracy.toInt()}% Acc",
                    fontSize = 10.sp,
                    color = EmeraldSuccess,
                    fontWeight = FontWeight.Bold
                )
            }

            IconButton(
                onClick = { isExpanded = !isExpanded },
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = AppTextSecondary
                )
            }
        }

        AnimatedVisibility(visible = isExpanded) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(Color(0x20F59E0B))
                )

                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Topic: ${record.topicChapter}", fontSize = 11.sp, color = AppTextSecondary)
                    Text("Time: ${record.timeTakenMin} mins", fontSize = 11.sp, color = CyanMetric)
                }

                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Q: ${record.questionsAttempted} Att • ✓${record.correctCount} • ✗${record.wrongCount} • -${record.unattemptedCount}",
                        fontSize = 10.sp,
                        color = AppTextPrimary
                    )
                    Text(
                        text = "Difficulty: ${record.difficulty}",
                        fontSize = 10.sp,
                        color = GoldBright
                    )
                }

                if (record.mistakeType.isNotBlank()) {
                    Text(
                        text = "Mistake Type: ${record.mistakeType}",
                        fontSize = 10.sp,
                        color = RoseError
                    )
                }

                if (record.personalNotes.isNotBlank()) {
                    Text(
                        text = "Notes: \"${record.personalNotes}\"",
                        fontSize = 10.sp,
                        color = AppTextSecondary
                    )
                }

                Row(
                    horizontalArrangement = Arrangement.End,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Record",
                            tint = RoseError,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}
