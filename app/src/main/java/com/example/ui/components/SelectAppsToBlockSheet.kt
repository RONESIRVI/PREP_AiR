package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayCircleOutline
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.filled.Whatshot
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class BlockedAppsSelection(
    val blockYouTube: Boolean = true,
    val blockYouTubeShorts: Boolean = true,
    val blockYouTubeHomepage: Boolean = false,
    val blockDistractingChannels: Boolean = false,
    val blockBrowserApps: Boolean = true,
    val blockAdultContent: Boolean = true,
    val blockDistractingSites: Boolean = false,
    val selectedAppIds: Set<String> = setOf(
        "facebook", "angrybirds", "dainikbhaskar", "jiohotstar",
        "threads", "x", "primevideo", "amazon", "snapchat",
        "game2048", "reddit", "mygalaxy", "samsungshop"
    )
) {
    val totalCount: Int
        get() = selectedAppIds.size +
                (if (blockYouTube) 1 else 0) +
                (if (blockBrowserApps) 1 else 0)
}

data class DistractingAppItem(
    val id: String,
    val name: String,
    val brandType: BrandIconType,
    val category: String = "Distracting"
)

enum class BrandIconType {
    FACEBOOK,
    ANGRY_BIRDS,
    DAINIK_BHASKAR,
    JIO_HOTSTAR,
    THREADS,
    X,
    PRIME_VIDEO,
    AMAZON,
    SNAPCHAT,
    GAME_2048,
    REDDIT,
    MY_GALAXY,
    SAMSUNG_SHOP,
    INSTAGRAM
}

val DefaultDistractingApps = listOf(
    DistractingAppItem("facebook", "Facebook", BrandIconType.FACEBOOK),
    DistractingAppItem("angrybirds", "Angry Birds 2", BrandIconType.ANGRY_BIRDS),
    DistractingAppItem("dainikbhaskar", "Dainik Bhaskar", BrandIconType.DAINIK_BHASKAR),
    DistractingAppItem("jiohotstar", "JioHotstar", BrandIconType.JIO_HOTSTAR),
    DistractingAppItem("threads", "Threads", BrandIconType.THREADS),
    DistractingAppItem("x", "X", BrandIconType.X),
    DistractingAppItem("primevideo", "Prime Video", BrandIconType.PRIME_VIDEO),
    DistractingAppItem("amazon", "Amazon", BrandIconType.AMAZON),
    DistractingAppItem("snapchat", "Snapchat", BrandIconType.SNAPCHAT),
    DistractingAppItem("game2048", "2048", BrandIconType.GAME_2048),
    DistractingAppItem("reddit", "Reddit", BrandIconType.REDDIT),
    DistractingAppItem("mygalaxy", "My Galaxy", BrandIconType.MY_GALAXY),
    DistractingAppItem("samsungshop", "Samsung Shop", BrandIconType.SAMSUNG_SHOP),
    DistractingAppItem("instagram", "Instagram", BrandIconType.INSTAGRAM)
)

private val SheetBgColor = Color(0xFF161718)
private val SearchBarBg = Color(0xFF232426)
private val CardBg = Color(0xFF1C1D1F)
private val GreenToggleColor = Color(0xFF22C55E)
private val TextWhite = Color(0xFFF3F4F6)
private val TextMuted = Color(0xFF9CA3AF)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectAppsToBlockSheet(
    isOpen: Boolean,
    initialSelection: BlockedAppsSelection = BlockedAppsSelection(),
    onApplySelection: (BlockedAppsSelection) -> Unit,
    onDismiss: () -> Unit
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selection by remember(initialSelection) { mutableStateOf(initialSelection) }
    var searchQuery by remember { mutableStateOf("") }
    var isDistractingExpanded by remember { mutableStateOf(true) }

    val filteredApps = remember(searchQuery) {
        if (searchQuery.isBlank()) {
            DefaultDistractingApps
        } else {
            DefaultDistractingApps.filter {
                it.name.contains(searchQuery.trim(), ignoreCase = true)
            }
        }
    }

    ModalBottomSheet(
        onDismissRequest = {
            onApplySelection(selection)
            onDismiss()
        },
        sheetState = sheetState,
        containerColor = SheetBgColor,
        contentColor = TextWhite,
        dragHandle = null,
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
        modifier = Modifier.testTag("select_apps_to_block_sheet")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.92f)
                .padding(top = 16.dp)
        ) {
            // Header: Title & Close 'X'
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Select Apps to Block",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite,
                    modifier = Modifier.testTag("sheet_title_text")
                )

                IconButton(
                    onClick = {
                        onApplySelection(selection)
                        onDismiss()
                    },
                    modifier = Modifier
                        .size(36.dp)
                        .testTag("sheet_close_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextWhite,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Search Bar (Matching screenshot)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(SearchBarBg)
                    .padding(horizontal = 14.dp, vertical = 12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = TextMuted,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    androidx.compose.foundation.text.BasicTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        singleLine = true,
                        textStyle = TextStyle(
                            color = TextWhite,
                            fontSize = 14.sp
                        ),
                        decorationBox = { innerTextField ->
                            if (searchQuery.isEmpty()) {
                                Text(
                                    text = "Search apps",
                                    fontSize = 14.sp,
                                    color = TextMuted
                                )
                            }
                            innerTextField()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("search_apps_input")
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Scrollable Content
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 1. YouTube Section (Matching screenshot)
                if (searchQuery.isBlank() || "youtube".contains(searchQuery, ignoreCase = true)) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(CardBg)
                                .padding(14.dp)
                        ) {
                            // Main YouTube Row
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    YouTubeBrandIcon()
                                    Spacer(modifier = Modifier.width(14.dp))
                                    Text(
                                        text = "YouTube",
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = TextWhite
                                    )
                                }
                                GreenSwitch(
                                    checked = selection.blockYouTube,
                                    onCheckedChange = { isChecked ->
                                        selection = selection.copy(
                                            blockYouTube = isChecked,
                                            blockYouTubeShorts = if (isChecked) selection.blockYouTubeShorts else false
                                        )
                                    }
                                )
                            }

                            // Sub-options (Indent matching screenshot)
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(start = 12.dp, top = 10.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                SubOptionRow(
                                    icon = Icons.Default.Whatshot,
                                    label = "Block Shorts",
                                    checked = selection.blockYouTubeShorts,
                                    onCheckedChange = {
                                        selection = selection.copy(blockYouTubeShorts = it)
                                    }
                                )
                                SubOptionRow(
                                    icon = Icons.Default.Home,
                                    label = "Block homepage",
                                    checked = selection.blockYouTubeHomepage,
                                    onCheckedChange = {
                                        selection = selection.copy(blockYouTubeHomepage = it)
                                    }
                                )
                                SubOptionRow(
                                    icon = Icons.Default.PlayCircleOutline,
                                    label = "Block distracting channels",
                                    subtitle = "0 channels allowed >",
                                    checked = selection.blockDistractingChannels,
                                    onCheckedChange = {
                                        selection = selection.copy(blockDistractingChannels = it)
                                    }
                                )
                            }
                        }
                    }
                }

                // 2. Browser Apps Section (Matching screenshot)
                if (searchQuery.isBlank() || "browser".contains(searchQuery, ignoreCase = true) || "chrome".contains(searchQuery, ignoreCase = true)) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(CardBg)
                                .padding(14.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    BrowserChromeBrandIcon()
                                    Spacer(modifier = Modifier.width(14.dp))
                                    Column {
                                        Text(
                                            text = "Browser apps",
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = TextWhite
                                        )
                                        Text(
                                            text = if (selection.blockBrowserApps) "Blocked completely" else "Allowed",
                                            fontSize = 11.sp,
                                            color = TextMuted
                                        )
                                    }
                                }
                                GreenSwitch(
                                    checked = selection.blockBrowserApps,
                                    onCheckedChange = { isChecked ->
                                        selection = selection.copy(blockBrowserApps = isChecked)
                                    }
                                )
                            }

                            // Sub-options
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(start = 12.dp, top = 10.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                SubOptionRow(
                                    icon = Icons.Default.VisibilityOff,
                                    label = "Block adult content",
                                    checked = selection.blockAdultContent,
                                    onCheckedChange = {
                                        selection = selection.copy(blockAdultContent = it)
                                    }
                                )
                                SubOptionRow(
                                    icon = Icons.Default.Language,
                                    label = "Block distracting sites",
                                    subtitle = "0 websites allowed >",
                                    checked = selection.blockDistractingSites,
                                    onCheckedChange = {
                                        selection = selection.copy(blockDistractingSites = it)
                                    }
                                )
                            }
                        }
                    }
                }

                // 3. Distracting Apps Section (Collapsible & Matching screenshot)
                item {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .clickable { isDistractingExpanded = !isDistractingExpanded }
                            .padding(vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = if (isDistractingExpanded) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowUp,
                                contentDescription = "Toggle Section",
                                tint = TextWhite,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Distracting",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TextWhite
                            )
                        }

                        // Master Toggle for Distracting Apps
                        val allDistractingSelected = filteredApps.all { selection.selectedAppIds.contains(it.id) }
                        GreenSwitch(
                            checked = allDistractingSelected && filteredApps.isNotEmpty(),
                            onCheckedChange = { enableAll ->
                                val newIds = selection.selectedAppIds.toMutableSet()
                                if (enableAll) {
                                    filteredApps.forEach { newIds.add(it.id) }
                                } else {
                                    filteredApps.forEach { newIds.remove(it.id) }
                                }
                                selection = selection.copy(selectedAppIds = newIds)
                            }
                        )
                    }
                }

                // Distracting App List Items
                if (isDistractingExpanded) {
                    items(filteredApps, key = { it.id }) { app ->
                        val isBlocked = selection.selectedAppIds.contains(app.id)
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                RenderBrandIcon(app.brandType)
                                Spacer(modifier = Modifier.width(14.dp))
                                Text(
                                    text = app.name,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = TextWhite
                                )
                            }

                            GreenSwitch(
                                checked = isBlocked,
                                onCheckedChange = { checked ->
                                    val newIds = selection.selectedAppIds.toMutableSet()
                                    if (checked) {
                                        newIds.add(app.id)
                                    } else {
                                        newIds.remove(app.id)
                                    }
                                    selection = selection.copy(selectedAppIds = newIds)
                                }
                            )
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }

            // Bottom Confirmation Button
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .clip(RoundedCornerShape(25.dp))
                        .background(Color.White)
                        .clickable {
                            onApplySelection(selection)
                            onDismiss()
                        }
                        .testTag("confirm_blocked_apps_button")
                ) {
                    Text(
                        text = "Save Selection (${selection.totalCount} Blocked)",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
            }
        }
    }
}

@Composable
fun SubOptionRow(
    icon: ImageVector,
    label: String,
    subtitle: String? = null,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = TextMuted,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = label,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Normal,
                    color = TextWhite
                )
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        fontSize = 11.sp,
                        color = TextMuted
                    )
                }
            }
        }
        GreenSwitch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}

@Composable
fun GreenSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Switch(
        checked = checked,
        onCheckedChange = onCheckedChange,
        colors = SwitchDefaults.colors(
            checkedThumbColor = Color.White,
            checkedTrackColor = GreenToggleColor,
            uncheckedThumbColor = Color(0xFF6B7280),
            uncheckedTrackColor = Color(0xFF374151),
            uncheckedBorderColor = Color.Transparent,
            checkedBorderColor = Color.Transparent
        ),
        modifier = Modifier.testTag("green_switch")
    )
}

// --- Brand Icon Renderers (Pixel-Accurate for Offline Reliability) ---

@Composable
fun YouTubeBrandIcon(modifier: Modifier = Modifier) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(36.dp)
            .clip(CircleShape)
            .background(Color(0xFFFF0000))
    ) {
        Canvas(modifier = Modifier.size(14.dp)) {
            val path = Path().apply {
                moveTo(size.width * 0.25f, size.height * 0.15f)
                lineTo(size.width * 0.85f, size.height * 0.5f)
                lineTo(size.width * 0.25f, size.height * 0.85f)
                close()
            }
            drawPath(path, Color.White, style = Fill)
        }
    }
}

@Composable
fun BrowserChromeBrandIcon(modifier: Modifier = Modifier) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(36.dp)
            .clip(CircleShape)
            .background(Color.White)
    ) {
        Canvas(modifier = Modifier.size(36.dp)) {
            // Draw Chrome segmented tri-color ring
            drawCircle(Color(0xFFEA4335), radius = size.minDimension / 2) // Red
            drawCircle(Color(0xFFFBBC05), radius = size.minDimension / 2.3f) // Yellow
            drawCircle(Color(0xFF34A853), radius = size.minDimension / 2.7f) // Green
            drawCircle(Color.White, radius = size.minDimension / 3.4f)
            drawCircle(Color(0xFF4285F4), radius = size.minDimension / 4.4f) // Blue center
        }
    }
}

@Composable
fun RenderBrandIcon(type: BrandIconType) {
    when (type) {
        BrandIconType.FACEBOOK -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1877F2))
            ) {
                Text(
                    text = "f",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
        BrandIconType.ANGRY_BIRDS -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE53935))
            ) {
                Text(text = "🐦", fontSize = 18.sp)
            }
        }
        BrandIconType.DAINIK_BHASKAR -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color.White)
                    .border(1.dp, Color(0xFFE5E7EB), CircleShape)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "दैनिक", fontSize = 7.sp, fontWeight = FontWeight.Black, color = Color.Black)
                    Text(text = "भास्कर", fontSize = 7.sp, fontWeight = FontWeight.Black, color = Color(0xFFEA580C))
                }
            }
        }
        BrandIconType.JIO_HOTSTAR -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF0F1026), Color(0xFF1E3A8A), Color(0xFF9333EA))
                        )
                    )
            ) {
                Text(text = "✦", fontSize = 20.sp, color = Color(0xFFFDE047), fontWeight = FontWeight.Bold)
            }
        }
        BrandIconType.THREADS -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color.Black)
                    .border(1.dp, Color(0xFF333333), CircleShape)
            ) {
                Text(text = "@", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        BrandIconType.X -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color.Black)
                    .border(1.dp, Color(0xFF333333), CircleShape)
            ) {
                Text(text = "𝕏", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        BrandIconType.PRIME_VIDEO -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF00A8E1))
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "prime", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(text = "video", fontSize = 6.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                }
            }
        }
        BrandIconType.AMAZON -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF232F3E))
            ) {
                Text(text = "a", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFF9900))
            }
        }
        BrandIconType.SNAPCHAT -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFFFFC00))
            ) {
                Text(text = "👻", fontSize = 18.sp)
            }
        }
        BrandIconType.GAME_2048 -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFEDC22E))
            ) {
                Text(text = "2048", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Color.White)
            }
        }
        BrandIconType.REDDIT -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFFF4500))
            ) {
                Text(text = "👽", fontSize = 18.sp)
            }
        }
        BrandIconType.MY_GALAXY -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF8B5CF6))
            ) {
                Text(text = "🌌", fontSize = 18.sp)
            }
        }
        BrandIconType.SAMSUNG_SHOP -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF0284C7))
            ) {
                Text(text = "🛍️", fontSize = 16.sp)
            }
        }
        BrandIconType.INSTAGRAM -> {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF833AB4), Color(0xFFFD1D1D), Color(0xFFFCB045))
                        )
                    )
            ) {
                Text(text = "📷", fontSize = 16.sp)
            }
        }
    }
}
