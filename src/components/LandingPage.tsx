"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Robot, Target, ShieldCheck } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import Navbar, { NavLink } from "./Navbar";

// ── Static data ────────────────────────────────────────────────────
const STATS = [
  { val: "94.8%", label: "ICP match rate",   brand: "TIER 1" },
  { val: "18×",   label: "signals detected", brand: "DAILY"  },
  { val: "< 3s",  label: "crawl latency",    brand: "P99"    },
  { val: "1,200+",label: "revenue leaders",  brand: "USERS"  },
] as const;

const MARQUEE_ITEMS = [...STATS, ...STATS];

const JSON_LD_STR = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IntelScout AI",
  operatingSystem: "All",
  applicationCategory: "BusinessApplication",
  description: "Real-time AI crawler, technographics parser, and account qualification scoring engine.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

const GRID_ROWS = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];
const GRID_COLS = [8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66];

const FEATURES = [
  { num: "01", title: "Continuous Crawler Engine",  body: "Scrapes web infrastructure, hiring targets, corporate news, and pricing tables automatically. Eliminates manual research overhead entirely.", delay: 0    },
  { num: "02", title: "Dynamic Intent Scoring",      body: "Set exact weights for compliance requirements, dev tool changes, or marketing roles. Watch matching profiles float straight to the top.",         delay: 0.08 },
  { num: "03", title: "GTM Contact Blueprints",      body: "Maps target accounts to buying committees and writes highly contextual, personalized email sequences tailored to exact active pain points.",       delay: 0.16 },
  { num: "04", title: "Real-time Signal Feed",       body: "Live alerts when a target account triggers a qualifying event — funding, headcount changes, tech adoption, or compliance filings.",               delay: 0.24 },
] as const;

const STEPS = [
  { roman: "I",   title: "Define your ICP",             body: "Describe your offer and ideal customer. IntelScout compiles a full GTM blueprint — ICP fit, pain map, and signal weights.",              active: true  },
  { roman: "II",  title: "Crawl & score accounts",       body: "The crawler monitors thousands of domains continuously, scoring each account against your qualification vectors in real-time.",           active: false },
  { roman: "III", title: "Launch personalized outreach", body: "Export AI-written email sequences, call scripts, and LinkedIn hooks tailored to each account's exact active signals.",                   active: false },
] as const;

const CODE_LINES = [
  { line: 1, delay: 0,   text: 'import { intelscout } from "@/core"' },
  { line: 2, delay: 80,  text: '' },
  { line: 3, delay: 160, text: 'intelscout.crawl({' },
  { line: 4, delay: 240, text: "  source: 'your-domain.com'," },
  { line: 5, delay: 320, text: '  sync: true,' },
  { line: 6, delay: 400, text: '  signals: ["hiring","pricing"]' },
  { line: 7, delay: 480, text: '})' },
] as const;

// Stable framer-motion variant objects
const FADE_UP = {
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true         },
  transition:  { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const MODAL_VARIANTS = {
  initial:    { scale: 0.94, opacity: 0, y: 12 },
  animate:    { scale: 1,    opacity: 1, y: 0  },
  exit:       { scale: 0.94, opacity: 0, y: 12 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
};

// ── Memoised sub-components ────────────────────────────────────────
const AnimatedWord = React.memo(function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="relative inline-block">
      <span className="inline-flex">
        {word.split("").map((char, i) => (
          <span key={i} className="animate-char-in" style={{ animationDelay: `${delay + i * 40}ms` }}>
            {char}
          </span>
        ))}
      </span>
      <span className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-sm" style={{ background: "rgba(0,0,0,0.07)" }} />
    </span>
  );
});

const FeatureRow = React.memo(function FeatureRow({ num, title, body, delay = 0 }: { num: string; title: string; body: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group border-b border-black/10 py-10 lg:py-14 flex flex-col lg:flex-row gap-8 lg:gap-16 cursor-default"
    >
      <div className="shrink-0">
        <span className="font-roboto-mono text-sm text-[#888888]">{num}</span>
      </div>
      <div className="flex-1 grid lg:grid-cols-2 gap-6 items-start">
        <h3 className="text-3xl lg:text-4xl font-black tracking-tight text-black group-hover:translate-x-2 transition-transform duration-500 font-roboto leading-tight">
          {title}
        </h3>
        <p className="text-lg text-[#555555] leading-relaxed font-roboto font-normal">{body}</p>
      </div>
    </motion.div>
  );
});

// ── Scroll-driven components ───────────────────────────────────────
const PanelICP = React.memo(function PanelICP() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="p-8 h-full flex flex-col justify-center min-h-[320px]"
    >
      <div className="space-y-4">
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
          <div className="text-[11px] text-[#888] font-roboto-mono tracking-widest mb-1.5">TARGET_INDUSTRY</div>
          <div className="text-sm font-semibold font-roboto text-white">B2B SaaS, FinTech, DevTools</div>
        </div>
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
          <div className="text-[11px] text-[#888] font-roboto-mono tracking-widest mb-1.5">MANDATORY_SIGNALS</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white">Security Audit (SOC2)</span>
            <span className="px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white">Executive Hire</span>
            <span className="px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white">Funding</span>
          </div>
        </div>
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-[11px] text-[#888] font-roboto-mono tracking-widest">ICP_FIT_THRESHOLD</div>
            <div className="text-[11px] text-white font-roboto-mono">85%</div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full" 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const PanelCrawl = React.memo(function PanelCrawl() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col min-h-[320px]"
    >
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <span className="text-xs font-roboto-mono text-[#666]">intelscout.crawl.ts</span>
      </div>
      <div className="p-7 font-roboto-mono text-sm flex-1 flex flex-col justify-center">
        <pre className="text-[#aaa] leading-loose">
          {CODE_LINES.map((l) => (
            <div key={l.line} className="code-line-reveal" style={{ animationDelay: `${l.delay}ms` }}>
              <span className="text-[#444] select-none w-7 inline-block">{l.line}</span>
              <span>{l.text}</span>
            </div>
          ))}
        </pre>
      </div>
      <div className="px-5 py-3 flex items-center gap-3 border-t border-white/10">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-roboto-mono text-[#666]">ICP_SCORE: 94.8 // 18 signals detected</span>
      </div>
    </motion.div>
  );
});

const PanelOutreach = React.memo(function PanelOutreach() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="p-8 h-full flex flex-col justify-center min-h-[320px]"
    >
      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center gap-3 text-sm text-[#aaa] font-roboto">
          <span className="text-white/50">To:</span> 
          <span className="px-2 py-0.5 bg-white/10 rounded-md text-white border border-white/5">VP Security</span>
        </div>
        <div className="p-6 text-[15px] text-[#ccc] leading-relaxed font-roboto">
          Hi {'{{first_name}}'},<br/><br/>
          Noticed you're preparing for <span className="bg-white/10 border border-white/5 text-white px-1.5 py-0.5 rounded text-[13px]">SOC2 compliance</span> and just hired a new <span className="bg-white/10 border border-white/5 text-white px-1.5 py-0.5 rounded text-[13px]">CISO</span>.<br/><br/>
          Our platform automates evidence collection securely and efficiently.
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex justify-end bg-white/[0.02]">
          <div className="px-4 py-2 bg-white hover:bg-[#e5e5e5] transition-colors cursor-pointer text-black text-[13px] font-bold rounded-lg shadow-sm font-roboto">
            Launch Sequence
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function ScrollStep({ step, index, activeStep, onStepEnter }: { step: any, index: number, activeStep: number, onStepEnter: (i: number) => void }) {
  const ref = useRef(null);
  // Trigger when element hits the middle 30% of the viewport
  const isInView = useInView(ref, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    if (isInView) {
      onStepEnter(index);
    }
  }, [isInView, index, onStepEnter]);

  return (
    <div ref={ref} className="py-16 md:py-24 flex flex-col justify-center">
      <div className={`w-full text-left transition-all duration-700 ${activeStep === index ? "opacity-100" : "opacity-20"}`}>
        <div className="flex items-start gap-6">
          <span className={`font-black text-3xl font-roboto shrink-0 transition-colors duration-500 ${activeStep === index ? "text-white" : "text-[#555]"}`}>
            {step.roman}
          </span>
          <div className="flex-1">
            <h3 className={`text-2xl lg:text-3xl font-black mb-3 transition-all duration-500 font-roboto ${activeStep === index ? "text-white translate-x-1" : "text-white/60"}`}>
              {step.title}
            </h3>
            <p className={`leading-relaxed font-normal font-roboto transition-colors duration-500 ${activeStep === index ? "text-[#ccc]" : "text-[#999]"}`}>
              {step.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function LandingPage() {
  const { loginWithEmail } = useIntelScout();

  const [showAuth,        setShowAuth]        = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [authEmail,       setAuthEmail]       = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const openAuth  = useCallback(() => setShowAuth(true),  []);
  const closeAuth = useCallback(() => setShowAuth(false), []);

  const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setLoginSubmitting(true);
    await loginWithEmail(authEmail, authEmail.split("@")[0]);
    setLoginSubmitting(false);
  }, [authEmail, loginWithEmail]);

  const handleGoogleLogin = useCallback(async () => {
    setLoginSubmitting(true);
    await loginWithEmail("demo@google.com", "Google User");
    setLoginSubmitting(false);
  }, [loginWithEmail]);

  const handleOktaLogin = useCallback(async () => {
    setLoginSubmitting(true);
    await loginWithEmail("okta@demo.com", "Okta User");
    setLoginSubmitting(false);
  }, [loginWithEmail]);

  return (
    <div className="relative min-h-screen bg-white text-black overflow-x-hidden noise-overlay font-roboto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD_STR }} />

      <Navbar onOpenAuth={openAuth} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 lg:pt-48 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-[1100px] mx-auto w-full px-6 lg:px-8 flex flex-col md:items-center text-left md:text-center">

          {/* Eyebrow Badge */}
          <div className="animate-line-in mb-6 w-full flex md:justify-center" style={{ animationDelay: "200ms" }}>
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-black/[0.03] border border-black/10 text-[13px] font-medium text-[#444] font-roboto">
              Signal Intelligence for Revenue Teams
            </div>
          </div>

          {/* Headline */}
          <div className="mb-6 w-full">
            <h1
              className="font-black font-roboto flex flex-col items-start md:items-center"
              style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
            >
              <span className="leading-[1] md:leading-[0.92] animate-line-in tracking-tight text-[#222]" style={{ animationDelay: "350ms" }}>
                Qualify B2B
              </span>
              <span className="leading-[1] md:leading-[0.92] animate-line-in tracking-tighter text-black" style={{ animationDelay: "500ms" }}>
                accounts to {heroVisible && <AnimatedWord word="win." delay={600} />}
              </span>
            </h1>
          </div>

          {/* Description & CTA Group tightly stacked */}
          <div className="flex flex-col items-start md:items-center gap-6 md:gap-8 w-full max-w-[640px] mx-auto">
            <p
              className="text-[17px] md:text-xl text-[#555] leading-relaxed font-normal animate-line-in"
              style={{ animationDelay: "500ms" }}
            >
              IntelScout crawls target domains in real-time — tracking hiring signals,
              pricing changes, and tech stack shifts — then scores every account automatically.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-line-in"
              style={{ animationDelay: "620ms" }}
            >
              <button
                onClick={openAuth}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-[#1a1a1a] text-white font-bold text-[15px] rounded-full px-6 h-12 transition-all duration-200 group font-roboto shadow-sm"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[15px] rounded-full px-6 h-12 transition-all duration-200 font-roboto text-black hover:bg-black/5"
                style={{ border: "1.5px solid rgba(0,0,0,0.12)" }}
              >
                Watch demo
              </a>
            </div>
          </div>
        </div>

        {/* Marquee stats */}
        <div className="w-full mt-24 animate-line-in overflow-hidden border-y border-black/[0.04] bg-[#fafafa] py-8 relative z-10" style={{ animationDelay: "800ms" }}>
          <div className="flex gap-16 marquee whitespace-nowrap select-none">
            {MARQUEE_ITEMS.map((s, i) => (
              <div key={i} className="flex items-baseline gap-4 shrink-0">
                <span className="font-black font-roboto text-black" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                  {s.val}
                </span>
                <span className="text-sm text-[#666666] font-roboto">
                  {s.label}
                  <span className="block font-roboto-mono text-[10px] mt-0.5 tracking-widest text-[#999999]">
                    {s.brand}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6">
              <span className="w-8 h-px bg-black/25 inline-block" />
              Capabilities
            </span>
            <motion.h2 {...FADE_UP} className="text-4xl lg:text-5xl font-black tracking-tight font-roboto leading-[1.05] text-black">
              Know who&apos;s buying.<br />
              <span className="text-black/65">Before they tell you.</span>
            </motion.h2>
          </div>
          <div>
            {FEATURES.map((f) => <FeatureRow key={f.num} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works — black section ─────────────────────────── */}
      <section id="how-it-works" className="relative py-24 bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)" }}
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6">
              <span className="w-8 h-px bg-white/30 inline-block" />
              Process
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="text-4xl lg:text-5xl font-black tracking-tight font-roboto leading-[1.1]"
            >
              Three steps.<br />
              <span className="text-[#666666]">Infinite pipeline.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative items-start">
            <div className="pb-32 pt-8">
              {STEPS.map((step, idx) => (
                <ScrollStep 
                  key={step.roman} 
                  step={step} 
                  index={idx} 
                  activeStep={activeProcessStep} 
                  onStepEnter={setActiveProcessStep} 
                />
              ))}
            </div>

            <div className="relative">
              <div className="lg:sticky lg:top-[30vh] w-full border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0a] shadow-[0_8px_30px_rgba(0,0,0,0.4)] min-h-[350px]">
                <AnimatePresence mode="wait">
                  {activeProcessStep === 0 && <PanelICP key="panel0" />}
                  {activeProcessStep === 1 && <PanelCrawl key="panel1" />}
                  {activeProcessStep === 2 && <PanelOutreach key="panel2" />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transition Layer (Final CTA & Trust Metrics) ─────────────────────────── */}
      <section className="relative pt-24 pb-12 bg-white overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="bg-[#fafafa] border border-black/10 rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888] mb-4">
                <Robot className="w-4 h-4" /> Autonomous Intelligence
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight font-roboto leading-tight text-black mb-6">
                Stop guessing. Start closing.
              </h2>
              <p className="text-[#555] text-lg font-roboto mb-8">
                Join 400+ revenue teams using IntelScout to identify high-intent buyers the moment they enter the market.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-3.5 bg-black hover:bg-[#222] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Configure Your GTM Signals <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono text-[#666]">1.2M+ Accounts Scored</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono text-[#666]">SOC2 Type II Certified</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="relative z-10 hidden md:block">
               <div className="w-64 h-64 bg-black/[0.02] rounded-full border border-black/5 flex items-center justify-center relative">
                 <div className="w-48 h-48 bg-black/[0.03] rounded-full border border-black/5 flex items-center justify-center">
                   <div className="w-32 h-32 bg-black/[0.04] rounded-full border border-black/10 flex items-center justify-center">
                     <AnimatedLogo className="w-12 h-12 text-black/20" showText={false} />
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="pt-12 pb-24 bg-white" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
            
            {/* Left Column: Product Identity */}
            <div className="max-w-sm">
              <AnimatedLogo className="w-6 h-6 mb-6" showText={true} />
              <p className="text-sm text-[#555] font-roboto leading-relaxed mb-6">
                IntelScout is an autonomous scoring engine that maps real-time technographic and behavioral signals to your ideal customer profile.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#888]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Systems operational
              </div>
            </div>

            {/* Right Column: Navigation */}
            <div className="grid grid-cols-2 gap-12 sm:gap-24">
              <div>
                <h4 className="font-bold text-[#111] mb-6 text-sm">Product</h4>
                <ul className="space-y-4 text-sm text-[#777] font-roboto">
                  <li><a href="#features" className="hover:text-black transition">Signal Engine</a></li>
                  <li><a href="#how-it-works" className="hover:text-black transition">Qualification</a></li>
                  <li><a href="#" className="hover:text-black transition">Integrations</a></li>
                  <li><a href="#" className="hover:text-black transition">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#111] mb-6 text-sm">Company</h4>
                <ul className="space-y-4 text-sm text-[#777] font-roboto">
                  <li><a href="#" className="hover:text-black transition">About</a></li>
                  <li><a href="#" className="hover:text-black transition">Blog</a></li>
                  <li><a href="#" className="hover:text-black transition">Careers</a></li>
                  <li><a href="#" className="hover:text-black transition">Contact</a></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Legal Info */}
          <div className="mt-24 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#999] font-roboto">
              © {new Date().getFullYear()} IntelScout AI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-[#999] font-roboto">
              <a href="#" className="hover:text-black transition">Privacy Policy</a>
              <a href="#" className="hover:text-black transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Auth modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuth && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              {...MODAL_VARIANTS}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
              style={{ border: "1px solid rgba(0,0,0,0.1)" }}
            >
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#888888] hover:text-black hover:bg-black/5 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 pb-5 mb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <AnimatedLogo className="w-5 h-5" showText={true} />
              </div>

              {loginSubmitting ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <CircleNotch className="w-7 h-7 text-[#888888] animate-spin" />
                  <span className="text-sm text-[#888888] font-roboto">Redirecting…</span>
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-black/10 flex-1" />
                    <span className="text-[10px] uppercase font-roboto-mono text-[#aaaaaa]">Select authentication provider</span>
                    <div className="h-px bg-black/10 flex-1" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full relative z-10 flex items-center gap-3 px-4 py-3.5 bg-white border border-black/10 hover:bg-black/5 text-black rounded-xl transition duration-200 text-sm font-roboto font-medium cursor-pointer"
                  >
                    <GoogleLogo className="w-4 h-4 text-black" weight="bold" />
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleOktaLogin}
                    className="w-full relative z-10 flex items-center gap-3 px-4 py-3.5 bg-white border border-black/10 hover:bg-black/5 text-black rounded-xl transition duration-200 text-sm font-roboto font-medium cursor-pointer"
                  >
                    <WarningCircle className="w-4 h-4 text-black" />
                    Continue with Okta SSO
                  </button>

                  <button
                    type="button"
                    onClick={closeAuth}
                    className="w-full text-center pt-2 pb-1 text-[11px] text-[#aaaaaa] hover:text-[#555555] transition font-roboto mt-4"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
