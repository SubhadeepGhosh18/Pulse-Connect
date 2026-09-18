"use client";

import React, { useMemo } from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Project } from "@/types";
import {
  Globe,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap,
} from "lucide-react";

export function ClientDemandSidebar() {
  const {
    projects,
    setSelectedProject,
    setIsProjectModalOpen,
    setIsProposalDrawerOpen,
    currentRole,
    setFilters,
    addToast,
  } = usePulse();

  // Dynamically detect clients seeking website & web platform builds
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

    const matching = projects.filter((p) => {
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

    const uniqueClients = new Map();
    let totalBudget = 0;

    matching.forEach((proj) => {
      totalBudget += proj.budgetMax;
      if (proj.client && !uniqueClients.has(proj.clientId)) {
        uniqueClients.set(proj.clientId, proj.client);
      }
    });

    return {
      projects: matching,
      clientCount: uniqueClients.size,
      totalBudget,
    };
  }, [projects]);

  const handleApplyToProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    if (currentRole === "FREELANCER") {
      setIsProposalDrawerOpen(true);
    } else {
      setIsProjectModalOpen(true);
    }
  };

  const handleViewAllWebsiteGigs = () => {
    setFilters((prev) => ({
      ...prev,
      category: "All Categories",
      search: "Next.js",
    }));

    addToast(
      "info",
      "Filtered: Website & Web App Projects",
      `Showing all active website builds with verified client budgets.`
    );
  };

  return (
    <aside className="sticky top-20 space-y-4">
      {/* Main Notification Card */}
      <div className="p-5 rounded-2xl bg-background-card/95 border border-blue-500/30 shadow-glow-blue backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-300 font-bold">
              Live Demand Alert
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 border border-blue-400/40 text-blue-200">
            {websiteDemand.clientCount} Clients Hiring
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-sm font-bold text-white leading-snug">
          Clients Wanting Website Builds
        </h3>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          <strong className="text-white">{websiteDemand.clientCount} verified clients</strong> are actively seeking talented freelancers to build their websites and web apps.
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-2 my-3.5 p-2.5 rounded-xl bg-background-tertiary/90 border border-blue-500/20 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Active Requests</span>
            <span className="text-base font-bold text-sky-300 font-mono">
              {websiteDemand.projects.length} Projects
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Total Budget Pool</span>
            <span className="text-base font-bold text-accent-emerald font-mono">
              {formatCurrency(websiteDemand.totalBudget)}+
            </span>
          </div>
        </div>

        {/* Live List of Client Requests */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {websiteDemand.projects.slice(0, 4).map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProject(proj);
                setIsProjectModalOpen(true);
              }}
              className="p-3 rounded-xl bg-background-secondary/70 border border-blue-500/15 hover:border-blue-400/50 hover:bg-background-cardHover transition-all cursor-pointer group"
            >
              {/* Client Info */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <img
                    src={proj.client?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={proj.client?.name || "Client"}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500/30"
                  />
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {proj.client?.company || proj.client?.name}
                  </span>
                  {proj.client?.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  )}
                </div>

                <span className="text-[10px] font-mono text-sky-400 font-semibold">
                  {formatCurrency(proj.budgetMin)} - {formatCurrency(proj.budgetMax)}
                  {proj.budgetType === "HOURLY" ? "/hr" : ""}
                </span>
              </div>

              {/* Project Title */}
              <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {proj.title}
              </h4>

              {/* Skills and Quick CTA */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-500/10">
                <div className="flex items-center space-x-1">
                  {proj.skillsRequired.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-950/60 text-slate-300 border border-blue-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => handleApplyToProject(proj, e)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-blue-400 hover:text-sky-300 transition-colors"
                >
                  <span>{currentRole === "FREELANCER" ? "Submit Bid" : "View"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button at bottom */}
        <button
          onClick={handleViewAllWebsiteGigs}
          className="w-full mt-3 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-400/40 hover:border-blue-400 transition-all flex items-center justify-center space-x-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Filter All Website Projects</span>
        </button>
      </div>
    </aside>
  );
}
