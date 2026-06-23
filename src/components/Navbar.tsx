import React, { useState, useEffect } from "react";
import { ArrowRight, Sun, Moon } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";

export const NavLink = React.memo(function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[13px] font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] px-3 py-1.5 rounded-full transition-all duration-200 font-roboto flex items-center gap-1.5">
      {children}
    </a>
  );
});

export default function Navbar({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
      <header className="w-full max-w-[1100px] pointer-events-auto bg-background/70 backdrop-blur-md border border-foreground/10 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-14 md:h-16 flex items-center justify-between px-6 transition-colors duration-300">
        {/* Logo — left */}
        <div className="flex-1 min-w-max flex items-center">
          <AnimatedLogo className="w-5 h-5" showText={true} />
        </div>

        {/* Nav links — perfectly centred inside a pill group */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center gap-0.5 p-1 bg-foreground/[0.03] border border-border-light rounded-full">
            <NavLink href="#features">Signals</NavLink>
            <NavLink href="#how-it-works">Workflow</NavLink>
            <NavLink href="#newsletter">Digest</NavLink>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-6 flex-1 min-w-max">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground/60 hover:text-foreground hover:bg-foreground/5 p-2 rounded-full transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button onClick={onOpenAuth} className="text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 font-roboto hidden md:block">
            Sign in
          </button>
          <motion.button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-[13px] font-semibold rounded-full px-5 h-9 transition-all duration-200 group font-roboto shrink-0 hover:opacity-90 shadow-sm"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </header>
    </motion.div>
  );
}
