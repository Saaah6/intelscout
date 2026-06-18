"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { Pulse, ShieldCheck, Flame, Info } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntelligenceFeed() {
  const { feedEvents } = useSignalScout();

  const getEventIcon = (type: "strong" | "medium" | "weak") => {
    switch (type) {
      case "strong": return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "medium": return <Flame className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getEventBorderColor = (type: "strong" | "medium" | "weak") => {
    switch (type) {
      case "strong": return "border-emerald-900/30 bg-emerald-950/5";
      case "medium": return "border-amber-900/30 bg-amber-950/5";
      default: return "border-blue-900/30 bg-blue-950/5";
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 shadow-lg flex flex-col h-full overflow-hidden min-h-[400px]">
      
      {/* Title */}
      <div className="flex items-center space-x-2 mb-4 border-b border-zinc-850/60 pb-3">
        <Pulse className="w-4 h-4 text-violet-400 animate-pulse" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">Live GTM Signal Feed</h3>
      </div>

      <p className="text-[10px] text-zinc-500 mb-4">
        Dynamic intent triggers crawling from domain headers, job listings, and news channels in real-time.
      </p>

      {/* Events Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {feedEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <Pulse className="w-8 h-8 text-zinc-655 mb-2.5 animate-spin" />
              <p className="text-xs text-zinc-550 font-medium">Listening for GTM trigger webhooks...</p>
            </div>
          ) : (
            feedEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 15, stiffness: 150 }}
                className={`p-3.5 border rounded-xl flex items-start space-x-3 hover:border-zinc-800 transition ${getEventBorderColor(event.type)}`}
              >
                <div className="p-1.5 bg-zinc-950 border border-zinc-850 rounded-lg shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-white truncate font-outfit">
                      {event.companyName}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 shrink-0">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                    {event.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
