package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepRedAlert
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary
import com.example.ui.theme.threeDCard

@Composable
fun StrictSystemInfoDialog(
    isOpen: Boolean,
    initialStrict: Boolean = true,
    onConfirm: (isStrict: Boolean) -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    var isStrictSelected by remember(initialStrict) { mutableStateOf(initialStrict) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = PrepSurface,
        shape = RoundedCornerShape(20.dp),
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(if (isStrictSelected) Color(0xFF451A1A) else PrepGreenDark)
                ) {
                    Icon(
                        imageVector = if (isStrictSelected) Icons.Default.Lock else Icons.Default.Shield,
                        contentDescription = "Strict Shield",
                        tint = if (isStrictSelected) PrepRedAlert else PrepGreenBright,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "Strict System (सख्त मोड)",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrepTextPrimary
                    )
                    Text(
                        text = "कठोर अनुशासन व ऐप ब्लॉकिंग नियम",
                        fontSize = 11.sp,
                        color = PrepTextMuted
                    )
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Info Box explaining Strict System rules
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(PrepSurfaceCard)
                        .border(1.dp, Color(0xFF374151), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "Strict System क्या है और कैसे काम करता है?",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )

                        RuleBullet(
                            emoji = "🔒",
                            title = "अपरिवर्तनीय फोकस (No Bypass)",
                            desc = "शेड्यूल शुरू होने पर टाइमर को बीच में रोका या बंद नहीं किया जा सकता।"
                        )
                        RuleBullet(
                            emoji = "🚫",
                            title = "सख्त ऐप प्रतिबंध (Hard App Lock)",
                            desc = "चुने गए ऐप्स (YouTube Shorts, सोशल मीडिया) पूरी तरह ब्लॉक रहेंगे।"
                        )
                        RuleBullet(
                            emoji = "⚙️",
                            title = "एंटी-अनइंस्टॉल व सुरक्षा",
                            desc = "सत्र के दौरान ऐप बंद करना या सेटिंग्स बदलना प्रतिबंधित रहेगा।"
                        )
                        RuleBullet(
                            emoji = "☕",
                            title = "निर्धारित ब्रेक ही मिलेगा",
                            desc = "केवल तय ब्रेक समय में ही फोन का हल्का उपयोग संभव होगा।"
                        )
                    }
                }

                Text(
                    text = "क्या आप इस शेड्यूल के लिए Strict System लागू करना चाहते हैं?",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PrepTextPrimary
                )

                // Option 1: Enable Strict Mode
                val strictBorderColor by animateColorAsState(
                    targetValue = if (isStrictSelected) PrepRedAlert else Color(0xFF374151),
                    label = "strictBorder"
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isStrictSelected) Color(0xFF2A1515) else PrepSurfaceCard)
                        .border(1.5.dp, strictBorderColor, RoundedCornerShape(12.dp))
                        .clickable { isStrictSelected = true }
                        .padding(12.dp)
                        .testTag("option_strict_mode_enable")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Text(text = "🛡️", fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "हाँ, Strict System लागू करें",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isStrictSelected) PrepRedAlert else PrepTextPrimary
                                )
                                Text(
                                    text = "100% डीप फोकस गारंटी (नो डिस्ट्रैक्शन)",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                        if (isStrictSelected) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(PrepRedAlert)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Selected",
                                    tint = Color.White,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }
                }

                // Option 2: Standard Mode (Normal)
                val normalBorderColor by animateColorAsState(
                    targetValue = if (!isStrictSelected) PrepGreenBright else Color(0xFF374151),
                    label = "normalBorder"
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (!isStrictSelected) PrepGreenDark else PrepSurfaceCard)
                        .border(1.5.dp, normalBorderColor, RoundedCornerShape(12.dp))
                        .clickable { isStrictSelected = false }
                        .padding(12.dp)
                        .testTag("option_strict_mode_disable")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Text(text = "⚡", fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "नहीं, सामान्य मोड रखें",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (!isStrictSelected) PrepGreenBright else PrepTextPrimary
                                )
                                Text(
                                    text = "आवश्यकता पड़ने पर टाइमर पॉज करने की अनुमति",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                        if (!isStrictSelected) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(PrepGreenBright)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Selected",
                                    tint = Color.Black,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(if (isStrictSelected) PrepRedAlert else PrepGreenBright)
                    .clickable {
                        onConfirm(isStrictSelected)
                    }
                    .testTag("confirm_strict_system_dialog_button")
            ) {
                Text(
                    text = if (isStrictSelected) "Strict Mode के साथ शेड्यूल बनाएं" else "शेड्यूल बनाएं",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isStrictSelected) Color.White else Color.Black
                )
            }
        },
        dismissButton = {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
                    .clickable { onDismiss() }
                    .padding(vertical = 8.dp)
            ) {
                Text(
                    text = "रद्द करें (Cancel)",
                    fontSize = 13.sp,
                    color = PrepTextMuted
                )
            }
        }
    )
}

@Composable
private fun RuleBullet(
    emoji: String,
    title: String,
    desc: String
) {
    Row(
        verticalAlignment = Alignment.Top,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text = emoji, fontSize = 14.sp, modifier = Modifier.padding(top = 1.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrepTextPrimary
            )
            Text(
                text = desc,
                fontSize = 11.sp,
                color = PrepTextSecondary,
                lineHeight = 15.sp
            )
        }
    }
}
