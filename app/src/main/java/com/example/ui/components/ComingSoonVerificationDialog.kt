package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
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

@Composable
fun ComingSoonVerificationDialog(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    onCheckOta: () -> Unit
) {
    if (!isOpen) return

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(24.dp))
                .background(
                    if (PrepThemeState.isLight3D) Color(0xFFFFFFFF) else PrepSurfaceCard
                )
                .border(
                    width = 1.5.dp,
                    brush = Brush.linearGradient(
                        listOf(
                            PrepGoldPro,
                            PrepGreenBright,
                            PrepGoldPro
                        )
                    ),
                    shape = RoundedCornerShape(24.dp)
                )
                .shadow(16.dp, RoundedCornerShape(24.dp))
                .padding(22.dp)
                .testTag("coming_soon_verification_popup")
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Top row with close button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(PrepGoldPro.copy(alpha = 0.18f))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = null,
                                tint = PrepGoldPro,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "COMING SOON VERIFICATION",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.6.sp,
                            color = PrepGoldPro
                        )
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(PrepSurfaceVariant)
                            .testTag("close_verification_popup_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = PrepTextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Emblem
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(68.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.sweepGradient(
                                listOf(
                                    PrepGoldPro.copy(alpha = 0.25f),
                                    PrepGreenBright.copy(alpha = 0.25f),
                                    PrepGoldPro.copy(alpha = 0.25f)
                                )
                            )
                        )
                        .border(
                            2.dp,
                            Brush.linearGradient(listOf(PrepGoldPro, PrepGreenBright)),
                            CircleShape
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.RocketLaunch,
                        contentDescription = "New Release",
                        tint = PrepGoldPro,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "🚀 नया अपडेट जल्द ही Release होगा!",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "PREP_AiR v1.1.0 की फाइनल टेस्टिंग और वेरिफिकेशन प्रक्रिया सफलतापूर्वक पूरी हो रही है।",
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                    color = PrepTextSecondary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Verification Checklist
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(PrepSurfaceVariant)
                        .padding(14.dp)
                ) {
                    VerificationItem(
                        label = "New Supercharged Engine",
                        status = "Verified 100%"
                    )
                    VerificationItem(
                        label = "Strict Mode & Apps Blocker",
                        status = "Verified Ready"
                    )
                    VerificationItem(
                        label = "In-App OTA Auto-Updater",
                        status = "Active & Verified"
                    )
                    VerificationItem(
                        label = "Release Target",
                        status = "v1.1.0 Upcoming"
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Action buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = {
                            onDismiss()
                            onCheckOta()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PrepGoldPro,
                            contentColor = Color.Black
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("popup_check_ota_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Check Updates",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PrepGreenDark,
                            contentColor = PrepGreenBright
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(0.9f)
                            .height(44.dp)
                            .testTag("popup_dismiss_button")
                    ) {
                        Text(
                            text = "समझ गया (OK)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun VerificationItem(
    label: String,
    status: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.CheckCircle,
                contentDescription = null,
                tint = PrepGreenBright,
                modifier = Modifier.size(14.dp)
            )
            Spacer(modifier = Modifier.width(7.dp))
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrepTextPrimary
            )
        }
        Text(
            text = status,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace,
            color = PrepGreenBright
        )
    }
}
