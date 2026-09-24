import React from "react";
import { Plus, Tag, Clock, MoreVertical } from "lucide-react";

export default function PlannerTab() {
  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-[Space Grotesk] text-ink">Study Planner</h2>
          <p className="text-slate text-sm">Organize your day efficiently.</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-lime text-white flex items-center justify-center shadow-md hover:bg-green transition-colors">
          <Plus size={24} />
        </button>
      </div>

      {/* Mini Calendar Strip */}
      <div className="flex justify-between mb-8">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
          <div key={day} className={`flex flex-col items-center p-2 rounded-xl min-w-[42px] ${i === 3 ? 'bg-forest text-white shadow-md' : 'bg-white text-slate border border-border'}`}>
            <span className="text-[10px] font-semibold uppercase mb-1">{day}</span>
            <span className={`text-sm font-bold ${i === 3 ? 'text-white' : 'text-ink'}`}>{12 + i}</span>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">Today's Schedule</h3>

      {/* Schedule List */}
      <div className="space-y-3">
        <ScheduleItem 
          title="Morning Focus Block" 
          time="08:00 AM - 10:30 AM" 
          tag="Maths" 
          tagColor="bg-blue" 
          isActive={false}
        />
        <ScheduleItem 
          title="Deep Work Session" 
          time="11:00 AM - 01:00 PM" 
          tag="Physics" 
          tagColor="bg-amber" 
          isActive={true}
        />
        <ScheduleItem 
          title="Revision & Notes" 
          time="03:00 PM - 05:00 PM" 
          tag="Chemistry" 
          tagColor="bg-rose" 
          isActive={false}
        />
      </div>
    </div>
  );
}

function ScheduleItem({ title, time, tag, tagColor, isActive }: { title: string, time: string, tag: string, tagColor: string, isActive: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${isActive ? 'bg-white border-lime shadow-sm ring-1 ring-lime/20' : 'bg-white/60 border-border'} relative overflow-hidden`}>
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-lime"></div>}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-ink text-sm">{title}</h4>
        <button className="text-slate hover:text-ink"><MoreVertical size={16} /></button>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {time}
        </div>
        <div className="flex items-center gap-1">
          <Tag size={12} />
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${tagColor}`}></span>
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
