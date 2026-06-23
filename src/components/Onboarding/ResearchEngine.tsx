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

    let isSubscribed = true;

    async function startCrawl() {
      try {
        const response = await fetch("/api/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accounts,
            productOffer: "AI Compliance Platform", // In a real app, pull from context
            icp: "Mid-market to Enterprise SaaS",   // In a real app, pull from context
          })
        });

        if (!response.ok) {
          addConsoleLog(`Error: Backend returned ${response.status} ${response.statusText}`);
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) return;

        while (isSubscribed) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          let eolIndex;
          while ((eolIndex = buffer.indexOf("\n\n")) >= 0) {
            const eventChunk = buffer.slice(0, eolIndex);
            buffer = buffer.slice(eolIndex + 2);

            const lines = eventChunk.split("\n");
            let eventType = "message";
            let data = "";

            for (const line of lines) {
              if (line.startsWith("event: ")) {
                eventType = line.substring(7).trim();
              } else if (line.startsWith("data: ")) {
                data += line.substring(6);
              }
            }

            if (data) {
              if (eventType === "result") {
                // Here you would typically update the specific account in context
                // For now, we'll just log that it was received
                const parsed = JSON.parse(data);
                addConsoleLog(`[SYSTEM] Received structured intel for ${parsed.domain}`);
              } else if (eventType === "done") {
                setResearchProgress(100);
                setTimeout(() => {
                  if (isSubscribed) setStep("dashboard");
                }, 2500);
              } else {
                // Regular log message
                addConsoleLog(data);
                
                // Naive progress estimation based on log length
                setResearchProgress(prev => Math.min(99, prev + (100 / (accounts.length * 5))));
              }
            }
          }
        }
      } catch (err) {
        if (isSubscribed) {
          addConsoleLog(`Error: Failed to connect to GTM Engine (${err})`);
        }
      }
    }

    startCrawl();

    return () => {
      isSubscribed = false;
    };
  }, [accounts, setStep, setResearchProgress, clearConsoleLogs, addConsoleLog]);

  return (
    <div className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col h-[520px]">
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
