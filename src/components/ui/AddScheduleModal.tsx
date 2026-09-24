import React, { useState, useEffect } from 'react';
import { db, Tag } from '../../store/db';
import { X, Clock, Tag as TagIcon, Smartphone } from 'lucide-react';
import { registerPlugin } from '@capacitor/core';

const AppBlocker = registerPlugin<any>('AppBlocker');

interface AppInfo {
  packageName: string;
  appName: string;
}

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onAdd: () => void;
}

export function AddScheduleModal({ isOpen, onClose, tags, onAdd }: AddScheduleModalProps) {
  const [selectedTagId, setSelectedTagId] = useState<number>(tags[0]?.id || 1);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("11:00");
  
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      AppBlocker.getInstalledApps().then((res: any) => {
        if (res && res.apps) {
          setInstalledApps(res.apps);
        }
      }).catch(() => {
        // Mock data for browser testing
        setInstalledApps([
          { packageName: "com.instagram.android", appName: "Instagram" },
          { packageName: "com.google.android.youtube", appName: "YouTube" },
          { packageName: "com.facebook.katana", appName: "Facebook" }
        ]);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleApp = (pkg: string) => {
    const next = new Set(selectedApps);
    if (next.has(pkg)) next.delete(pkg);
    else next.add(pkg);
    setSelectedApps(next);
  };

  const handleSave = async () => {
    // Convert time to today's epoch
    const now = new Date();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM);
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endH, endM);

    if (endDate < startDate) {
        // If end time is before start time, assume it crosses midnight
        endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    }

    await db.schedules.add({
      tag_id: selectedTagId,
      start_epoch: startDate.getTime(),
      end_epoch: endDate.getTime(),
      block_apps: JSON.stringify(Array.from(selectedApps))
    });

    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-ink font-[Space Grotesk]">New Study Block</h3>
          <button onClick={onClose} className="text-slate hover:text-rose transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Tag Selector */}
          <div>
            <label className="text-xs font-bold text-slate uppercase tracking-wider mb-2 flex items-center gap-1">
              <TagIcon size={14} /> Subject / Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => tag.id && setSelectedTagId(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedTagId === tag.id ? `${tag.color_hex} text-white shadow-md` : 'bg-slate-100 text-slate hover:bg-slate-200'
                  }`}
                >
                  <span>{tag.icon}</span> {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={14} /> Start Time
              </label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm font-bold text-ink outline-none focus:border-lime"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={14} /> End Time
              </label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl p-3 text-sm font-bold text-ink outline-none focus:border-lime"
              />
            </div>
          </div>

          {/* App Selector */}
          <div>
            <label className="text-xs font-bold text-slate uppercase tracking-wider mb-2 flex items-center gap-1">
              <Smartphone size={14} /> Apps to Block
            </label>
            <div className="bg-slate-50 border border-border rounded-xl max-h-40 overflow-y-auto p-2 space-y-1">
              {installedApps.length === 0 ? (
                <div className="text-xs text-slate text-center py-2">Loading apps...</div>
              ) : (
                installedApps.map(app => (
                  <label key={app.packageName} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-ink">{app.appName}</span>
                    <input 
                      type="checkbox" 
                      checked={selectedApps.has(app.packageName)}
                      onChange={() => toggleApp(app.packageName)}
                      className="w-4 h-4 text-lime rounded border-slate-300 focus:ring-lime"
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-forest text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-forest/20 hover:bg-forest-dark transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
