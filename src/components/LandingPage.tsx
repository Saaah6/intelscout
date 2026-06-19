"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CircleNotch, X, GoogleLogo, WarningCircle } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import Navbar, { NavLink } from "./Navbar";
import NewsletterSection from "./NewsletterSection";

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

// ── Main component ─────────────────────────────────────────────────
export default function LandingPage() {
  const { loginWithEmail } = useIntelScout();

  const [showAuth,        setShowAuth]        = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [authEmail,       setAuthEmail]       = useState("");
  const [heroVisible, setHeroVisible] = useState(false);

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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ paddingTop: 68 }}>
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-14 py-32 lg:py-40">

          <div className="animate-line-in mb-8" style={{ animationDelay: "200ms" }}>
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888]">
              <span className="w-8 h-px bg-black/25 inline-block" />
              The GTM intelligence platform
            </span>
          </div>

          <div className="mb-12">
            <h1
              className="font-black leading-[1.0] tracking-tight font-roboto text-black text-balance max-w-[1100px]"
              style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
            >
              <span className="animate-line-in inline" style={{ animationDelay: "350ms" }}>
                Qualify B2B accounts to{" "}
              </span>
              <span className="inline-block">
                {heroVisible && <AnimatedWord word="win." delay={550} />}
              </span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-center">
            <p
              className="text-xl lg:text-2xl text-[#444444] leading-relaxed max-w-xl font-normal animate-line-in"
              style={{ animationDelay: "500ms" }}
            >
              IntelScout crawls target domains in real-time — tracking hiring signals,
              pricing changes, and tech stack shifts — then scores every account automatically.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-4 animate-line-in"
              style={{ animationDelay: "620ms" }}
            >
              <button
                onClick={openAuth}
                className="inline-flex items-center gap-2.5 bg-black hover:bg-[#1a1a1a] text-white font-bold text-base rounded-full px-8 h-14 transition-all duration-200 group font-roboto"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-base rounded-full px-8 h-14 transition-all duration-200 font-roboto text-black"
                style={{ border: "1.5px solid rgba(0,0,0,0.18)" }}
              >
                Watch demo
              </a>
            </div>
          </div>
        </div>

        {/* Marquee stats */}
        <div className="absolute bottom-12 left-0 right-0 animate-line-in overflow-hidden" style={{ animationDelay: "800ms" }}>
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
      <section id="features" className="relative py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6">
              <span className="w-8 h-px bg-black/25 inline-block" />
              Capabilities
            </span>
            <motion.h2 {...FADE_UP} className="text-4xl lg:text-6xl font-black tracking-tight font-roboto leading-tight text-black">
              Everything you need.<br />
              <span className="text-[#aaaaaa]">Nothing you don't.</span>
            </motion.h2>
          </div>
          <div>
            {FEATURES.map((f) => <FeatureRow key={f.num} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works — black section ─────────────────────────── */}
      <section id="how-it-works" className="relative py-24 lg:py-32 bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-14">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6">
              <span className="w-8 h-px bg-white/30 inline-block" />
              Process
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-black tracking-tight font-roboto leading-tight"
            >
              Three steps.<br />
              <span className="text-[#666666]">Infinite pipeline.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              {STEPS.map((step) => (
                <div
                  key={step.roman}
                  className={`w-full text-left py-8 group transition-all duration-500 ${step.active ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-black text-3xl text-[#555555] font-roboto shrink-0">{step.roman}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-black mb-3 group-hover:translate-x-2 transition-transform duration-300 font-roboto text-white">
                        {step.title}
                      </h3>
                      <p className="text-[#999999] leading-relaxed font-normal font-roboto">{step.body}</p>
                      {step.active && (
                        <div className="mt-4 h-px bg-white/15 overflow-hidden">
                          <div className="h-full bg-white progress-bar" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <span className="text-xs font-roboto-mono text-[#666666]">intelscout.crawl.ts</span>
                </div>
                <div className="p-7 font-roboto-mono text-sm min-h-[260px]">
                  <pre className="text-[#aaaaaa] leading-loose">
                    {CODE_LINES.map((l) => (
                      <div key={l.line} className="code-line-reveal" style={{ animationDelay: `${l.delay}ms` }}>
                        <span className="text-[#444444] select-none w-7 inline-block">{l.line}</span>
                        <span>{l.text}</span>
                      </div>
                    ))}
                  </pre>
                </div>
                <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-roboto-mono text-[#666666]">ICP_SCORE: 94.8 // 18 signals detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-8 bg-white" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4">
          <AnimatedLogo className="w-4 h-4" showText={true} />
          <div className="flex gap-8 items-center">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#newsletter">Subscribe</NavLink>
          </div>
          <p className="text-xs text-[#aaaaaa] font-roboto-mono">
            © {new Date().getFullYear()} IntelScout AI Inc.
          </p>
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
