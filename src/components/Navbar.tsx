import React, { useState, useEffect } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export const NavLink = React.memo(function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[13px] font-medium text-black/50 hover:text-black hover:bg-black/5 px-3.5 py-1.5 rounded-full transition-all duration-200 font-roboto">
      {children}
    </a>
  );
});

export default function Navbar({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (!previous) return;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <header className="w-full max-w-[1200px] pointer-events-auto bg-white/70 backdrop-blur-md border border-black/10 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-14 md:h-16 flex items-center justify-between px-6 transition-all">
        {/* Logo — left */}
        <div className="flex-1 min-w-max flex items-center">
          <AnimatedLogo className="w-5 h-5" showText={true} />
        </div>

        {/* Nav links — perfectly centred */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-1">
          <NavLink href="#features">Platform</NavLink>
          <NavLink href="#how-it-works">Intelligence</NavLink>
          <NavLink href="#newsletter">Digest</NavLink>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-8 flex-1 min-w-max">
          <button onClick={onOpenAuth} className="text-[13px] font-medium text-black/60 hover:text-black transition-colors duration-200 font-roboto hidden md:block">
            Sign in
          </button>
          <motion.button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center gap-2 text-white text-[13px] font-semibold rounded-full px-5 h-9 transition-all duration-200 group font-roboto shrink-0 bg-[#111] hover:bg-black shadow-sm"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </header>
    </motion.div>
  );
}
