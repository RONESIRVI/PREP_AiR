package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
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
    assertEquals("PREP_AiR", appName)
  }

  @Test
  fun `verify OTA version comparison logic`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val otaManager = com.example.data.ota.OtaUpdateManager(context)
    
    // Newer remote versions (remote, current)
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("1.0.1", "1.0.0"))
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("1.1.0", "1.0.0"))
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("2.0.0", "1.0.0"))
    
    // Older or equal versions
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.0.0", "1.0.0"))
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.0.0", "1.1.0"))
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.9.9", "2.0.0"))
  }

  @Test
  fun `verify Light 3D and Dark theme switching`() {
    com.example.ui.theme.PrepThemeState.isLight3D = true
    org.junit.Assert.assertTrue(com.example.ui.theme.PrepThemeState.isLight3D)
    val lightBg = com.example.ui.theme.PrepBackground
    assertEquals(androidx.compose.ui.graphics.Color(0xFFF1F5F2), lightBg)

    com.example.ui.theme.PrepThemeState.isLight3D = false
    org.junit.Assert.assertFalse(com.example.ui.theme.PrepThemeState.isLight3D)
    val darkBg = com.example.ui.theme.PrepBackground
    assertEquals(androidx.compose.ui.graphics.Color(0xFF070B08), darkBg)

    // Reset back to default Light 3D
    com.example.ui.theme.PrepThemeState.isLight3D = true
  }
}
