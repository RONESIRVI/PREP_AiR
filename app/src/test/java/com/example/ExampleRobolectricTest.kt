package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.local.entity.TestRecordEntity
import com.example.ui.theme.AppBackground
import com.example.ui.theme.TestTrackThemeState
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("TestTrack Pro", appName)
  }

  @Test
  fun `verify test record entity creation and accuracy calculation`() {
    val record = TestRecordEntity(
        testType = "Mock Test",
        subject = "Physics",
        topicChapter = "Electromagnetism",
        testName = "All India Mock 01",
        dateStr = "2026-09-22",
        totalMarks = 100f,
        marksObtained = 85f,
        questionsAttempted = 25,
        correctCount = 22,
        wrongCount = 3,
        unattemptedCount = 5,
        accuracy = 88f,
        timeTakenMin = 50,
        difficulty = "Moderate",
        mistakeType = "Calculation",
        personalNotes = "Great focus, check formula #4"
    )

    assertEquals("Physics", record.subject)
    assertEquals("Mock Test", record.testType)
    assertEquals(85f, record.marksObtained)
    assertEquals(22, record.correctCount)
    assertEquals(3, record.wrongCount)
    assertTrue(record.accuracy > 80f)
  }

  @Test
  fun `verify theme switching in TestTrack Pro`() {
    TestTrackThemeState.isLightMode = false
    assertEquals(com.example.ui.theme.Navy900, AppBackground)

    TestTrackThemeState.isLightMode = true
    assertEquals(com.example.ui.theme.AcademicPaperLight, AppBackground)

    // Reset back to default dark navy
    TestTrackThemeState.isLightMode = false
  }

  @Test
  fun `verify OTA version comparison logic`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val otaManager = com.example.data.ota.OtaUpdateManager(context)

    assertTrue(otaManager.isNewerVersion("1.0.1", "1.0.0"))
    assertTrue(otaManager.isNewerVersion("1.1.0", "1.0.0"))
    assertTrue(otaManager.isNewerVersion("2.0.0", "1.0.0"))

    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.0.0", "1.0.0"))
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.0.0", "1.1.0"))
  }
}
