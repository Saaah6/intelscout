"use client";

import React, { useState } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { ArrowRight, Compass } from "@phosphor-icons/react";

export default function Stage1Offer() {
  const { offer, setOffer, generateWorkspace, setStep } = useIntelScout();
  const [sell, setSell] = useState(offer.sell);
  const [websiteUrl, setWebsiteUrl] = useState(offer.websiteUrl);
  const [problem, setProblem] = useState(offer.problem);
  const [dealSize, setDealSize] = useState(offer.dealSize);
  const [salesCycle, setSalesCycle] = useState(offer.salesCycle);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStep, setScrapeStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sell || !problem || !websiteUrl) return;
    const newOffer = { sell, websiteUrl, problem, dealSize, salesCycle };
    setOffer(newOffer);
    
    // Simulate AI product study / scraping (1 MINUTE total across all pages)
    setIsScraping(true);
    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      setScrapeStep(sec);
      if (sec >= 60) {
        clearInterval(interval);
        generateWorkspace(newOffer);
        setIsScraping(false);
        setStep(2);
      }
    }, 1000);
  };

  const loadExample = (exSell: string, exUrl: string, exProblem: string, exSize: string, exCycle: string) => {
    setSell(exSell);
    setWebsiteUrl(exUrl);
    setProblem(exProblem);
    setDealSize(exSize);
    setSalesCycle(exCycle);
  };

  const getScrapeMessage = (sec: number) => {
    if (sec < 5) return `Connecting to ${websiteUrl}...`;
    if (sec < 15) return `Scraping homepage and landing pages...`;
    if (sec < 25) return `Crawling pricing and feature matrices...`;
    if (sec < 35) return `Reading blog posts and content marketing...`;
    if (sec < 45) return `Parsing customer case studies and testimonials...`;
    if (sec < 55) return `Extracting core pain points and triggers...`;
    return `Synthesizing GTM blueprint...`;
  };

  return (
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111] font-outfit">Define Your Offer</h2>
          <p className="text-sm text-[#555]">Describe what you sell so IntelScout can compile your GTM blueprint.</p>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Quick Examples</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => loadExample("AI Compliance Platform", "vanta.com", "Reduce compliance effort and automate SOC2 audits", "$20,000-$100,000", "Medium")}
            className="text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group"
          >
            <p className="font-semibold text-[#111]">AI Compliance Software</p>
            <p className="text-[#666] line-clamp-1 mt-0.5">Automates audits & reviews</p>
          </button>
          <button
            type="button"
            onClick={() => loadExample("Cybersecurity Service", "crowdstrike.com", "Proactive penetration testing and dark web monitoring", "$5,000-$20,000", "Short")}
            className="text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group"
          >
            <p className="font-semibold text-[#111]">Cybersecurity Consultant</p>
            <p className="text-[#666] line-clamp-1 mt-0.5">Penetration testing & risk mapping</p>
          </button>
          <button
            type="button"
            onClick={() => loadExample("DevTools Product", "vercel.com", "Speed up CI/CD pipelines and caching layers", "<$1,000", "Short")}
            className="text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group"
          >
            <p className="font-semibold text-[#111]">DevTools Platform</p>
            <p className="text-[#666] line-clamp-1 mt-0.5">CI/CD caching tool</p>
          </button>
        </div>
      </div>
 
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="sell-input" className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">What do you sell?</label>
            <input
              id="sell-input"
              type="text"
              value={sell}
              onChange={(e) => setSell(e.target.value)}
              placeholder="e.g. HR SaaS, Cloud Security Tools..."
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
            />
          </div>
          <div>
            <label htmlFor="url-input" className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Product URL</label>
            <input
              id="url-input"
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. vanta.com, linear.app"
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
            />
          </div>
        </div>
 
        <div>
          <label htmlFor="problem-input" className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">What critical problem do you solve?</label>
          <textarea
            id="problem-input"
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. Help companies pass SOC2 audits, reduce cloud infrastructure cost, automate candidate hiring filters..."
            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            required
          />
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="deal-size" className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Avg Deal Size (ACV)</label>
            <select
              id="deal-size"
              value={dealSize}
              onChange={(e) => setDealSize(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            >
              <option value="<$1,000">Less than $1,000</option>
              <option value="$1,000-$5,000">$1,000 - $5,000</option>
              <option value="$5,000-$20,000">$5,000 - $20,000</option>
              <option value="$20,000-$100,000">$20,000 - $100,000</option>
              <option value="$100,000+">$100,000+</option>
            </select>
          </div>

          <div>
            <label htmlFor="sales-cycle" className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Sales Cycle Length</label>
            <select
              id="sales-cycle"
              value={salesCycle}
              onChange={(e) => setSalesCycle(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            >
              <option value="Short">Short (1-30 days)</option>
              <option value="Medium">Medium (1-3 months)</option>
              <option value="Long">Long (3-9 months)</option>
              <option value="Enterprise">Enterprise (9+ months)</option>
            </select>
          </div>
        </div>

        {/* Action button & Loading State */}
        <div className="pt-4 border-t border-black/10 flex flex-col md:flex-row md:justify-between items-center gap-4">
          {isScraping ? (
            <div className="flex flex-col items-start gap-1 w-full md:w-auto">
              <div className="flex items-center gap-3 text-sm font-medium text-[#111] font-outfit">
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{getScrapeMessage(scrapeStep)}</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-1.5 mt-1">
                <div className="bg-black h-1.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${(scrapeStep / 60) * 100}%` }} />
              </div>
            </div>
          ) : (
            <div className="hidden md:block" /> // Spacer
          )}

          <button
            type="submit"
            disabled={!sell || !problem || !websiteUrl || isScraping}
            className="px-6 py-3 bg-black hover:bg-[#222] disabled:opacity-50 disabled:hover:bg-black text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit"
          >
            <span>{isScraping ? "Studying Product..." : "Study Product & Generate ICP"}</span>
            {!isScraping && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
