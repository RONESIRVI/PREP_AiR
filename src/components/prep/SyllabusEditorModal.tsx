import React, { useState } from "react";
import { SyllabusTopic } from "../../types";
import { X, Plus, Save, Trash2, Edit2 } from "lucide-react";

interface SyllabusEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: SyllabusTopic[];
  setSyllabus: React.Dispatch<React.SetStateAction<SyllabusTopic[]>>;
}

export const SyllabusEditorModal: React.FC<SyllabusEditorModalProps> = ({
  isOpen,
  onClose,
  syllabus,
  setSyllabus,
}) => {
  const [editingTopic, setEditingTopic] = useState<SyllabusTopic | null>(null);

  if (!isOpen) return null;

  const handleSave = (topic: SyllabusTopic) => {
    if (syllabus.some((t) => t.id === topic.id)) {
      setSyllabus((prev) => prev.map((t) => (t.id === topic.id ? topic : t)));
    } else {
      setSyllabus((prev) => [topic, ...prev]);
    }
    setEditingTopic(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this syllabus topic forever?")) {
      setSyllabus((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600" />
              Syllabus Editor
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Add, Edit, or Delete syllabus topics.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {editingTopic ? (
            <SyllabusForm 
              initialData={editingTopic} 
              onSave={handleSave} 
              onCancel={() => setEditingTopic(null)} 
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setEditingTopic({
                  id: `topic-${Date.now()}`,
                  paper: "Prelims GS1",
                  subject: "",
                  module: "",
                  title: "",
                  yield: "⭐ Medium Yield",
                  weightagePercentage: 5,
                  pyqFrequencyLast5Years: 0,
                  status: "not_started",
                  notes: "",
                  subtopics: [],
                })}
                className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" /> Add New Topic
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {syllabus.map((topic) => (
                  <div key={topic.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">{topic.paper} • {topic.subject}</div>
                      <h3 className="font-bold text-slate-800 text-sm">{topic.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{topic.module}</p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                      <button 
                        onClick={() => setEditingTopic(topic)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(topic.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SyllabusForm: React.FC<{ initialData: SyllabusTopic, onSave: (data: SyllabusTopic) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<SyllabusTopic>(initialData);

  const handleChange = (field: keyof SyllabusTopic, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubtopicsChange = (val: string) => {
    setFormData(prev => ({ ...prev, subtopics: val.split('\n').filter(s => s.trim()) }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
        {initialData.subject ? "Edit Topic" : "Add New Topic"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Paper / Exam</label>
          <input 
            type="text" 
            list="paper-options"
            value={formData.paper} 
            onChange={e => handleChange('paper', e.target.value)} 
            placeholder="Type or select a paper..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
          />
          <datalist id="paper-options">
            {Array.from(new Set(syllabus.map(t => t.paper).filter(Boolean))).map(p => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Subject</label>
          <input 
            type="text" 
            list="subject-options"
            value={formData.subject} 
            onChange={e => handleChange('subject', e.target.value)} 
            placeholder="Type or select a subject..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
          />
          <datalist id="subject-options">
            {Array.from(new Set(syllabus.filter(t => !formData.paper || t.paper === formData.paper).map(t => t.subject).filter(Boolean))).map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Module</label>
          <input type="text" value={formData.module} onChange={e => handleChange('module', e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Topic Title</label>
          <input type="text" value={formData.title} onChange={e => handleChange('title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Subtopics (One per line)</label>
        <textarea 
          rows={4}
          value={formData.subtopics.join('\n')} 
          onChange={e => handleSubtopicsChange(e.target.value)} 
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer">
          Cancel
        </button>
        <button onClick={() => onSave(formData)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition cursor-pointer">
          <Save className="w-4 h-4" /> Save Topic
        </button>
      </div>
    </div>
  );
}
