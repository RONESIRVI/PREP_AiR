package com.sadhna.focus.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.sadhna.focus.MainActivity
// import com.sadhna.focus.R

/**
 * Sadhna Home Screen Widget
 *
 * Shows:
 *  • Total focused time today  (e.g. "2h 41m")
 *  • "Start Sadhna" button → opens app
 *
 * Widget layout defined in res/layout/widget_sadhna.xml
 * Widget info    defined in res/xml/sadhna_widget_info.xml
 */
class SadhnaWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        appWidgetIds.forEach { widgetId ->
            updateWidget(context, appWidgetManager, widgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_REFRESH) {
            val manager = AppWidgetManager.getInstance(context)
            val ids     = manager.getAppWidgetIds(
                ComponentName(context, SadhnaWidgetProvider::class.java)
            )
            ids.forEach { updateWidget(context, manager, it) }
        }
    }

    companion object {
        const val ACTION_REFRESH = "in.sadhna.focus.WIDGET_REFRESH"

        fun updateWidget(
            context: Context,
            manager: AppWidgetManager,
            widgetId: Int,
        ) {
            val views = RemoteViews(context.packageName, android.R.layout.simple_list_item_1)

            // TODO: Read today's focus time from Room DB (use WorkManager or DataStore)
            val focusedTime = "0m"   // Replace with actual value
            // views.setTextViewText(R.id.tv_focused_time, focusedTime)
            // views.setTextViewText(R.id.tv_label, "Time focused")

            // Tap widget → open app
            val openIntent = PendingIntent.getActivity(
                context, 0,
                Intent(context, MainActivity::class.java),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            // views.setOnClickPendingIntent(R.id.btn_start_focus, openIntent)
            // views.setOnClickPendingIntent(R.id.widget_root, openIntent)

            manager.updateAppWidget(widgetId, views)
        }
    }
}
