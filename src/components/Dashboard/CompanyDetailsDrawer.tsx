"use client";

import React from "react";
import { Account, useSignalScout } from "@/context/SignalScoutContext";
import { X, Target, Users2, Send, Lightbulb, Compass, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyDetailsDrawerProps {
  account: Account | null;
  onClose: () => void;
}

export default function CompanyDetailsDrawer({ account, onClose }: CompanyDetailsDrawerProps) {
  const { signals } = useSignalScout();
  if (!account) return null;

  const getTierName = (tier: 1 | 2 | 3 | 4) => {
    switch(tier) {
      case 1: return "Tier 1 - Contact Immediately";
      case 2: return "Tier 2 - Contact This Week";
      case 3: return "Tier 3 - Nurture";
      default: return "Tier 4 - Monitor";
    }
  };

  const getTierColor = (tier: 1 | 2 | 3 | 4) => {
    switch(tier) {
      case 1: return "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";
      case 2: return "text-amber-400 border-amber-900/40 bg-amber-950/20";
      case 3: return "text-blue-400 border-blue-900/40 bg-blue-950/20";
      default: return "text-zinc-400 border-zinc-850 bg-zinc-900";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative w-full max-w-lg bg-zinc-950 border-l border-zinc-900 shadow-2xl h-full z-10 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div>
            <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-bold uppercase tracking-wider ${getTierColor(account.priorityTier)}`}>
              {getTierName(account.priorityTier)}
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1.5 font-outfit">
              {account.company_name}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">{account.domain}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Score Formula Math Panel (Stage 7 & 8) */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Explainable Qualification Score</span>
              <span className="text-2xl font-black font-outfit text-white">
                {account.opportunityScore}<span className="text-xs font-normal text-zinc-500"> / 100</span>
              </span>
            </div>
            {/* Horizontal progress bar segmentation */}
            <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden flex mb-4">
              <div className="h-full bg-emerald-500" style={{ width: `${account.icpFit * 0.4}%` }} title="ICP Fit contribution" />
              <div className="h-full bg-amber-500" style={{ width: `${account.intent * 0.25}%` }} title="Intent contribution" />
              <div className="h-full bg-blue-500" style={{ width: `${account.timing * 0.15}%` }} title="Timing contribution" />
              <div className="h-full bg-purple-500" style={{ width: `${account.signalScore * 0.2}%` }} title="Signal contribution" />
            </div>
            {/* Score Grid Breakdown */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-zinc-400">
              <div className="bg-zinc-950 border border-zinc-900/50 rounded-lg p-2">
                <p className="font-bold text-emerald-400 font-mono">{account.icpFit}</p>
                <p className="text-[8px] text-zinc-550 uppercase font-semibold mt-0.5">ICP Fit (40%)</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/50 rounded-lg p-2">
                <p className="font-bold text-amber-400 font-mono">{account.intent}</p>
                <p className="text-[8px] text-zinc-550 uppercase font-semibold mt-0.5">Intent (25%)</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/50 rounded-lg p-2">
                <p className="font-bold text-blue-400 font-mono">{account.timing}</p>
                <p className="text-[8px] text-zinc-550 uppercase font-semibold mt-0.5">Timing (15%)</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/50 rounded-lg p-2">
                <p className="font-bold text-purple-400 font-mono">{account.signalScore}</p>
                <p className="text-[8px] text-zinc-550 uppercase font-semibold mt-0.5">Signals (20%)</p>
              </div>
            </div>
          </div>

          {/* Why This Account (Stage 8) */}
          <div>
            <div className="flex items-center space-x-2 text-zinc-300 mb-3 border-b border-zinc-900 pb-2">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-outfit">Qualification Reasons</h3>
            </div>
            <ul className="space-y-2.5">
              {account.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-400">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technographic Match details */}
          <div>
            <div className="flex items-center space-x-2 text-zinc-300 mb-3 border-b border-zinc-900 pb-2">
              <Compass className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-outfit">Technographics Detected</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {account.techStack.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-xs font-medium text-zinc-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Buying Committee Mapping (Stage 9) */}
          <div>
            <div className="flex items-center space-x-2 text-zinc-300 mb-3 border-b border-zinc-900 pb-2">
              <Users2 className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-outfit">Buying Committee Map</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Economic Buyer</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{account.buyingCommittee.economic}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Technical Buyer</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{account.buyingCommittee.technical}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">GTM Champion</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{account.buyingCommittee.champion}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Target User</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{account.buyingCommittee.endUser}</p>
              </div>
            </div>
          </div>

          {/* GTM Recommendations (Stage 10) */}
          <div>
            <div className="flex items-center space-x-2 text-zinc-300 mb-3 border-b border-zinc-900 pb-2">
              <Send className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-outfit">Outbound GTM Recommendation</h3>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4.5 space-y-3.5 text-xs">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Recommended Contact Persona</span>
                <p className="font-semibold text-zinc-200 mt-0.5">{account.gtmRecommendations.contact}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Why They Care / Motivation Trigger</span>
                <p className="text-zinc-300 mt-0.5 leading-relaxed">{account.gtmRecommendations.reason}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Identified Target Pain</span>
                <p className="text-zinc-300 mt-0.5 leading-relaxed">{account.gtmRecommendations.pain}</p>
              </div>
              <div className="p-3 bg-violet-950/10 border border-violet-900/20 rounded-lg">
                <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider block">Suggested Pitch Angle</span>
                <p className="text-zinc-200 font-medium mt-1 leading-relaxed italic">
                  "{account.gtmRecommendations.angle}"
                </p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
