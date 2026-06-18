"use client";

import React, { useState } from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { useSignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import CosmosBackground from "./CosmosBackground";
import { 
  Target, 
  EnvelopeSimple, 
  ArrowRight, 
  CheckCircle, 
  Sparkle, 
  Cpu, 
  TrendUp, 
  Users, 
  Lock,
  CircleNotch
} from "@phosphor-icons/react";

import AnimatedLogo from "./AnimatedLogo";

export default function LandingPage() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  
  // Local state for newsletter signup
  const [email, setEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // Local state for authentication modal
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Handle newsletter submit
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setNewsletterSubmitting(true);
    setNewsletterError("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setNewsletterSuccess(true);
        setEmail("");
      } else {
        setNewsletterError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setNewsletterError("Failed to connect to the server. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Handle Google authentication redirect via Clerk
  const handleGoogleLogin = async () => {
    if (!isSignInLoaded) return;
    setLoginSubmitting(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/"
      });
    } catch (err) {
      console.error("Clerk Google authentication error", err);
      setLoginSubmitting(false);
    }
  };

  // Handle Okta authentication redirect via Clerk
  const handleOktaLogin = async () => {
    if (!isSignInLoaded) return;
    setLoginSubmitting(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_okta",
        redirectUrl: "/",
        redirectUrlComplete: "/"
      });
    } catch (err) {
      console.error("Clerk Okta authentication error", err);
      setLoginSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Signal Scout",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "Real-time AI crawler, technographics parser, and account qualification scoring engine for enterprise GTM teams.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* WebGL Cosmos Backdrop */}
      <CosmosBackground />

      {/* Tech Grid Lines Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025] z-0">
        <div className="absolute h-px bg-white w-full" style={{ top: "12.5%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "25%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "37.5%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "50%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "62.5%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "75%" }} />
        <div className="absolute h-px bg-white w-full" style={{ top: "87.5%" }} />
        
        <div className="absolute w-px bg-white h-full" style={{ left: "8.33%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "16.66%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "25%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "33.33%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "41.66%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "50%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "58.33%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "66.66%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "75%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "83.33%" }} />
        <div className="absolute w-px bg-white h-full" style={{ left: "91.66%" }} />
      </div>

      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Centered Floating Glassmorphic Top Navigation Dock */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl bg-zinc-900/70 border border-zinc-800/85 backdrop-blur-md rounded-full shadow-2xl z-40 px-6 py-3 flex items-center justify-between transition-all duration-300">
        <AnimatedLogo className="w-5 h-5" showText={true} />

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
          <a href="#features" className="hover:text-violet-400 transition">Features</a>
          <a href="#how-it-works" className="hover:text-violet-400 transition">How It Works</a>
          <a href="#newsletter" className="hover:text-violet-400 transition">GTM Digest</a>
        </nav>

        <button 
          onClick={() => setShowGooglePopup(true)}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] uppercase tracking-wider font-bold rounded-full transition duration-300 cursor-pointer"
        >
          Sign In
        </button>
      </div>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full flex flex-col items-center justify-center relative z-25 text-center">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-violet-950/20 border border-violet-900/30 text-violet-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-md shadow-violet-950/10 animate-pulse">
          <Sparkle className="w-3.5 h-3.5" />
          <span>The Next Gen GTM Intelligence Console</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl font-outfit">
          Qualify B2B Accounts in Real-Time with{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Signal Scout Crawler
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
          Signal Scout crawls target domains to monitor security changes, hiring activities, pricing expansions, and regional updates, scoring every account on automatic qualification vectors.
        </p>

        {/* Google CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setShowGooglePopup(true)}
            className="px-6 py-3.5 bg-violet-600 hover:bg-violet-550 text-white rounded-xl font-bold text-xs tracking-wider uppercase flex items-center space-x-3 transition duration-300 shadow-xl shadow-violet-600/15 group"
          >
            {/* Google Icon Logo SVG */}
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.97.545 4.078 1.488l3.078-3.078C19.26 2.367 15.99 1 12.24 1 5.926 1 1 5.925 1 12s4.926 11 11.24 11c5.73 0 10.74-4.14 10.74-11 0-.693-.06-1.37-.173-2.029H12.24z"/>
            </svg>
            <span>Get Started with Google</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Mock Graphic Visualizer Card */}
        <div id="how-it-works" className="mt-14 w-full max-w-4xl bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
          <div className="flex items-center justify-between border-b border-zinc-850/60 pb-3 mb-4 text-left">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-zinc-500 font-mono pl-2 hidden sm:inline">GTM PRIORITIZATION PANEL &bull; SEC_MONITORING_LIVE</span>
              <span className="text-[10px] text-zinc-500 font-mono pl-2 sm:hidden">PRIORITIZATION PANEL</span>
            </div>
            <div className="px-2.5 py-1 bg-violet-950/20 border border-violet-900/30 text-violet-400 rounded-lg text-[9px] font-bold tracking-wider">
              100% AUTOMATED
            </div>
          </div>
          
          {/* Dashboard Preview Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-3.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Target ICP Fit</span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-xl font-black text-white font-outfit">94.8%</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">Tier 1 Match</span>
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-3.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Intent Triggers Crawled</span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-xl font-black text-white font-outfit">18 Detected</span>
                <span className="text-[10px] text-violet-400 font-bold font-mono">+12 New Today</span>
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-3.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Next Best Outreach Angle</span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-xs font-bold text-zinc-350 truncate">SOC2/HIPAA Security Autopilot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section id="features" className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <div className="bg-zinc-900/30 border border-zinc-900/50 rounded-2xl p-6 hover:border-zinc-850 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-950/30 border border-violet-900/40 text-violet-400 flex items-center justify-center mb-5">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Continuous Crawler Engine</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Scrapes web infrastructure, hiring targets, corporate news, and pricing tables automatically. Eliminates manual research overhead.
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900/50 rounded-2xl p-6 hover:border-zinc-850 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 flex items-center justify-center mb-5">
              <TrendUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Dynamic Intent Weighted Scoring</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Set exact weights for compliance requirements, dev tool changes, or marketing roles. Watch matching profiles float straight to the top.
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900/50 rounded-2xl p-6 hover:border-zinc-850 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 flex items-center justify-center mb-5">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">GTM Contact Blueprints</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Maps target accounts to buying committees and writes highly contextual, personalized email sequences tailored to their exact active pain points.
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="mt-32 w-full max-w-xl">
          <div className="bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] text-violet-400 pointer-events-none">
              <EnvelopeSimple className="w-40 h-40" />
            </div>

            <div className="flex items-center justify-center space-x-2 text-violet-400 mb-4">
              <EnvelopeSimple className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">GTM Intelligence Digest</span>
            </div>

            <h2 className="text-xl font-bold text-white font-outfit">Join the GTM Intelligence Circle</h2>
            <p className="mt-2 text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
              Get weekly updates on B2B signal crawling techniques, qualification structures, and outbound strategies. No spam, just high-intent tactics.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-6 relative flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                disabled={newsletterSubmitting || newsletterSuccess}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-850 focus:border-violet-500 px-4 py-3 rounded-xl text-xs focus:outline-none transition text-zinc-200 placeholder-zinc-650 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting || newsletterSuccess}
                className="px-5 py-3 bg-violet-600 hover:bg-violet-555 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:bg-violet-850 disabled:cursor-not-allowed"
              >
                {newsletterSubmitting ? (
                  <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                ) : newsletterSuccess ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            <AnimatePresence>
              {newsletterSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-emerald-400 font-semibold mt-3.5 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Success! You've joined the list. Check your email.</span>
                </motion.p>
              )}
              {newsletterError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-red-400 font-semibold mt-3"
                >
                  {newsletterError}
                </motion.p>
              )}
            </AnimatePresence>

            <span className="text-[9px] text-zinc-650 font-medium tracking-wide block mt-4 uppercase">
              Join 1,200+ revenue leaders subscribing monthly
            </span>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900/60 py-8 text-center text-xs text-zinc-500 font-medium z-20 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-zinc-650">
            &copy; {new Date().getFullYear()} Signal Scout Inc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-[10px] uppercase tracking-wider font-bold">
            <a href="#features" className="hover:text-violet-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-violet-400 transition">How It Works</a>
            <a href="#newsletter" className="hover:text-violet-400 transition">Subscribe</a>
            <a href="/api/newsletter/subscribers" className="hover:text-violet-400 transition">Subscribers API</a>
          </div>
        </div>
      </footer>

      {/* Clerk Authentication Portal Dialog */}
      <AnimatePresence>
        {showGooglePopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 text-left relative"
            >
              {/* Portal Header */}
              <div className="flex items-center space-x-2.5 pb-4 border-b border-zinc-850/60">
                <AnimatedLogo className="w-5 h-5" showText={true} />
              </div>

              {loginSubmitting ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <CircleNotch className="w-8 h-8 text-violet-500 animate-spin" />
                  <span className="text-xs text-zinc-400 font-semibold">Redirecting to Identity Gateway...</span>
                </div>
              ) : (
                <div className="py-5 space-y-3">
                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-800 rounded-xl transition duration-200 text-left font-semibold text-xs text-zinc-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Okta Login Button */}
                  <button
                    onClick={handleOktaLogin}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-800 rounded-xl transition duration-200 text-left font-semibold text-xs text-zinc-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-violet-400" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span>Continue with Okta SSO</span>
                  </button>

                  <button
                    onClick={() => setShowGooglePopup(false)}
                    className="w-full text-center py-2 text-[10px] font-bold text-zinc-550 hover:text-zinc-400 transition uppercase tracking-wider mt-4"
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
