package com.example.ui.screens.welcome

import android.Manifest
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LinkOff
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.BuildConfig
import com.example.data.ota.UpdateInfo
import com.example.data.ota.UpdateStatus
import com.example.util.NotificationHelper
import com.example.ui.theme.PrepBackground
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary
import com.example.ui.components.ComingSoonVerificationDialog
import com.example.ui.components.PremiumNewVersionCard
import com.example.ui.components.UpdateSetupDialog
import com.example.ui.theme.PrepThemeState
import com.example.ui.theme.threeDCard
import java.io.File

/**
 * Clean, minimal WelcomeScreen featuring:
 * - Prominent Welcome message 🙏
 * - 'Coming Soon' Verification Pop-up (Interactive Pop-up dialog)
 * - Visual placeholder area for future app graphics
 * - In-App OTA Auto-Detect & Update Setup (100% link-free)
 */
@Composable
fun WelcomeScreen(
    otaStatus: UpdateStatus,
    postponedUpdate: UpdateInfo? = null,
    onCheckForUpdates: () -> Unit,
    onDownloadUpdate: (UpdateInfo) -> Unit,
    onInstallApk: (File) -> Unit,
    onPostponeToUpdateSetup: (UpdateInfo) -> Unit = {},
    onClearPostponedUpdate: () -> Unit = {},
    onSimulateTestUpdate: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()
    var showComingSoonDialog by remember { mutableStateOf(false) }
    var showUpdateSetupDialog by remember { mutableStateOf(false) }

    val context = LocalContext.current
    var isNotifAllowed by remember { mutableStateOf(NotificationHelper.areNotificationsAllowed(context)) }
    val notifPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        isNotifAllowed = granted
    }

    // Gentle ambient pulse for subtle decorative elements
    val infiniteTransition = rememberInfiniteTransition(label = "ambient_pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 0.85f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_alpha"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PrepBackground)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 22.dp, vertical = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // ==========================================
            // 1. PROMINENT WELCOME MESSAGE 🙏
            // ==========================================
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(
                        if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else PrepSurfaceCard
                    )
                    .border(
                        width = 1.5.dp,
                        color = (if (PrepThemeState.isLight3D) PrepGreenBright else Color(0xFF34D399))
                            .copy(alpha = pulseAlpha),
                        shape = CircleShape
                    )
                    .shadow(
                        elevation = 4.dp,
                        shape = CircleShape,
                        spotColor = PrepGreenBright.copy(alpha = 0.3f)
                    )
                    .testTag("welcome_prayer_avatar")
            ) {
                Text(
                    text = "🙏",
                    fontSize = 38.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Welcome 🙏",
                fontSize = 32.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = (-0.5).sp,
                color = PrepTextPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier.testTag("welcome_heading_text")
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Welcome to PREP_AiR",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrepGreenBright,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "A clean, modern space dedicated to your focus, discipline, and daily progress.",
                fontSize = 13.sp,
                lineHeight = 19.sp,
                color = PrepTextMuted,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(26.dp))

            // ============================================================
            // 2. VISUAL PLACEHOLDER AREA FOR FUTURE APP GRAPHICS
            // ============================================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .threeDCard(RoundedCornerShape(20.dp), elevation = 4.dp)
                    .border(
                        width = 1.dp,
                        color = PrepCardBorder,
                        shape = RoundedCornerShape(20.dp)
                    )
                    .padding(2.dp)
                    .testTag("future_app_graphics_placeholder")
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(
                            if (PrepThemeState.isLight3D) Color(0xFFFAFCFA) else PrepSurfaceCard
                        )
                        .padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Header tag for the placeholder
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Image,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "APP GRAPHICS PREVIEW",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp,
                                color = PrepTextMuted
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(PrepSurfaceVariant)
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Text(
                                text = "Canvas Placeholder",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = PrepTextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Stylized Canvas Placeholder Graphic (Geometric Blueprint Wireframe)
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (PrepThemeState.isLight3D) Color(0xFFF3F7F4) else Color(0xFF101913)
                            )
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val strokeColor = if (PrepThemeState.isLight3D) {
                                Color(0x3010B981)
                            } else {
                                Color(0x304CEF8D)
                            }
                            val gridColor = if (PrepThemeState.isLight3D) {
                                Color(0x18000000)
                            } else {
                                Color(0x18FFFFFF)
                            }

                            val step = 20.dp.toPx()
                            // Subtle Blueprint Grid Lines
                            var x = 0f
                            while (x < size.width) {
                                drawLine(
                                    color = gridColor,
                                    start = Offset(x, 0f),
                                    end = Offset(x, size.height),
                                    strokeWidth = 1f
                                )
                                x += step
                            }
                            var y = 0f
                            while (y < size.height) {
                                drawLine(
                                    color = gridColor,
                                    start = Offset(0f, y),
                                    end = Offset(size.width, y),
                                    strokeWidth = 1f
                                )
                                y += step
                            }

                            // Dashed Border around inner graphic area
                            drawRoundRect(
                                color = strokeColor,
                                size = Size(size.width - 24.dp.toPx(), size.height - 24.dp.toPx()),
                                topLeft = Offset(12.dp.toPx(), 12.dp.toPx()),
                                cornerRadius = CornerRadius(10.dp.toPx()),
                                style = Stroke(
                                    width = 1.5.dp.toPx(),
                                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(14f, 10f), 0f)
                                )
                            )
                        }

                        // Center Placeholder Icon & Label
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(CircleShape)
                                    .background(PrepGreenDark)
                                    .border(1.dp, PrepGreenBright.copy(alpha = 0.4f), CircleShape)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "Future App Graphics Space",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepTextPrimary
                            )
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(
                                text = "Revamped interface illustrations & charts will appear here",
                                fontSize = 11.sp,
                                color = PrepTextMuted,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ============================================================
            // 3. 'COMING SOON VERIFICATION' POPUP TRIGGER (CARD REPLACED)
            // ============================================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else PrepSurfaceCard
                    )
                    .border(
                        width = 1.2.dp,
                        brush = Brush.horizontalGradient(
                            listOf(
                                PrepGoldPro.copy(alpha = 0.7f),
                                PrepGreenBright.copy(alpha = 0.7f)
                            )
                        ),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .clickable { showComingSoonDialog = true }
                    .padding(horizontal = 16.dp, vertical = 13.dp)
                    .testTag("coming_soon_verification_popup_trigger")
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(PrepGoldPro.copy(alpha = 0.18f))
                        ) {
                            Icon(
                                imageVector = Icons.Default.RocketLaunch,
                                contentDescription = null,
                                tint = PrepGoldPro,
                                modifier = Modifier.size(17.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Coming Soon Verification",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(PrepGoldPro.copy(alpha = 0.15f))
                                        .padding(horizontal = 5.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "POP-UP",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Black,
                                        color = PrepGoldPro
                                    )
                                }
                            }
                            Text(
                                text = "नया अपडेट जल्द ही Release होगा • Tap for details",
                                fontSize = 11.sp,
                                color = PrepGoldPro
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(PrepSurfaceVariant)
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = "Open >",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepGreenBright
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ======================================================================
            // 4. IN-APP OTA AUTO-DETECT & UPDATE SETUP (100% LINK-FREE)
            // ======================================================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .threeDCard(RoundedCornerShape(20.dp), elevation = 3.dp)
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
                    .testTag("ota_update_system_card")
            ) {
                Column {
                    // Header with Installed Version & Auto-Detect badge
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(PrepGreenDark)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.SystemUpdate,
                                    contentDescription = "OTA System",
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "Auto-Detect & Update Setup",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepTextPrimary
                                    )
                                }
                                Text(
                                    text = "📱 Installed: v${BuildConfig.VERSION_NAME} • Auto-Detect Active",
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = PrepGreenBright
                                )
                            }
                        }

                        // Update Setup Button
                        Button(
                            onClick = { showUpdateSetupDialog = true },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (postponedUpdate != null) PrepGoldPro else PrepSurfaceVariant,
                                contentColor = if (postponedUpdate != null) Color.Black else PrepTextPrimary
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .height(36.dp)
                                .testTag("welcome_open_update_setup_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp),
                                tint = if (postponedUpdate != null) Color.Black else PrepGreenBright
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (postponedUpdate != null) "Setup (1)" else "Setup",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Link-Free Guarantee Banner
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(PrepBackground.copy(alpha = 0.6f))
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.LinkOff,
                                contentDescription = null,
                                tint = PrepGreenBright,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "बिना लिंक के Direct In-App Install • 100% सुरक्षित",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PrepTextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Notifications Allowed System Bar
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isNotifAllowed) PrepGreenDark.copy(alpha = 0.35f)
                                else PrepGoldPro.copy(alpha = 0.15f)
                            )
                            .border(
                                1.dp,
                                if (isNotifAllowed) PrepGreenBright.copy(alpha = 0.45f)
                                else PrepGoldPro.copy(alpha = 0.45f),
                                RoundedCornerShape(10.dp)
                            )
                            .clickable {
                                if (!isNotifAllowed) {
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                        notifPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                                    } else {
                                        NotificationHelper.openNotificationSettings(context)
                                    }
                                } else {
                                    val sent = NotificationHelper.sendTestNotification(context)
                                    Toast.makeText(
                                        context,
                                        if (sent) "🔔 Notifications System: Active & Test Alert Sent! ✓"
                                        else "🔔 Notifications System: Settings Opened",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                            .testTag("notifications_allowed_system_btn")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = if (isNotifAllowed) Icons.Default.NotificationsActive else Icons.Default.Notifications,
                                    contentDescription = null,
                                    tint = if (isNotifAllowed) PrepGreenBright else PrepGoldPro,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(
                                        text = if (isNotifAllowed) "Notifications Allowed System: Active ✓" else "Notifications Allowed System: अनुमति दें",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isNotifAllowed) PrepGreenBright else PrepGoldPro
                                    )
                                    Text(
                                        text = if (isNotifAllowed) "Tap to send test alert • सुरक्षित इन-ऐप अपडेट अलर्ट" else "अपडेट और अलर्ट प्राप्त करने के लिए टैप करें",
                                        fontSize = 9.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isNotifAllowed) PrepGreenBright else PrepGoldPro)
                                    .clickable {
                                        if (!isNotifAllowed) {
                                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                                notifPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                                            } else {
                                                NotificationHelper.openNotificationSettings(context)
                                            }
                                        } else {
                                            val sent = NotificationHelper.sendTestNotification(context)
                                            Toast.makeText(
                                                context,
                                                if (sent) "🔔 Test notification sent! ✓" else "Notification active",
                                                Toast.LENGTH_SHORT
                                            ).show()
                                        }
                                    }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                                    .testTag("notifications_test_action_btn")
                            ) {
                                Text(
                                    text = if (isNotifAllowed) "Test 🔔" else "Allow",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.Black
                                )
                            }
                        }
                    }

                    // Card for Postponed Update in Update Setup (If user sent it to setup)
                    if (postponedUpdate != null && otaStatus !is UpdateStatus.UpdateAvailable) {
                        Spacer(modifier = Modifier.height(12.dp))
                        PremiumNewVersionCard(
                            updateInfo = postponedUpdate,
                            currentVersion = BuildConfig.VERSION_NAME,
                            onDownloadNow = { onDownloadUpdate(postponedUpdate) },
                            onSecondaryAction = { showUpdateSetupDialog = true },
                            secondaryActionText = "Open Update Setup (सेटअप खोलें)",
                            secondaryActionIcon = Icons.Default.SystemUpdate
                        )
                    }

                    // Dynamic status display based on otaStatus
                    when (val s = otaStatus) {
                        is UpdateStatus.Checking -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrepSurfaceVariant)
                                    .padding(horizontal = 12.dp, vertical = 9.dp)
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    strokeWidth = 2.dp,
                                    color = PrepGreenBright
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "Auto-Detecting live update...",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "Checking releases without browser redirection",
                                        fontSize = 10.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }
                        }

                        is UpdateStatus.UpdateAvailable -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            PremiumNewVersionCard(
                                updateInfo = s.updateInfo,
                                currentVersion = BuildConfig.VERSION_NAME,
                                onDownloadNow = { onDownloadUpdate(s.updateInfo) },
                                onSecondaryAction = { onPostponeToUpdateSetup(s.updateInfo) },
                                secondaryActionText = "📦 बाद में करने के लिए Update Setup में भेजें",
                                secondaryActionIcon = Icons.Default.Schedule
                            )
                        }

                        is UpdateStatus.Downloading -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrepSurfaceVariant)
                                    .padding(12.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Downloading APK package directly...",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "${s.progressPercent}%",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                LinearProgressIndicator(
                                    progress = { s.progressPercent / 100f },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(5.dp)
                                        .clip(RoundedCornerShape(3.dp)),
                                    color = PrepGreenBright,
                                    trackColor = PrepBackground
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "बिना ब्राउज़र लिंक के सीधे सुरक्षित डाउनलोड हो रहा है",
                                    fontSize = 10.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }

                        is UpdateStatus.ReadyToInstall -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            Button(
                                onClick = { onInstallApk(s.apkFile) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = PrepGreenBright,
                                    contentColor = Color.Black
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp)
                                    .testTag("welcome_install_apk_btn")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Install APK Update (बिना लिंक के Direct Install)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        is UpdateStatus.Installing -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(PrepGreenDark.copy(alpha = 0.35f))
                                    .border(1.2.dp, PrepGreenBright, RoundedCornerShape(12.dp))
                                    .padding(14.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.RocketLaunch,
                                        contentDescription = null,
                                        tint = PrepGreenBright,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "🚀 इंस्टॉलेशन शुरू हो गया है (v${s.version})",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepGreenBright
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "पैकेज एंड्रॉइड इंस्टॉलर को हैंडओवर हो गया है। आपको बार-बार इंस्टॉलेशन करने की आवश्यकता नहीं है।",
                                    fontSize = 11.sp,
                                    color = PrepTextSecondary,
                                    lineHeight = 15.sp
                                )
                            }
                        }

                        is UpdateStatus.UpToDate -> {
                            Spacer(modifier = Modifier.height(12.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (PrepThemeState.isLight3D) Color(0xFFF0FDF4) else PrepGreenDark.copy(alpha = 0.25f))
                                    .border(1.2.dp, PrepGreenBright.copy(alpha = 0.7f), RoundedCornerShape(12.dp))
                                    .padding(12.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Verified,
                                            contentDescription = null,
                                            tint = PrepGreenBright,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "सिस्टम पूरी तरह अप-टू-डेट है (v${s.currentVersion})",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (PrepThemeState.isLight3D) Color(0xFF166534) else PrepGreenBright
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(PrepGreenBright.copy(alpha = 0.2f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = "LATEST",
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PrepGreenBright
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "✓ बार-बार इंस्टॉलेशन की ज़रूरत नहीं • OTA ऑटो-डिटेक्ट बैकग्राउंड में एक्टिव है",
                                    fontSize = 10.sp,
                                    color = if (PrepThemeState.isLight3D) Color(0xFF14532D) else PrepTextSecondary
                                )

                                Spacer(modifier = Modifier.height(10.dp))
                                Button(
                                    onClick = onCheckForUpdates,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (PrepThemeState.isLight3D) Color(0xFF0F172A) else PrepSurfaceCard,
                                        contentColor = Color.White
                                    ),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(38.dp)
                                        .testTag("welcome_check_updates_btn")
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Refresh,
                                        contentDescription = null,
                                        modifier = Modifier.size(14.dp),
                                        tint = PrepGreenBright
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Re-check OTA Updates",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        is UpdateStatus.Error -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (PrepThemeState.isLight3D) Color(0xFFFEF3C7) else PrepSurfaceVariant)
                                    .padding(12.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Info,
                                        contentDescription = null,
                                        tint = PrepGoldPro,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Remote GitHub Repo Connect Status",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (PrepThemeState.isLight3D) Color(0xFF92400E) else PrepGoldPro
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = s.message,
                                    fontSize = 10.sp,
                                    color = PrepTextMuted,
                                    lineHeight = 14.sp
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Button(
                                        onClick = onCheckForUpdates,
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (PrepThemeState.isLight3D) Color(0xFF0F172A) else PrepSurfaceCard,
                                            contentColor = Color.White
                                        ),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(38.dp)
                                            .testTag("welcome_retry_check_btn")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Refresh,
                                            contentDescription = null,
                                            modifier = Modifier.size(14.dp),
                                            tint = PrepGreenBright
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Re-check", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }

                                    Button(
                                        onClick = onSimulateTestUpdate,
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = PrepGoldPro,
                                            contentColor = Color.Black
                                        ),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier
                                            .weight(1.2f)
                                            .height(38.dp)
                                            .testTag("welcome_simulate_update_btn")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.RocketLaunch,
                                            contentDescription = null,
                                            modifier = Modifier.size(14.dp),
                                            tint = Color.Black
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Test Live Update", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        else -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = onCheckForUpdates,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (PrepThemeState.isLight3D) Color(0xFF0F172A) else PrepSurfaceCard,
                                        contentColor = Color.White
                                    ),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(42.dp)
                                        .testTag("welcome_check_updates_btn")
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Refresh,
                                        contentDescription = null,
                                        modifier = Modifier.size(15.dp),
                                        tint = PrepGreenBright
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "Auto-Detect Check",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                Button(
                                    onClick = onSimulateTestUpdate,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = PrepGoldPro,
                                        contentColor = Color.Black
                                    ),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .weight(1.1f)
                                        .height(42.dp)
                                        .testTag("welcome_test_live_update_btn")
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.RocketLaunch,
                                        contentDescription = null,
                                        modifier = Modifier.size(15.dp),
                                        tint = Color.Black
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "Test Update Flow",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // ============================================================
        // COMING SOON VERIFICATION POP-UP DIALOG (MODAL)
        // ============================================================
        ComingSoonVerificationDialog(
            isOpen = showComingSoonDialog,
            onDismiss = { showComingSoonDialog = false },
            onCheckOta = {
                onCheckForUpdates()
                showUpdateSetupDialog = true
            }
        )

        // ============================================================
        // UPDATE SETUP MODAL DIALOG (100% LINK-FREE IN-APP UPDATER)
        // ============================================================
        UpdateSetupDialog(
            isOpen = showUpdateSetupDialog,
            onDismiss = { showUpdateSetupDialog = false },
            otaStatus = otaStatus,
            postponedUpdate = postponedUpdate,
            onCheckForUpdates = onCheckForUpdates,
            onSimulateTestUpdate = onSimulateTestUpdate,
            onDownloadUpdate = onDownloadUpdate,
            onInstallApk = onInstallApk,
            onClearPostponedUpdate = onClearPostponedUpdate
        )
    }
}
