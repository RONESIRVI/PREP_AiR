import React, { useState, useEffect } from "react";
import { X, Plus, ChevronLeft, Calendar, Trash2 } from "lucide-react";


export interface DDayProject {
  id: string;
  name: string;
  startDate?: string | null;
  targetDate: string;
  goals?: string | null;
  isMain: boolean;
}

interface DDayManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const DDayManagerModal: React.FC<DDayManagerModalProps> = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState<DDayProject[]>([]);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProject, setEditingProject] = useState<DDayProject | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [goals, setGoals] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("d_day_projects");
      if (stored && stored !== "null") {
        try {
          const parsed = JSON.parse(stored);
          setProjects(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setProjects([]);
        }
      } else {
        // Migration from old single target_d_day
        const oldTarget = localStorage.getItem("target_d_day");
        if (oldTarget) {
          const legacyProject: DDayProject = {
            id: Date.now().toString(),
            name: "Mission D-Day",
            targetDate: oldTarget,
            isMain: true,
          };
          setProjects([legacyProject]);
          localStorage.setItem("d_day_projects", JSON.stringify([legacyProject]));
        }
      }
    }
  }, [isOpen]);

  const saveProjects = (newProjects: DDayProject[]) => {
    setProjects(newProjects);
    localStorage.setItem("d_day_projects", JSON.stringify(newProjects));
    // Dispatch event so ProfileCard3D can update immediately
    window.dispatchEvent(new Event("d_day_updated"));
    
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setName("");
    setStartDate("");
    setTargetDate("");
    setGoals("");
    setErrorMsg("");
    setIsMain(projects.length === 0); // Default to main if first project
    setView("form");
  };

  const handleEditClick = (p: DDayProject) => {
    setEditingProject(p);
    setName(p.name);
    setStartDate(p.startDate || "");
    setTargetDate(p.targetDate);
    setGoals(p.goals || "");
    setErrorMsg("");
    setIsMain(p.isMain);
    setView("form");
  };

  const handleDelete = (id: string) => {
    // Direct deletion to avoid Capacitor window.confirm bugs
    const updated = projects.filter((p) => p.id !== id);
    // if we deleted the main, and there are others, make the first one main
    if (updated.length > 0 && !updated.some(p => p.isMain)) {
      updated[0].isMain = true;
    }
    saveProjects(updated);
  };

  const handleSaveForm = () => {
    if (!name.trim() || !targetDate) {
      setErrorMsg("Name and Target Date are required!");
      return;
    }

    let updatedList = [...projects];

    // If this is set as main, unset others
    if (isMain) {
      updatedList = updatedList.map((p) => ({ ...p, isMain: false }));
    }

    const payload: DDayProject = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      name: name.trim(),
      startDate: startDate || null,
      targetDate,
      goals: goals || null,
      isMain,
    };

    if (editingProject) {
      updatedList = updatedList.map((p) => (p.id === payload.id ? payload : p));
    } else {
      updatedList.push(payload);
    }

    // Ensure at least one is main if any exist
    if (updatedList.length > 0 && !updatedList.some((p) => p.isMain)) {
      updatedList[0].isMain = true;
    }

    saveProjects(updatedList);
    setView("list");
  };

  const calculateDaysLeft = (targetDateStr: string) => {
    const targetDateObj = new Date(targetDateStr);
    const today = new Date();
    targetDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = targetDateObj.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm sm:overflow-y-auto">
      <div className="bg-[#0f1218] w-full h-full sm:h-[600px] sm:max-w-md sm:rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#1a1f29]">
          <div className="flex items-center gap-3">
            {view === "form" ? (
              <button onClick={() => setView("list")} className="p-2 text-slate-400 hover:text-white rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
            <h2 className="text-lg font-bold text-white tracking-wide">
              {view === "list" ? "Project (D-Day)" : editingProject ? "Edit project" : "Add project (D-Day)"}
            </h2>
          </div>
          {view === "form" ? (
            <button onClick={handleSaveForm} className="text-[#0ea5e9] font-bold px-4 py-2 hover:bg-white/5 rounded-xl transition-colors">
              Save
            </button>
          ) : (
            <button onClick={handleAddClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0ea5e9]/10 text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white font-bold rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          {view === "list" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">In progress</h3>
              
              {projects.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No D-Days created yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((p) => {
                    const daysLeft = calculateDaysLeft(p.targetDate);
                    return (
                      <div key={p.id} onClick={() => handleEditClick(p)} className={`p-4 rounded-2xl border ${p.isMain ? 'border-[#0ea5e9]/50 bg-[#0ea5e9]/5' : 'border-white/5 bg-white/[0.02]'} flex justify-between items-center group cursor-pointer hover:bg-white/[0.05] transition-colors`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-200 truncate">{p.name}</h4>
                            {p.isMain && <span className="px-1.5 py-0.5 bg-[#0ea5e9] text-white text-[9px] font-black uppercase tracking-wider rounded-md">MAIN</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{new Date(p.targetDate).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
                          {p.goals && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 bg-white/5 p-2 rounded-lg">{p.goals}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                          <div className="text-right w-12">
                            <span className={`text-sm sm:text-base font-bold ${daysLeft < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                              D{daysLeft < 0 ? '+' + Math.abs(daysLeft) : '-' + daysLeft}
                            </span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="p-2 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {view === "form" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#1a1f29] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
                <input 
                  type="checkbox" 
                  checked={isMain} 
                  onChange={(e) => setIsMain(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-[#0ea5e9] focus:ring-[#0ea5e9] focus:ring-offset-slate-900" 
                />
                <span className="font-medium text-slate-300">Set as main D-Day</span>
              </label>

              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Enter D-Day name." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1f29] border border-white/5 text-white font-bold rounded-2xl p-4 focus:border-white/20 transition-colors outline-none"
                />
              </div>

              <div className="rounded-2xl bg-[#1a1f29] border border-white/5 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Start date</span>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent text-slate-300 font-medium focus:outline-none text-right cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-4">
                  <span className="text-slate-400 font-medium">D-Day</span>
                  <input 
                    type="date" 
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    className="bg-transparent text-white font-bold focus:outline-none text-right cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <textarea 
                  placeholder="Write your current situation and goals." 
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  className="w-full bg-[#1a1f29] border border-white/5 text-slate-300 text-sm rounded-2xl p-4 focus:border-white/20 transition-colors outline-none resize-none"
                />
              </div>

            </div>
          )}
        </div>



      </div>
    </div>
  );
};
