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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary

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
            .padding(horizontal = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        days.forEachIndexed { index, day ->
            val isSelected = selectedDayIndex == index

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        if (isSelected) PrepGreenDark else PrepSurfaceCard
                    )
                    .border(
                        width = 1.dp,
                        color = if (isSelected) PrepGreenBright else PrepCardBorder,
                        shape = RoundedCornerShape(16.dp)
                    )
                    .clickable { onDaySelected(index) }
                    .padding(vertical = 10.dp, horizontal = 12.dp)
            ) {
                Text(
                    text = day.dayLetter,
                    fontSize = 11.sp,
                    color = if (isSelected) PrepGreenBright else PrepTextMuted,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = day.dayNumber.toString(),
                    fontSize = 15.sp,
                    color = if (isSelected) Color.White else PrepTextPrimary,
                    fontWeight = FontWeight.Bold
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
