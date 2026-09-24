import React, { useState, useEffect } from "react";
import { Sparkles, Brain, ArrowRight, Clock } from "lucide-react";
import { SmartRecommendation } from "../../types";

interface SmartRecommendationProps {
  recommendation: SmartRecommendation;
  onStartStudy: () => void;
}

export const SmartRecommendationCard: React.FC<SmartRecommendationProps> = ({
  recommendation,
  onStartStudy,
}) => {
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // waitMinutes calculation removed as requested
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-6 -right-6 text-indigo-50 opacity-50">
        <Brain className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">
            What Should I Study Now?
          </h3>
        </div>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-widest mb-2">
            🔥 High Priority
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-1">
            {recommendation.subject}
          </h4>
          <p className="text-sm font-medium text-slate-600">
            {recommendation.topic}
          </p>
        </div>

        <div className="bg-white/80 border border-indigo-100 rounded-xl p-3 mb-5">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
            Details:
          </div>
          <ul className="space-y-1.5">
            {recommendation.tags.map((tag, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs font-bold text-slate-700"
              >
                <span className="w-3 h-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[8px]">
                  ✓
                </span>
                {tag}
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px]">
                  ✓
                </span>
                {recommendation.reason}
            </li>
          </ul>
        </div>

        <button
          onClick={onStartStudy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-xs shadow-md shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
        >
          <span>Start Study</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
