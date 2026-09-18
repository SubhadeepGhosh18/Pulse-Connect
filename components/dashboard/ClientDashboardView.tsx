"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Project } from "@/types";
import {
  Layers,
  PlusCircle,
  Users,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ClientDashboardView() {
  const {
    projects,
    proposals,
    currentUser,
    setIsPostWizardOpen,
    setSelectedProjectForReview,
    setIsReviewModalOpen,
  } = usePulse();

  // Client's projects
  const clientProjects = projects.filter((p) => p.clientId === currentUser.id);

  // Client's total proposals received
  const totalBidsReceived = proposals.filter((prop) =>
    clientProjects.some((p) => p.id === prop.projectId)
  ).length;

  const activeContracts = clientProjects.filter((p) => p.status === "IN_PROGRESS").length;

  const handleOpenReview = (project: Project) => {
    setSelectedProjectForReview(project);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-background-card to-background-secondary border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 font-semibold">
            Client Management Console
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Managing talent pipelines and proposals for <strong className="text-white">{currentUser.company || "Your Projects"}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsPostWizardOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-accent-indigo hover:bg-accent-indigo/90 text-white shadow-glow-indigo transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Posted Projects</span>
            <Layers className="w-4 h-4 text-accent-indigo" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{clientProjects.length}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Active listings</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Total Proposals</span>
            <Users className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-bold font-mono text-accent-cyan">{totalBidsReceived}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Incoming freelancer bids</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Active Contracts</span>
            <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
          </div>
          <p className="text-2xl font-bold font-mono text-accent-emerald">{activeContracts}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Under execution</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Total Invested</span>
            <TrendingUp className="w-4 h-4 text-accent-violet" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            ${currentUser.totalSpent?.toLocaleString() || "0"}
          </p>
          <p className="text-[11px] text-foreground-muted mt-1">Verified escrow spend</p>
        </div>
      </div>

      {/* Projects Table / Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Project Openings</h2>
          <span className="text-xs font-mono text-foreground-muted">
            {clientProjects.length} Listings
          </span>
        </div>

        {clientProjects.length === 0 ? (
          <div className="text-center py-12 px-4 bg-background-card/40 border border-border-subtle rounded-2xl">
            <Layers className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">No projects posted yet</h3>
            <p className="text-xs text-foreground-muted mt-1 mb-4">
              Post your first listing to start receiving proposals from elite engineers.
            </p>
            <button
              onClick={() => setIsPostWizardOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-accent-indigo text-white shadow-glow-indigo"
            >
              Post Project Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProjects.map((proj) => {
              const projectBidsCount = proposals.filter((p) => p.projectId === proj.id).length;

              return (
                <div
                  key={proj.id}
                  className="p-5 rounded-xl bg-background-card border border-border-subtle hover:border-border-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-foreground-muted">
                        {proj.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                          proj.status === "OPEN"
                            ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
                            : "bg-accent-amber/20 text-accent-amber border border-accent-amber/30"
                        }`}
                      >
                        {proj.status === "OPEN" ? "Accepting Bids" : proj.status.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{proj.title}</h3>
                    <p className="text-xs text-foreground-muted line-clamp-2 mb-3">
                      {proj.description}
                    </p>

                    <div className="flex items-center space-x-3 text-xs font-mono text-foreground-subtle mb-4">
                      <span>Budget: {formatCurrency(proj.budgetMin)} - {formatCurrency(proj.budgetMax)}</span>
                      <span>•</span>
                      <span>{proj.duration}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-foreground-muted font-mono">
                      <Users className="w-3.5 h-3.5 text-accent-cyan" />
                      <span className="font-bold text-white">{projectBidsCount}</span>
                      <span>proposals received</span>
                    </div>

                    <button
                      onClick={() => handleOpenReview(proj)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-accent-indigo hover:bg-accent-indigo/90 text-white shadow-glow-indigo transition-all"
                    >
                      <span>Review Proposals ({projectBidsCount})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
