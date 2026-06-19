import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

const FADE_UP = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterSubmitting(true);
    try {
      const res  = await fetch("/api/newsletter/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setNewsletterSuccess(true); setEmail(""); }
      else setNewsletterError(data.error || "Something went wrong.");
    } catch {
      setNewsletterError("Failed to connect. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  }, [email]);

  const onEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), []);

  return (
    <section id="newsletter" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Extremely faint grid background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{ backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)", backgroundSize: "64px 64px" }} 
      />
      {/* Subtle radial background glow (monochrome) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-black/[0.04] blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14 relative z-10">
        <div className="max-w-[600px] mx-auto text-center flex flex-col items-center justify-center">
          
          {/* Premium pill badge */}
          <div className="inline-flex items-center justify-center h-[26px] px-3 rounded-full border border-black/10 bg-white text-[12px] font-medium text-[#444] mb-6 font-roboto shadow-[0_2px_4px_-1px_rgba(0,0,0,0.02)] gap-1.5">
            <span className="text-[#888] text-[10px]">⚡</span> Weekly GTM Intelligence
          </div>
          
          <motion.h2 {...FADE_UP} className="text-4xl lg:text-5xl font-black tracking-tight font-roboto mb-5 leading-[1.1] text-black text-center w-full">
            Join the GTM<br className="hidden sm:block" /> Intelligence Circle
          </motion.h2>
          
          <p className="text-[17px] text-[#666] leading-relaxed mb-8 font-normal text-center w-full max-w-[440px] mx-auto">
            B2B signal crawling techniques, qualification frameworks, and outbound strategies.
          </p>

          <form 
            onSubmit={handleNewsletterSubmit} 
            className="w-full max-w-[440px] mx-auto bg-white border border-black/10 rounded-[14px] p-1.5 flex flex-col md:flex-row items-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/15 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:border-black/20"
          >
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              disabled={newsletterSubmitting || newsletterSuccess}
              onChange={onEmailChange}
              className="flex-1 w-full h-11 px-4 bg-transparent text-[14px] font-roboto text-black placeholder-[#888] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={newsletterSubmitting || newsletterSuccess}
              className="w-full md:w-[120px] h-11 bg-black hover:bg-[#222] text-white font-semibold text-[13px] rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 font-roboto"
            >
              {newsletterSubmitting ? (
                <CircleNotch className="w-4 h-4 animate-spin" />
              ) : newsletterSuccess ? (
                <><CheckCircle className="w-4 h-4" /> Done</>
              ) : "Subscribe"}
            </button>
          </form>
          {newsletterError && <p className="text-xs text-red-500 mt-3 font-roboto text-center w-full">{newsletterError}</p>}

          {/* Improved trust indicator */}
          <div className="flex items-center gap-3 mt-6 justify-center">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-[#eee] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-[#555]">C</div>
              <div className="w-6 h-6 rounded-full bg-[#e5e5e5] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-[#555]">V</div>
              <div className="w-6 h-6 rounded-full bg-[#ddd] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-[#555]">M</div>
            </div>
            <p className="text-[13px] text-[#777] font-medium font-roboto">
              Join <span className="text-black font-bold">1,200+</span> revenue leaders
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
