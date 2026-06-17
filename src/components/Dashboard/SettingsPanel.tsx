"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { Sliders, ToggleLeft, ToggleRight, RefreshCw, Save, CheckCircle } from "lucide-react";

export default function SettingsPanel() {
  const { signals, setSignals, recalculateScores } = useSignalScout();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleToggleSignal = (id: string) => {
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, enabled: !sig.enabled } : sig));
    setSignals(updated);
  };

  const handleWeightChange = (id: string, weight: number) => {
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, weight } : sig));
    setSignals(updated);
  };

  const handleApplyConfig = () => {
    recalculateScores();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Group signals
  const strongSigs = signals.filter((s) => s.category === "strong");
  const mediumSigs = signals.filter((s) => s.category === "medium");
  const weakSigs = signals.filter((s) => s.category === "weak");

  const renderSignalRow = (sig: typeof signals[0]) => (
    <div 
      key={sig.id} 
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl transition ${
        sig.enabled ? "border-zinc-850" : "opacity-40 border-zinc-900"
      }`}
    >
      <div className="flex items-center space-x-3 sm:w-1/2">
        <button
          type="button"
          onClick={() => handleToggleSignal(sig.id)}
          className={`focus:outline-none transition ${sig.enabled ? "text-violet-400" : "text-zinc-650"}`}
        >
          {sig.enabled ? (
            <ToggleRight className="w-8 h-8" />
          ) : (
            <ToggleLeft className="w-8 h-8" />
          )}
        </button>
        <div>
          <p className="text-xs font-semibold text-white">{sig.name}</p>
          <p className="text-[10px] text-zinc-500 font-mono">ID: {sig.id}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 sm:mt-0 flex-1 justify-end">
        <input
          type="range"
          min="1"
          max="50"
          value={sig.weight}
          disabled={!sig.enabled}
          onChange={(e) => handleWeightChange(sig.id, parseInt(e.target.value))}
          className="w-full sm:w-44 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-30"
        />
        <span className="text-xs font-mono font-bold text-zinc-300 w-12 text-right">
          +{sig.weight} pts
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 shadow-lg flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-850/60 mb-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Qualification Weighting Center</h3>
          <p className="text-[10px] text-zinc-400">Modify dynamic signal weights. Changes will impact all Opportunity Scores upon applying.</p>
        </div>
        
        {/* Save/Apply */}
        <button
          onClick={handleApplyConfig}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition ${
            saveSuccess 
              ? "bg-emerald-600 text-white" 
              : "bg-violet-600 hover:bg-violet-505 text-white shadow-lg shadow-violet-600/15"
          }`}
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Applied!</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
              <span>Apply & Recalculate</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        
        {/* Strong Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase block mb-3">Strong Signal Weights</span>
          <div className="space-y-2">
            {strongSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Medium Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase block mb-3">Medium Signal Weights</span>
          <div className="space-y-2">
            {mediumSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Weak Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-zinc-550 uppercase block mb-3">Weak Signal Weights</span>
          <div className="space-y-2">
            {weakSigs.map(renderSignalRow)}
          </div>
        </div>

      </div>

    </div>
  );
}
