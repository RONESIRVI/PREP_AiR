package com.sadhna.focus

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text
import androidx.compose.material3.MaterialTheme
import dagger.hilt.android.AndroidEntryPoint

import androidx.compose.runtime.*
import androidx.compose.material3.*
import com.sadhna.focus.data.remote.UpdateChecker
import com.sadhna.focus.data.remote.downloadAndInstall
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import androidx.compose.ui.platform.LocalContext

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                val context = LocalContext.current
                var updateInfo by remember { mutableStateOf<com.sadhna.focus.data.remote.UpdateInfo?>(null) }
                var showDialog by remember { mutableStateOf(false) }

                LaunchedEffect(Unit) {
                    val update = withContext(Dispatchers.IO) {
                        UpdateChecker.checkForUpdate(context)
                    }
                    if (update != null) {
                        updateInfo = update
                        showDialog = true
                    }
                }

                if (showDialog && updateInfo != null) {
                    AlertDialog(
                        onDismissRequest = { showDialog = false },
                        title = { Text("🔥 Sadhna Update!") },
                        text = { Text(updateInfo!!.releaseNotes) },
                        confirmButton = {
                            Button(onClick = {
                                downloadAndInstall(context, updateInfo!!.apkDownloadUrl)
                                showDialog = false
                            }) { Text("Update करो ✅") }
                        },
                        dismissButton = {
                            TextButton(onClick = { showDialog = false }) {
                                Text("बाद में")
                            }
                        }
                    )
                }

                Text("Sadhna App - Base Build Running! (OTA Active)")
            }
        }
    }
}
