package com.sadhna.focus.update

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.Environment
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

// ── Update info data class ─────────────────────────────────────────────────
data class UpdateInfo(
    val version: String,        // "v1.2.0"
    val apkDownloadUrl: String, // GitHub release asset URL
    val releaseNotes: String,   // Markdown changelog
)

// ═══════════════════════════════════════════════════════════════════════════
//  UpdateChecker — polls GitHub Releases API for new APK versions
// ═══════════════════════════════════════════════════════════════════════════
object UpdateChecker {

    // 🔗 Replace with your actual GitHub username and repo name
    private const val GITHUB_API =
        "https://api.github.com/repos/YOUR_USERNAME/sadhna-android/releases/latest"

    private const val CONNECT_TIMEOUT = 8_000
    private const val READ_TIMEOUT    = 8_000

    /**
     * Checks GitHub for a newer release.
     * Returns [UpdateInfo] if an update is available, null otherwise.
     * Must be called from a coroutine (runs on IO dispatcher internally).
     */
    suspend fun checkForUpdate(context: Context): UpdateInfo? =
        withContext(Dispatchers.IO) {
            try {
                val conn = URL(GITHUB_API).openConnection() as HttpURLConnection
                conn.apply {
                    connectTimeout = CONNECT_TIMEOUT
                    readTimeout    = READ_TIMEOUT
                    setRequestProperty("Accept", "application/vnd.github.v3+json")
                    setRequestProperty("User-Agent", "Sadhna-Android/${currentVersion(context)}")
                }

                if (conn.responseCode != HttpURLConnection.HTTP_OK) return@withContext null

                val json = JSONObject(conn.inputStream.bufferedReader().readText())

                val latestTag    = json.getString("tag_name")          // "v1.2.0"
                val releaseNotes = json.optString("body", "")
                val assets       = json.getJSONArray("assets")

                // Find the APK asset
                val apkUrl = (0 until assets.length())
                    .map { assets.getJSONObject(it) }
                    .firstOrNull { it.getString("name").endsWith(".apk") }
                    ?.getString("browser_download_url")
                    ?: return@withContext null

                val current = currentVersion(context)

                if (isNewer(latestTag, current)) {
                    UpdateInfo(
                        version        = latestTag,
                        apkDownloadUrl = apkUrl,
                        releaseNotes   = releaseNotes,
                    )
                } else null

            } catch (_: Exception) {
                null  // Network error, malformed JSON, etc. — silent fail
            }
        }

    // ── Download APK via DownloadManager ──────────────────────────────────
    fun downloadAndInstall(context: Context, apkUrl: String) {
        val request = DownloadManager.Request(Uri.parse(apkUrl))
            .setTitle("Sadhna Update")
            .setDescription("Downloading new version…")
            .setNotificationVisibility(
                DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            )
            .setDestinationInExternalFilesDir(
                context, Environment.DIRECTORY_DOWNLOADS, "sadhna-update.apk"
            )
            .setAllowedOverMetered(true)
            .setAllowedOverRoaming(false)

        val dm         = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
        val downloadId = dm.enqueue(request)

        // Listen for completion
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(ctx: Context, intent: Intent) {
                val id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L)
                if (id == downloadId) {
                    ctx.unregisterReceiver(this)
                    installApk(ctx)
                }
            }
        }
        context.registerReceiver(receiver,
            IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE))
    }

    // ── Install the downloaded APK ────────────────────────────────────────
    private fun installApk(context: Context) {
        val apkFile = File(
            context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),
            "sadhna-update.apk"
        )
        if (!apkFile.exists()) return

        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            apkFile
        )

        val install = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(install)
    }

    // ── Version comparison helpers ────────────────────────────────────────

    /**
     * Returns true if [latest] ("v1.2.0") is newer than [current] ("v1.1.0").
     * Compares major.minor.patch semantically.
     */
    private fun isNewer(latest: String, current: String): Boolean {
        return try {
            val l = parseVersion(latest)
            val c = parseVersion(current)
            for (i in 0..2) {
                if (l[i] > c[i]) return true
                if (l[i] < c[i]) return false
            }
            false
        } catch (_: Exception) { false }
    }

    private fun parseVersion(tag: String): List<Int> =
        tag.removePrefix("v").split(".")
           .map { it.filter { c -> c.isDigit() }.toIntOrNull() ?: 0 }
           .let { if (it.size < 3) it + List(3 - it.size) { 0 } else it }
           .take(3)

    private fun currentVersion(context: Context): String = try {
        context.packageManager
            .getPackageInfo(context.packageName, 0)
            .versionName ?: "1.0.0"
    } catch (_: Exception) { "1.0.0" }
}
