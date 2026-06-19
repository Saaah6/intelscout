"use client";

import React, { useEffect } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { Terminal, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

export default function ResearchEngine() {
  const { 
    accounts, 
    setStep, 
    researchProgress, 
    setResearchProgress, 
    consoleLogs, 
    addConsoleLog, 
    clearConsoleLogs 
  } = useIntelScout();

  useEffect(() => {
    clearConsoleLogs();
    setResearchProgress(0);
    
    if (accounts.length === 0) {
      addConsoleLog("Warning: No accounts imported. Initializing default crawl queue...");
      return;
    }

    addConsoleLog(`Initialized GTM research engine. Queue depth: ${accounts.length} accounts.`);
    addConsoleLog("Establishing secure connection gateways...");
    addConsoleLog("Loading heuristics and technographic signatures...");

    let accountIdx = 0;
    let stage = 0; // 0: crawl, 1: tech, 2: jobs, 3: score, 4: next
    
    const interval = setInterval(() => {
      if (accountIdx >= accounts.length) {
        clearInterval(interval);
        setResearchProgress(100);
        addConsoleLog("------------------------------------------------------------------");
        addConsoleLog("🎉 qualification pipeline completed successfully.");
        addConsoleLog(`Scanned: ${accounts.length} | Qualified: ${accounts.filter(a => a.opportunityScore >= 70).length} High Priority.`);
        addConsoleLog("Redirecting to GTM Operating System Workspace...");
        
        // Auto transition after a brief pause
        setTimeout(() => {
          setStep("dashboard");
        }, 2500);
        return;
      }

      const currentAcc = accounts[accountIdx];
      const progressPercent = Math.round((accountIdx / accounts.length) * 100);
      setResearchProgress(progressPercent);

      switch(stage) {
        case 0:
          addConsoleLog(`[SCAN] [${currentAcc.domain}] Fetching landing page and meta headers...`);
          stage++;
          break;
        case 1:
          addConsoleLog(`[TECH] [${currentAcc.domain}] Detected libraries: ${currentAcc.techStack.join(", ")}.`);
          stage++;
          break;
        case 2:
          addConsoleLog(`[JOBS] [${currentAcc.domain}] Scraping jobs listing board... ${currentAcc.signalsDetected.length} signals identified.`);
          stage++;
          break;
        case 3:
          addConsoleLog(`[QUAL] [${currentAcc.domain}] FIT: ${currentAcc.icpFit} | INTENT: ${currentAcc.intent} | TIMING: ${currentAcc.timing} -> OPP: ${currentAcc.opportunityScore}`);
          stage++;
          break;
        case 4:
          addConsoleLog(`[DONE] [${currentAcc.domain}] Priority assigned to Tier ${currentAcc.priorityTier}. Crawl node released.`);
          stage = 0;
          accountIdx++;
          break;
      }
    }, 280); // Speed up log generation for premium fast responsiveness

    return () => clearInterval(interval);
  }, [accounts, setStep, setResearchProgress, clearConsoleLogs, addConsoleLog]);

  return (
    <div className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col h-[520px]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${researchProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
        <div className="flex items-center space-x-2 text-[#111]">
          <Terminal className="w-5 h-5" />
          <h3 className="font-semibold text-[#111] font-outfit text-sm">GTM Engine Crawler logs</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[#888]">Progress:</span>
          <span className="font-mono font-bold text-[#111] bg-[#fafafa] px-2 py-1 border border-black/10 rounded">
            {researchProgress}%
          </span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-white/50 backdrop-blur-md border border-black/5 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-[#666] overflow-y-auto space-y-2 shadow-[inset_0_4px_15px_rgba(0,0,0,0.03)] scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
        {consoleLogs.map((log, index) => {
          // Parse: [TIMESTAMP] [TAG] [DOMAIN] Message
          const regex = /^(\[[^\]]+\])\s*(?:(\[[^\]]+\])\s*)?(?:(\[[^\]]+\])\s*)?(.*)$/;
          const match = log.match(regex);
          
          if (!match) {
            return <p key={index} className="text-[#666]">{log}</p>;
          }

          const timestamp = match[1];
          const tag = match[2];
          const domain = match[3];
          const message = match[4];

          let tagColor = "text-[#666]";
          if (tag) {
            if (tag.includes("[SCAN]")) tagColor = "text-blue-500 font-bold";
            else if (tag.includes("[TECH]")) tagColor = "text-amber-500 font-bold";
            else if (tag.includes("[JOBS]")) tagColor = "text-violet-500 font-bold";
            else if (tag.includes("[QUAL]")) tagColor = "text-emerald-500 font-bold";
            else if (tag.includes("[DONE]")) tagColor = "text-[#111] font-bold";
          }

          let msgColor = "text-[#555]";
          if (message.includes("🎉")) msgColor = "text-emerald-600 font-semibold";
          else if (message.includes("Warning")) msgColor = "text-amber-600";

          return (
            <div key={index} className="flex items-start gap-1.5 font-mono break-all sm:break-normal">
              <span className="text-[#aaa] shrink-0">{timestamp}</span>
              {tag && <span className={`${tagColor} shrink-0`}>{tag}</span>}
              {domain && <span className="text-[#888] shrink-0">{domain}</span>}
              <span className={msgColor}>{message}</span>
            </div>
          );
        })}
      </div>

      {/* Finishing Status Overlay */}
      {researchProgress === 100 && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 text-emerald-700 text-sm font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span>Research Audit Complete. Launching GTM Console...</span>
          </div>
          <button
            onClick={() => setStep("dashboard")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Enter Console</span>
          </button>
        </div>
      )}
    </div>
  );
}
