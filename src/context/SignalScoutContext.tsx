"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

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
  const generateWorkspace = useCallback(() => {
    const isTech = offer.sell.toLowerCase().includes("ai") || offer.sell.toLowerCase().includes("tech") || offer.sell.toLowerCase().includes("software") || offer.sell.toLowerCase().includes("cyber");
    
    // 1. Generate ICP
    const generatedICP: ICP = {
      firmographics: {
        industry: isTech ? "B2B SaaS, FinTech, Enterprise Software" : "E-commerce, Retail, Professional Services",
        employeeCount: "50-1000 employees",
        revenue: offer.dealSize === "<$1,000" || offer.dealSize === "$1,000-$5,000" ? "$5M - $20M" : "$20M - $150M",
        geography: "United States, Canada, Europe",
        fundingStage: "Series A to Series D"
      },
      technographics: isTech 
        ? ["AWS", "GitHub Actions", "Salesforce", "Vanta", "Snowflake", "Sentry", "PostgreSQL"]
        : ["Shopify", "Google Analytics", "HubSpot", "Zendesk", "Stripe", "Clara"],
      growthSignals: [
        "Engineering expansion (>20% YoY)",
        "Compliance requirements in job specifications",
        "Recent funding rounds",
        "Enterprise landing page launches"
      ],
      buyingCommittee: isTech
        ? ["VP of Engineering", "Head of Security", "Chief Technology Officer (CTO)", "Director of DevOps"]
        : ["Chief Marketing Officer (CMO)", "Head of Sales", "Founder & CEO", "VP of Revenue Operations"]
    };
    setIcp(generatedICP);

    // 2. Generate Pain Mapping
    const generatedPainMap: PainMap = {
      problem: offer.problem,
      pain: isTech ? [
        "Security reviews block major enterprise deals",
        "SOC2/ISO preparation takes engineers away from building the product",
        "Compliance audits are manual, error-prone, and stress-inducing"
      ] : [
        "Inbound sales pipeline has stalled due to lack of personalization",
        "High cost of customer acquisition through paid advertising channels",
        "Inefficient outbound campaign tracking and poor tool integrations"
      ],
      triggers: isTech ? [
        "Hiring Security Engineers (audit workload likely increasing)",
        "Added 'Enterprise Plan' link to website footer",
        "Announced Series A funding (entering enterprise sales cycle)"
      ] : [
        "Hiring Growth Marketers or Sales Leaders",
        "Launched a new product category on Product Hunt",
        "Expanded into new geographic market segments"
      ],
      buyingMotivation: isTech
        ? "Unlock enterprise revenue and pass security reviews in days rather than months."
        : "Improve customer acquisition efficiency and increase outbound meeting booking rates."
    };
    setPainMap(generatedPainMap);

    // 3. Dynamically adjust signals config categories / naming if needed
    const customSignals = DEFAULT_SIGNALS.map((s) => {
      if (!isTech) {
        if (s.id === "sec_hiring") return { ...s, name: "Marketing Expansion Hiring" };
        if (s.id === "comp_hiring") return { ...s, name: "Sales Operations Hiring" };
        if (s.id === "trust_center") return { ...s, name: "Shopify Plus / Tech Upgrade" };
        if (s.id === "soc2_ment") return { ...s, name: "AdTech Platform Mentioned" };
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
            const updatedReasons = [...a.reasons];
            if (randomSig.id === "sec_hiring") updatedReasons.unshift("Detected hiring for 2+ Security Engineering positions.");
            else if (randomSig.id === "trust_center") updatedReasons.unshift("Added Trust / Security Center to main homepage.");
            else if (randomSig.id === "ent_pricing") updatedReasons.unshift("Added 'Enterprise' package to standard pricing matrix.");
            else updatedReasons.unshift(`Detected trigger: ${randomSig.name}`);

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
        recalculateScores
      }}
    >
      {children}
    </SignalScoutContext.Provider>
  );
};
