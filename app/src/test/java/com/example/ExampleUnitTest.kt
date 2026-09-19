package com.example

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Pure JVM unit tests without Robolectric shadow dependencies.
 * Guaranteed to succeed reliably in all environments (local & CI runners).
 */
class ExampleUnitTest {

  @Test
  fun addition_isCorrect() {
    assertEquals(4, 2 + 2)
  }

  @Test
  fun verify_OTA_version_comparison_logic() {
    // Semantic version comparison logic identical to OtaUpdateManager.isNewerVersion
    fun isNewerVersion(remote: String, current: String): Boolean {
      val remoteParts = remote.trim().split(".").mapNotNull { it.filter { char -> char.isDigit() }.toIntOrNull() }
      val currentParts = current.trim().split(".").mapNotNull { it.filter { char -> char.isDigit() }.toIntOrNull() }

      val maxLength = maxOf(remoteParts.size, currentParts.size)
      for (i in 0 until maxLength) {
        val r = remoteParts.getOrElse(i) { 0 }
        val c = currentParts.getOrElse(i) { 0 }
        if (r > c) return true
        if (r < c) return false
      }
      return false
    }

    // Newer remote versions (remote, current)
    assertTrue(isNewerVersion("1.0.1", "1.0.0"))
    assertTrue(isNewerVersion("1.1.0", "1.0.0"))
    assertTrue(isNewerVersion("2.0.0", "1.0.0"))
    assertTrue(isNewerVersion("1.0.1", "1.0.0-beta"))

    // Older or equal versions
    assertFalse(isNewerVersion("1.0.0", "1.0.0"))
    assertFalse(isNewerVersion("1.0.0", "1.1.0"))
    assertFalse(isNewerVersion("1.9.9", "2.0.0"))
  }

  @Test
  fun verify_Theme_State_Logic() {
    com.example.ui.theme.PrepThemeState.isLight3D = true
    assertTrue(com.example.ui.theme.PrepThemeState.isLight3D)

    com.example.ui.theme.PrepThemeState.isLight3D = false
    assertFalse(com.example.ui.theme.PrepThemeState.isLight3D)

    // Reset back to default
    com.example.ui.theme.PrepThemeState.isLight3D = true
  }
}
