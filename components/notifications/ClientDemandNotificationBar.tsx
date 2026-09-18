"use client";

import React, { useState, useMemo } from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency } from "@/lib/utils";
import {
  Globe,
  Sparkles,
  ArrowRight,
  X,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function ClientDemandNotificationBar() {
  const {
    projects,
    setFilters,
    setActiveView,
    currentRole,
    addToast,
  } = usePulse();

  const [isVisible, setIsVisible] = useState(true);

  // Filter projects where clients want to make/build a website or web platform
  const websiteDemand = useMemo(() => {
    const webKeywords = [
      "website",
      "web",
      "saas",
      "platform",
      "frontend",
      "full-stack",
      "next.js",
      "react",
      "landing page",
    ];

    const matchingProjects = projects.filter((p) => {
      const catMatch =
        p.category === "Full-Stack Development" ||
        p.category === "UI/UX & Design";

      const titleMatch = webKeywords.some((kw) =>
        p.title.toLowerCase().includes(kw)
      );

      const descMatch = webKeywords.some((kw) =>
        p.description.toLowerCase().includes(kw)
      );

      const skillsMatch = p.skillsRequired.some((s) =>
        ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma", "HTML5", "CSS3"].includes(s)
      );

      return (catMatch || titleMatch || descMatch || skillsMatch) && p.status === "OPEN";
    });

    // Unique clients looking to make their website
    const uniqueClientMap = new Map();
    let totalPool = 0;

    matchingProjects.forEach((proj) => {
      totalPool += proj.budgetMax;
      if (proj.client && !uniqueClientMap.has(proj.clientId)) {
        uniqueClientMap.set(proj.clientId, proj.client);
      }
    });

    return {
      projects: matchingProjects,
      clients: Array.from(uniqueClientMap.values()),
      clientCount: uniqueClientMap.size,
      totalPool,
    };
  }, [projects]);

  if (!isVisible) return null;

  const handleViewWebsiteGigs = () => {
    setActiveView("marketplace");
    setFilters((prev) => ({
      ...prev,
      category: "All Categories",
      search: "Next.js",
    }));

    addToast(
      "info",
      "Website & Web App Gigs Filtered",
      `Showing open client website listings with active budgets.`
    );

    // Smooth scroll down to project feed
    const feedElement = document.getElementById("project-feed");
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative z-30 w-full bg-gradient-to-r from-[#050B1D] via-[#0A173B] to-[#050B1D] border-b border-blue-500/25 shadow-glow-indigo transition-all duration-300">
      {/* Background ambient neon glow line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Left: Live Beacon + Message + Client Avatars */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-center md:text-left">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-300 font-mono text-[11px] font-semibold shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
              </span>
              <span>LIVE CLIENT DEMAND</span>
            </div>

            {/* Client Avatar Stack */}
            {websiteDemand.clients.length > 0 && (
              <div className="hidden sm:flex items-center -space-x-2 overflow-hidden py-0.5">
                {websiteDemand.clients.slice(0, 3).map((client, idx) => (
                  <img
                    key={client.id || idx}
                    src={client.avatarUrl}
                    alt={client.name}
                    title={`${client.name} (${client.company || "Client"})`}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-blue-900 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Dynamic Text */}
            <div className="text-slate-200 text-xs leading-tight">
              <span className="font-bold text-white">
                {websiteDemand.clientCount} verified {websiteDemand.clientCount === 1 ? "client wants" : "clients want"}
              </span>{" "}
              to build a website & web application right now.
              <span className="hidden lg:inline text-slate-400 ml-1.5">
                Total budget allocated:{" "}
                <strong className="text-sky-300 font-mono">
                  {formatCurrency(websiteDemand.totalPool)}+
                </strong>
              </span>
            </div>
          </div>

          {/* Right: Quick Action CTA + Dismiss */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleViewWebsiteGigs}
              className="group flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-400/40 hover:border-blue-400 shadow-sm transition-all font-semibold"
            >
              <span>View Website Projects</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-900/60 text-sky-200 group-hover:bg-blue-700">
                {websiteDemand.projects.length}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss banner"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-blue-900/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
