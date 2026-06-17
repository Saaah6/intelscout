"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import KPIWidgets from "./KPIWidgets";
import AnalyticsCharts from "./AnalyticsCharts";
import AccountsTable from "./AccountsTable";
import CompanyDetailsDrawer from "./CompanyDetailsDrawer";
import IntelligenceFeed from "./IntelligenceFeed";
import SettingsPanel from "./SettingsPanel";
import { Account } from "@/context/SignalScoutContext";
import { AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleRevealInsights = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleCloseDrawer = () => {
    setSelectedAccount(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 flex-1 flex flex-col">
            <KPIWidgets />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-start">
              <div className="xl:col-span-2 space-y-6 flex flex-col h-full">
                <AnalyticsCharts />
                <AccountsTable onRevealInsights={handleRevealInsights} />
              </div>
              <div className="h-full">
                <IntelligenceFeed />
              </div>
            </div>
          </div>
        );
      case "accounts":
        return (
          <div className="flex-1 flex flex-col h-full">
            <AccountsTable onRevealInsights={handleRevealInsights} />
          </div>
        );
      case "signals":
        return (
          <div className="flex-1 flex flex-col h-full items-center">
            <SettingsPanel />
          </div>
        );
      case "feed":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
            <div className="md:col-span-2">
              <IntelligenceFeed />
            </div>
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 text-xs text-zinc-400 space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider font-outfit">Feed Configuration</h4>
              <p>
                The intelligence feed displays alerts from our crawler as they happen.
              </p>
              <p>
                As accounts trigger events in the background, they automatically get priority bumps and move up our prioritizations matrices.
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                <span className="font-bold text-zinc-300 block mb-1">Active Crawler Gateways:</span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-500">
                  <li>sec_hiring (Security Positions)</li>
                  <li>comp_hiring (Compliance / GTM Positions)</li>
                  <li>soc2_ment (Job Specifications crawling)</li>
                  <li>trust_center (Homepage audit scan)</li>
                  <li>ent_pricing (SaaS package matrices check)</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setSidebarCollapsed={setSidebarCollapsed}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Tab Viewport */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          {renderTabContent()}
        </main>

      </div>

      {/* Slide-over Insights Drawer */}
      <AnimatePresence>
        {selectedAccount && (
          <CompanyDetailsDrawer 
            account={selectedAccount} 
            onClose={handleCloseDrawer} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
