"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  className?: string;
  showText?: boolean;
}

export default function AnimatedLogo({ className = "w-6 h-6", showText = false }: AnimatedLogoProps) {
  return (
    <div className="flex items-center space-x-2.5 select-none">
      {/* Animated Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Pulsing signal background wave 1 */}
        <motion.div
          animate={{
            scale: [1, 2, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-violet-500/30 rounded-full blur-[2px]"
        />

        {/* Pulsing signal background wave 2 */}
        <motion.div
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.05, 0.25, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[4px]"
        />

        {/* Outer rotating scanner ring */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-full h-full text-violet-400/50"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="20 40 10 30"
            fill="none"
          />
        </motion.svg>

        {/* Inner rotating counter-ring */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-4/5 h-4/5 text-emerald-400/40"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="40 10 5 45"
            fill="none"
          />
        </motion.svg>

        {/* Solid center dot */}
        <div className="relative w-2 h-2 bg-gradient-to-tr from-violet-400 to-emerald-400 rounded-full shadow-lg shadow-violet-500/50 z-10" />
      </div>

      {/* Optional Text */}
      {showText && (
        <span className="font-bold text-sm tracking-tight text-white font-outfit">
          Signal<span className="text-violet-400">Scout</span>
        </span>
      )}
    </div>
  );
}
