"use client";

import React from "react";
import { useSignalScout } from "@/context/SignalScoutContext";
import { 
  LayoutDashboard, 
  TableProperties, 
  SlidersHorizontal, 
  Activity, 
  ChevronsLeft, 
  ChevronsRight, 
  LogOut,
  Target
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  const { setStep, accounts } = useSignalScout();

  const navItems = [
    { id: "dashboard", label: "Analytics Overview", icon: LayoutDashboard },
    { id: "accounts", label: "Prioritized Accounts", icon: TableProperties, badge: accounts.length },
    { id: "signals", label: "Signal Tuning", icon: SlidersHorizontal },
    { id: "feed", label: "Intelligence Feed", icon: Activity }
  ];

  return (
    <aside 
      className={`bg-zinc-950 border-r border-zinc-900 flex flex-col transition-all duration-300 relative ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 justify-between border-b border-zinc-900">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="p-1.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-lg shrink-0">
            <Target className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-sm tracking-tight text-white font-outfit truncate">
              SignalScout <span className="text-violet-400">AI</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-300 transition"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse button when collapsed */}
      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          className="absolute -right-3.5 top-20 bg-zinc-950 border border-zinc-850 p-1 rounded-full text-zinc-500 hover:text-zinc-300 shadow-md transition z-20"
        >
          <ChevronsRight className="w-3 h-3" />
        </button>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold tracking-wide transition relative group ${
                isActive 
                  ? "bg-violet-600/15 border border-violet-500/20 text-violet-400" 
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${collapsed ? "mx-auto" : "mr-3"}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="absolute right-3.5 bg-zinc-900 border border-zinc-850 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-zinc-400">
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-16 bg-zinc-900 border border-zinc-850 text-white text-[10px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-zinc-900">
        <button
          onClick={() => setStep(1)}
          className="w-full flex items-center p-2.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-950/10 transition group"
        >
          <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? "mx-auto" : "mr-3"}`} />
          {!collapsed && <span>Reset Campaign</span>}
          {collapsed && (
            <div className="absolute left-16 bg-zinc-900 border border-zinc-850 text-red-400 text-[10px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-xl">
              Reset Campaign
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
