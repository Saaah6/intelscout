"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { List, Shield } from "@phosphor-icons/react";

interface NavbarProps {
  activeTab: string;
  setSidebarCollapsed: (v: boolean) => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ activeTab, setSidebarCollapsed, sidebarCollapsed }: NavbarProps) {
  const { offer, userRole, setUserRole } = useSignalScout();

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Analytics Console";
      case "accounts": return "Accounts Prioritization Engine";
      case "signals": return "Dynamic Signal Configurations";
      case "feed": return "GTM Intelligence Feed";
      case "audience": return "Audience & Auth Logs";
      default: return "Dashboard";
    }
  };

  return (
    <header className="h-16 bg-zinc-950/60 backdrop-blur-md border-b border-zinc-900 px-6 flex items-center justify-between shrink-0 z-30">
      
      {/* View Title */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-300 md:hidden transition"
        >
          <List className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white font-outfit">{getTitle()}</h1>
          <p className="text-[10px] text-zinc-400 font-medium hidden md:block">
            Offer: <span className="text-violet-400 font-semibold">{offer.sell}</span> &bull; deal size: <span className="text-zinc-300">{offer.dealSize}</span>
          </p>
        </div>
      </div>

      {/* Status Indicators & RBAC Selector */}
      <div className="flex items-center space-x-3.5">
        
        {/* Role Selector dropdown */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900/60 border border-zinc-850 rounded-xl relative">
          <Shield className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider hidden sm:inline">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="bg-transparent text-[9px] font-bold text-zinc-300 focus:outline-none cursor-pointer uppercase tracking-wider pr-1 border-none focus:ring-0 outline-none"
          >
            <option value="admin" className="bg-zinc-950 text-zinc-350">Admin</option>
            <option value="sales" className="bg-zinc-950 text-zinc-350">Sales Rep</option>
            <option value="marketing" className="bg-zinc-950 text-zinc-350">Marketing</option>
          </select>
        </div>

        {/* Pulsing Crawler Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-900/80 border border-zinc-850 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden lg:inline">
            GTM Crawler Live
          </span>
        </div>

        {/* Protection / Sandbox Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-violet-950/20 border border-violet-900/30 text-violet-400 rounded-xl">
          <span className="relative w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">
            AI Active
          </span>
        </div>

      </div>

    </header>
  );
}
