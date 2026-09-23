package com.sadhna.focus.data.remote

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Environment
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import androidx.core.content.ContextCompat

// Data class for update info
data class UpdateInfo(
    val version: String,
    val apkDownloadUrl: String,
    val releaseNotes: String
)

object UpdateChecker {
    // 🔗 Fetch the latest release for PREP_AiR
    private const val GITHUB_API = "https://api.github.com/repos/RONESIRVI/PREP_AiR/releases/latest"

    suspend fun checkForUpdate(context: Context): UpdateInfo? {
        return try {
            // GitHub API call
            val url = URL(GITHUB_API)
            val conn = url.openConnection() as HttpURLConnection
            conn.setRequestProperty("Accept", "application/vnd.github.v3+json")

            val json = JSONObject(conn.inputStream.bufferedReader().readText())
            val latestTag = json.getString("tag_name")  // "v1.2.0"
            val releaseNotes = json.getString("body")
            val apkUrl = json
                .getJSONArray("assets")
                .getJSONObject(0)
                .getString("browser_download_url")

            // Current app version
            val currentVersion = context.packageManager
                .getPackageInfo(context.packageName, 0).versionName ?: "v1.0.0"

            // Compare versions
            if (isNewer(latestTag, currentVersion)) {
                UpdateInfo(latestTag, apkUrl, releaseNotes)
            } else null  // Already latest
        } catch (e: Exception) { 
            e.printStackTrace()
            null 
        }
    }

    private fun isNewer(latest: String, current: String): Boolean {
        return try {
            // Strip "v" prefix: "v1.2.0" → [1,2,0]
            val l = latest.removePrefix("v").split(".").map { it.toIntOrNull() ?: 0 }
            val c = current.removePrefix("v").split(".").map { it.toIntOrNull() ?: 0 }
            for (i in 0..2) {
                val latestPart = l.getOrElse(i) { 0 }
                val currentPart = c.getOrElse(i) { 0 }
                if (latestPart > currentPart) return true
                if (latestPart < currentPart) return false
            }
            false
        } catch (e: Exception) {
            false
        }
    }
}

fun downloadAndInstall(context: Context, apkUrl: String) {
    val request = DownloadManager.Request(Uri.parse(apkUrl))
        .setTitle("Sadhna Update")
        .setDescription("Downloading new version...")
        .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        .setDestinationInExternalFilesDir(context, Environment.DIRECTORY_DOWNLOADS, "sadhna-update.apk")

    val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
    val downloadId = dm.enqueue(request)

    // Listen for download complete
    val receiver = object : BroadcastReceiver() {
        override fun onReceive(ctx: Context, intent: Intent) {
            val id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
            if (id == downloadId) {
                installApk(ctx)
                ctx.unregisterReceiver(this)
            }
        }
    }
    ContextCompat.registerReceiver(
        context,
        receiver,
        IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE),
        ContextCompat.RECEIVER_NOT_EXPORTED
    )
}

private fun installApk(context: Context) {
    val apkFile = File(
        context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),
        "sadhna-update.apk"
    )

    val uri = FileProvider.getUriForFile(
        context, "com.sadhna.focus.fileprovider", apkFile
    )

    val install = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, "application/vnd.android.package-archive")
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    context.startActivity(install)
}
