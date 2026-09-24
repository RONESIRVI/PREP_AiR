import React, { useState } from "react";
import { HISTORICAL_CUTOFFS } from "../../data/analyticsDefaults";
import {
  Trophy,
  Award,
  BarChart2,
  Sparkles,
  Target,
  HelpCircle,
  Calculator,
} from "lucide-react";

export const RankBenchmarkTab: React.FC = () => {
  const [targetCategory, setTargetCategory] = useState<
    "General" | "EWS" | "OBC" | "SC" | "ST"
  >("General");
  const [myPrelimsScore, setMyPrelimsScore] = useState<number>(94);
  const [myMainsScore, setMyMainsScore] = useState<number>(765);
  const [myInterviewScore, setMyInterviewScore] = useState<number>(180);

  const totalScore = myMainsScore + myInterviewScore;

  // Estimate AIR rank tier
  const getAIRTier = (total: number) => {
    if (total >= 1050)
      return {
        rank: "Top 10 (AIR 1-10)",
        service: "IAS / IFS (Home Cadre)",
        color: "text-amber-700 font-extrabold",
      };
    if (total >= 1000)
      return {
        rank: "Top 50 (AIR 11-50)",
        service: "IAS / IPS",
        color: "text-emerald-700 font-extrabold",
      };
    if (total >= 960)
      return {
        rank: "Top 150 (AIR 51-150)",
        service: "IAS / IPS / IRS",
        color: "text-teal-700 font-bold",
      };
    if (total >= 920)
      return {
        rank: "Final List (AIR 151-500)",
        service: "IRS / IDAS / Group A",
        color: "text-indigo-700 font-bold",
      };
    return {
      rank: "Borderline / Interview Call",
      service: "Need +30 Marks in GS/Optional",
      color: "text-rose-700 font-bold",
    };
  };

  const rankProjection = getAIRTier(totalScore);

  return (
    <div className="space-y-6">
      {/* Top Banner Bento Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Official RAS
              Cutoff Archive & Estimator
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              2018 - 2024 Cutoff Analytics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Historical Cutoffs & AIR Rank Benchmark Calculator
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
            Simulate your marks against real historical cutoffs to see your
            projected Rank, Service Allocation (IAS, IPS, IFS, IRS), and safe
            qualification buffers.
          </p>
        </div>
      </div>

      {/* Interactive AIR Predictor Calculator */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Interactive RAS Marks & Service Simulator</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Prelims Max: 200 • Mains Max: 1750 • Interview: 275
          </span>
        </div>

        {/* Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Prelims GS1 Mock Score</span>
              <span className="text-indigo-600 font-mono font-extrabold">
                {myPrelimsScore} / 200
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="1"
              value={myPrelimsScore}
              onChange={(e) => setMyPrelimsScore(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 font-medium flex justify-between">
              <span>Avg Cutoff: 88</span>
              <span
                className={
                  myPrelimsScore >= 88
                    ? "text-emerald-700 font-bold"
                    : "text-rose-600 font-bold"
                }
              >
                {myPrelimsScore >= 88
                  ? `+${myPrelimsScore - 88} Safe Buffer`
                  : "Below Cutoff"}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">
                Estimated Mains (GS1-4 + Opt + Essay)
              </span>
              <span className="text-indigo-600 font-mono font-extrabold">
                {myMainsScore} / 1750
              </span>
            </div>
            <input
              type="range"
              min="650"
              max="900"
              step="5"
              value={myMainsScore}
              onChange={(e) => setMyMainsScore(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 font-medium flex justify-between">
              <span>Mains Cutoff: ~740</span>
              <span className="text-emerald-700 font-bold">
                {myMainsScore >= 740
                  ? "Interview Call Guaranteed"
                  : "Borderline"}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">
                Personality Test (Interview)
              </span>
              <span className="text-emerald-700 font-mono font-extrabold">
                {myInterviewScore} / 275
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="215"
              step="1"
              value={myInterviewScore}
              onChange={(e) => setMyInterviewScore(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500 font-medium flex justify-between">
              <span>Avg Score: 160</span>
              <span>Topper Score: 190+</span>
            </div>
          </div>
        </div>

        {/* Projection Output Badge */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Projected Final Marks
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-0.5">
              {totalScore}{" "}
              <span className="text-base text-slate-500 font-normal">
                / 2025
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Projected All India Rank (AIR) Tier
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold ${rankProjection.color}`}
            >
              {rankProjection.rank}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              Probable Service:{" "}
              <strong className="text-slate-900">
                {rankProjection.service}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Cutoffs Archive Table */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <span>Official RAS Cutoffs History (General Category)</span>
          </h3>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Year</th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Prelims GS1 Cutoff (Out of 200)
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Mains Written Cutoff (Out of 1750)
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Final Recommended Rank Cutoff (Out of 2025)
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  AIR 1 Final Marks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {HISTORICAL_CUTOFFS.map((cut) => (
                <tr key={cut.year} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-sans whitespace-nowrap">
                    RAS CSE {cut.year}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-700 whitespace-nowrap">
                    {cut.prelimsGeneral} / 200
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-700 whitespace-nowrap">
                    {cut.mainsGeneral} / 1750
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 whitespace-nowrap">
                    {cut.finalGeneral} / 2025
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-extrabold whitespace-nowrap">
                    {cut.rank1Marks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
