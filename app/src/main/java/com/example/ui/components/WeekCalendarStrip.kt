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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepGreenPrimary
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepThemeState
import com.example.ui.theme.threeDCard
import com.example.ui.theme.threeDWell

data class DayItem(
    val dayLetter: String,
    val dayNumber: Int,
    val hasCompletedFocus: Boolean = false,
    val isToday: Boolean = false
)

@Composable
fun WeekCalendarStrip(
    selectedDayIndex: Int,
    onDaySelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val isLight = PrepThemeState.isLight3D
    val days = listOf(
        DayItem("M", 15, hasCompletedFocus = true),
        DayItem("T", 16, hasCompletedFocus = true),
        DayItem("W", 17, hasCompletedFocus = true),
        DayItem("T", 18, hasCompletedFocus = true),
        DayItem("F", 19, hasCompletedFocus = true, isToday = true),
        DayItem("S", 20, hasCompletedFocus = false),
        DayItem("S", 21, hasCompletedFocus = false)
    )

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        days.forEachIndexed { index, day ->
            val isSelected = selectedDayIndex == index

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .then(
                        if (isSelected) {
                            Modifier
                                .shadow(
                                    elevation = 4.dp,
                                    shape = RoundedCornerShape(16.dp),
                                    spotColor = if (isLight) Color(0x350D2A18) else PrepGreenBright.copy(alpha = 0.5f)
                                )
                                .clip(RoundedCornerShape(16.dp))
                                .background(
                                    if (isLight) Color.White else PrepGreenDark
                                )
                                .border(
                                    width = 1.5.dp,
                                    color = if (isLight) Color(0xFF10B981) else PrepGreenBright,
                                    shape = RoundedCornerShape(16.dp)
                                )
                        } else {
                            Modifier
                                .threeDCard(RoundedCornerShape(16.dp), elevation = 1.5.dp)
                        }
                    )
                    .clickable { onDaySelected(index) }
                    .padding(vertical = 10.dp, horizontal = 11.dp)
            ) {
                Text(
                    text = day.dayLetter,
                    fontSize = 11.sp,
                    color = if (isSelected) PrepGreenBright else PrepTextMuted,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = day.dayNumber.toString(),
                    fontSize = 15.sp,
                    color = if (isSelected) {
                        if (isLight) PrepGreenPrimary else Color.White
                    } else PrepTextPrimary,
                    fontWeight = FontWeight.Black
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Streak dot indicator
                Box(
                    modifier = Modifier
                        .size(5.dp)
                        .background(
                            color = when {
                                day.hasCompletedFocus -> PrepGreenBright
                                day.isToday -> PrepGreenBright.copy(alpha = 0.5f)
                                else -> Color.Transparent
                            },
                            shape = CircleShape
                        )
                )
            }
        }
    }
}
