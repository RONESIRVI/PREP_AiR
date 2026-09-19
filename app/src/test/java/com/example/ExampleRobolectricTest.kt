package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
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
    
    // Newer versions
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("1.0.0", "1.0.1"))
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("1.0.0", "1.1.0"))
    org.junit.Assert.assertTrue(otaManager.isNewerVersion("1.0.0", "2.0.0"))
    
    // Older or equal versions
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.0.0", "1.0.0"))
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("1.1.0", "1.0.0"))
    org.junit.Assert.assertFalse(otaManager.isNewerVersion("2.0.0", "1.9.9"))
  }
}
