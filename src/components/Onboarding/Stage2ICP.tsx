"use client";

import React, { useState } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { ArrowLeft, ArrowRight, Buildings, Cpu, Sparkle, Users, Plus, X, WarningCircle, CheckCircle, Brain, CircleNotch } from "@phosphor-icons/react";

export default function Stage2ICP() {
  const { icp, setIcp, setStep, icpAnalysis, isAnalyzingIcp, analyzeBusinessIcp } = useIntelScout();
  const [newTech, setNewTech] = useState("");
  const [newSignal, setNewSignal] = useState("");
  const [newRole, setNewRole] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  if (!icp) return null;

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTech.trim()) return;
    setIcp({
      ...icp,
      technographics: [...icp.technographics, newTech.trim()]
    });
    setNewTech("");
  };

  const handleRemoveTech = (index: number) => {
    setIcp({
      ...icp,
      technographics: icp.technographics.filter((_, i) => i !== index)
    });
  };

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignal.trim()) return;
    setIcp({
      ...icp,
      growthSignals: [...icp.growthSignals, newSignal.trim()]
    });
    setNewSignal("");
  };

  const handleRemoveSignal = (index: number) => {
    setIcp({
      ...icp,
      growthSignals: icp.growthSignals.filter((_, i) => i !== index)
    });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    setIcp({
      ...icp,
      buyingCommittee: [...icp.buyingCommittee, newRole.trim()]
    });
    setNewRole("");
  };

  const handleRemoveRole = (index: number) => {
    setIcp({
      ...icp,
      buyingCommittee: icp.buyingCommittee.filter((_, i) => i !== index)
    });
  };

  const handleFirmoChange = (field: "industry" | "employeeCount" | "revenue" | "geography" | "fundingStage", value: string) => {
    setIcp({
      ...icp,
      firmographics: {
        ...icp.firmographics,
        [field]: value
      }
    });
  };

  const handleRefineWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsRefining(true);
    
    // Simulate Machine Learning processing
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      let updatedIndustry = icp.firmographics.industry;
      let newRoles = [...icp.buyingCommittee];
      
      if (promptLower.includes("health") || promptLower.includes("medical")) {
        updatedIndustry = "Healthcare, Medical Tech, Life Sciences";
        newRoles.unshift("Chief Medical Officer");
      } else if (promptLower.includes("finance") || promptLower.includes("fintech") || promptLower.includes("bank")) {
        updatedIndustry = "FinTech, Banking, Financial Services";
        newRoles.unshift("Chief Financial Officer (CFO)");
      } else if (promptLower.includes("edu")) {
        updatedIndustry = "EdTech, Higher Education";
        newRoles.unshift("Provost / Dean");
      } else {
        const words = aiPrompt.split(" ").filter(w => w.length > 4);
        if (words.length > 0) {
           const cap = words[0].charAt(0).toUpperCase() + words[0].slice(1);
           updatedIndustry = `${cap} Operations, ${icp.firmographics.industry}`;
           newRoles.unshift(`VP of ${cap}`);
        }
      }

      setIcp({
        ...icp,
        firmographics: {
          ...icp.firmographics,
          industry: updatedIndustry
        },
        buyingCommittee: [...new Set(newRoles)].slice(0, 6)
      });
      setAiPrompt("");
      setIsRefining(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl">
            <Sparkle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111] font-outfit">Ideal Customer Profile (ICP)</h2>
            <p className="text-sm text-[#555]">IntelScout compiled this profile based on your business offer. Customize it below.</p>
          </div>
        </div>
        <button
          onClick={analyzeBusinessIcp}
          disabled={isAnalyzingIcp}
          className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-70"
        >
          {isAnalyzingIcp ? <CircleNotch className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          <span>{isAnalyzingIcp ? "Analyzing..." : "Analyze Fit"}</span>
        </button>
      </div>

      {icpAnalysis && icpAnalysis.length > 0 && (
        <div className="mb-8 space-y-3">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">AI Fit Analysis</h3>
          {icpAnalysis.map((res, i) => (
            <div key={i} className={`p-4 rounded-xl border ${res.status === 'perfect' ? 'bg-emerald-50/50 border-emerald-200' : res.status === 'critical' ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200'} flex items-start space-x-3`}>
              <div className="mt-0.5">
                {res.status === 'perfect' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <WarningCircle className={`w-5 h-5 ${res.status === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />}
              </div>
              <div>
                <p className={`text-sm font-medium ${res.status === 'perfect' ? 'text-emerald-900' : res.status === 'critical' ? 'text-red-900' : 'text-amber-900'}`}>{res.message}</p>
                {res.suggestion && (
                  <p className={`text-xs mt-1 ${res.status === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>
                    <strong>Suggestion:</strong> {res.suggestion}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Refinement Prompt */}
      <div className="mb-8">
        <form onSubmit={handleRefineWithAI} className="relative shadow-sm rounded-xl overflow-hidden group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Brain className={`h-5 w-5 ${isRefining ? 'text-violet-500 animate-pulse' : 'text-violet-500'}`} />
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isRefining}
            className="block w-full pl-11 pr-28 py-4 border border-violet-200 bg-violet-50/30 placeholder-violet-400 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:text-[15px] transition-all disabled:opacity-70 text-black font-medium"
            placeholder="Refine with AI... (e.g., 'Focus strictly on enterprise healthcare' or 'We only sell to CTOs')"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              type="submit"
              disabled={isRefining || !aiPrompt.trim()}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:hover:bg-violet-600 transition flex items-center space-x-2"
            >
              {isRefining ? (
                <>
                  <CircleNotch className="w-4 h-4 animate-spin" />
                  <span>Learning...</span>
                </>
              ) : (
                <span>Improve</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Firmographics Card */}
        <div className="bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm">
          <div className="flex items-center space-x-2.5 text-[#333] mb-4">
            <Buildings className="w-5 h-5" />
            <h3 className="font-semibold text-[#111] font-outfit">Firmographics</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]">
              <span className="block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono">Target Industry</span>
              <select
                value={icp.firmographics.industry}
                onChange={(e) => handleFirmoChange("industry", e.target.value)}
                className="w-full bg-transparent text-[13px] font-semibold text-[#111] leading-snug focus:outline-none cursor-pointer p-0 m-0 pr-6"
              >
                <option value="" disabled>Select Target Industry...</option>
                <option value="Software Development">Software Development</option>
                <option value="Information Technology & Services">Information Technology & Services</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Hospital & Health Care">Hospital & Health Care</option>
                <option value="Education Management">Education Management</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail & Consumer Goods">Retail & Consumer Goods</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Media & Entertainment">Media & Entertainment</option>
                <option value="Automotive">Automotive</option>
                {icp.firmographics.industry && !["Software Development", "Information Technology & Services", "Financial Services", "Hospital & Health Care", "Education Management", "Real Estate", "Manufacturing", "Retail & Consumer Goods", "Telecommunications", "Media & Entertainment", "Automotive"].includes(icp.firmographics.industry) && (
                  <option value={icp.firmographics.industry}>{icp.firmographics.industry}</option>
                )}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]">
                <span className="block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono">Company Size</span>
                <select
                  value={icp.firmographics.employeeCount}
                  onChange={(e) => handleFirmoChange("employeeCount", e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6"
                >
                  <option value="" disabled>Select Size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1,000 employees</option>
                  <option value="1001-5000">1,001-5,000 employees</option>
                  <option value="5001-10000">5,001-10,000 employees</option>
                  <option value="10001+">10,001+ employees</option>
                </select>
              </div>
              <div className="bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]">
                <span className="block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono">Target Revenue</span>
                <select
                  value={icp.firmographics.revenue}
                  onChange={(e) => handleFirmoChange("revenue", e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6"
                >
                  <option value="" disabled>Select Revenue...</option>
                  <option value="<$1M">&lt;$1M</option>
                  <option value="$1M-$10M">$1M - $10M</option>
                  <option value="$10M-$50M">$10M - $50M</option>
                  <option value="$50M-$100M">$50M - $100M</option>
                  <option value="$100M-$250M">$100M - $250M</option>
                  <option value="$250M-$1B">$250M - $1B</option>
                  <option value="$1B+">$1B+</option>
                </select>
              </div>
              <div className="bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]">
                <span className="block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono">Geography</span>
                <select
                  value={icp.firmographics.geography}
                  onChange={(e) => handleFirmoChange("geography", e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6"
                >
                  <option value="" disabled>Select Region...</option>
                  <option value="North America">North America</option>
                  <option value="EMEA">EMEA</option>
                  <option value="APAC">APAC</option>
                  <option value="LATAM">LATAM</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <div className="bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]">
                <span className="block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono">Funding Phase</span>
                <select
                  value={icp.firmographics.fundingStage}
                  onChange={(e) => handleFirmoChange("fundingStage", e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6"
                >
                  <option value="" disabled>Select Funding...</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C">Series C</option>
                  <option value="Series D">Series D</option>
                  <option value="Series E+">Series E+</option>
                  <option value="Private Equity">Private Equity</option>
                  <option value="Post-IPO">Post-IPO</option>
                  <option value="Bootstrapped">Bootstrapped</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Buying Committee Card */}
        <div className="bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm">
          <div className="flex items-center space-x-2.5 text-[#333] mb-4">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-[#111] font-outfit">Buying Committee</h3>
          </div>
          <p className="text-xs text-[#666] mb-3">Key decision makers and target personas IntelScout will identify:</p>
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1">
            {icp.buyingCommittee.map((role, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium"
              >
                <span>{role}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveRole(idx)}
                  className="hover:text-red-500 hover:bg-black/5 rounded transition p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddRole} className="flex space-x-2">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Add persona (e.g. CMO)..."
              className="flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <button 
              type="submit" 
              className="px-2.5 py-1.5 bg-black hover:bg-[#222] text-white rounded-lg text-xs font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Technographics Card */}
        <div className="bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm md:col-span-1">
          <div className="flex items-center space-x-2.5 text-[#333] mb-3">
            <Cpu className="w-5 h-5" />
            <h3 className="font-semibold text-[#111] font-outfit">Technographics</h3>
          </div>
          <p className="text-xs text-[#666] mb-3">Accounts using these tools will score higher:</p>
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1">
            {icp.technographics.map((tech, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium"
              >
                <span>{tech}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTech(idx)}
                  className="hover:text-red-500 hover:bg-black/5 rounded transition p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <select
              value=""
              onChange={(e) => {
                 if (!e.target.value) return;
                 if (!icp.technographics.includes(e.target.value)) {
                    setIcp({
                      ...icp,
                      technographics: [...icp.technographics, e.target.value]
                    });
                 }
              }}
              className="flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="">Select technology to add...</option>
              {Object.entries({
                "CRM & Sales": ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Outreach", "SalesLoft", "Apollo.io"],
                "Marketing Automation": ["Marketo", "Pardot", "ActiveCampaign", "Mailchimp", "Klaviyo", "Braze"],
                "Cloud & Infrastructure": ["AWS", "Google Cloud", "Microsoft Azure", "Vercel", "DigitalOcean", "Heroku", "Cloudflare"],
                "DevTools & CI/CD": ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI", "Sentry", "Datadog", "Docker", "Kubernetes"],
                "Data & Analytics": ["Snowflake", "Databricks", "Google Analytics", "Mixpanel", "Amplitude", "Segment", "Tableau", "Looker"],
                "HR & Recruiting": ["Workday", "Greenhouse", "Lever", "BambooHR", "Gusto", "Rippling", "Deel"],
                "Customer Support": ["Zendesk", "Intercom", "Freshdesk", "Jira Service Desk", "Gorgias"],
                "E-commerce": ["Shopify", "Magento", "WooCommerce", "BigCommerce", "Stripe"],
                "Productivity & Collaboration": ["Slack", "Microsoft Teams", "Notion", "Asana", "Monday.com", "Google Workspace"]
              }).map(([category, tools]) => (
                <optgroup key={category} label={category}>
                  {tools.map(tool => (
                    <option key={tool} value={tool} disabled={icp.technographics.includes(tool)}>{tool}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Growth Signals Card */}
        <div className="bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm md:col-span-1">
          <div className="flex items-center space-x-2.5 text-[#333] mb-3">
            <Sparkle className="w-5 h-5" />
            <h3 className="font-semibold text-[#111] font-outfit">Hiring & Growth Triggers</h3>
          </div>
          <p className="text-xs text-[#666] mb-3">We look for these signals to determine timing:</p>
          <div className="space-y-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1">
            {icp.growthSignals.map((signal, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between px-3 py-1.5 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium"
              >
                <span className="line-clamp-1">{signal}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSignal(idx)}
                  className="text-[#888] hover:text-red-500 transition ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddSignal} className="flex space-x-2">
            <input
              type="text"
              value={newSignal}
              onChange={(e) => setNewSignal(e.target.value)}
              placeholder="Add hiring trigger (e.g. Hiring CMO)..."
              className="flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <button 
              type="submit" 
              className="px-2.5 py-1.5 bg-black hover:bg-[#222] text-white rounded-lg text-xs font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-2.5 bg-black hover:bg-[#222] text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit"
        >
          <span>Map Pain Points</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
