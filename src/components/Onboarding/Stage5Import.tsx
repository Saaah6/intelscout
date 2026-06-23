"use client";

import React, { useState, useRef } from "react";
import { useIntelScout, Account, getOfferCategory } from "@/context/IntelScoutContext";
import { ArrowLeft, Database, Download, FileText, CloudArrowUp, Play, Globe, MagnifyingGlass, CircleNotch } from "@phosphor-icons/react";

export default function Stage5Import() {
  const { setAccounts, setStep, offer, signals } = useIntelScout();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [singleDomain, setSingleDomain] = useState("");
  const [isAnalyzingSingle, setIsAnalyzingSingle] = useState(false);
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
    const category = getOfferCategory(offer.sell);
    const isTechOffer = category !== "general";

    const mappedAccounts: Account[] = list.map((item, index) => {
      // Find matching mock details or generate random firmographics
      const matchedMock = DEMO_COMPANIES.find(c => c.domain.toLowerCase() === item.domain.toLowerCase() || c.name.toLowerCase() === item.name.toLowerCase());
      
      let industry = matchedMock?.industry || "B2B SaaS";
      let techStack = matchedMock?.tech || ["AWS", "GitHub Actions", "PostgreSQL"];

      if (category === "compliance") {
        industry = matchedMock?.industry || "B2B SaaS, FinTech, Enterprise Software";
        techStack = matchedMock?.tech || ["AWS", "GitHub Actions", "Salesforce", "Vanta", "Drata", "Vercel"];
      } else if (category === "hr") {
        industry = "HR Tech, B2B SaaS, Talent Management Services";
        techStack = ["Workday", "Greenhouse", "Slack", "Gusto", "BambooHR", "Lever"];
      } else if (category === "sales") {
        industry = "SalesTech, Marketing Automation, B2B SaaS, Agencies";
        techStack = ["HubSpot", "Salesforce", "Marketo", "Segment", "Intercom", "Apollo"];
      } else if (category === "devtools") {
        industry = "DevTools, Infrastructure, Cloud Platform SaaS";
        techStack = ["AWS", "GitHub Actions", "Vercel", "Sentry", "PostgreSQL", "Docker", "Kubernetes"];
      } else {
        industry = "E-commerce, Retail, Professional Services";
        techStack = ["Shopify", "Google Analytics", "HubSpot", "Zendesk", "Stripe", "Clara"];
      }

      const employeeCount = matchedMock?.size || Math.floor(Math.random() * 950) + 50;
      const revenue = matchedMock?.rev || `$${Math.floor(Math.random() * 90) + 10}M`;
      const fundingStage = matchedMock?.stage || ["Series A", "Series B", "Series C", "Seed"][Math.floor(Math.random() * 4)];
      const geography = matchedMock?.geo || "United States";

      // Calculate Scores
      // Fit calculation: how well do industry, size, and location match ICP?
      let icpFit = 65; // Base
      if (isTechOffer && (industry.includes("SaaS") || industry.includes("DevTools") || industry.includes("FinTech") || industry.includes("Tech"))) icpFit += 15;
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

      // Dynamic explainable prioritization reasons
      const reasons: string[] = [];
      if (signalsDetected.includes("sec_hiring")) {
        if (category === "compliance") reasons.push("Currently recruiting for 2+ Security Engineering positions.");
        else if (category === "hr") reasons.push("Currently recruiting for Talent Recruiters & Sourcers.");
        else if (category === "sales") reasons.push("Currently recruiting for 3+ Account Executives.");
        else if (category === "devtools") reasons.push("Currently recruiting for DevOps & SRE Engineers.");
        else reasons.push("Currently recruiting for Sales & Marketing Directors.");
      }
      if (signalsDetected.includes("trust_center")) {
        if (category === "compliance") reasons.push("Added secure trust center directory to landing domains.");
        else if (category === "hr") reasons.push("Integrated automated onboarding software to website.");
        else if (category === "sales") reasons.push("Added self-serve Enterprise packages to billing pages.");
        else if (category === "devtools") reasons.push("Added interactive API documentation and developer portal.");
        else reasons.push("Upgraded digital checkout portal or tech integrations.");
      }
      if (signalsDetected.includes("ent_pricing")) reasons.push("Updated billing structures to include Enterprise pricing tiers.");
      if (signalsDetected.includes("funding")) reasons.push("Announced a new capital venture round recently.");
      if (icpFit >= 90) reasons.push(`Fits core ICP matrix with employee count of ${employeeCount}.`);
      if (reasons.length === 0) reasons.push("Demonstrating baseline compliance signals.");

      // Buying Committee Mapping dynamically by Category
      let economic = "Founder & CEO";
      let technical = "VP of Engineering / CTO";
      let champion = "Head of Information Security";
      let endUser = "DevOps & Security Engineers";

      if (category === "hr") {
        economic = "Chief People Officer";
        technical = "Director of HR Operations";
        champion = "VP of HR / Head of Talent";
        endUser = "HR & Recruiting Teams";
      } else if (category === "sales") {
        economic = "Chief Revenue Officer (CRO)";
        technical = "Head of Sales Operations";
        champion = "VP of Sales / VP of Marketing";
        endUser = "Account Executives & Growth Marketers";
      } else if (category === "devtools") {
        economic = "VP of Engineering";
        technical = "Chief Technology Officer (CTO)";
        champion = "Director of DevOps";
        endUser = "Software Engineers & Cloud Architects";
      } else if (category === "general") {
        economic = "Founder & CEO";
        technical = "IT Director / Operations Lead";
        champion = "Commercial Operations Lead";
        endUser = "Sales & Marketing Associates";
      }

      // GTM Recommendations
      let contact = "Head of Information Security";
      let reason = signalsDetected.includes("sec_hiring") 
        ? "Currently hiring security staff, likely scaling compliance requirements." 
        : "Matches technographic footprint and target firmographics.";
      let pain = "Engineers spend hundreds of manual hours prepping compliance reviews.";
      let angle = `Pitch how ${offer.sell} can automate compliance logs, saving engineering cycles.`;

      if (category === "hr") {
        contact = "VP of HR / Head of Talent";
        reason = signalsDetected.includes("sec_hiring")
          ? "Recruiter hires and headcount growth indicating rapid scaling bottlenecks."
          : "Matches rapid scaling triggers and target firmographics.";
        pain = "Headcount expansion is breaking manual employee onboarding and compliance cycles.";
        angle = `Pitch how ${offer.sell} simplifies automated onboarding workflows and speeds up time-to-hire.`;
      } else if (category === "sales") {
        contact = "Chief Revenue Officer (CRO)";
        reason = signalsDetected.includes("sec_hiring")
          ? "Hiring sales hires and adding CRM API tools; indicating pipeline scaling priority."
          : "Matches active pipeline and marketing operations triggers.";
        pain = "Outbound response rates have crashed due to generic cold outreach.";
        angle = `Pitch how ${offer.sell} leverages buying triggers to personalize prospecting at scale.`;
      } else if (category === "devtools") {
        contact = "VP of Engineering";
        reason = signalsDetected.includes("sec_hiring")
          ? "Hiring DevOps / Cloud Engineers; indicating infrastructure scalability needs."
          : "Matches developer workflow and infra signals.";
        pain = "Developers waste hours maintaining custom CI/CD pipelines and manual configs.";
        angle = `Pitch how ${offer.sell} optimizes database caching and reduces build times by 50%.`;
      } else if (category === "general") {
        contact = "Founder / Head of Commercial Operations";
        reason = "Matches targeted firmographic growth profile and regional presence.";
        pain = "Inefficient customer acquisition cost and lack of integrated sales tracking.";
        angle = `Pitch how ${offer.sell} improves pipeline generation metrics and simplifies target engagement.`;
      }

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
    link.setAttribute("download", "intelscout_sample_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyzeSingleDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleDomain.trim()) return;

    setIsAnalyzingSingle(true);

    // Parse company name from domain
    let rawDomain = singleDomain.trim();
    // remove http/https/www
    let cleanDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, "");
    // remove trailing slashes or subpaths
    cleanDomain = cleanDomain.split("/")[0].toLowerCase();

    if (!cleanDomain.includes(".")) {
      setErrorMsg("Please enter a valid domain format (e.g. airbnb.com)");
      setIsAnalyzingSingle(false);
      return;
    }

    const namePart = cleanDomain.split(".")[0];
    const companyName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setTimeout(() => {
      setErrorMsg("");
      processImportedCompanies([{ name: companyName, domain: cleanDomain }]);
      setIsAnalyzingSingle(false);
      setStep("research");
    }, 1200);
  };

  return (
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111] font-outfit">Import Accounts</h2>
          <p className="text-sm text-[#555]">Define your targets to analyze. Enter a single target enterprise domain or upload a CSV file.</p>
        </div>
      </div>

      {/* Single Domain Search / Analysis Input */}
      <div className="mb-6 bg-white border border-black/10 rounded-xl p-5 relative overflow-hidden shadow-sm">
        <span className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2.5">Analyze Single Target Enterprise Domain</span>
        <form onSubmit={handleAnalyzeSingleDomain} className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-3 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Enter domain (e.g. microsoft.com, airbnb.com, stripe.com)..."
              value={singleDomain}
              onChange={(e) => setSingleDomain(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
              disabled={isAnalyzingSingle}
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzingSingle || !singleDomain.trim()}
            className="px-4 py-2.5 bg-black hover:bg-[#222] disabled:opacity-50 disabled:hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer font-outfit"
          >
            {isAnalyzingSingle ? (
              <>
                <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                <span>Resolving...</span>
              </>
            ) : (
              <>
                <MagnifyingGlass className="w-3.5 h-3.5" />
                <span>Analyze Domain</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Horizontal Divider */}
      <div className="flex items-center my-6 text-[10px] font-bold text-[#888] uppercase tracking-widest">
        <div className="flex-1 h-px bg-black/10" />
        <span className="px-3">Or upload CSV file</span>
        <div className="flex-1 h-px bg-black/10" />
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
            ? "border-black/50 bg-black/5" 
            : "border-black/10 bg-white hover:border-black/30 hover:bg-[#fafafa]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />
        <CloudArrowUp className="w-10 h-10 text-[#666] mb-3" />
        <p className="text-sm font-semibold text-[#111]">
          {fileName ? `Selected: ${fileName}` : "Drag & drop your CSV file here"}
        </p>
        <p className="text-xs text-[#666] mt-1">Supports files up to 10,000 accounts. Must include company_name, domain headers.</p>
        
        {fileName && (
          <div className="mt-4 px-3 py-1 bg-[#fafafa] border border-black/10 text-[11px] font-mono text-[#555] rounded-lg flex items-center space-x-1">
            <FileText className="w-3 h-3 text-[#111]" />
            <span>Ready to process.</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 text-center font-medium mt-3">{errorMsg}</p>
      )}

      {/* Action Utilities */}
      <div className="flex items-center justify-between mt-5 gap-3">
        <button
          type="button"
          onClick={downloadSampleCSV}
          className="text-xs font-semibold text-[#888] hover:text-[#111] flex items-center space-x-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV template</span>
        </button>

        <button
          type="button"
          onClick={handleLoadDemo}
          className="text-xs font-semibold text-[#555] hover:text-[#111] flex items-center space-x-1.5 transition"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Or, Load Pre-loaded Demo Dataset (12 companies)</span>
        </button>
      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
