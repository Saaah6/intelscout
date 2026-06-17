"use client";

import React, { useState } from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { BarChart3, PieChart } from "lucide-react";

export default function AnalyticsCharts() {
  const { accounts } = useSignalScout();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  // 1. Calculate Score Distribution (Ranges: 0-49, 50-69, 70-89, 90-100)
  const ranges = [
    { label: "<50 (Tier 4)", count: 0, color: "#ef4444", key: "tier4" },
    { label: "50-69 (Tier 3)", count: 0, color: "#3b82f6", key: "tier3" },
    { label: "70-89 (Tier 2)", count: 0, color: "#f59e0b", key: "tier2" },
    { label: "90+ (Tier 1)", count: 0, color: "#10b981", key: "tier1" }
  ];

  accounts.forEach((acc) => {
    if (acc.opportunityScore >= 90) ranges[3].count++;
    else if (acc.opportunityScore >= 70) ranges[2].count++;
    else if (acc.opportunityScore >= 50) ranges[1].count++;
    else ranges[0].count++;
  });

  const maxCount = Math.max(...ranges.map((r) => r.count), 1);

  // 2. Calculate Technographics Prevalence
  const techCounts: { [key: string]: number } = {};
  accounts.forEach((acc) => {
    acc.techStack.forEach((tech) => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });

  const sortedTech = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5

  const maxTechCount = Math.max(...sortedTech.map((t) => t[1]), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Chart 1: Priority Score Distribution */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition shadow-lg flex flex-col">
        <div className="flex items-center space-x-2 mb-4 border-b border-zinc-850/60 pb-3">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Priority Score Distribution</h3>
        </div>

        {/* SVG Bar Chart */}
        <div className="flex-1 min-h-[200px] flex items-end justify-between px-4 pb-2 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-zinc-850">
            <div className="w-full border-t border-zinc-900/50" />
            <div className="w-full border-t border-zinc-900/50" />
            <div className="w-full border-t border-zinc-900/50" />
            <div className="w-full border-t border-zinc-900/50" />
          </div>

          {ranges.map((range, idx) => {
            const heightPercent = (range.count / maxCount) * 80; // max 80% height
            return (
              <div 
                key={range.key} 
                className="flex flex-col items-center flex-1 group z-10"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="relative w-12 md:w-16 flex flex-col justify-end" style={{ height: "140px" }}>
                  {/* Tooltip */}
                  {hoveredBar === idx && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 text-[10px] text-white font-mono px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-50">
                      {range.count} accounts
                    </div>
                  )}
                  {/* Bar */}
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500 ease-out cursor-pointer relative overflow-hidden"
                    style={{ 
                      height: `${Math.max(4, heightPercent)}%`,
                      backgroundColor: range.color,
                      boxShadow: hoveredBar === idx ? `0 0 15px ${range.color}60` : `0 0 5px ${range.color}20`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium mt-2.5 text-center leading-tight">
                  {range.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 2: Top Technographics Presence */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition shadow-lg flex flex-col">
        <div className="flex items-center space-x-2 mb-4 border-b border-zinc-850/60 pb-3">
          <PieChart className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Top Tech Stack Matches</h3>
        </div>

        {/* Horizontal Tech Bar Chart */}
        <div className="flex-1 flex flex-col justify-center space-y-3.5 pb-2">
          {sortedTech.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-12">No tech stack metrics available.</p>
          ) : (
            sortedTech.map(([tech, count], idx) => {
              const widthPercent = (count / maxTechCount) * 100;
              return (
                <div 
                  key={tech} 
                  className="space-y-1.5"
                  onMouseEnter={() => setHoveredTech(idx)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-zinc-300 font-semibold">{tech}</span>
                    <span className="text-zinc-500 font-mono">{count} target accounts</span>
                  </div>
                  <div className="h-2.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden relative cursor-pointer">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${
                        hoveredTech === idx 
                          ? "from-violet-500 to-violet-400" 
                          : "from-violet-600 to-violet-500/80"
                      }`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
