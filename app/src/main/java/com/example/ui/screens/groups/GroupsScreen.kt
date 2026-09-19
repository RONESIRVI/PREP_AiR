package com.example.ui.screens.groups

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.entity.GroupEntity
import com.example.ui.theme.PrepBlueAccent
import com.example.ui.theme.PrepCardBorder
import com.example.ui.theme.PrepGoldPro
import com.example.ui.theme.PrepGreenBright
import com.example.ui.theme.PrepGreenDark
import com.example.ui.theme.PrepSurface
import com.example.ui.theme.PrepSurfaceCard
import com.example.ui.theme.PrepSurfaceVariant
import com.example.ui.theme.PrepTextMuted
import com.example.ui.theme.PrepTextPrimary
import com.example.ui.theme.PrepTextSecondary

data class LeaderboardMember(
    val rank: Int,
    val name: String,
    val avatarEmoji: String,
    val focusHours: Float,
    val streakDays: Int,
    val isMe: Boolean = false
)

@Composable
fun GroupsScreen(
    groups: List<GroupEntity>,
    onJoinGroupWithCode: (String) -> Unit,
    onCreateGroup: (GroupEntity) -> Unit,
    modifier: Modifier = Modifier
) {
    var showJoinDialog by remember { mutableStateOf(false) }
    var showCreateDialog by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableStateOf(0) } // 0 = Leaderboard, 1 = My Groups

    val sampleLeaderboard = listOf(
        LeaderboardMember(1, "Aariz (You)", "⚡", 48.5f, 14, isMe = true),
        LeaderboardMember(2, "Rohan K.", "🦁", 46.2f, 12),
        LeaderboardMember(3, "Sneha P.", "🦉", 42.0f, 9),
        LeaderboardMember(4, "Vikram S.", "🦅", 38.5f, 8),
        LeaderboardMember(5, "Ananya D.", "🌿", 35.0f, 11)
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 8.dp)
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column {
                Text(
                    text = "Study Groups",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
                Text(
                    text = "Peer accountability & competitive focus ranks",
                    fontSize = 12.sp,
                    color = PrepTextMuted
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { showJoinDialog = true },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrepSurfaceCard,
                        contentColor = PrepGreenBright
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Icon(imageVector = Icons.Default.QrCode, contentDescription = "Join", modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Join", fontSize = 12.sp)
                }

                Button(
                    onClick = { showCreateDialog = true },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrepGreenBright,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = "Create", modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "New", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Sub-tabs (Leaderboard vs My Groups)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(PrepSurfaceCard, RoundedCornerShape(12.dp))
                .padding(4.dp)
        ) {
            listOf("Group Leaderboard", "Active Squads").forEachIndexed { index, title ->
                val isSelected = selectedTab == index
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) PrepGreenDark else Color.Transparent)
                        .clickable { selectedTab = index }
                        .padding(vertical = 8.dp)
                ) {
                    Text(
                        text = title,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) PrepGreenBright else PrepTextMuted
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (selectedTab == 0) {
            // Leaderboard view
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    // Top 1 Podium highlight
                    val topLeader = sampleLeaderboard.first()
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFF1F2B1A))
                            .border(1.dp, PrepGoldPro.copy(alpha = 0.6f), RoundedCornerShape(14.dp))
                            .padding(16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    contentAlignment = Alignment.Center,
                                    modifier = Modifier
                                        .size(44.dp)
                                        .background(PrepGoldPro.copy(alpha = 0.2f), CircleShape)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.EmojiEvents,
                                        contentDescription = "Rank 1",
                                        tint = PrepGoldPro,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "Rank #1 • ${topLeader.name}",
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PrepTextPrimary
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Box(
                                            modifier = Modifier
                                                .background(PrepGreenBright.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                                .padding(horizontal = 5.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "YOU",
                                                color = PrepGreenBright,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                    Text(
                                        text = "${topLeader.streakDays} Day Study Streak 🔥",
                                        fontSize = 12.sp,
                                        color = PrepGoldPro
                                    )
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "${topLeader.focusHours} hrs",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = PrepGreenBright
                                )
                                Text(
                                    text = "This Week",
                                    fontSize = 10.sp,
                                    color = PrepTextMuted
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }

                items(sampleLeaderboard.drop(1)) { member ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(PrepSurfaceCard)
                            .border(1.dp, PrepCardBorder, RoundedCornerShape(12.dp))
                            .padding(12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "#${member.rank}",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepTextMuted,
                                    modifier = Modifier.width(28.dp)
                                )
                                Text(text = member.avatarEmoji, fontSize = 22.sp)
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = member.name,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PrepTextPrimary
                                    )
                                    Text(
                                        text = "${member.streakDays} days streak",
                                        fontSize = 11.sp,
                                        color = PrepTextMuted
                                    )
                                }
                            }

                            Text(
                                text = "${member.focusHours}h",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrepTextPrimary
                            )
                        }
                    }
                }
            }
        } else {
            // My Groups List view
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(groups) { group ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(PrepSurfaceCard)
                            .border(1.dp, PrepCardBorder, RoundedCornerShape(14.dp))
                            .padding(14.dp)
                    ) {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Group,
                                        contentDescription = null,
                                        tint = PrepGreenBright,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = group.name,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PrepTextPrimary
                                    )
                                }

                                Box(
                                    modifier = Modifier
                                        .background(PrepSurfaceVariant, RoundedCornerShape(6.dp))
                                        .padding(horizontal = 8.dp, vertical = 3.dp)
                                ) {
                                    Text(
                                        text = group.code,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Monospace,
                                        color = PrepBlueAccent
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = group.description,
                                fontSize = 12.sp,
                                color = PrepTextSecondary,
                                lineHeight = 16.sp
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "👥 ${group.memberCount} members • My Rank: #${group.myRank}",
                                    fontSize = 11.sp,
                                    color = PrepTextMuted
                                )

                                Text(
                                    text = "${group.totalHours} Total Hours",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PrepGreenBright
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Join Group Dialog
    if (showJoinDialog) {
        var inviteCode by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showJoinDialog = false },
            containerColor = PrepSurface,
            title = {
                Text(
                    text = "Join Group via Code",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
            },
            text = {
                Column {
                    Text(
                        text = "Enter the 8-character invite code provided by your study group admin.",
                        fontSize = 12.sp,
                        color = PrepTextMuted
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = inviteCode,
                        onValueChange = { inviteCode = it.uppercase() },
                        placeholder = { Text("e.g. AIR-2026") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrepGreenBright,
                            unfocusedBorderColor = PrepCardBorder,
                            focusedTextColor = PrepTextPrimary,
                            unfocusedTextColor = PrepTextPrimary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (inviteCode.isNotBlank()) {
                            onJoinGroupWithCode(inviteCode.trim())
                            showJoinDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrepGreenBright,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Join Group", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                OutlinedButton(
                    onClick = { showJoinDialog = false },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrepTextMuted),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Cancel")
                }
            }
        )
    }

    // Create Group Dialog
    if (showCreateDialog) {
        var groupName by remember { mutableStateOf("") }
        var groupGoal by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            containerColor = PrepSurface,
            title = {
                Text(
                    text = "Create Study Squad",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrepTextPrimary
                )
            },
            text = {
                Column {
                    OutlinedTextField(
                        value = groupName,
                        onValueChange = { groupName = it },
                        label = { Text("Group Name (e.g. UPSC Prelims Focus)") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrepGreenBright,
                            unfocusedBorderColor = PrepCardBorder,
                            focusedTextColor = PrepTextPrimary,
                            unfocusedTextColor = PrepTextPrimary,
                            focusedLabelColor = PrepGreenBright,
                            unfocusedLabelColor = PrepTextMuted
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = groupGoal,
                        onValueChange = { groupGoal = it },
                        label = { Text("Group Target / Mission") },
                        placeholder = { Text("e.g. 6 hours daily deep revision") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrepGreenBright,
                            unfocusedBorderColor = PrepCardBorder,
                            focusedTextColor = PrepTextPrimary,
                            unfocusedTextColor = PrepTextPrimary,
                            focusedLabelColor = PrepGreenBright,
                            unfocusedLabelColor = PrepTextMuted
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (groupName.isNotBlank()) {
                            val randomCode = "AIR-${(1000..9999).random()}"
                            onCreateGroup(
                                GroupEntity(
                                    name = groupName.trim(),
                                    code = randomCode,
                                    description = groupGoal.ifBlank { "Daily study consistency squad" },
                                    memberCount = 1,
                                    totalHours = 0f,
                                    myRank = 1,
                                    joined = true
                                )
                            )
                            showCreateDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrepGreenBright,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Create", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                OutlinedButton(
                    onClick = { showCreateDialog = false },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrepTextMuted),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Cancel")
                }
            }
        )
    }
}
