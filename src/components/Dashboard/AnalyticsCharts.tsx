"use client";

import React, { useState, useEffect } from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { ChartBar, ChartPie, Radio, TrendUp } from "@phosphor-icons/react";

export default function AnalyticsCharts() {
  const { accounts, signals, feedEvents, lastSignalAt } = useSignalScout();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const [hoveredSig, setHoveredSig] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  // Trigger mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Pulse the score distribution border when a new signal fires
  useEffect(() => {
    if (lastSignalAt === 0) return;
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 1400);
    return () => clearTimeout(t);
  }, [lastSignalAt]);

  // ── Chart 1: Score Distribution ──────────────────────────────────────────
  const ranges = [
    { label: "<50", sublabel: "Tier 4", count: 0, color: "#71717a", glow: "#71717a" },
    { label: "50–69", sublabel: "Tier 3", count: 0, color: "#3b82f6", glow: "#3b82f6" },
    { label: "70–89", sublabel: "Tier 2", count: 0, color: "#f59e0b", glow: "#f59e0b" },
    { label: "90+", sublabel: "Tier 1", count: 0, color: "#10b981", glow: "#10b981" },
  ];
  accounts.forEach((acc) => {
    if (acc.opportunityScore >= 90) ranges[3].count++;
    else if (acc.opportunityScore >= 70) ranges[2].count++;
    else if (acc.opportunityScore >= 50) ranges[1].count++;
    else ranges[0].count++;
  });
  const maxCount = Math.max(...ranges.map((r) => r.count), 1);
  const avgScore =
    accounts.length > 0
      ? Math.round(accounts.reduce((s, a) => s + a.opportunityScore, 0) / accounts.length)
      : 0;

  // ── Chart 2: Top Technographics ──────────────────────────────────────────
  const techCounts: { [k: string]: number } = {};
  accounts.forEach((acc) =>
    acc.techStack.forEach((tech) => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    })
  );
  const sortedTech = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxTechCount = Math.max(...sortedTech.map((t) => t[1]), 1);

  // ── Chart 3: Signal Category Breakdown ───────────────────────────────────
  const sigCategoryTotals = { strong: 0, medium: 0, weak: 0 };
  accounts.forEach((acc) => {
    acc.signalsDetected.forEach((sigId) => {
      const cfg = signals.find((s) => s.id === sigId);
      if (cfg) sigCategoryTotals[cfg.category]++;
    });
  });
  const sigCategories = [
    { label: "Strong", count: sigCategoryTotals.strong, color: "#10b981", bg: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
    { label: "Medium", count: sigCategoryTotals.medium, color: "#f59e0b", bg: "bg-amber-500/20 border-amber-500/30 text-amber-400" },
    { label: "Weak", count: sigCategoryTotals.weak, color: "#8b5cf6", bg: "bg-violet-500/20 border-violet-500/30 text-violet-400" },
  ];
  const totalSignalsFired = sigCategoryTotals.strong + sigCategoryTotals.medium + sigCategoryTotals.weak;
  const maxSigCount = Math.max(sigCategoryTotals.strong, sigCategoryTotals.medium, sigCategoryTotals.weak, 1);

  const emptyState = (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-40">
      <TrendUp className="w-7 h-7 text-zinc-500 mb-2" />
      <p className="text-xs text-zinc-500">Import accounts to populate charts</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

      {/* ── Chart 1: Score Distribution ── */}
      <div className={`bg-zinc-900/40 border rounded-xl p-5 shadow-lg flex flex-col transition-all duration-500 ${pulsing ? "border-violet-500/40 shadow-violet-500/10" : "border-zinc-900 hover:border-zinc-800"}`}>
        <div className="flex items-center justify-between mb-3 border-b border-zinc-850/60 pb-3">
          <div className="flex items-center space-x-2">
            <ChartBar className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Score Distribution</h3>
          </div>
          {accounts.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">Avg</span>
              <span className="text-xs font-black font-mono text-violet-400">{avgScore}</span>
            </div>
          )}
        </div>

        {accounts.length === 0 ? emptyState : (
          <div className="flex-1 min-h-[180px] flex items-end justify-around px-2 pb-1 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-t border-zinc-900/60" />
              ))}
            </div>

            {ranges.map((range, idx) => {
              const heightPercent = mounted ? (range.count / maxCount) * 78 : 0;
              const isHovered = hoveredBar === idx;
              return (
                <div
                  key={range.label}
                  className="flex flex-col items-center flex-1 group z-10 cursor-pointer"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="relative w-10 sm:w-12 flex flex-col justify-end" style={{ height: "130px" }}>
                    {/* Count label */}
                    {range.count > 0 && (
                      <span
                        className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono transition-opacity duration-200"
                        style={{ color: range.color, opacity: isHovered ? 1 : 0.6 }}
                      >
                        {range.count}
                      </span>
                    )}
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 text-[10px] text-white font-mono px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-50">
                        {range.count} account{range.count !== 1 ? "s" : ""}
                      </div>
                    )}
                    {/* Bar */}
                    <div
                      className="w-full rounded-t-md relative overflow-hidden"
                      style={{
                        height: `${Math.max(range.count === 0 ? 0 : 3, heightPercent)}%`,
                        backgroundColor: range.color,
                        boxShadow: isHovered ? `0 0 18px ${range.glow}50` : `0 0 6px ${range.glow}18`,
                        transition: "height 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/5" />
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[10px] font-bold font-mono" style={{ color: range.color }}>{range.label}</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{range.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Chart 2: Top Tech Stack ── */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition shadow-lg flex flex-col">
        <div className="flex items-center space-x-2 mb-4 border-b border-zinc-850/60 pb-3">
          <ChartPie className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Tech Stack Matches</h3>
        </div>

        {sortedTech.length === 0 ? emptyState : (
          <div className="flex-1 flex flex-col justify-center space-y-3 pb-1">
            {sortedTech.map(([tech, count], idx) => {
              const widthPercent = mounted ? (count / maxTechCount) * 100 : 0;
              const isHovered = hoveredTech === idx;
              return (
                <div
                  key={tech}
                  className="space-y-1"
                  onMouseEnter={() => setHoveredTech(idx)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className={`font-semibold transition-colors duration-150 ${isHovered ? "text-violet-300" : "text-zinc-300"}`}>{tech}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">{count}</span>
                  </div>
                  <div className="h-2 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${isHovered ? "bg-gradient-to-r from-violet-400 to-violet-300" : "bg-gradient-to-r from-violet-600 to-violet-500/70"}`}
                      style={{ width: `${widthPercent}%`, transitionDelay: `${idx * 60}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Chart 3: Signal Category Breakdown ── */}
      <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-850/60 pb-3">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 text-violet-400 ${pulsing ? "animate-ping" : "animate-pulse"}`} />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Signal Breakdown</h3>
          </div>
          {totalSignalsFired > 0 && (
            <span className="text-[9px] font-bold font-mono text-zinc-500 uppercase">{totalSignalsFired} fired</span>
          )}
        </div>

        {accounts.length === 0 ? emptyState : (
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {sigCategories.map((cat, idx) => {
              const isHovered = hoveredSig === idx;
              const barW = mounted ? (cat.count / maxSigCount) * 100 : 0;
              const pct = totalSignalsFired > 0 ? Math.round((cat.count / totalSignalsFired) * 100) : 0;
              return (
                <div
                  key={cat.label}
                  className="space-y-1.5"
                  onMouseEnter={() => setHoveredSig(idx)}
                  onMouseLeave={() => setHoveredSig(null)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${cat.bg}`}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold" style={{ color: cat.color }}>
                        {cat.count}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-mono">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${barW}%`,
                        backgroundColor: cat.color,
                        opacity: isHovered ? 1 : 0.75,
                        boxShadow: isHovered ? `0 0 10px ${cat.color}60` : "none",
                        transitionDelay: `${idx * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Live ticker at bottom */}
            <div className="mt-auto pt-3 border-t border-zinc-900 flex items-center space-x-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {feedEvents.length > 0
                  ? `${feedEvents.length} live event${feedEvents.length !== 1 ? "s" : ""} captured`
                  : "Waiting for live triggers..."}
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
