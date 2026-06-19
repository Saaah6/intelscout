import React from "react";
import { ArrowRight } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";

export const NavLink = React.memo(function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm font-medium text-[#333333] hover:text-black transition-colors duration-200 group relative font-roboto">
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
    </a>
  );
});

export default function Navbar({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
      <nav className="relative max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14 py-3 sm:py-0 flex flex-wrap items-center justify-between" style={{ minHeight: 68 }}>
        {/* Logo — left */}
        <div className="flex-1 min-w-max">
          <AnimatedLogo className="w-5 h-5" showText={true} />
        </div>

        {/* Nav links — perfectly centred */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-6 lg:gap-12 flex-1">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it works</NavLink>
          <NavLink href="#newsletter">GTM Digest</NavLink>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5 flex-1 min-w-max mt-2 sm:mt-0">
          <button onClick={onOpenAuth} className="text-sm font-medium text-[#333333] hover:text-black transition-colors duration-200 font-roboto hidden md:block">
            Sign in
          </button>
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-[#1a1a1a] text-white text-sm font-bold rounded-full px-5 sm:px-6 h-9 transition-all duration-200 group font-roboto shrink-0"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>
    </header>
  );
}
