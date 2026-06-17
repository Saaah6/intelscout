"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type GtmCategory = "compliance" | "hr" | "sales" | "devtools" | "general";

export function getOfferCategory(sell: string): GtmCategory {
  const sellLower = sell.toLowerCase();
  if (sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2")) {
    return "compliance";
  }
  if (sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent")) {
    return "hr";
  }
  if (sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops")) {
    return "sales";
  }
  if (sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching")) {
    return "devtools";
  }
  return "general";
}

export interface Offer {
  sell: string;
  problem: string;
  dealSize: string;
  salesCycle: string;
}

export interface ICP {
  firmographics: {
    industry: string;
    employeeCount: string;
    revenue: string;
    geography: string;
    fundingStage: string;
  };
  technographics: string[];
  growthSignals: string[];
  buyingCommittee: string[];
}

export interface PainMap {
  problem: string;
  pain: string[];
  triggers: string[];
  buyingMotivation: string;
}

export interface SignalConfig {
  id: string;
  name: string;
  category: "strong" | "medium" | "weak";
  weight: number;
  enabled: boolean;
}

export interface Account {
  id: string;
  company_name: string;
  domain: string;
  icpFit: number;
  intent: number;
  timing: number;
  signalScore: number;
  opportunityScore: number; // Formula: Fit + Intent + Timing + Signal
  priorityTier: 1 | 2 | 3 | 4; // Tier 1: 90+, Tier 2: 70-89, Tier 3: 50-69, Tier 4: <50
  reasons: string[];
  buyingCommittee: {
    economic: string;
    technical: string;
    champion: string;
    endUser: string;
  };
  gtmRecommendations: {
    contact: string;
    reason: string;
    pain: string;
    angle: string;
  };
  signalsDetected: string[];
  techStack: string[];
  employeeCount: number;
  revenue: string;
  geography: string;
  fundingStage: string;
  industry: string;
}

export interface FeedEvent {
  id: string;
  timestamp: string;
  companyName: string;
  text: string;
  type: "strong" | "medium" | "weak";
  weight: number;
}

interface SignalScoutContextType {
  step: number; // 1 to 5, 'research', 'dashboard'
  setStep: (s: number | "research" | "dashboard") => void;
  offer: Offer;
  setOffer: (o: Offer) => void;
  icp: ICP | null;
  setIcp: (i: ICP | null) => void;
  painMap: PainMap | null;
  setPainMap: (p: PainMap | null) => void;
  signals: SignalConfig[];
  setSignals: (s: SignalConfig[]) => void;
  accounts: Account[];
  setAccounts: (a: Account[]) => void;
  feedEvents: FeedEvent[];
  addFeedEvent: (e: FeedEvent) => void;
  isResearching: boolean;
  setIsResearching: (r: boolean) => void;
  researchProgress: number;
  setResearchProgress: (p: number) => void;
  consoleLogs: string[];
  addConsoleLog: (l: string) => void;
  clearConsoleLogs: () => void;
  generateWorkspace: () => void;
  recalculateScores: () => void;
  gtmSummary: string;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  credits: number;
  setCredits: (c: number) => void;
}

const SignalScoutContext = createContext<SignalScoutContextType | undefined>(undefined);

export const useSignalScout = () => {
  const context = useContext(SignalScoutContext);
  if (!context) {
    throw new Error("useSignalScout must be used within a SignalScoutProvider");
  }
  return context;
};

const DEFAULT_SIGNALS: SignalConfig[] = [
  // Strong Signals
  { id: "sec_hiring", name: "Security Hiring / Expansion", category: "strong", weight: 30, enabled: true },
  { id: "comp_hiring", name: "Compliance / Legal Hiring", category: "strong", weight: 25, enabled: true },
  { id: "soc2_ment", name: "SOC2 / HIPAA Mentions in Jobs", category: "strong", weight: 20, enabled: true },
  { id: "trust_center", name: "Trust Center Added to Website", category: "strong", weight: 20, enabled: true },
  { id: "ent_pricing", name: "Enterprise Pricing Added", category: "strong", weight: 20, enabled: true },
  // Medium Signals
  { id: "funding", name: "Recently Funded (Last 90 Days)", category: "medium", weight: 15, enabled: true },
  { id: "eng_hiring", name: "Engineering Expansion (>3 roles)", category: "medium", weight: 12, enabled: true },
  { id: "new_market", name: "New Regional Presence (e.g. EU)", category: "medium", weight: 10, enabled: true },
  // Weak Signals
  { id: "blog_post", name: "Generic Technical Blog Posts", category: "weak", weight: 3, enabled: true },
  { id: "gen_hiring", name: "General Sales / Marketing Hiring", category: "weak", weight: 2, enabled: true }
];

export const SignalScoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStepState] = useState<number | "research" | "dashboard">(1);
  const [offer, setOffer] = useState<Offer>({
    sell: "AI Compliance Platform",
    problem: "Reduce compliance effort and automate SOC2 audits",
    dealSize: "$20,000-$100,000",
    salesCycle: "Medium"
  });
  const [icp, setIcp] = useState<ICP | null>(null);
  const [painMap, setPainMap] = useState<PainMap | null>(null);
  const [signals, setSignals] = useState<SignalConfig[]>(DEFAULT_SIGNALS);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [gtmSummary, setGtmSummary] = useState<string>(
    "Active GTM Strategy: Targeting growing B2B SaaS companies undergoing security audits (SOC2/ISO). The GTM engine crawls target domains looking for trust directories, job vacancies in cybersecurity, and enterprise pricing updates to capture buying timing windows."
  );

  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [credits, setCredits] = useState<number>(5);

  // Credit refill loop for simulated AI Rate Limiting
  useEffect(() => {
    const interval = setInterval(() => {
      setCredits((prev) => Math.min(5, prev + 1));
    }, 15000); // Refill 1 credit every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const setStep = useCallback((s: number | "research" | "dashboard") => {
    setStepState(s);
  }, []);

  const addConsoleLog = useCallback((l: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${l}`]);
  }, []);

  const clearConsoleLogs = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const addFeedEvent = useCallback((e: FeedEvent) => {
    setFeedEvents((prev) => [e, ...prev].slice(0, 50));
  }, []);

  // Recalculates Opportunity Score based on state config
  const recalculateScores = useCallback(() => {
    setAccounts((prev) =>
      prev.map((acc) => {
        const computedSignals = acc.signalsDetected.reduce((sum, sigId) => {
          const cfg = signals.find((s) => s.id === sigId && s.enabled);
          return sum + (cfg ? cfg.weight : 0);
        }, 0);

        const signalScore = Math.min(100, Math.max(0, computedSignals * 2.2)); // Scale weight sum
        const oppScore = Math.round((acc.icpFit * 0.4) + (acc.intent * 0.25) + (acc.timing * 0.15) + (signalScore * 0.2));

        let tier: 1 | 2 | 3 | 4 = 4;
        if (oppScore >= 90) tier = 1;
        else if (oppScore >= 70) tier = 2;
        else if (oppScore >= 50) tier = 3;

        return {
          ...acc,
          signalScore: Math.round(signalScore),
          opportunityScore: oppScore,
          priorityTier: tier
        };
      })
    );
  }, [signals]);

  // Generate ICP and Pain mapping dynamically based on the offer
  const generateWorkspace = useCallback((customOffer?: Offer) => {
    const currentOffer = customOffer || offer;
    const sellLower = currentOffer.sell.toLowerCase();

    // Determine category based on keywords
    const isCompliance = sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2");
    const isHR = sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent");
    const isSalesCRM = sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops");
    const isDevTools = sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching");

    let industry = "B2B SaaS, FinTech, Enterprise Software";
    let technographics = ["AWS", "GitHub Actions", "Salesforce", "Vanta", "Snowflake", "Sentry", "PostgreSQL"];
    let growthSignals = ["Engineering expansion (>20% YoY)", "Compliance requirements in job specifications", "Recent funding rounds", "Enterprise landing page launches"];
    let buyingCommittee = ["VP of Engineering", "Head of Security", "Chief Technology Officer (CTO)", "Director of DevOps"];
    
    let pain = [
      "Security reviews block major enterprise deals",
      "SOC2/ISO preparation takes engineers away from building the product",
      "Compliance audits are manual, error-prone, and stress-inducing"
    ];
    let triggers = [
      "Hiring Security Engineers (audit workload likely increasing)",
      "Added 'Enterprise Plan' link to website footer",
      "Announced Series A funding (entering enterprise sales cycle)"
    ];
    let buyingMotivation = "Unlock enterprise revenue and pass security reviews in days rather than months.";
    let summary = `Active GTM Strategy: Targeting growing B2B SaaS companies undergoing security audits (SOC2/ISO). The GTM engine crawls target domains looking for trust directories, job vacancies in cybersecurity, and enterprise pricing updates to capture buying timing windows.`;

    if (isHR) {
      industry = "HR Tech, B2B SaaS, Talent Management Services";
      technographics = ["Workday", "Greenhouse", "Slack", "Gusto", "BambooHR", "Lever"];
      growthSignals = ["Hiring 10+ new employees (rapid headcount growth)", "Opened new regional hub", "Transitioning to remote-first structure", "Adding HR operations tooling"];
      buyingCommittee = ["VP of HR", "Chief People Officer", "Head of Talent Acquisition", "Director of HR Operations"];
      pain = [
        "Headcount growth exceeds HR team capacity, slowing down hiring speed",
        "Employee onboarding and compliance tracking are completely manual",
        "High churn rates due to lack of career tracking and performance metrics"
      ];
      triggers = [
        "Hiring 5+ Talent Recruiters (headcount expansion preparation)",
        "Acquired a new company or announced regional expansion",
        "Adding automated onboarding software keyword to tech stack"
      ];
      buyingMotivation = "Reduce talent acquisition cost, speed up time-to-hire, and automate onboarding compliance.";
      summary = `Active GTM Strategy: Targeting companies with rapid headcount expansion. The GTM engine crawls job listings for recruiter roles, scans HR technographics, and monitors expansion signals to identify teams hitting HR operational bottlenecks.`;
    } else if (isSalesCRM) {
      industry = "SalesTech, Marketing Automation, B2B SaaS, Agencies";
      technographics = ["HubSpot", "Salesforce", "Marketo", "Segment", "Intercom", "Apollo"];
      growthSignals = ["Hiring 3+ Account Executives", "Launched new product category on Product Hunt", "Adding sales coaching tools", "CMO/CRO hire announced"];
      buyingCommittee = ["VP of Sales", "VP of Marketing", "Chief Revenue Officer (CRO)", "Head of Sales Operations"];
      pain = [
        "Sales pipelines have stalled due to generic outbound messaging",
        "High cost of customer acquisition through paid advertising channels",
        "Poor conversion rates from leads to booked meetings in the CRM"
      ];
      triggers = [
        "Hiring Growth Marketers or Sales Leaders (pipeline urgency)",
        "Launched a new product category on Product Hunt",
        "Updated pricing to add a direct sales / enterprise plan"
      ];
      buyingMotivation = "Increase conversion rates, automate cold lead personalization, and scale pipeline velocity.";
      summary = `Active GTM Strategy: Targeting companies with active sales hiring and pipeline expansion priorities. The GTM engine crawls job listings for growth/sales hires and scans marketing tools to identify fit.`;
    } else if (isDevTools) {
      industry = "DevTools, Infrastructure, Cloud Platform SaaS";
      technographics = ["AWS", "GitHub Actions", "Vercel", "Sentry", "PostgreSQL", "Docker", "Kubernetes"];
      growthSignals = ["Scaling infrastructure nodes", "Transitioning to cloud-native setup", "Hiring cloud architects", "Recent technical blog posts"];
      buyingCommittee = ["VP of Engineering", "Chief Technology Officer (CTO)", "Director of DevOps", "Engineering Manager"];
      pain = [
        "Engineering cycles wasted on manual CI/CD maintenance and debugging",
        "Slow site/app load speeds leading to developer frustration",
        "High cloud infrastructure and database caching costs"
      ];
      triggers = [
        "Scaling infrastructure nodes or moving workloads to AWS",
        "Hiring Cloud Engineers (infrastructure optimization needs)",
        "Adding DevOps tooling to the tech stack matrix"
      ];
      buyingMotivation = "Reclaim developer hours, optimize database/cloud spend, and double build speeds.";
      summary = `Active GTM Strategy: Targeting teams looking to streamline build cycles and cloud resources. The GTM engine crawls engineering roles, developer blogs, and technographic profiles (e.g. AWS/Vercel) to flag optimization triggers.`;
    } else if (!isCompliance) { // Default or general SaaS
      // If it doesn't match default compliance and is a general category, check isTech
      const isTech = currentOffer.sell.toLowerCase().includes("ai") || currentOffer.sell.toLowerCase().includes("tech") || currentOffer.sell.toLowerCase().includes("software") || currentOffer.sell.toLowerCase().includes("cyber");
      if (!isTech) {
        industry = "E-commerce, Retail, Professional Services";
        technographics = ["Shopify", "Google Analytics", "HubSpot", "Zendesk", "Stripe", "Clara"];
        growthSignals = ["Adding checkout flows", "Hiring sales/ops directors", "Launching online portals"];
        buyingCommittee = ["Chief Marketing Officer (CMO)", "Head of Sales", "Founder & CEO", "VP of Revenue Operations"];
        pain = [
          "Inbound sales pipeline has stalled due to lack of personalization",
          "High cost of customer acquisition through paid advertising channels",
          "Inefficient outbound campaign tracking and poor tool integrations"
        ];
        triggers = [
          "Hiring Growth Marketers or Sales Leaders",
          "Launched a new product category on Product Hunt",
          "Expanded into new geographic market segments"
        ];
        buyingMotivation = "Improve customer acquisition efficiency and increase outbound meeting booking rates.";
        summary = `Active GTM Strategy: Targeting retail and mid-market organizations looking to optimize customer acquisition. The GTM engine crawls job listings for growth/marketing hires and scans tech stacks to identify target integrations.`;
      }
    }

    // 1. Generate ICP
    const generatedICP: ICP = {
      firmographics: {
        industry,
        employeeCount: "50-1000 employees",
        revenue: currentOffer.dealSize === "<$1,000" || currentOffer.dealSize === "$1,000-$5,000" ? "$5M - $20M" : "$20M - $150M",
        geography: "United States, Canada, Europe",
        fundingStage: "Series A to Series D"
      },
      technographics,
      growthSignals,
      buyingCommittee
    };
    setIcp(generatedICP);

    // 2. Generate Pain Mapping
    const generatedPainMap: PainMap = {
      problem: currentOffer.problem,
      pain,
      triggers,
      buyingMotivation
    };
    setPainMap(generatedPainMap);
    setGtmSummary(summary);

    // 3. Dynamically adjust signals config categories / naming based on flags
    const isTech = isCompliance || isDevTools || isHR || isSalesCRM || currentOffer.sell.toLowerCase().includes("ai") || currentOffer.sell.toLowerCase().includes("tech") || currentOffer.sell.toLowerCase().includes("software") || currentOffer.sell.toLowerCase().includes("cyber");
    const customSignals = DEFAULT_SIGNALS.map((s) => {
      if (!isTech) {
        if (s.id === "sec_hiring") return { ...s, name: "Marketing Expansion Hiring" };
        if (s.id === "comp_hiring") return { ...s, name: "Sales Operations Hiring" };
        if (s.id === "trust_center") return { ...s, name: "Shopify Plus / Tech Upgrade" };
        if (s.id === "soc2_ment") return { ...s, name: "AdTech Mentioned" };
      } else {
        // Customize text for devtools, hr, crm
        if (isHR) {
          if (s.id === "sec_hiring") return { ...s, name: "Talent Recruiter Hiring" };
          if (s.id === "comp_hiring") return { ...s, name: "HR Operations Hiring" };
          if (s.id === "trust_center") return { ...s, name: "Onboarding Software Added" };
          if (s.id === "soc2_ment") return { ...s, name: "Headcount Targets Mentioned" };
        } else if (isSalesCRM) {
          if (s.id === "sec_hiring") return { ...s, name: "Sales Exec (AE) Hiring" };
          if (s.id === "comp_hiring") return { ...s, name: "Sales Operations Hiring" };
          if (s.id === "trust_center") return { ...s, name: "Self-Serve Pricing Added" };
          if (s.id === "soc2_ment") return { ...s, name: "CRM API Mentions in Jobs" };
        } else if (isDevTools) {
          if (s.id === "sec_hiring") return { ...s, name: "DevOps Engineer Hiring" };
          if (s.id === "comp_hiring") return { ...s, name: "Cloud Architect Hiring" };
          if (s.id === "trust_center") return { ...s, name: "API Documentation Added" };
          if (s.id === "soc2_ment") return { ...s, name: "CI/CD Pipeline Mentions" };
        }
      }
      return s;
    });
    setSignals(customSignals);
  }, [offer]);

  // Handle background feed updates
  useEffect(() => {
    if (step !== "dashboard" || accounts.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random company
      const randomAccIndex = Math.floor(Math.random() * accounts.length);
      const acc = accounts[randomAccIndex];
      if (!acc) return;

      // Select a signal that this account doesn't have yet or trigger a new one
      const possibleSignals = signals.filter(s => s.enabled && !acc.signalsDetected.includes(s.id));
      if (possibleSignals.length === 0) return;

      const randomSig = possibleSignals[Math.floor(Math.random() * possibleSignals.length)];
      
      // Update account signals in state
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === acc.id) {
            const updatedSignals = [...a.signalsDetected, randomSig.id];
            
            // Recalculate score specifically for this company
            const computedSignals = updatedSignals.reduce((sum, sigId) => {
              const cfg = signals.find((s) => s.id === sigId && s.enabled);
              return sum + (cfg ? cfg.weight : 0);
            }, 0);
            const newSignalScore = Math.round(Math.min(100, Math.max(0, computedSignals * 2.2)));
            const newOppScore = Math.round((a.icpFit * 0.4) + (a.intent * 0.25) + (a.timing * 0.15) + (newSignalScore * 0.2));
            
            let newTier: 1 | 2 | 3 | 4 = 4;
            if (newOppScore >= 90) newTier = 1;
            else if (newOppScore >= 70) newTier = 2;
            else if (newOppScore >= 50) newTier = 3;

            // Generate update text
            const text = `${a.company_name} was detected for: "${randomSig.name}"`;
            
            // Add a log/reasons entry
            const category = getOfferCategory(offer.sell);
            const updatedReasons = [...a.reasons];
            let reasonText = `Detected trigger: ${randomSig.name}`;

            if (randomSig.id === "sec_hiring") {
              if (category === "compliance") reasonText = "Detected hiring for 2+ Security Engineering positions.";
              else if (category === "hr") reasonText = "Detected hiring for Talent Recruiters & Sourcers.";
              else if (category === "sales") reasonText = "Detected hiring for 3+ Account Executives.";
              else if (category === "devtools") reasonText = "Detected hiring for DevOps & SRE Engineers.";
              else reasonText = "Detected hiring for Sales & Marketing Directors.";
            } else if (randomSig.id === "comp_hiring") {
              if (category === "compliance") reasonText = "Hiring for Compliance/Legal Counsel roles.";
              else if (category === "hr") reasonText = "Hiring for HR Operations Specialists.";
              else if (category === "sales") reasonText = "Hiring for Sales Operations Analysts.";
              else if (category === "devtools") reasonText = "Hiring for Cloud Security Architects.";
              else reasonText = "Hiring for Operations Managers.";
            } else if (randomSig.id === "trust_center") {
              if (category === "compliance") reasonText = "Added secure Trust / Security Center to domain portal.";
              else if (category === "hr") reasonText = "Integrated automated onboarding software to website.";
              else if (category === "sales") reasonText = "Added self-serve Enterprise packages to billing pages.";
              else if (category === "devtools") reasonText = "Added interactive API documentation and developer portal.";
              else reasonText = "Upgraded digital checkout portal or tech integrations.";
            } else if (randomSig.id === "soc2_ment") {
              if (category === "compliance") reasonText = "SOC2/HIPAA audit readiness mentioned in vacancies.";
              else if (category === "hr") reasonText = "Rapid headcount targets mentioned in company press.";
              else if (category === "sales") reasonText = "CRM API and integration needs mentioned in listings.";
              else if (category === "devtools") reasonText = "CI/CD automation pipeline expansion mentioned in job posts.";
              else reasonText = "New digital marketing tools listed in active jobs.";
            } else if (randomSig.id === "funding") {
              reasonText = "Announced a new venture capital funding round recently.";
            } else if (randomSig.id === "ent_pricing") {
              reasonText = "Added 'Enterprise' package to standard pricing matrix.";
            }

            updatedReasons.unshift(reasonText);

            return {
              ...a,
              signalsDetected: updatedSignals,
              signalScore: newSignalScore,
              opportunityScore: newOppScore,
              priorityTier: newTier,
              reasons: updatedReasons.slice(0, 5)
            };
          }
          return a;
        })
      );

      // Add Feed Event
      addFeedEvent({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        companyName: acc.company_name,
        text: `Triggered "${randomSig.name}" signal (+${randomSig.weight} score)`,
        type: randomSig.category,
        weight: randomSig.weight
      });

    }, 12000); // Trigger a new intelligence signal event every 12s

    return () => clearInterval(interval);
  }, [step, accounts, signals]);

  return (
    <SignalScoutContext.Provider
      value={{
        step,
        setStep,
        offer,
        setOffer,
        icp,
        setIcp,
        painMap,
        setPainMap,
        signals,
        setSignals,
        accounts,
        setAccounts,
        feedEvents,
        addFeedEvent,
        isResearching,
        setIsResearching,
        researchProgress,
        setResearchProgress,
        consoleLogs,
        addConsoleLog,
        clearConsoleLogs,
        generateWorkspace,
        recalculateScores,
        gtmSummary,
        userRole,
        setUserRole,
        credits,
        setCredits
      }}
    >
      {children}
    </SignalScoutContext.Provider>
  );
};
