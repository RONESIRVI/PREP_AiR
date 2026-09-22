package com.example.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entity storing individual test records according to Section 01:
 * Test Type, Subject, Topic / Chapter, Test Name, Date,
 * Total Marks, Marks Obtained, Questions Attempted,
 * Correct / Wrong / Unattempted, Accuracy, Time Taken,
 * Difficulty, Mistake Type, Personal Notes.
 */
@Entity(tableName = "test_records")
data class TestRecordEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val testType: String, // Mock Test, Chapter Test, Full Syllabus, Speed Test, Sectional, Previous Year
    val subject: String, // Physics, Chemistry, Mathematics, Biology, Reasoning, Quantitative, English, General Studies
    val topicChapter: String,
    val testName: String,
    val dateStr: String, // YYYY-MM-DD
    val totalMarks: Float,
    val marksObtained: Float,
    val questionsAttempted: Int,
    val correctCount: Int,
    val wrongCount: Int,
    val unattemptedCount: Int,
    val accuracy: Float, // Calculated as (correct / attempted * 100) or user given
    val timeTakenMin: Int,
    val difficulty: String, // Easy, Moderate, Hard, Very Hard
    val mistakeType: String, // Conceptual, Calculation, Silly Mistake, Time Pressure, Misread Question, Guessed
    val personalNotes: String,
    val createdAt: Long = System.currentTimeMillis()
)
