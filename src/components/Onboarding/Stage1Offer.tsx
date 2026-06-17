"use client";

import React, { useState } from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { ArrowRight, Compass, HelpCircle } from "lucide-react";

export default function Stage1Offer() {
  const { offer, setOffer, generateWorkspace, setStep } = useSignalScout();
  const [sell, setSell] = useState(offer.sell);
  const [problem, setProblem] = useState(offer.problem);
  const [dealSize, setDealSize] = useState(offer.dealSize);
  const [salesCycle, setSalesCycle] = useState(offer.salesCycle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sell || !problem) return;
    setOffer({ sell, problem, dealSize, salesCycle });
    generateWorkspace();
    setStep(2);
  };

  const loadExample = (exSell: string, exProblem: string, exSize: string, exCycle: string) => {
    setSell(exSell);
    setProblem(exProblem);
    setDealSize(exSize);
    setSalesCycle(exCycle);
  };

  return (
    <div className="w-full max-w-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Define Your Offer</h2>
          <p className="text-sm text-zinc-400">Describe what you sell so SignalScout can compile your GTM blueprint.</p>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Quick Examples</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => loadExample("AI Compliance Platform", "Reduce compliance effort and automate SOC2 audits", "$20,000-$100,000", "Medium")}
            className="text-left p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-violet-500/30 hover:bg-zinc-800/40 transition text-xs group"
          >
            <p className="font-semibold text-zinc-200 group-hover:text-violet-400">AI Compliance Software</p>
            <p className="text-zinc-500 line-clamp-1 mt-0.5">Automates audits & reviews</p>
          </button>
          <button
            type="button"
            onClick={() => loadExample("Cybersecurity Service", "Proactive penetration testing and dark web monitoring", "$5,000-$20,000", "Short")}
            className="text-left p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-violet-500/30 hover:bg-zinc-800/40 transition text-xs group"
          >
            <p className="font-semibold text-zinc-200 group-hover:text-violet-400">Cybersecurity Consultant</p>
            <p className="text-zinc-500 line-clamp-1 mt-0.5">Penetration testing & risk mapping</p>
          </button>
          <button
            type="button"
            onClick={() => loadExample("DevTools Product", "Speed up CI/CD pipelines and caching layers", "<$1,000", "Short")}
            className="text-left p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-violet-500/30 hover:bg-zinc-800/40 transition text-xs group"
          >
            <p className="font-semibold text-zinc-200 group-hover:text-violet-400">DevTools Platform</p>
            <p className="text-zinc-500 line-clamp-1 mt-0.5">CI/CD caching tool</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="sell-input" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">What do you sell?</label>
          <input
            id="sell-input"
            type="text"
            value={sell}
            onChange={(e) => setSell(e.target.value)}
            placeholder="e.g. HR SaaS, Cloud Security Tools, Performance Marketing Agency..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="problem-input" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">What critical problem do you solve?</label>
          <textarea
            id="problem-input"
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. Help companies pass SOC2 audits, reduce cloud infrastructure cost, automate candidate hiring filters..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deal-size-select" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Average Deal Size (ACV)</label>
            <select
              id="deal-size-select"
              value={dealSize}
              onChange={(e) => setDealSize(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition"
            >
              <option value="<$1,000">&lt;$1,000</option>
              <option value="$1,000-$5,000">$1,000 - $5,000</option>
              <option value="$5,000-$20,000">$5,000 - $20,000</option>
              <option value="$20,000-$100,000">$20,000 - $100,000</option>
              <option value="$100,000+">$100,000+</option>
            </select>
          </div>

          <div>
            <label htmlFor="sales-cycle-select" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Sales Cycle Time</label>
            <select
              id="sales-cycle-select"
              value={salesCycle}
              onChange={(e) => setSalesCycle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition"
            >
              <option value="Short">Short (1-15 days)</option>
              <option value="Medium">Medium (15-60 days)</option>
              <option value="Long">Long (60+ days)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!sell || !problem}
          className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-medium text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-violet-600/20 font-outfit"
        >
          <span>Generate Ideal Customer Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
