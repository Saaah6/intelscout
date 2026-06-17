"use client";

import React, { useState, useRef } from "react";
import { useSignalScout, Account } from "@/context/SignalScoutContext";
import { ArrowLeft, Database, Download, FileText, UploadCloud, Play } from "lucide-react";

export default function Stage5Import() {
  const { setAccounts, setStep, offer, signals } = useSignalScout();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated high-fidelity mock company list
  const DEMO_COMPANIES = [
    { name: "Vanta", domain: "vanta.com", industry: "B2B SaaS", size: 450, rev: "$80M", stage: "Series B", geo: "US", tech: ["AWS", "GitHub Actions", "Salesforce", "Drata", "Vanta"] },
    { name: "Stripe", domain: "stripe.com", industry: "FinTech", size: 8500, rev: "$12B", stage: "Late Stage", geo: "US", tech: ["AWS", "Salesforce", "Snowflake", "Sentry", "PostgreSQL"] },
    { name: "Rippling", domain: "rippling.com", industry: "HR SaaS", size: 2200, rev: "$400M", stage: "Series E", geo: "US", tech: ["AWS", "GitHub Actions", "Salesforce", "Snowflake"] },
    { name: "Supabase", domain: "supabase.com", industry: "DevTools Product", size: 120, rev: "$15M", stage: "Series A", geo: "US/Remote", tech: ["AWS", "GitHub Actions", "Vercel", "Sentry", "PostgreSQL"] },
    { name: "Cursor", domain: "cursor.sh", industry: "DevTools Product", size: 35, rev: "$8M", stage: "Seed", geo: "US", tech: ["AWS", "GitHub Actions", "Vercel", "PostgreSQL"] },
    { name: "Retool", domain: "retool.com", industry: "B2B SaaS", size: 550, rev: "$95M", stage: "Series C", geo: "US", tech: ["AWS", "GitHub Actions", "Salesforce", "Sentry", "PostgreSQL"] },
    { name: "Linear", domain: "linear.app", industry: "B2B SaaS", size: 60, rev: "$25M", stage: "Series A", geo: "US/EU", tech: ["AWS", "GitHub Actions", "Vercel", "Sentry"] },
    { name: "Vercel", domain: "vercel.com", industry: "DevTools Product", size: 480, rev: "$75M", stage: "Series D", geo: "US", tech: ["AWS", "GitHub Actions", "Vercel", "Sentry"] },
    { name: "Notion", domain: "notion.so", industry: "B2B SaaS", size: 750, rev: "$180M", stage: "Late Stage", geo: "US", tech: ["AWS", "Salesforce", "Snowflake"] },
    { name: "Deel", domain: "deel.com", industry: "FinTech", size: 3000, rev: "$500M", stage: "Series D", geo: "Global", tech: ["AWS", "GitHub Actions", "Salesforce", "Snowflake"] },
    { name: "Figma", domain: "figma.com", industry: "B2B SaaS", size: 1300, rev: "$450M", stage: "Late Stage", geo: "US", tech: ["AWS", "GitHub Actions", "Snowflake", "Sentry"] },
    { name: "Sentry", domain: "sentry.io", industry: "DevTools Product", size: 380, rev: "$60M", stage: "Series C", geo: "US", tech: ["AWS", "GitHub Actions", "Vercel", "Sentry", "PostgreSQL"] }
  ];

  // Logic to process raw domains into full Qualified Account items
  const processImportedCompanies = (list: Array<{ name: string; domain: string }>) => {
    const isTechOffer = offer.sell.toLowerCase().includes("ai") || offer.sell.toLowerCase().includes("tech") || offer.sell.toLowerCase().includes("software") || offer.sell.toLowerCase().includes("cyber");

    const mappedAccounts: Account[] = list.map((item, index) => {
      // Find matching mock details or generate random firmographics
      const matchedMock = DEMO_COMPANIES.find(c => c.domain.toLowerCase() === item.domain.toLowerCase() || c.name.toLowerCase() === item.name.toLowerCase());
      
      const industry = matchedMock?.industry || (isTechOffer ? "B2B SaaS" : "Professional Services");
      const employeeCount = matchedMock?.size || Math.floor(Math.random() * 950) + 50;
      const revenue = matchedMock?.rev || `$${Math.floor(Math.random() * 90) + 10}M`;
      const fundingStage = matchedMock?.stage || ["Series A", "Series B", "Series C", "Seed"][Math.floor(Math.random() * 4)];
      const geography = matchedMock?.geo || "United States";
      const techStack = matchedMock?.tech || (isTechOffer ? ["AWS", "GitHub Actions", "PostgreSQL"] : ["Shopify", "HubSpot"]);

      // Calculate Scores
      // Fit calculation: how well do industry, size, and location match ICP?
      let icpFit = 65; // Base
      if (isTechOffer && (industry.includes("SaaS") || industry.includes("DevTools") || industry.includes("FinTech"))) icpFit += 15;
      if (employeeCount >= 50 && employeeCount <= 1000) icpFit += 10;
      if (geography.includes("US") || geography.includes("Global")) icpFit += 10;
      icpFit = Math.min(100, icpFit);

      // Intent calculation: based on mock activities
      const intent = Math.floor(Math.random() * 45) + 50; // 50-95
      const timing = Math.floor(Math.random() * 45) + 50; // 50-95

      // Assign realistic signals detected based on indices
      const signalsDetected: string[] = [];
      if (index % 3 === 0) signalsDetected.push("funding");
      if (index % 4 === 0) signalsDetected.push("sec_hiring");
      if (index % 5 === 0) signalsDetected.push("trust_center");
      if (index % 6 === 0) signalsDetected.push("ent_pricing");
      if (signalsDetected.length === 0) signalsDetected.push("blog_post");

      // Compute Opportunity Score using Context logic
      const computedSignalsWeight = signalsDetected.reduce((sum, sigId) => {
        const cfg = signals.find((s) => s.id === sigId && s.enabled);
        return sum + (cfg ? cfg.weight : 0);
      }, 0);
      const signalScore = Math.round(Math.min(100, Math.max(0, computedSignalsWeight * 2.2)));
      const opportunityScore = Math.round((icpFit * 0.4) + (intent * 0.25) + (timing * 0.15) + (signalScore * 0.2));

      let priorityTier: 1 | 2 | 3 | 4 = 4;
      if (opportunityScore >= 90) priorityTier = 1;
      else if (opportunityScore >= 70) priorityTier = 2;
      else if (opportunityScore >= 50) priorityTier = 3;

      // Explainable prioritization reasons
      const reasons: string[] = [];
      if (signalsDetected.includes("sec_hiring")) reasons.push("Currently recruiting for Security Engineers.");
      if (signalsDetected.includes("trust_center")) reasons.push("Added secure trust center directory to landing domains.");
      if (signalsDetected.includes("ent_pricing")) reasons.push("Updated billing structures to include Enterprise pricing tiers.");
      if (signalsDetected.includes("funding")) reasons.push("Announced a new capital venture round recently.");
      if (icpFit >= 90) reasons.push(`Fits core ICP matrix with employee count of ${employeeCount}.`);
      if (reasons.length === 0) reasons.push("Demonstrating baseline compliance signals.");

      // Buying Committee Mapping
      const economic = isTechOffer ? "Founder & CEO" : "Chief Commercial Officer";
      const technical = isTechOffer ? "VP of Engineering / CTO" : "IT Infrastructure Director";
      const champion = isTechOffer ? "Head of Information Security" : "Ops Manager";
      const endUser = isTechOffer ? "DevOps & Security Engineers" : "Commercial Teams";

      // GTM Recommendations
      const contact = isTechOffer ? "Head of Information Security" : "VP Marketing Operations";
      const reason = signalsDetected.includes("sec_hiring") 
        ? "Currently hiring security staff, likely scaling compliance requirements." 
        : "Matches technographic footprint and target firmographics.";
      const pain = isTechOffer
        ? "Engineers spends hundreds of manual hours prepping compliance reviews."
        : "High customer acquisition costs and outdated tool tracking integrations.";
      const angle = isTechOffer
        ? `Pitch how ${offer.sell} can automate compliance logs, saving engineering cycles.`
        : `Demonstrate how ${offer.sell} reduces CPA by automating targeted outbound operations.`;

      return {
        id: Math.random().toString(36).substring(7),
        company_name: item.name,
        domain: item.domain,
        icpFit,
        intent,
        timing,
        signalScore,
        opportunityScore,
        priorityTier,
        reasons,
        buyingCommittee: { economic, technical, champion, endUser },
        gtmRecommendations: { contact, reason, pain, angle },
        signalsDetected,
        techStack,
        employeeCount,
        revenue,
        geography,
        fundingStage,
        industry
      };
    });

    setAccounts(mappedAccounts);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setErrorMsg("Please upload a valid CSV file (.csv format)");
      return;
    }
    setErrorMsg("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    try {
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) {
        setErrorMsg("The CSV file is empty or missing data rows.");
        return;
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const nameIndex = headers.indexOf("company_name");
      const domainIndex = headers.indexOf("domain");

      if (nameIndex === -1 || domainIndex === -1) {
        setErrorMsg("CSV must include columns: 'company_name' and 'domain'");
        return;
      }

      const parsedList: Array<{ name: string; domain: string }> = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        if (cols.length > Math.max(nameIndex, domainIndex)) {
          parsedList.push({
            name: cols[nameIndex].replace(/^["']|["']$/g, ""),
            domain: cols[domainIndex].replace(/^["']|["']$/g, "")
          });
        }
      }

      if (parsedList.length === 0) {
        setErrorMsg("Failed to parse any valid company records.");
        return;
      }

      processImportedCompanies(parsedList);
      setStep("research");
    } catch (err) {
      setErrorMsg("Error parsing CSV. Ensure there are no unquoted commas.");
    }
  };

  const handleLoadDemo = () => {
    setErrorMsg("");
    setFileName("Demo Company Dataset");
    const formattedDemo = DEMO_COMPANIES.map(c => ({ name: c.name, domain: c.domain }));
    processImportedCompanies(formattedDemo);
    setStep("research");
  };

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,company_name,domain\n"
      + "Vanta,vanta.com\n"
      + "Stripe,stripe.com\n"
      + "Rippling,rippling.com\n"
      + "Retool,retool.com\n"
      + "Supabase,supabase.com\n"
      + "Cursor,cursor.sh\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "signalscout_sample_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">Import Accounts</h2>
          <p className="text-sm text-zinc-400">Upload your target company list in CSV format to trigger the AI qualification engine.</p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
          dragActive 
            ? "border-violet-500 bg-violet-950/10" 
            : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-950/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />
        <UploadCloud className="w-10 h-10 text-zinc-500 mb-3" />
        <p className="text-sm font-semibold text-zinc-200">
          {fileName ? `Selected: ${fileName}` : "Drag & drop your CSV file here"}
        </p>
        <p className="text-xs text-zinc-500 mt-1">Supports files up to 10,000 accounts. Must include company_name, domain headers.</p>
        
        {fileName && (
          <div className="mt-4 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 rounded-lg flex items-center space-x-1">
            <FileText className="w-3 h-3 text-violet-400" />
            <span>Ready to process.</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-red-400 text-center font-medium mt-3">{errorMsg}</p>
      )}

      {/* Action Utilities */}
      <div className="flex items-center justify-between mt-5 gap-3">
        <button
          type="button"
          onClick={downloadSampleCSV}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV template</span>
        </button>

        <button
          type="button"
          onClick={handleLoadDemo}
          className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center space-x-1.5 transition"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Or, Load Pre-loaded Demo Dataset (12 companies)</span>
        </button>
      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
