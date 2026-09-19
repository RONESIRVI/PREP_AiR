package com.example.ui.components

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary

data class FocusTrack(
    val id: String,
    val title: String,
    val iconEmoji: String,
    val description: String,
    val frequencyHz: String
)

val focusTracksList = listOf(
    FocusTrack("brown", "Brown Noise", "🌊", "Deep soothing rumble for uninterrupted immersion", "Deep waterfall"),
    FocusTrack("white", "White Noise", "📻", "Broad spectrum sound mask for study rooms", "Equal energy"),
    FocusTrack("binaural", "Binaural Beats", "🧠", "Alpha 40Hz waves stimulating cognitive focus", "40 Hz Alpha"),
    FocusTrack("pink", "Pink Noise", "🌧️", "Gentle rain frequency scientifically tested for memory", "1/f noise"),
    FocusTrack("birds", "Binaural Birds", "🌲", "Atmospheric woodland soundscape for calm pacing", "Field recording")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FocusMusicPlayerSheet(
    isOpen: Boolean,
    isPlaying: Boolean,
    selectedTrackId: String,
    volume: Float,
    onTrackSelect: (String) -> Unit,
    onPlayPauseToggle: () -> Unit,
    onVolumeChange: (Float) -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = PrepSurface,
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(vertical = 10.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .background(PrepCardBorder, RoundedCornerShape(2.dp))
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Focus Audio Player",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrepTextPrimary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .background(PrepGoldPro.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "PRO SOUNDS",
                                color = PrepGoldPro,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    Text(
                        text = "Science-backed acoustics engineered to prevent mind wandering",
                        fontSize = 12.sp,
                        color = PrepTextMuted
                    )
                }

                IconButton(
                    onClick = onPlayPauseToggle,
                    modifier = Modifier
                        .size(48.dp)
                        .background(PrepGreenBright, CircleShape)
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Track list selection
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(focusTracksList) { track ->
                    val isSelected = track.id == selectedTrackId

                    Column(
                        modifier = Modifier
                            .width(130.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) PrepGreenDark else PrepSurfaceCard)
                            .border(
                                1.dp,
                                if (isSelected) PrepGreenBright else PrepCardBorder,
                                RoundedCornerShape(12.dp)
                            )
                            .clickable {
                                onTrackSelect(track.id)
                            }
                            .padding(12.dp)
                    ) {
                        Text(text = track.iconEmoji, fontSize = 24.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = track.title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) PrepGreenBright else PrepTextPrimary
                        )
                        Text(
                            text = track.frequencyHz,
                            fontSize = 11.sp,
                            color = PrepTextMuted
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Sound Description Card
            val activeTrack = focusTracksList.find { it.id == selectedTrackId } ?: focusTracksList.first()
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PrepSurfaceCard, RoundedCornerShape(12.dp))
                    .border(1.dp, PrepCardBorder, RoundedCornerShape(12.dp))
                    .padding(14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.GraphicEq,
                        contentDescription = "Sound Wave",
                        tint = PrepGreenBright,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Now Playing: ${activeTrack.title}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PrepTextPrimary
                        )
                        Text(
                            text = activeTrack.description,
                            fontSize = 12.sp,
                            color = PrepTextMuted
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Volume Slider
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.VolumeUp,
                    contentDescription = "Volume",
                    tint = PrepTextMuted,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Slider(
                    value = volume,
                    onValueChange = onVolumeChange,
                    valueRange = 0f..1f,
                    colors = SliderDefaults.colors(
                        thumbColor = PrepGreenBright,
                        activeTrackColor = PrepGreenBright,
                        inactiveTrackColor = PrepCardBorder
                    ),
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "${(volume * 100).toInt()}%",
                    fontSize = 12.sp,
                    color = PrepTextMuted,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
