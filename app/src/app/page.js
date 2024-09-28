"use client";

import { RetroGrid } from "./components/retro-grid";

export default function Home() {
  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
      JustDoIt
      </span>

      <RetroGrid />

      {/* Self-improvement quote */}
      <div className="absolute bottom-10 text-center">
        <p className="text-xl font-semibold text-white">"Success is not final, failure is not fatal: It is the courage to continue that counts."</p>
        <p className="mt-2 text-lg text-gray-400">- JustDoIt</p>
      </div>
    </div>
  );
}
