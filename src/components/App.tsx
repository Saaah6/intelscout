"use client";

import React from "react";
import { IntelScoutProvider, useIntelScout } from "@/context/IntelScoutContext";
import Stage1Offer from "@/components/Onboarding/Stage1Offer";
import Stage2ICP from "@/components/Onboarding/Stage2ICP";
import Stage3Pain from "@/components/Onboarding/Stage3Pain";
import Stage4Weights from "@/components/Onboarding/Stage4Weights";
import Stage5Import from "@/components/Onboarding/Stage5Import";
import ResearchEngine from "@/components/Onboarding/ResearchEngine";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import LandingPage from "@/components/LandingPage";
import AnimatedLogo from "@/components/AnimatedLogo";
import { SignOut } from "@phosphor-icons/react";
import LiquidCurtain from "@/components/LiquidCurtain";

function OnboardingSteps() {
  const { step, user, logout } = useIntelScout();

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
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Absolute positioned floating profile & signout */}
      {user && (
        <div className="absolute top-6 right-6 flex items-center space-x-2 sm:space-x-3 bg-white/80 border border-black/10 rounded-full py-1.5 px-2.5 sm:pl-2.5 sm:pr-4 shadow-sm backdrop-blur-md z-40">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-5 h-5 rounded-full ring-1 ring-black/10"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-bold text-[#111] max-w-[100px] truncate leading-tight font-outfit">{user.name}</span>
            <span className="text-[8px] text-[#666] truncate leading-none max-w-[100px]">{user.email}</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-black/10" />
          <button
            onClick={logout}
            className="text-[#555] hover:text-red-500 transition text-[9px] font-bold flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer"
            title="Sign Out"
          >
            <SignOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      )}

      {/* Setup Steps Wizard Header */}
      <div className="w-full max-w-3xl flex flex-col items-center mb-8 text-center">
        <div className="flex items-center justify-center mb-2 text-black">
          <AnimatedLogo className="w-6 h-6" showText={true} />
        </div>
        <h1 className="text-xl font-bold text-[#111] mb-4 font-outfit tracking-tight">Campaign Configuration</h1>
        
        {/* Progress bar dots */}
        <div className="flex items-center space-x-2 w-full max-w-sm mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div 
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  s <= step ? "bg-black shadow-sm" : "bg-black/10"
                }`}
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest mt-3.5">
          Step {step} of 5 &bull; {getStepTitle(step)}
        </span>
      </div>

      {/* Main Wizard Form Container */}
      <div className="w-full flex justify-center items-center">
        <LiquidCurtain stageKey={step}>
          {renderWizardStep()}
        </LiquidCurtain>
      </div>

    </div>
  );
}

function MainAppContent() {
  const { step, isAuthenticated, isAuthLoading } = useIntelScout();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-6 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="text-[#555] text-xs font-semibold">Initializing IntelScout Engine...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (step === "research") {
    return (
      <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-6 font-sans">
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
    <IntelScoutProvider>
      <MainAppContent />
    </IntelScoutProvider>
  );
}
