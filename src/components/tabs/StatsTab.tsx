import React, { useMemo } from "react";
import { BarChart3, TrendingUp, Flame, Activity } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../store/db";

export default function StatsTab() {
  const sessions = useLiveQuery(() => db.focus_sessions.toArray()) || [];
  const tags = useLiveQuery(() => db.tags.toArray()) || [];

  const { todaysHours, weeklyData, avgFocusTimeStr, topTagsData } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // 1. Today's Focus
    const todaysSessions = sessions.filter(s => s.end_time >= startOfToday && s.completed);
    const todaysMinutes = todaysSessions.reduce((acc, curr) => acc + curr.duration_min, 0);
    const todaysHours = (todaysMinutes / 60).toFixed(1);

    // 2. Weekly Data
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    let totalWeeklyMinutes = 0;
    
    const sevenDaysAgo = startOfToday - (6 * 24 * 60 * 60 * 1000);
    
    sessions.forEach(s => {
      if (s.completed && s.end_time >= sevenDaysAgo) {
        totalWeeklyMinutes += s.duration_min;
        const date = new Date(s.end_time);
        // JS getDay() is 0=Sun, 1=Mon. Convert to 0=Mon, 6=Sun
        const dayIdx = (date.getDay() + 6) % 7;
        weeklyData[dayIdx] += s.duration_min;
      }
    });

    const maxDayMinutes = Math.max(...weeklyData, 1); // Avoid division by zero
    // Normalize to 0-100 percentages for chart heights
    const weeklyChartPercents = weeklyData.map(mins => (mins / maxDayMinutes) * 100);

    const avgMinutes = Math.floor(totalWeeklyMinutes / 7);
    const avgFocusTimeStr = `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`;

    // 3. Top Tags
    const tagMinutes: Record<number, number> = {};
    sessions.forEach(s => {
      if (s.completed) {
        tagMinutes[s.tag_id] = (tagMinutes[s.tag_id] || 0) + s.duration_min;
      }
    });

    const totalAllTimeMinutes = Object.values(tagMinutes).reduce((a, b) => a + b, 0) || 1;
    
    const topTagsData = Object.entries(tagMinutes)
      .map(([tagId, mins]) => {
        const tag = tags.find(t => t.id === Number(tagId));
        return {
          id: Number(tagId),
          name: tag?.name || 'Unknown',
          color: tag?.color_hex || 'bg-slate-300',
          percent: Math.round((mins / totalAllTimeMinutes) * 100)
        };
      })
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3); // Top 3

    return { todaysHours, weeklyData: weeklyChartPercents, avgFocusTimeStr, topTagsData };
  }, [sessions, tags]);

  // Mock streak for now
  const currentStreak = sessions.length > 0 ? 1 : 0;

  return (
    <div className="p-6 h-full pb-24 overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-[Space Grotesk] text-ink">Analytics</h2>
        <p className="text-slate text-sm">Measure your discipline & progress.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame size={14} className="text-amber" />
            Current Streak
          </div>
          <div className="text-3xl font-black text-ink">{currentStreak} <span className="text-sm font-medium text-slate">Days</span></div>
        </div>
        
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={14} className="text-blue" />
            Today's Focus
          </div>
          <div className="text-3xl font-black text-ink">{todaysHours} <span className="text-sm font-medium text-slate">hrs</span></div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-ink uppercase tracking-wider">Weekly Activity</h3>
          <BarChart3 size={16} className="text-slate" />
        </div>
        <div className="h-40 flex items-end justify-between gap-2">
          {weeklyData.map((h, i) => (
            <div key={i} className="w-full bg-slate-50 rounded-t-md relative flex flex-col justify-end group cursor-pointer" style={{ height: '100%' }}>
              <div className="bg-lime w-full rounded-t-md transition-all group-hover:bg-green" style={{ height: `${h}%` }}></div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate">
                {["M","T","W","T","F","S","S"][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate">Avg. Focus Time (Last 7 Days)</div>
          <div className="text-sm font-bold text-ink flex items-center gap-1">
            <TrendingUp size={14} className="text-lime" />
            {avgFocusTimeStr}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm text-ink uppercase tracking-wider mb-4">Top Tags</h3>
        <div className="space-y-3">
          {topTagsData.length === 0 ? (
            <div className="text-xs text-slate text-center">No focus sessions recorded yet.</div>
          ) : (
            topTagsData.map(tag => (
              <TagProgress key={tag.id} name={tag.name} color={tag.color} percent={tag.percent} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TagProgress({ name, color, percent }: { name: string, color: string, percent: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-ink">{name}</span>
        <span className="text-slate font-medium">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
