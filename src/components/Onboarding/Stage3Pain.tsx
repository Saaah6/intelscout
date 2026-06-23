"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { ArrowLeft, ArrowRight, Warning, Lightning, Eye, Lightbulb, TrendUp } from "@phosphor-icons/react";

export default function Stage3Pain() {
  const { painMap, setStep, offer } = useIntelScout();

  if (!painMap) return null;

  return (
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl">
            <TrendUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-[#111] font-outfit">Pain Mapping Blueprint</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800 uppercase tracking-widest font-mono border border-violet-200">
                Synthesized from {offer?.websiteUrl || "Source URL"}
              </span>
            </div>
            <p className="text-sm text-[#555] mt-1">IntelScout maps core problem statements to operational pains, triggers, and motivations.</p>
          </div>
        </div>
      </div>

      {/* Main Flow Layout */}
      <div className="relative border-l border-black/10 pl-8 ml-4 space-y-8 mb-8">
        
        {/* Step 1: Core Problem */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-black/10 text-[#555] rounded-lg group-hover:border-black/30 transition">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-1">Core Problem Solved</span>
            <p className="text-sm font-medium text-[#111] max-w-2xl bg-white border border-black/10 shadow-sm rounded-xl p-3.5 mt-1.5">
              {painMap.problem}
            </p>
          </div>
        </div>

        {/* Step 2: Resulting Operational Pains */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-amber-500/30 text-amber-600 rounded-lg group-hover:border-amber-500/50 transition">
            <Warning className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Customer Pain Points</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {painMap.pain.map((painItem, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white border border-black/10 shadow-sm rounded-xl hover:border-black/30 transition text-xs font-medium text-[#333]"
                >
                  <p className="leading-relaxed">{painItem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Trigger Events */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-emerald-500/30 text-emerald-600 rounded-lg group-hover:border-emerald-500/50 transition">
            <Lightning className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Signal Triggers (Buying Window)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {painMap.triggers.map((trigger, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white border border-black/10 shadow-sm rounded-xl hover:border-black/30 transition text-xs font-medium text-[#333]"
                >
                  <p className="leading-relaxed">{trigger}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Buying Motivation */}
        <div className="relative group">
          <div className="absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-violet-500/30 text-violet-600 rounded-lg group-hover:border-violet-500/50 transition">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-1">Target Buying Motivation</span>
            <p className="text-sm font-medium text-violet-900 max-w-2xl bg-violet-50 border border-violet-200 shadow-sm rounded-xl p-3.5 mt-1.5">
              {painMap.buyingMotivation}
            </p>
          </div>
        </div>

      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-6 py-2.5 bg-black hover:bg-[#222] text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit"
        >
          <span>Configure Signals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
