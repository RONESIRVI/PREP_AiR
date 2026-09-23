package com.sadhna.focus.ui.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
// import com.sadhna.focus.ui.blocks.BlocksScreen
// import com.sadhna.focus.ui.focus.FocusScreen
// import com.sadhna.focus.ui.groups.GroupsScreen
// import com.sadhna.focus.ui.planner.PlannerScreen
import com.sadhna.focus.ui.theme.PoppinsFamily

// ── Route constants ────────────────────────────────────────────────────────
object Routes {
    const val FOCUS   = "focus"
    const val PLANNER = "planner"
    const val GROUPS  = "groups"
    const val BLOCKS  = "blocks"
}

// ── Bottom nav item definition ─────────────────────────────────────────────
data class NavItem(
    val route: String,
    val emoji: String,
    val label: String,
)

val navItems = listOf(
    NavItem(Routes.FOCUS,   "⏳", "Focus"),
    NavItem(Routes.PLANNER, "📅", "Planner"),
    NavItem(Routes.GROUPS,  "👥", "Groups"),
    NavItem(Routes.BLOCKS,  "🚫", "Blocks"),
)

// ═══════════════════════════════════════════════════════════════════════════
//  SADHNA APP — Root scaffold with NavHost + bottom nav
// ═══════════════════════════════════════════════════════════════════════════
@Composable
fun SadhnaApp() {
    val navController = rememberNavController()

    Scaffold(
        containerColor = Color(0xFF08070C),
        bottomBar = {
            SadhnaBottomBar(navController = navController)
        }
    ) { innerPadding ->
        NavHost(
            navController      = navController,
            startDestination   = Routes.FOCUS,
            modifier           = Modifier.padding(innerPadding),
            enterTransition    = { fadeIn(tween(200)) },
            exitTransition     = { fadeOut(tween(200)) },
            popEnterTransition = { fadeIn(tween(200)) },
            popExitTransition  = { fadeOut(tween(200)) },
        ) {
            composable(Routes.FOCUS)   { FocusScreen() }
            composable(Routes.PLANNER) { PlannerScreen() }
            composable(Routes.GROUPS)  { GroupsScreen() }
            composable(Routes.BLOCKS)  { BlocksScreen() }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  BOTTOM NAVIGATION BAR
// ═══════════════════════════════════════════════════════════════════════════
@Composable
private fun SadhnaBottomBar(navController: NavHostController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF111018))
            .windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        // Top divider line
        HorizontalDivider(
            color     = Color(0x11FFFFFF),
            thickness = 1.dp,
        )

        Row(
            modifier             = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement= Arrangement.SpaceAround,
            verticalAlignment    = Alignment.CenterVertically,
        ) {
            navItems.forEach { item ->
                val selected = currentDestination
                    ?.hierarchy
                    ?.any { it.route == item.route } == true

                SadhnaNavItem(
                    item     = item,
                    selected = selected,
                    onClick  = {
                        navController.navigate(item.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState    = true
                        }
                    }
                )
            }
        }
    }
}

// ── Single nav tab item ────────────────────────────────────────────────────
@Composable
private fun SadhnaNavItem(
    item: NavItem,
    selected: Boolean,
    onClick: () -> Unit,
) {
    val fireOrange = Color(0xFFFF6B00)
    val muted      = Color(0xFF7C7A8A)

    Surface(
        onClick        = onClick,
        color          = Color.Transparent,
        shape          = RoundedCornerShape(12.dp),
    ) {
        Column(
            modifier            = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            // Icon with selected indicator background
            Box(
                modifier         = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(
                        if (selected) Color(0x22FF6B00) else Color.Transparent
                    )
                    .padding(horizontal = 10.dp, vertical = 4.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text     = item.emoji,
                    fontSize = 20.sp,
                    color    = if (selected) fireOrange else muted.copy(alpha = 0.6f),
                )
            }

            // Label
            AnimatedContent(
                targetState = selected,
                label       = "nav_label_${item.route}"
            ) { isSelected ->
                Text(
                    text  = item.label,
                    style = TextStyle(
                        fontFamily  = PoppinsFamily,
                        fontWeight  = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        fontSize    = 9.sp,
                        color       = if (isSelected) fireOrange else muted,
                    )
                )
            }
        }
    }
}

@Composable
fun FocusScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Focus Screen (Coming Soon)", color = Color.White)
    }
}

@Composable
fun PlannerScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Planner Screen (Coming Soon)", color = Color.White)
    }
}

@Composable
fun GroupsScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Groups Screen (Coming Soon)", color = Color.White)
    }
}

@Composable
fun BlocksScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Blocks Screen (Coming Soon)", color = Color.White)
    }
}
