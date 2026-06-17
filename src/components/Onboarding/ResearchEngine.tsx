"use client";

import React, { useEffect } from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { Terminal, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ResearchEngine() {
  const { 
    accounts, 
    setStep, 
    researchProgress, 
    setResearchProgress, 
    consoleLogs, 
    addConsoleLog, 
    clearConsoleLogs 
  } = useSignalScout();

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
    <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-850 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-[520px]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${researchProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
        <div className="flex items-center space-x-2 text-violet-400">
          <Terminal className="w-5 h-5" />
          <h3 className="font-semibold text-white font-outfit text-sm">GTM Engine Crawler logs</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-zinc-500">Progress:</span>
          <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-1 border border-zinc-850 rounded">
            {researchProgress}%
          </span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-black/40 border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-400 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {consoleLogs.map((log, index) => {
          let logColor = "text-zinc-400";
          if (log.includes("[SCAN]")) logColor = "text-blue-400/90";
          else if (log.includes("[TECH]")) logColor = "text-amber-400/90";
          else if (log.includes("[JOBS]")) logColor = "text-violet-400/90";
          else if (log.includes("[QUAL]")) logColor = "text-emerald-400/90";
          else if (log.includes("[DONE]")) logColor = "text-zinc-200 font-semibold";
          else if (log.includes("🎉")) logColor = "text-emerald-400 font-bold";
          
          return (
            <p key={index} className={logColor}>
              {log}
            </p>
          );
        })}
      </div>

      {/* Finishing Status Overlay */}
      {researchProgress === 100 && (
        <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 text-emerald-400 text-sm font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span>Research Audit Complete. Launching GTM Console...</span>
          </div>
          <button
            onClick={() => setStep("dashboard")}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enter Console</span>
          </button>
        </div>
      )}
    </div>
  );
}
