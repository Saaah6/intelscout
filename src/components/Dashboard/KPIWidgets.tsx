"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { 
  Buildings, 
  WarningCircle, 
  Pulse, 
  Compass, 
  Flame, 
  CurrencyDollar 
} from "@phosphor-icons/react";

export default function KPIWidgets() {
  const { accounts, offer } = useSignalScout();

  // 1. Accounts Analyzed
  const totalAnalyzed = accounts.length;

  // 2. High Priority Accounts (Tier 1 & 2: Score >= 70)
  const highPriorityCount = accounts.filter(a => a.opportunityScore >= 70).length;
  const highPriorityPercent = totalAnalyzed > 0 
    ? Math.round((highPriorityCount / totalAnalyzed) * 100) 
    : 0;

  // 3. Signals Detected
  const totalSignals = accounts.reduce((sum, a) => sum + a.signalsDetected.length, 0);

  // 4. ICP Match Rate (Average Fit Score)
  const avgFit = totalAnalyzed > 0
    ? Math.round(accounts.reduce((sum, a) => sum + a.icpFit, 0) / totalAnalyzed)
    : 0;

  // 5. Intent Distribution (Average Intent Score)
  const avgIntent = totalAnalyzed > 0
    ? Math.round(accounts.reduce((sum, a) => sum + a.intent, 0) / totalAnalyzed)
    : 0;

  // 6. Pipeline Opportunities (logical formula: High Priority Accounts * dealSize average value)
  let avgDealValue = 50000; // default for $20k-$100k
  if (offer.dealSize === "<$1,000") avgDealValue = 800;
  else if (offer.dealSize === "$1,000-$5,000") avgDealValue = 3000;
  else if (offer.dealSize === "$5,000-$20,000") avgDealValue = 12500;
  else if (offer.dealSize === "$20,000-$100,000") avgDealValue = 60000;
  else if (offer.dealSize === "$100,000+") avgDealValue = 250000;

  const totalPipeline = highPriorityCount * avgDealValue;
  const formatPipeline = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const cards = [
    { 
      label: "Accounts Analyzed", 
      value: totalAnalyzed, 
      desc: "Processed in current run", 
      icon: Buildings, 
      color: "text-violet-400 bg-violet-600/10 border-violet-500/20" 
    },
    { 
      label: "High Priority Accounts", 
      value: highPriorityCount, 
      desc: `${highPriorityPercent}% of total accounts`, 
      icon: WarningCircle, 
      color: "text-emerald-400 bg-emerald-600/10 border-emerald-500/20" 
    },
    { 
      label: "Signals Detected", 
      value: totalSignals, 
      desc: "Dynamic triggers matched", 
      icon: Pulse, 
      color: "text-blue-400 bg-blue-600/10 border-blue-500/20" 
    },
    { 
      label: "ICP Match Rate", 
      value: `${avgFit}%`, 
      desc: "Average profile overlap", 
      icon: Compass, 
      color: "text-amber-400 bg-amber-600/10 border-amber-500/20" 
    },
    { 
      label: "Average Intent", 
      value: `${avgIntent}%`, 
      desc: "Signal weight index", 
      icon: Flame, 
      color: "text-orange-400 bg-orange-600/10 border-orange-500/20" 
    },
    { 
      label: "Pipeline Opportunities", 
      value: formatPipeline(totalPipeline), 
      desc: `Est. from ${offer.dealSize} ACV`, 
      icon: CurrencyDollar, 
      color: "text-pink-400 bg-pink-600/10 border-pink-500/20" 
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg border shrink-0 ${card.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold font-outfit text-white leading-none tracking-tight mb-1 group-hover:text-violet-400 transition">
                {card.value}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium truncate">{card.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
