package com.sadhna.focus.ui.stats

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import com.sadhna.focus.data.usage.AppCategory
import com.sadhna.focus.data.usage.AppUsage
import com.sadhna.focus.data.usage.UsageStatsHelper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

data class UsageStatsUiState(
    val period: StatsPeriod         = StatsPeriod.DAILY,
    val filter: StatsFilter         = StatsFilter.ALL,
    val allApps: List<AppUsage>     = emptyList(),
    val bars: List<BarData>         = emptyList(),
    val totalFormatted: String      = "0m",
    val periodLabel: String         = "",
    val distractingMin: Int         = 0,
    val productiveMin: Int          = 0,
    val othersMin: Int              = 0,
    val isLoading: Boolean          = true,
    val hasPermission: Boolean      = true,
) {
    val filteredApps: List<AppUsage> get() = when (filter) {
        StatsFilter.ALL          -> allApps
        StatsFilter.DISTRACTING  -> allApps.filter { it.category == AppCategory.DISTRACTING }
        StatsFilter.PRODUCTIVE   -> allApps.filter { it.category == AppCategory.PRODUCTIVE  }
        StatsFilter.OTHERS       -> allApps.filter { it.category == AppCategory.OTHERS      }
    }
}

@HiltViewModel
class UsageStatsViewModel @Inject constructor(
    private val helper: UsageStatsHelper,
) : ViewModel() {

    private val _state = MutableStateFlow(UsageStatsUiState())
    val state: StateFlow<UsageStatsUiState> = _state.asStateFlow()

    init { loadStats() }

    fun setPeriod(period: StatsPeriod) {
        _state.update { it.copy(period = period) }
        loadStats()
    }

    fun setFilter(filter: StatsFilter) {
        _state.update { it.copy(filter = filter) }
    }

    private fun loadStats() {
        viewModelScope.launch(Dispatchers.IO) {
            if (!helper.hasUsagePermission()) {
                _state.update { it.copy(hasPermission = false, isLoading = false) }
                return@launch
            }

            _state.update { it.copy(isLoading = true) }
            val apps = helper.getTodayUsage()

            // Totals by category
            val distracting = apps.filter { it.category == AppCategory.DISTRACTING }.sumOf { it.usedMin }
            val productive  = apps.filter { it.category == AppCategory.PRODUCTIVE  }.sumOf { it.usedMin }
            val others      = apps.filter { it.category == AppCategory.OTHERS      }.sumOf { it.usedMin }
            val total       = apps.sumOf { it.usedMin }

            // Weekly bars
            val weekData = helper.getWeeklyUsageByDay()
            val today    = SimpleDateFormat("E", Locale.ENGLISH)
                           .format(Date()).take(1)
            val bars     = weekData.entries.reversed().map { (label, min) ->
                BarData(label = label, valueMin = min, isToday = label == today)
            }

            _state.update {
                it.copy(
                    allApps         = apps,
                    bars            = bars,
                    totalFormatted  = total.toHourMin(),
                    periodLabel     = "Today — ${todayLabel()}",
                    distractingMin  = distracting,
                    productiveMin   = productive,
                    othersMin       = others,
                    isLoading       = false,
                    hasPermission   = true,
                )
            }
        }
    }

    private fun Int.toHourMin(): String {
        val h = this / 60; val m = this % 60
        return when { h > 0 && m > 0 -> "${h}h ${m}m"; h > 0 -> "${h}h"; else -> "${m}m" }
    }

    private fun todayLabel(): String =
        SimpleDateFormat("EEE, dd MMM", Locale.ENGLISH).format(Date())
}
