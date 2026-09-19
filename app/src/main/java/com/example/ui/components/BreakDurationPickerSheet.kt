package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val SheetBgColor = Color(0xFF141516)
private val TextWhite = Color(0xFFF3F4F6)
private val TextMuted = Color(0xFF6B7280)
private val ActiveCapsuleBg = Color(0xFF253B23)
private val ActiveCapsuleBorder = Color(0xFF3B5D37)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BreakDurationPickerSheet(
    isOpen: Boolean,
    initialMinutes: Int = 10,
    onConfirm: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedMins by remember(initialMinutes) { mutableIntStateOf(initialMinutes.coerceIn(1, 30)) }
    val minutesRange = remember { (1..30).toList() }
    val listState = rememberLazyListState()

    // Auto-scroll to selected value
    LaunchedEffect(selectedMins) {
        val targetIndex = (selectedMins - 1 - 2).coerceAtLeast(0)
        listState.animateScrollToItem(targetIndex)
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SheetBgColor,
        dragHandle = {
            // Drag handle pill
            Box(
                modifier = Modifier
                    .padding(top = 10.dp, bottom = 12.dp)
                    .width(36.dp)
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(Color(0xFF4B5563))
            )
        },
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        modifier = Modifier.testTag("break_duration_picker_sheet")
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(bottom = 32.dp)
        ) {
            // Title
            Text(
                text = "Set break duration (1-30 minutes).",
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = TextWhite,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(vertical = 12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Wheel / Scrollable Numbers
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
            ) {
                LazyColumn(
                    state = listState,
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(minutesRange) { mins ->
                        val isSelected = mins == selectedMins
                        if (isSelected) {
                            // Olive green highlight capsule (matching screenshot)
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(ActiveCapsuleBg)
                                    .border(1.dp, ActiveCapsuleBorder, RoundedCornerShape(12.dp))
                                    .clickable { selectedMins = mins }
                                    .testTag("selected_break_duration_pill")
                            ) {
                                Text(
                                    text = "$mins  mins",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        } else {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(38.dp)
                                    .clickable { selectedMins = mins }
                            ) {
                                Text(
                                    text = "$mins",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Normal,
                                    color = TextMuted
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // White "Confirm" pill button (matching screenshot)
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .clip(RoundedCornerShape(30.dp))
                    .background(Color.White)
                    .clickable {
                        onConfirm(selectedMins)
                    }
                    .testTag("confirm_break_duration_button")
            ) {
                Text(
                    text = "Confirm",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
        }
    }
}
