"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { ArrowLeft, ArrowRight, Sliders, ToggleLeft, ToggleRight } from "@phosphor-icons/react";

export default function Stage4Weights() {
  const { signals, setSignals, setStep } = useSignalScout();

  const handleToggleSignal = (id: string) => {
    setSignals(
      signals.map((sig) => (sig.id === id ? { ...sig, enabled: !sig.enabled } : sig))
    );
  };

  const handleWeightChange = (id: string, weight: number) => {
    setSignals(
      signals.map((sig) => (sig.id === id ? { ...sig, weight } : sig))
    );
  };

  // Group signals
  const strongSigs = signals.filter((s) => s.category === "strong");
  const mediumSigs = signals.filter((s) => s.category === "medium");
  const weakSigs = signals.filter((s) => s.category === "weak");

  const renderSignalRow = (sig: typeof signals[0]) => (
    <div 
      key={sig.id} 
      className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl transition ${
        sig.enabled ? "border-zinc-800" : "opacity-40 border-zinc-900"
      }`}
    >
      <div className="flex items-center space-x-3 md:w-1/3">
        <button
          type="button"
          onClick={() => handleToggleSignal(sig.id)}
          className={`focus:outline-none transition ${sig.enabled ? "text-violet-400" : "text-zinc-600"}`}
        >
          {sig.enabled ? (
            <ToggleRight className="w-9 h-9" />
          ) : (
            <ToggleLeft className="w-9 h-9" />
          )}
        </button>
        <div>
          <p className="text-xs font-semibold text-white">{sig.name}</p>
          <p className="text-[10px] text-zinc-500">ID: {sig.id}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 md:mt-0 flex-1 justify-end">
        <Sliders className="w-3.5 h-3.5 text-zinc-500" />
        <input
          type="range"
          min="1"
          max="50"
          value={sig.weight}
          disabled={!sig.enabled}
          onChange={(e) => handleWeightChange(sig.id, parseInt(e.target.value))}
          className="w-48 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-30 disabled:cursor-not-allowed"
        />
        <span className="text-xs font-mono font-bold text-zinc-300 w-12 text-right">
          +{sig.weight} pts
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Dynamic Signal Engine</h2>
            <p className="text-sm text-zinc-400">Fine-tune the weights for custom trigger events. Higher weights prioritize matching accounts.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8 max-h-[420px] overflow-y-auto pr-1">
        
        {/* Strong Signals Group */}
        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block mb-3">Strong Signals (High Intent)</span>
          <div className="space-y-2.5">
            {strongSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Medium Signals Group */}
        <div>
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block mb-3">Medium Signals (Growth / Timing)</span>
          <div className="space-y-2.5">
            {mediumSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Weak Signals Group */}
        <div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">Weak Signals (Informational)</span>
          <div className="space-y-2.5">
            {weakSigs.map(renderSignalRow)}
          </div>
        </div>

      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(5)}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-lg shadow-violet-600/20 font-outfit"
        >
          <span>Import Accounts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
