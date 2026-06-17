"use client";

import React, { useState } from "react";
import { Account, useSignalScout, getOfferCategory, Offer } from "@/context/SignalScoutContext";
import { X, Target, Users2, Send, Lightbulb, Compass, Zap, Flame, Sparkles, MessageSquare, Clipboard, PhoneCall, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyDetailsDrawerProps {
  account: Account | null;
  onClose: () => void;
}

export default function CompanyDetailsDrawer({ account, onClose }: CompanyDetailsDrawerProps) {
  const { signals, offer, credits, setCredits, userRole } = useSignalScout();
  const isMarketing = userRole === "marketing";
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // AI Outreach Copilot parameters
  const [channel, setChannel] = useState<"email" | "linkedin" | "call">("email");
  const [tone, setTone] = useState<"professional" | "friendly" | "bold" | "value">("professional");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState("");

  if (!account) return null;

  const generateOutreachContent = (
    acc: Account,
    off: Offer,
    chan: "email" | "linkedin" | "call",
    t: "professional" | "friendly" | "bold" | "value",
    promptText: string
  ) => {
    const championName = acc.buyingCommittee.champion;
    const championFirstName = championName.split(" ")[0] || "there";
    const company = acc.company_name;
    const detectedTech = acc.techStack.slice(0, 2).join(" and ") || "your tech stack";
    
    // Resolve GTM category from offer
    const category = getOfferCategory(off.sell);
    
    // Check custom prompt keywords for adjustments
    const lowerPrompt = promptText.toLowerCase();
    const isShort = lowerPrompt.includes("short") || lowerPrompt.includes("brief") || lowerPrompt.includes("under") || lowerPrompt.includes("limit");
    
    let subject = "";
    let body = "";

    if (chan === "email") {
      // Subjects
      if (t === "professional") {
        subject = `Regarding GTM scalability and operational overhead at ${company}`;
      } else if (t === "friendly") {
        subject = `Quick question about ${company}'s tech stack`;
      } else if (t === "bold") {
        subject = `Scaling pipeline at ${company} - direct offer`;
      } else {
        subject = `Free audit report regarding GTM efficiency for ${company}`;
      }

      // Bodies
      if (t === "professional") {
        body = `Hi ${championFirstName},

I hope this email finds you well. I'm reaching out because I noticed ${company} is currently expanding its operational footprint while utilizing ${detectedTech}. 

As you navigate this stage of growth, managing pipeline efficiency can divert considerable focus from your core development cycles. We built ${off.sell} specifically to resolve this bottleneck—helping teams automate target segments, personalize outreach, and address identified operational friction.

Given your role as ${acc.buyingCommittee.champion}, I wanted to see if you'd be open to a brief 10-minute introductory call next Tuesday at 10 AM to discuss how we might optimize similar workflows at ${company}?

Best regards,

[Your Name]
GTM Analyst, SignalScout`;
      } else if (t === "friendly") {
        body = `Hi ${championFirstName},

Hope you're having a great week! 

I was browsing through ${company}'s technographics and noticed you guys are running a stack with ${detectedTech}. It's a solid setup, but we've found that scaling teams often run into manual bottlenecks when mapping data triggers to active campaigns.

We developed ${off.sell} as a simple solution to automate that entire flow, saving teams about 15-20 hours a week. Just wanted to drop you a quick line and see if you'd be interested in taking a look at a 2-minute demo?

Cheers,

[Your Name]
SignalScout`;
      } else if (t === "bold") {
        body = `Hi ${championFirstName},

Let's skip the fluff. Right now, ${company} is hiring for core roles, which usually indicates an influx of operational overhead and potential process leaks.

We solve this problem at its root. With ${off.sell}, we help organizations pass compliance checks, optimize sales pipeline speed, and reduce CPA by up to 40% using automated target intelligence.

Are you open to a direct 10-minute call this Thursday at 2 PM to see if we're a fit for ${company}? If not, no worries at all.

Best,

[Your Name]
Outbound Lead, SignalScout`;
      } else { // value-first
        body = `Hi ${championFirstName},

I hope you're doing well. I put together a quick, custom analysis of ${company}'s current public indicators. 

Based on your tech stack involving ${detectedTech} and active growth triggers, we've identified three specific areas where outbound operational efficiency could be improved:
1. Automated segment alignment to eliminate manual data entry.
2. Real-time signal tracking to optimize campaign timing.
3. Tech stack synchronization to prevent prospect leakage.

We've automated these fixes via ${off.sell}. If you'd like, I can send over the full PDF report or discuss the findings in a quick 5-minute sync?

Warm regards,

[Your Name]
GTM Architect, SignalScout`;
      }

      if (isShort) {
        body = `Hi ${championFirstName},\n\nI noticed ${company} is scaling and using ${detectedTech}. We built ${off.sell} to specifically automate target qualification, cutting manual work by 50%.\n\nWould you be open to a 5-minute call next Tuesday at 11 AM to see how this fits your roadmap?\n\nBest,\n[Your Name]`;
      }

      // Prepend subject
      return `Subject: ${subject}\n\n${body}`;

    } else if (chan === "linkedin") {
      if (t === "professional") {
        body = `Hi ${championFirstName}, I noticed your role as ${acc.buyingCommittee.champion} at ${company}. Given your stack with ${detectedTech}, I'd love to connect to share insights on how other growing teams are automating GTM pipelines and reducing developer overhead. Let's connect!`;
      } else if (t === "friendly") {
        body = `Hi ${championFirstName}! I saw you're leading team workflows at ${company}. Love what you guys are building. Would love to connect and keep up with your growth milestones this year. Cheers!`;
      } else if (t === "bold") {
        body = `Hey ${championFirstName}, congrats on the recent growth triggers at ${company}! If you're looking to automate outbound outreach and solve GTM leaks, let's connect. I have a brief idea that might save your team 20+ hours a week.`;
      } else {
        body = `Hi ${championFirstName}, I compiled a short technographic comparison report for ${company} showing optimizations for ${detectedTech}. I'd love to connect and send it over if you find it interesting.`;
      }

      if (promptText) {
        body += `\n\n[Custom instructions applied: "${promptText}"]`;
      }
      return body;

    } else { // Call Script
      return `[Cold Call Script - Tone: ${t.toUpperCase()}]
[Target Info: ${company} | Champion: ${championName} (${acc.buyingCommittee.champion})]

📞 INTRO:
"Hi ${championName}, this is [Your Name] from SignalScout. I know I caught you out of the blue, do you have 45 seconds to see if this is worth your time?"

🚀 ELEVATOR PITCH:
"The reason I'm calling is I noticed ${company} is using ${detectedTech} and scaling active hiring. Typically, ${acc.buyingCommittee.champion}s tell us they are wasting hours of engineering cycles or sales time manually mapping compliance and outreach targets.
We built ${off.sell} to automate that entire signal qualification, allowing you to pass reviews in days and scale pipeline with zero manual input."

🙋 OBJECTIONS:
- If "Too busy": "Completely understand. That's why I wanted to schedule a specific 10-minute slot next Tuesday at 11 AM so we don't disrupt your day. Does that work?"
- If "No budget": "No problem, we aren't asking for budget today. I just want to show you how we cut setup costs by 40% so you have the data for when you are ready."

🎯 THE CTA:
"Do you have your calendar handy for a quick 10-minute Zoom call next Wednesday at 2 PM to explore this?"

${promptText ? `[Note: Custom instruction: "${promptText}"]` : ""}`;
    }
  };

  const handleGenerateOutreach = () => {
    if (isMarketing || credits <= 0) return;
    setIsGenerating(true);
    setAiResponse(null);
    setLoadingStep("Scanning target company technographics...");
    setCredits(credits - 1);

    setTimeout(() => {
      setLoadingStep("Identifying Buying Committee champion...");
      setTimeout(() => {
        setLoadingStep("Synthesizing buying trigger points...");
        setTimeout(() => {
          setLoadingStep("Drafting custom pitch copy with GPT-4...");
          setTimeout(() => {
            const output = generateOutreachContent(account, offer, channel, tone, customPrompt);
            setAiResponse(output);
            setIsGenerating(false);
            setLoadingStep("");
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleCopyEmail = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
              {/* AI Outreach Copilot Panel */}
          <div className="border-t border-zinc-900 pt-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <div className="flex items-center space-x-2 text-zinc-350">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-outfit">AI Outreach Copilot</h3>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-mono text-zinc-550 uppercase">Limit:</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${credits > 0 ? "bg-zinc-900 text-violet-400" : "bg-red-950/40 border border-red-900/30 text-red-400"}`}>
                  {credits} / 5 req/min
                </span>
              </div>
            </div>

            {isMarketing ? (
              <div className="p-4 bg-red-950/20 border border-red-900/35 text-red-400 rounded-xl flex items-start space-x-3 text-xs leading-normal">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase tracking-wide mb-0.5">Access Restricted</span>
                  <span>AI outreach response generation is restricted to Sales and GTM Administrator roles. Switch your role in the navigation bar to proceed.</span>
                </div>
              </div>
            ) : (
              <>
                {/* Select Channel */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Select Channel</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => { setChannel("email"); setAiResponse(null); }}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        channel === "email" 
                          ? "bg-violet-950/20 border-violet-900/60 text-violet-400" 
                          : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:border-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => { setChannel("linkedin"); setAiResponse(null); }}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        channel === "linkedin" 
                          ? "bg-violet-950/20 border-violet-900/60 text-violet-400" 
                          : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:border-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => { setChannel("call"); setAiResponse(null); }}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        channel === "call" 
                          ? "bg-violet-950/20 border-violet-900/60 text-violet-400" 
                          : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:border-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Script</span>
                    </button>
                  </div>
                </div>

                {/* Select Tone */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider block mb-2">Outreach Tone</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(["professional", "friendly", "bold", "value"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTone(t); setAiResponse(null); }}
                        className={`py-1.5 border rounded-lg text-[9px] font-bold uppercase tracking-wider transition capitalize cursor-pointer ${
                          tone === t 
                            ? "bg-zinc-900 border-zinc-700 text-white" 
                            : "bg-zinc-950 border-zinc-900/50 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Custom Prompts */}
                <div>
                  <label htmlFor="custom-prompt" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Additional Instructions / Context</label>
                  <textarea
                    id="custom-prompt"
                    rows={2}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Keep under 80 words, mention competitor is Stripe, focus on database caching speed..."
                    className="w-full bg-zinc-955 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition resize-none bg-zinc-950"
                  />
                </div>

                {/* Rate limit warning */}
                {credits <= 0 && (
                  <div className="p-3 bg-amber-955/20 border border-amber-900/30 text-amber-500 rounded-xl flex items-start space-x-2.5 text-xs leading-normal">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <span>Rate limit exceeded (5 requests/min). AI quota resets in 15 seconds. Please wait or upgrade.</span>
                  </div>
                )}

                {/* Generate Trigger */}
                <button
                  onClick={handleGenerateOutreach}
                  disabled={isGenerating || credits <= 0}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-violet-600/10 font-outfit cursor-pointer disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 shrink-0" />
                  )}
                  <span>{isGenerating ? "AI Outreach Agent working..." : "Generate AI Outreach Copy"}</span>
                </button>

                {/* Simulated Agent progress */}
                {isGenerating && (
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center space-x-3 text-xs text-zinc-400">
                    <Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0" />
                    <span className="animate-pulse font-medium">{loadingStep}</span>
                  </div>
                )}

                {/* Response Display Box */}
                {aiResponse && !isGenerating && (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 relative group">
                    <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-zinc-900">
                      <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider block">AI Generated Outbound Copy</span>
                      <button
                        onClick={handleCopyEmail}
                        className="text-[10px] text-zinc-400 hover:text-white font-semibold transition cursor-pointer flex items-center space-x-1"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-[11px] text-zinc-350 leading-relaxed font-mono whitespace-pre-wrap break-words">
                      {aiResponse}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>        </div>

        </div>
      </motion.div>
    </div>
  );
}
