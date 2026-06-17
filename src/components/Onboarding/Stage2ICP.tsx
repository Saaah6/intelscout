"use client";

import React, { useState } from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { ArrowLeft, ArrowRight, Building2, Cpu, Sparkles, Users2, Plus, X } from "lucide-react";

export default function Stage2ICP() {
  const { icp, setIcp, setStep } = useSignalScout();
  const [newTech, setNewTech] = useState("");
  const [newSignal, setNewSignal] = useState("");

  if (!icp) return null;

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTech.trim()) return;
    setIcp({
      ...icp,
      technographics: [...icp.technographics, newTech.trim()]
    });
    setNewTech("");
  };

  const handleRemoveTech = (index: number) => {
    setIcp({
      ...icp,
      technographics: icp.technographics.filter((_, i) => i !== index)
    });
  };

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignal.trim()) return;
    setIcp({
      ...icp,
      growthSignals: [...icp.growthSignals, newSignal.trim()]
    });
    setNewSignal("");
  };

  const handleRemoveSignal = (index: number) => {
    setIcp({
      ...icp,
      growthSignals: icp.growthSignals.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="w-full max-w-4xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Ideal Customer Profile (ICP)</h2>
            <p className="text-sm text-zinc-400">SignalScout compiled this profile based on your business offer. Customize it below.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Firmographics Card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition">
          <div className="flex items-center space-x-2.5 text-violet-400 mb-4">
            <Building2 className="w-5 h-5" />
            <h3 className="font-semibold text-white font-outfit">Firmographics</h3>
          </div>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Target Industry</span>
              <span className="text-zinc-200 font-medium">{icp.firmographics.industry}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Company Size</span>
              <span className="text-zinc-200 font-medium">{icp.firmographics.employeeCount}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Target Revenue</span>
              <span className="text-zinc-200 font-medium">{icp.firmographics.revenue}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Geography</span>
              <span className="text-zinc-200 font-medium">{icp.firmographics.geography}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-zinc-400">Funding Phase</span>
              <span className="text-zinc-200 font-medium">{icp.firmographics.fundingStage}</span>
            </div>
          </div>
        </div>

        {/* Buying Committee Card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition">
          <div className="flex items-center space-x-2.5 text-violet-400 mb-4">
            <Users2 className="w-5 h-5" />
            <h3 className="font-semibold text-white font-outfit">Buying Committee</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">Key decision makers and target personas SignalScout will identify:</p>
          <div className="flex flex-wrap gap-2">
            {icp.buyingCommittee.map((role, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Technographics Card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition md:col-span-1">
          <div className="flex items-center space-x-2.5 text-violet-400 mb-3">
            <Cpu className="w-5 h-5" />
            <h3 className="font-semibold text-white font-outfit">Technographics</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">Accounts using these tools will score higher:</p>
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1">
            {icp.technographics.map((tech, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-violet-300 bg-violet-950/20 border border-violet-800/30 rounded-lg font-medium"
              >
                <span>{tech}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTech(idx)}
                  className="hover:text-red-400 hover:bg-violet-950/40 rounded transition p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddTech} className="flex space-x-2">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology (e.g. Vercel)..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500/60"
            />
            <button 
              type="submit" 
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg text-xs font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Growth Signals Card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition md:col-span-1">
          <div className="flex items-center space-x-2.5 text-violet-400 mb-3">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold text-white font-outfit">Hiring & Growth Triggers</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">We look for these signals to determine timing:</p>
          <div className="space-y-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1">
            {icp.growthSignals.map((signal, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg font-medium"
              >
                <span className="line-clamp-1">{signal}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSignal(idx)}
                  className="text-zinc-500 hover:text-red-400 transition ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddSignal} className="flex space-x-2">
            <input
              type="text"
              value={newSignal}
              onChange={(e) => setNewSignal(e.target.value)}
              placeholder="Add hiring trigger (e.g. Hiring CMO)..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500/60"
            />
            <button 
              type="submit" 
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg text-xs font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-lg shadow-violet-600/20 font-outfit"
        >
          <span>Map Pain Points</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
