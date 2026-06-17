"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { ArrowLeft, ArrowRight, AlertTriangle, Zap, Eye, Lightbulb, TrendingUp } from "lucide-react";

export default function Stage3Pain() {
  const { painMap, setStep } = useSignalScout();

  if (!painMap) return null;

  return (
    <div className="w-full max-w-4xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Pain Mapping Blueprint</h2>
            <p className="text-sm text-zinc-400">SignalScout maps core problem statements to operational pains, triggers, and motivations.</p>
          </div>
        </div>
      </div>

      {/* Main Flow Layout */}
      <div className="relative border-l border-zinc-850 pl-8 ml-4 space-y-8 mb-8">
        
        {/* Step 1: Core Problem */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg group-hover:border-zinc-700 transition">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Core Problem Solved</span>
            <p className="text-sm font-medium text-white max-w-2xl bg-zinc-950/20 border border-zinc-850 rounded-xl p-3.5 mt-1.5">
              {painMap.problem}
            </p>
          </div>
        </div>

        {/* Step 2: Resulting Operational Pains */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-zinc-900 border border-zinc-850 text-amber-500/80 rounded-lg group-hover:border-zinc-700 transition">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Customer Pain Points</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {painMap.pain.map((painItem, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-zinc-950/30 border border-zinc-850 rounded-xl hover:border-zinc-800 transition text-xs font-medium text-zinc-300"
                >
                  <p className="leading-relaxed">{painItem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Trigger Events */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-zinc-900 border border-zinc-850 text-emerald-500/80 rounded-lg group-hover:border-zinc-700 transition">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Signal Triggers (Buying Window)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {painMap.triggers.map((trigger, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-zinc-950/30 border border-zinc-850 rounded-xl hover:border-zinc-800 transition text-xs font-medium text-zinc-300"
                >
                  <p className="leading-relaxed">{trigger}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Buying Motivation */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-zinc-900 border border-zinc-850 text-violet-400 rounded-lg group-hover:border-zinc-700 transition">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Target Buying Motivation</span>
            <p className="text-sm font-medium text-zinc-200 max-w-2xl bg-violet-950/10 border border-violet-850/20 rounded-xl p-3.5 mt-1.5">
              {painMap.buyingMotivation}
            </p>
          </div>
        </div>

      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-lg shadow-violet-600/20 font-outfit"
        >
          <span>Configure Signals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
