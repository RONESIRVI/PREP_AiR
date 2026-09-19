package com.example.ui.screens.welcome

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
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.BuildConfig
import com.example.data.ota.UpdateInfo
import com.example.data.ota.UpdateStatus
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
import com.example.ui.theme.PrepThemeState
import com.example.ui.theme.threeDCard
import java.io.File

/**
 * Clean, minimal WelcomeScreen featuring:
 * - Prominent Welcome message 🙏
 * - 'Coming Soon' notice for new updates
 * - Visual placeholder area for future app graphics
 * - Preserved and seamlessly integrated In-App OTA Update System
 */
@Composable
fun WelcomeScreen(
    otaStatus: UpdateStatus,
    onCheckForUpdates: () -> Unit,
    onOpenOtaSheet: () -> Unit,
    onDownloadUpdate: (UpdateInfo) -> Unit,
    onInstallApk: (File) -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

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

            Spacer(modifier = Modifier.height(20.dp))

            // ==========================================
            // 3. 'COMING SOON' NOTICE FOR NEW UPDATES
            // ==========================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .threeDCard(RoundedCornerShape(20.dp), elevation = 4.dp)
                    .border(
                        width = 1.2.dp,
                        brush = Brush.linearGradient(
                            listOf(
                                PrepGoldPro.copy(alpha = 0.7f),
                                PrepGreenBright.copy(alpha = 0.7f)
                            )
                        ),
                        shape = RoundedCornerShape(20.dp)
                    )
                    .padding(18.dp)
                    .testTag("coming_soon_notice_card")
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
                                    .background(PrepGoldPro.copy(alpha = 0.18f))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.RocketLaunch,
                                    contentDescription = null,
                                    tint = PrepGoldPro,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Coming Soon",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Major Update in Development",
                                    fontSize = 11.sp,
                                    color = PrepGoldPro
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(PrepGoldPro.copy(alpha = 0.15f))
                                .border(1.dp, PrepGoldPro.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                                .padding(horizontal = 9.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "v1.1.0",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                color = PrepGoldPro
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "नया अपडेट जल्द ही release किया जाएगा! नई डिज़ाइन, तेज़ परफॉर्मेंस और बेहतर फोकस टूल्स के साथ एक नया अनुभव आपके लिए तैयार किया जा रहा है।",
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        color = PrepTextSecondary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(PrepSurfaceVariant)
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            tint = PrepGreenBright,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Release Target: Ready Soon • In-App OTA Support Active",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = PrepTextPrimary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ===================================================
            // 4. PRESERVED IN-APP OTA UPDATE SYSTEM
            // ===================================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .threeDCard(RoundedCornerShape(20.dp), elevation = 3.dp)
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
                    .testTag("ota_update_system_card")
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
                                    .size(34.dp)
                                    .clip(CircleShape)
                                    .background(PrepGreenDark)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.SystemUpdate,
                                    contentDescription = "OTA System",
                                    tint = PrepGreenBright,
                                    modifier = Modifier.size(17.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "OTA Update System",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextPrimary
                                )
                                Text(
                                    text = "Current: v${BuildConfig.VERSION_NAME}",
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = PrepTextMuted
                                )
                            }
                        }

                        // Check Updates Button
                        Button(
                            onClick = onCheckForUpdates,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (PrepThemeState.isLight3D) Color(0xFF0F172A) else PrepSurfaceCard,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .height(38.dp)
                                .testTag("welcome_check_updates_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp),
                                tint = PrepGreenBright
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Check",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Dynamic status display if update is detected or downloading
                    when (val s = otaStatus) {
                        is UpdateStatus.Checking -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrepSurfaceVariant)
                                    .padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    strokeWidth = 2.dp,
                                    color = PrepGreenBright
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Checking for new releases...",
                                    fontSize = 11.sp,
                                    color = PrepTextPrimary
                                )
                            }
                        }

                        is UpdateStatus.UpdateAvailable -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrepGoldPro.copy(alpha = 0.12f))
                                    .border(1.dp, PrepGoldPro.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                                    .padding(10.dp)
                            ) {
                                Text(
                                    text = "New Update Available: ${s.updateInfo.versionName}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepGoldPro
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Button(
                                    onClick = { onDownloadUpdate(s.updateInfo) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = PrepGoldPro,
                                        contentColor = Color.Black
                                    ),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Download,
                                        contentDescription = null,
                                        modifier = Modifier.size(15.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Download ${s.updateInfo.versionName}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        is UpdateStatus.Downloading -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrepSurfaceVariant)
                                    .padding(10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Downloading update...",
                                        fontSize = 11.sp,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "${s.progressPercent}%",
                                        fontSize = 11.sp,
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
                            }
                        }

                        is UpdateStatus.ReadyToInstall -> {
                            Spacer(modifier = Modifier.height(10.dp))
                            Button(
                                onClick = { onInstallApk(s.apkFile) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = PrepGreenBright,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Install APK Update",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        else -> {
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { onOpenOtaSheet() }
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Auto-Sync Active • In-App Updater Ready",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )
                                Text(
                                    text = "Open Center >",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PrepGreenBright
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
