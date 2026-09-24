import React, { useState, useEffect } from "react";
import { TopperProfile } from "../../types";
import { X, Save } from "lucide-react";

interface TopperFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topper: TopperProfile) => void;
  editingTopper?: TopperProfile;
}

export const TopperFormModal: React.FC<TopperFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTopper,
}) => {
  const [formData, setFormData] = useState<Partial<TopperProfile>>({
    id: `topper-${Date.now()}`,
    name: "",
    rank: 1,
    year: new Date().getFullYear(),
    attempt: 1,
    optional: "",
    background: "",
    quote: "",
    avatar: "/ranker-logo.jpg",
    mainsScore: 0,
    interviewScore: 0,
    goldenRules: ["Read limited sources", "Revise multiple times"],
    gsStrategy: { gs1: "", gs2: "", gs3: "", gs4: "" },
    essayStrategy: "",
    optionalStrategy: "",
    prelimsStrategy: "",
    csatStrategy: "",
  });

  useEffect(() => {
    if (editingTopper) {
      setFormData(editingTopper);
    } else {
      setFormData({
        id: `topper-${Date.now()}`,
        name: "",
        rank: 1,
        year: new Date().getFullYear(),
        attempt: 1,
        optional: "",
        background: "",
        quote: "",
        avatar: "/ranker-logo.jpg",
        mainsScore: 850,
        interviewScore: 195,
        goldenRules: ["Read limited sources", "Revise multiple times"],
        gsStrategy: { gs1: "", gs2: "", gs3: "", gs4: "" },
        essayStrategy: "",
        optionalStrategy: "",
        prelimsStrategy: "",
        csatStrategy: "",
      });
    }
  }, [editingTopper, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as TopperProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {editingTopper ? "Edit Topper Profile" : "Add New Topper"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <form id="topper-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Rank</label>
                <input
                  required
                  type="number"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Year</label>
                <input
                  required
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Optional Subject</label>
                <input
                  required
                  type="text"
                  value={formData.optional}
                  onChange={(e) => setFormData({ ...formData, optional: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Inspiring Quote</label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Subject Category</label>
                <input
                  type="text"
                  list="topper-subject-options"
                  placeholder="e.g., GS Subject 1, History, or Custom Plan"
                  value={formData.optionalStrategy || ""}
                  onChange={(e) => setFormData({ ...formData, optionalStrategy: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <datalist id="topper-subject-options">
                  <option value="GS Subject 1" />
                  <option value="GS Subject 2" />
                  <option value="GS Subject 3" />
                  <option value="GS Subject 4" />
                  <option value="General Hindi" />
                  <option value="General English" />
                  <option value="Optional Subject" />
                  <option value="Interview Preparation" />
                  <option value="Daily Routine" />
                </datalist>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Strategy / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Write the strategy for the selected subject..."
                  value={formData.gsStrategy?.gs1 || ""}
                  onChange={(e) => setFormData({ ...formData, gsStrategy: { ...formData.gsStrategy!, gs1: e.target.value } })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Golden Rules (Comma Separated)</label>
              <input
                type="text"
                value={formData.goldenRules?.join(', ')}
                onChange={(e) => setFormData({ ...formData, goldenRules: e.target.value.split(',').map(r => r.trim()) })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="topper-form"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Topper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
