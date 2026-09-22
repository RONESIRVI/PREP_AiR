package com.example.ui.screens.record

import android.widget.Toast
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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.Grade
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.TestRecordEntity
import com.example.ui.theme.AppBackground
import com.example.ui.theme.AppCardBorder
import com.example.ui.theme.AppCardSurface
import com.example.ui.theme.AppCardSurfaceRaised
import com.example.ui.theme.AppTextPrimary
import com.example.ui.theme.AppTextSecondary
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldBright
import com.example.ui.theme.GoldDeep
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.Navy800
import com.example.ui.theme.RoseError
import com.example.ui.theme.TestTrackThemeState
import com.example.ui.theme.testTrack3DCard
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AddRecordSection(
    onSaveRecord: (TestRecordEntity) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    val testTypes = listOf("Mock Test", "Chapter Test", "Full Syllabus", "Speed Test", "Sectional", "Previous Year")
    val subjects = listOf("Physics", "Chemistry", "Mathematics", "Biology", "Reasoning", "Quantitative", "General Studies", "English")
    val difficulties = listOf("Easy", "Moderate", "Hard", "Very Hard")
    val mistakeTypes = listOf("None / Perfect", "Conceptual", "Calculation", "Silly Mistake", "Time Pressure", "Misread Question", "Guessed")

    // Form States
    var selectedTestType by remember { mutableStateOf(testTypes.first()) }
    var selectedSubject by remember { mutableStateOf(subjects.first()) }
    var topicChapter by remember { mutableStateOf("") }
    var testName by remember { mutableStateOf("") }
    val todayDateStr = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()) }
    var dateStr by remember { mutableStateOf(todayDateStr) }

    var totalMarksInput by remember { mutableStateOf("100") }
    var marksObtainedInput by remember { mutableStateOf("75") }
    var questionsAttemptedInput by remember { mutableStateOf("25") }
    var correctCountInput by remember { mutableStateOf("20") }
    var wrongCountInput by remember { mutableStateOf("5") }
    var unattemptedCountInput by remember { mutableStateOf("5") }
    var timeTakenMinInput by remember { mutableStateOf("60") }

    var selectedDifficulty by remember { mutableStateOf(difficulties[1]) } // Moderate
    var selectedMistakeType by remember { mutableStateOf(mistakeTypes[2]) } // Calculation
    var personalNotes by remember { mutableStateOf("") }

    // Auto-compute accuracy
    val correct = correctCountInput.toIntOrNull() ?: 0
    val attempted = questionsAttemptedInput.toIntOrNull() ?: (correct + (wrongCountInput.toIntOrNull() ?: 0))
    val autoAccuracy = if (attempted > 0) ((correct.toFloat() / attempted) * 100).coerceIn(0f, 100f) else 0f

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AppBackground)
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section 01 Header Banner
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
                            Text("✍️", fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "SECTION 01",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = GoldBright,
                                letterSpacing = 1.2.sp
                            )
                            Text(
                                text = "Add Record",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = AppTextPrimary
                            )
                        }
                    }

                    // Live computed accuracy badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (autoAccuracy >= 80) Color(0x2810B981) else Color(0x28F59E0B))
                            .border(
                                1.dp,
                                if (autoAccuracy >= 80) EmeraldSuccess else GoldPrimary,
                                RoundedCornerShape(20.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Accuracy: ${String.format(Locale.getDefault(), "%.1f", autoAccuracy)}%",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (autoAccuracy >= 80) EmeraldSuccess else GoldBright
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Log and structure test attempts with precision to track score progress, time efficiency, and mistake patterns.",
                    fontSize = 12.sp,
                    color = AppTextSecondary,
                    lineHeight = 16.sp
                )
            }
        }

        // 1. Test Type (Horizontal selector)
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = "Test Type",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    testTypes.forEach { type ->
                        val isSelected = selectedTestType == type
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) GoldPrimary else AppCardSurfaceRaised)
                                .border(
                                    1.dp,
                                    if (isSelected) GoldBright else AppCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedTestType = type }
                                .padding(horizontal = 12.dp, vertical = 7.dp)
                                .testTag("test_type_$type")
                        ) {
                            Text(
                                text = type,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.Black else AppTextSecondary
                            )
                        }
                    }
                }
            }
        }

        // 2. Subject & Topic / Chapter
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
                    text = "Subject & Topic Details",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )

                // Subject Chips
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    subjects.forEach { subj ->
                        val isSelected = selectedSubject == subj
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) GoldPrimary else AppCardSurfaceRaised)
                                .border(
                                    1.dp,
                                    if (isSelected) GoldBright else AppCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedSubject = subj }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                                .testTag("subject_chip_$subj")
                        ) {
                            Text(
                                text = subj,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.Black else AppTextSecondary
                            )
                        }
                    }
                }

                // Topic / Chapter Input
                OutlinedTextField(
                    value = topicChapter,
                    onValueChange = { topicChapter = it },
                    label = { Text("Topic / Chapter (e.g. Calculus, Modern History)") },
                    leadingIcon = { Icon(Icons.Default.MenuBook, contentDescription = null, tint = GoldPrimary) },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_topic_chapter"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GoldPrimary,
                        unfocusedBorderColor = AppCardBorder,
                        focusedLabelColor = GoldPrimary
                    )
                )

                // Test Name Input
                OutlinedTextField(
                    value = testName,
                    onValueChange = { testName = it },
                    label = { Text("Test Name (e.g. All India Mock 04, DPP #12)") },
                    leadingIcon = { Icon(Icons.Default.Grade, contentDescription = null, tint = GoldPrimary) },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_test_name"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GoldPrimary,
                        unfocusedBorderColor = AppCardBorder,
                        focusedLabelColor = GoldPrimary
                    )
                )

                // Date Input
                OutlinedTextField(
                    value = dateStr,
                    onValueChange = { dateStr = it },
                    label = { Text("Date (YYYY-MM-DD)") },
                    leadingIcon = { Icon(Icons.Default.CalendarToday, contentDescription = null, tint = GoldPrimary) },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_test_date"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GoldPrimary,
                        unfocusedBorderColor = AppCardBorder,
                        focusedLabelColor = GoldPrimary
                    )
                )
            }
        }

        // 3. Marks & Numerical Scoring Breakdown
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "Marks & Score Breakdown",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )

                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = totalMarksInput,
                        onValueChange = { totalMarksInput = it },
                        label = { Text("Total Marks") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_total_marks"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GoldPrimary,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )

                    OutlinedTextField(
                        value = marksObtainedInput,
                        onValueChange = { marksObtainedInput = it },
                        label = { Text("Marks Obtained") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_marks_obtained"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GoldPrimary,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )
                }

                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = questionsAttemptedInput,
                        onValueChange = { questionsAttemptedInput = it },
                        label = { Text("Attempted") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_questions_attempted"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GoldPrimary,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )

                    OutlinedTextField(
                        value = timeTakenMinInput,
                        onValueChange = { timeTakenMinInput = it },
                        label = { Text("Time (mins)") },
                        leadingIcon = { Icon(Icons.Default.Timer, contentDescription = null, tint = GoldPrimary) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_time_taken"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GoldPrimary,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )
                }

                // Correct / Wrong / Unattempted Trio
                Text(
                    text = "Questions Distribution (Correct / Wrong / Unattempted)",
                    fontSize = 11.sp,
                    color = AppTextSecondary
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = correctCountInput,
                        onValueChange = {
                            correctCountInput = it
                            val c = it.toIntOrNull() ?: 0
                            val w = wrongCountInput.toIntOrNull() ?: 0
                            questionsAttemptedInput = (c + w).toString()
                        },
                        label = { Text("Correct ✓") },
                        leadingIcon = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_correct_count"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = EmeraldSuccess,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )

                    OutlinedTextField(
                        value = wrongCountInput,
                        onValueChange = {
                            wrongCountInput = it
                            val c = correctCountInput.toIntOrNull() ?: 0
                            val w = it.toIntOrNull() ?: 0
                            questionsAttemptedInput = (c + w).toString()
                        },
                        label = { Text("Wrong ✗") },
                        leadingIcon = { Icon(Icons.Default.Clear, contentDescription = null, tint = RoseError) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_wrong_count"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RoseError,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )

                    OutlinedTextField(
                        value = unattemptedCountInput,
                        onValueChange = { unattemptedCountInput = it },
                        label = { Text("Skipped -") },
                        leadingIcon = { Icon(Icons.Default.HelpOutline, contentDescription = null, tint = AppTextSecondary) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_unattempted_count"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = GoldPrimary,
                            unfocusedBorderColor = AppCardBorder
                        )
                    )
                }
            }
        }

        // 4. Difficulty & Mistake Type
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
                    text = "Difficulty Level",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    difficulties.forEach { diff ->
                        val isSelected = selectedDifficulty == diff
                        val color = when (diff) {
                            "Easy" -> EmeraldSuccess
                            "Moderate" -> GoldBright
                            "Hard" -> Color(0xFFF97316)
                            else -> RoseError
                        }
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) color.copy(alpha = 0.25f) else AppCardSurfaceRaised)
                                .border(
                                    1.dp,
                                    if (isSelected) color else AppCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedDifficulty = diff }
                                .padding(vertical = 8.dp)
                                .testTag("difficulty_$diff")
                        ) {
                            Text(
                                text = diff,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) color else AppTextSecondary
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Primary Mistake Type",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    mistakeTypes.forEach { mistake ->
                        val isSelected = selectedMistakeType == mistake
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) GoldPrimary else AppCardSurfaceRaised)
                                .border(
                                    1.dp,
                                    if (isSelected) GoldBright else AppCardBorder,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedMistakeType = mistake }
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                                .testTag("mistake_type_$mistake")
                        ) {
                            Text(
                                text = mistake,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.Black else AppTextSecondary
                            )
                        }
                    }
                }
            }
        }

        // 5. Personal Notes
        Card(
            colors = CardDefaults.cardColors(containerColor = AppCardSurface),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AppCardBorder, RoundedCornerShape(14.dp))
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = "Personal Notes & Introspection",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AppTextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = personalNotes,
                    onValueChange = { personalNotes = it },
                    placeholder = { Text("Observations, questions to re-attempt, key formula slips...") },
                    leadingIcon = { Icon(Icons.Default.EditNote, contentDescription = null, tint = GoldPrimary) },
                    minLines = 3,
                    maxLines = 5,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_personal_notes"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = GoldPrimary,
                        unfocusedBorderColor = AppCardBorder
                    )
                )
            }
        }

        // 6. [ SAVE RECORD ] CTA Button
        Button(
            onClick = {
                val totalM = totalMarksInput.toFloatOrNull() ?: 100f
                val marksObt = marksObtainedInput.toFloatOrNull() ?: 0f
                val correctC = correctCountInput.toIntOrNull() ?: 0
                val wrongC = wrongCountInput.toIntOrNull() ?: 0
                val skippedC = unattemptedCountInput.toIntOrNull() ?: 0
                val attemptedQ = questionsAttemptedInput.toIntOrNull() ?: (correctC + wrongC)
                val timeM = timeTakenMinInput.toIntOrNull() ?: 30

                val finalAccuracy = if (attemptedQ > 0) {
                    ((correctC.toFloat() / attemptedQ) * 100).coerceIn(0f, 100f)
                } else 0f

                val finalTestName = testName.ifBlank { "$selectedSubject $selectedTestType" }
                val finalTopic = topicChapter.ifBlank { "General Practice" }

                val newRecord = TestRecordEntity(
                    testType = selectedTestType,
                    subject = selectedSubject,
                    topicChapter = finalTopic,
                    testName = finalTestName,
                    dateStr = dateStr,
                    totalMarks = totalM,
                    marksObtained = marksObt,
                    questionsAttempted = attemptedQ,
                    correctCount = correctC,
                    wrongCount = wrongC,
                    unattemptedCount = skippedC,
                    accuracy = finalAccuracy,
                    timeTakenMin = timeM,
                    difficulty = selectedDifficulty,
                    mistakeType = selectedMistakeType,
                    personalNotes = personalNotes
                )

                onSaveRecord(newRecord)
                Toast.makeText(context, "✓ Test Record saved: $finalTestName ($marksObt / $totalM)", Toast.LENGTH_SHORT).show()

                // Reset specific fields for consecutive quick entry
                testName = ""
                topicChapter = ""
                personalNotes = ""
            },
            colors = ButtonDefaults.buttonColors(
                containerColor = GoldPrimary,
                contentColor = Color.Black
            ),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .testTag("btn_save_record")
        ) {
            Icon(Icons.Default.Check, contentDescription = null, tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "SAVE RECORD",
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}
