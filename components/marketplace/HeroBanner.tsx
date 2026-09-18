"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { Sparkles, ShieldCheck, Zap, TrendingUp, Users } from "lucide-react";

export function HeroBanner() {
  const { currentRole, setIsPostWizardOpen, setActiveView } = usePulse();

  return (
    <div className="relative overflow-hidden pt-8 pb-10 border-b border-border-subtle bg-radial-highlight">
      {/* Deep Blue & Black Ambient Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-sky-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-10 left-10 w-[350px] h-[250px] bg-blue-900/25 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/30 backdrop-blur-md shadow-glow-indigo">
            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-blue-200 tracking-wide uppercase">
              Curated Talent Matching for Frontier Tech
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Connect with the world&apos;s most <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              exceptional builders.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            PulseConnect bridges the discovery gap between YC-backed founders, forward-thinking enterprises, and battle-tested senior engineers, AI researchers, and product designers.
          </p>

          {/* Role CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {currentRole === "CLIENT" ? (
              <>
                <button
                  onClick={() => setIsPostWizardOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue transition-all transform hover:-translate-y-0.5"
                >
                  Publish New Project
                </button>
                <button
                  onClick={() => setActiveView("my-projects")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-950/30 hover:bg-blue-900/40 text-blue-100 border border-blue-500/30 hover:border-blue-400/50 transition-all"
                >
                  View Incoming Proposals
                </button>
              </>
            ) : (
              <>
                <a
                  href="#project-feed"
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-accent-cyan hover:bg-sky-400 text-slate-950 font-bold shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
                >
                  Explore Active Openings
                </a>
                <button
                  onClick={() => setActiveView("freelancer-bids")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-950/30 hover:bg-blue-900/40 text-blue-100 border border-blue-500/30 hover:border-blue-400/50 transition-all"
                >
                  Track Submitted Bids
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-blue-500/20">
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-background-card/90 border border-blue-500/20 shadow-subtle-card">
            <div className="p-2.5 rounded-lg bg-blue-500/15 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">$4.8M+</p>
              <p className="text-xs text-slate-400">Contracts Matched</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-background-card/90 border border-blue-500/20 shadow-subtle-card">
            <div className="p-2.5 rounded-lg bg-sky-500/15 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">100%</p>
              <p className="text-xs text-slate-400">Verified Enterprise Clients</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-background-card/90 border border-blue-500/20 shadow-subtle-card">
            <div className="p-2.5 rounded-lg bg-accent-emerald/15 text-accent-emerald">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">&lt; 4 Hours</p>
              <p className="text-xs text-slate-400">Average Match Speed</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-background-card/90 border border-blue-500/20 shadow-subtle-card">
            <div className="p-2.5 rounded-lg bg-blue-600/15 text-blue-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">Top 1%</p>
              <p className="text-xs text-slate-400">Vetted Technical Talent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
