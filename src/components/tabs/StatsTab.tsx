import React from "react";
import { BarChart3, TrendingUp, Flame, Activity } from "lucide-react";

export default function StatsTab() {
  return (
    <div className="p-6 h-full">
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
          <div className="text-3xl font-black text-ink">12 <span className="text-sm font-medium text-slate">Days</span></div>
        </div>
        
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={14} className="text-blue" />
            Today's Focus
          </div>
          <div className="text-3xl font-black text-ink">4.5 <span className="text-sm font-medium text-slate">hrs</span></div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-ink uppercase tracking-wider">Weekly Activity</h3>
          <BarChart3 size={16} className="text-slate" />
        </div>
        <div className="h-40 flex items-end justify-between gap-2">
          {/* Mock Bar Chart */}
          {[40, 65, 30, 85, 50, 95, 20].map((h, i) => (
            <div key={i} className="w-full bg-slate-50 rounded-t-md relative flex flex-col justify-end group cursor-pointer" style={{ height: '100%' }}>
              <div className="bg-lime w-full rounded-t-md transition-all group-hover:bg-green" style={{ height: `${h}%` }}></div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate">
                {["M","T","W","T","F","S","S"][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate">Avg. Focus Time</div>
          <div className="text-sm font-bold text-ink flex items-center gap-1">
            <TrendingUp size={14} className="text-lime" />
            5h 12m
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm text-ink uppercase tracking-wider mb-4">Top Tags</h3>
        <div className="space-y-3">
          <TagProgress name="Physics" color="bg-amber" percent={65} />
          <TagProgress name="Mathematics" color="bg-blue" percent={45} />
          <TagProgress name="Chemistry" color="bg-rose" percent={25} />
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
