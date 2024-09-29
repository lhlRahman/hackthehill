"use client";

import { RetroGrid } from "./components/retro-grid";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function Home() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Paw_sitivity
      </span>

      <RetroGrid />

      {/* Dashboard button */}
      <motion.button
        style={{
          border,
          boxShadow,
        }}
        whileHover={{
          scale: 1.015,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className="group relative mt-8 flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
      >
        <Link className="z-40" href="/login">
          Get Started
        </Link>
        <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
      </motion.button>

      {/* Self-improvement quote */}
      <div className="absolute bottom-10 text-center">
        <p className="text-xl font-semibold text-white">
          "Success is not final, failure is not fatal: It is the courage to continue that counts."
        </p>
        <p className="mt-2 text-lg text-gray-400">- JustDoIt</p>
      </div>
    </div>
  );
}
