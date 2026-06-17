"use client";

import React from "react";
import { SignalScoutProvider, useSignalScout } from "@/context/SignalScoutContext";
import Stage1Offer from "@/components/Onboarding/Stage1Offer";
import Stage2ICP from "@/components/Onboarding/Stage2ICP";
import Stage3Pain from "@/components/Onboarding/Stage3Pain";
import Stage4Weights from "@/components/Onboarding/Stage4Weights";
import Stage5Import from "@/components/Onboarding/Stage5Import";
import ResearchEngine from "@/components/Onboarding/ResearchEngine";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Target, CheckCircle2 } from "lucide-react";

function OnboardingSteps() {
  const { step } = useSignalScout();

  const getStepTitle = (s: number) => {
    switch (s) {
      case 1: return "Define GTM Offer";
      case 2: return "Build Customer Profile";
      case 3: return "Map Operational Pains";
      case 4: return "Tune Intent Weights";
      case 5: return "Import Accounts Queue";
      default: return "";
    }
  };

  const renderWizardStep = () => {
    switch (step) {
      case 1: return <Stage1Offer />;
      case 2: return <Stage2ICP />;
      case 3: return <Stage3Pain />;
      case 4: return <Stage4Weights />;
      case 5: return <Stage5Import />;
      default: return null;
    }
  };

  if (typeof step === "string") return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-650/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-650/5 rounded-full blur-3xl pointer-events-none" />

      {/* Setup Steps Wizard Header */}
      <div className="w-full max-w-xl flex flex-col items-center mb-8 text-center">
        <div className="flex items-center space-x-2 text-violet-400 mb-2">
          <Target className="w-6 h-6 animate-pulse" />
          <span className="font-extrabold text-lg tracking-wider font-outfit uppercase">SignalScout AI</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-4 font-outfit">Campaign Configuration</h1>
        
        {/* Progress bar dots */}
        <div className="flex items-center space-x-2 w-full max-w-sm mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div 
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  s <= step ? "bg-violet-500 shadow-md shadow-violet-500/25" : "bg-zinc-800"
                }`}
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-3.5">
          Step {step} of 5 &bull; {getStepTitle(step)}
        </span>
      </div>

      {/* Main Wizard Form Container */}
      <div className="w-full flex justify-center items-center">
        {renderWizardStep()}
      </div>

    </div>
  );
}

function MainAppContent() {
  const { step } = useSignalScout();

  if (step === "research") {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 font-sans">
        <ResearchEngine />
      </div>
    );
  }

  if (step === "dashboard") {
    return <DashboardLayout />;
  }

  return <OnboardingSteps />;
}

export default function Page() {
  return (
    <SignalScoutProvider>
      <MainAppContent />
    </SignalScoutProvider>
  );
}
