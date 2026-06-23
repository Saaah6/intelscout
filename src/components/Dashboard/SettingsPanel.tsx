"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { Sliders, ToggleLeft, ToggleRight, ArrowsCounterClockwise, CheckCircle } from "@phosphor-icons/react";

export default function SettingsPanel() {
  const { signals, setSignals, recalculateScores, userRole } = useIntelScout();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const isSales = userRole === "sales";

  const handleToggleSignal = (id: string) => {
    if (isSales) return;
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, enabled: !sig.enabled } : sig));
    setSignals(updated);
  };

  const handleWeightChange = (id: string, weight: number) => {
    if (isSales) return;
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, weight } : sig));
    setSignals(updated);
  };

  const handleApplyConfig = () => {
    if (isSales) return;
    recalculateScores();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const [prefLocation, setPrefLocation] = React.useState("Global");
  const [prefFirmographics, setPrefFirmographics] = React.useState("Mid-Market");
  const [prefSalesCycle, setPrefSalesCycle] = React.useState("Medium (3-6m)");

  // Dynamic Signal Targeting Logic
  React.useEffect(() => {
    if (isSales) return;
    
    let updated = [...signals];
    updated = updated.map(sig => {
      let weight = sig.weight;
      let enabled = sig.enabled;

      // Location Logic
      if (prefLocation === "EMEA" && sig.id === "regional_exp") { weight = 45; enabled = true; }
      else if (prefLocation !== "EMEA" && sig.id === "regional_exp") { weight = 15; }

      // Firmographics Logic
      if (prefFirmographics === "Enterprise") {
        if (sig.id === "compliance_cert" || sig.id === "tech_install" || sig.id === "exec_hire") { weight = 40; enabled = true; }
        if (sig.id === "funding") { weight = 5; enabled = false; }
      } else if (prefFirmographics === "SMB") {
        if (sig.id === "funding" || sig.id === "headcount_growth") { weight = 35; enabled = true; }
        if (sig.id === "compliance_cert" || sig.id === "exec_hire") { weight = 5; enabled = false; }
      }

      // Sales Cycle Logic
      if (prefSalesCycle === "Short (1-3m)") {
        if (sig.id === "pricing_update" || sig.id === "tech_install") { weight = 30; enabled = true; }
        if (sig.category === "weak") { enabled = false; }
      } else if (prefSalesCycle === "Long (6m+)") {
        if (sig.id === "exec_hire" || sig.id === "dept_hiring" || sig.id === "specialty_role") { weight = 35; enabled = true; }
      }

      return { ...sig, weight: Math.min(50, Math.max(1, weight)), enabled };
    });

    // Check if changed
    const hasChanged = updated.some((u, i) => u.weight !== signals[i].weight || u.enabled !== signals[i].enabled);
    if (hasChanged) {
      setSignals(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefLocation, prefFirmographics, prefSalesCycle, isSales]); // Only trigger on pref changes

  // Group signals
  const strongSigs = signals.filter((s) => s.category === "strong");
  const mediumSigs = signals.filter((s) => s.category === "medium");
  const weakSigs = signals.filter((s) => s.category === "weak");

  const renderSignalRow = (sig: typeof signals[0]) => (
    <div 
      key={sig.id} 
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fafafa] border border-black/10 rounded-xl transition shadow-sm ${
        sig.enabled ? "border-black/20" : "opacity-40 border-black/10"
      }`}
    >
      <div className="flex items-center space-x-3 sm:w-1/2">
        <button
          type="button"
          disabled={isSales}
          onClick={() => handleToggleSignal(sig.id)}
          className={`focus:outline-none transition ${isSales ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${sig.enabled ? "text-violet-600" : "text-[#888]"}`}
        >
          {sig.enabled ? (
            <ToggleRight className="w-8 h-8" />
          ) : (
            <ToggleLeft className="w-8 h-8" />
          )}
        </button>
        <div>
          <p className="text-xs font-semibold text-[#111]">{sig.name}</p>
          <p className="text-[10px] text-[#666] font-mono">ID: {sig.id}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 sm:mt-0 flex-1 justify-end">
        <input
          type="range"
          min="1"
          max="50"
          value={sig.weight}
          disabled={!sig.enabled || isSales}
          onChange={(e) => handleWeightChange(sig.id, parseInt(e.target.value))}
          className="w-full sm:w-44 h-1 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-violet-600 disabled:opacity-30 disabled:cursor-not-allowed"
        />
        <span className="text-xs font-mono font-bold text-[#333] w-12 text-right">
          +{sig.weight} pts
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full">
      
      {/* Sales Read-only Banner */}
      {isSales && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start space-x-3 text-xs leading-normal">
          <Sliders className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold block uppercase tracking-wide mb-0.5">Read-Only Mode</span>
            <span>Your role (Sales Representative) does not have privileges to alter GTM signal configurations. Contact your GTM administrator to customize weights.</span>
          </div>
        </div>
      )}

      {/* Dynamic Targeting Preferences */}
      <div className="mb-8 p-4 bg-[#f8f9fa] border border-black/10 rounded-xl">
        <h3 className="text-xs font-bold text-[#111] uppercase tracking-widest font-outfit mb-4">Targeting Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide">Location</label>
            <select
              value={prefLocation}
              onChange={(e) => setPrefLocation(e.target.value)}
              disabled={isSales}
              className="text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50"
            >
              <option value="Global">Global</option>
              <option value="North America">North America</option>
              <option value="EMEA">EMEA</option>
              <option value="APAC">APAC</option>
              <option value="LATAM">LATAM</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide">Firmographics</label>
            <select
              value={prefFirmographics}
              onChange={(e) => setPrefFirmographics(e.target.value)}
              disabled={isSales}
              className="text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50"
            >
              <option value="SMB">SMB (1-50)</option>
              <option value="Mid-Market">Mid-Market (51-500)</option>
              <option value="Enterprise">Enterprise (500+)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide">Sales Cycle</label>
            <select
              value={prefSalesCycle}
              onChange={(e) => setPrefSalesCycle(e.target.value)}
              disabled={isSales}
              className="text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50"
            >
              <option value="Short (1-3m)">Short (1-3m)</option>
              <option value="Medium (3-6m)">Medium (3-6m)</option>
              <option value="Long (6m+)">Long (6m+)</option>
            </select>
          </div>
        </div>
        <p className="text-[10px] text-[#777] mt-3 font-mono">Modifying these preferences dynamically recalibrates the underlying intelligence signals.</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider font-outfit">Qualification Weighting Center</h3>
          <p className="text-[10px] text-[#666]">Manually fine-tune dynamic signal weights. Changes will impact Opportunity Scores.</p>
        </div>
        
        {/* Save/Apply */}
        <button
          onClick={handleApplyConfig}
          disabled={isSales}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition ${
            isSales
              ? "bg-[#fafafa] text-[#888] border border-black/10 cursor-not-allowed opacity-50"
              : saveSuccess 
                ? "bg-emerald-600 text-white" 
                : "bg-black hover:bg-[#222] text-white shadow-sm cursor-pointer"
          }`}
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Applied!</span>
            </>
          ) : (
            <>
              <ArrowsCounterClockwise className="w-3.5 h-3.5" />
              <span>Apply & Recalculate</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
        
        {/* Strong Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase block mb-3">Strong Signal Weights</span>
          <div className="space-y-2">
            {strongSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Medium Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-blue-600 uppercase block mb-3">Medium Signal Weights</span>
          <div className="space-y-2">
            {mediumSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Weak Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-[#555] uppercase block mb-3">Weak Signal Weights</span>
          <div className="space-y-2">
            {weakSigs.map(renderSignalRow)}
          </div>
        </div>

      </div>

    </div>
  );
}
