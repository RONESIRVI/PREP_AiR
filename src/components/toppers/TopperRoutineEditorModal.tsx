import React, { useState, useEffect } from "react";
import { TopperRoutine } from "../../types";
import { X, Save, Plus, Trash2 } from "lucide-react";

interface TopperRoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: TopperRoutine) => void;
  editingRoutine: TopperRoutine;
}

export const TopperRoutineEditorModal: React.FC<TopperRoutineEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRoutine,
}) => {
  const [formData, setFormData] = useState<TopperRoutine>(editingRoutine);

  useEffect(() => {
    setFormData(editingRoutine);
  }, [editingRoutine, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Edit Time Schedule</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Routine Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Schedule Items</label>
            {formData.schedule.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start border p-2 rounded-lg">
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => {
                    const newSchedule = [...formData.schedule];
                    newSchedule[idx].time = e.target.value;
                    setFormData({ ...formData, schedule: newSchedule });
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1"
                  placeholder="e.g. 05:00 AM"
                />
                <input
                  type="text"
                  value={item.activity}
                  onChange={(e) => {
                    const newSchedule = [...formData.schedule];
                    newSchedule[idx].activity = e.target.value;
                    setFormData({ ...formData, schedule: newSchedule });
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1"
                  placeholder="Activity"
                />
                <select
                  value={item.category}
                  onChange={(e) => {
                    const newSchedule = [...formData.schedule];
                    newSchedule[idx].category = e.target.value as "GS" | "Break / Health" | "Current Affairs" | "Optional" | "CSAT / Revision" | "Answer Writing";
                    setFormData({ ...formData, schedule: newSchedule });
                  }}
                  className="w-1/3 bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1"
                >
                  <option value="GS">GS</option>
                  <option value="Optional">Optional</option>
                  <option value="Current Affairs">Current Affairs</option>
                  <option value="Answer Writing">Answer Writing</option>
                  <option value="CSAT / Revision">CSAT / Revision</option>
                  <option value="Break / Health">Break / Health</option>
                </select>
                <button
                  onClick={() => {
                    const newSchedule = formData.schedule.filter((_, i) => i !== idx);
                    setFormData({ ...formData, schedule: newSchedule });
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  schedule: [...formData.schedule, { time: "", activity: "", category: "GS", description: "" }]
                });
              }}
              className="text-sm font-bold text-indigo-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              let totalHours = 0;
              let firstTime = "";
              let lastTime = "";
              
              formData.schedule.forEach((slot, index) => {
                // Calculate hours for non-break categories
                if (slot.category !== "Break / Health") {
                  const times = slot.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/ig);
                  if (times && times.length === 2) {
                    const parseAmPm = (t: string) => {
                      const match = t.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/i);
                      if (!match) return 0;
                      let h = parseInt(match[1]);
                      const m = parseInt(match[2] || "0");
                      const isPM = match[3].toLowerCase() === "pm";
                      if (h === 12 && !isPM) h = 0;
                      if (h !== 12 && isPM) h += 12;
                      return h + m/60;
                    };
                    const start = parseAmPm(times[0]);
                    let end = parseAmPm(times[1]);
                    if (end < start) end += 24;
                    totalHours += (end - start);
                  } else {
                    const hrMatch = slot.time.match(/(\d+(\.\d+)?)\s*hr/i);
                    if (hrMatch) totalHours += parseFloat(hrMatch[1]);
                  }
                }
                
                // Extract wake up time from first slot
                if (index === 0) {
                  const firstMatch = slot.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/i);
                  if (firstMatch) firstTime = firstMatch[0];
                }
                
                // Extract sleep time from last slot's end time
                if (index === formData.schedule.length - 1) {
                  const lastMatch = slot.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/ig);
                  if (lastMatch && lastMatch.length > 0) {
                    lastTime = lastMatch[lastMatch.length - 1];
                  }
                }
              });

              onSave({
                ...formData,
                totalStudyHours: totalHours > 0 ? parseFloat(totalHours.toFixed(1)) : formData.totalStudyHours,
                wakeUpTime: firstTime ? firstTime.toUpperCase() : formData.wakeUpTime,
                sleepTime: lastTime ? lastTime.toUpperCase() : formData.sleepTime,
              });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
          >
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
