"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Briefcase,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function FreelancerDashboardView() {
  const {
    proposals,
    projects,
    currentUser,
    setActiveView,
    setSelectedProject,
    setIsProjectModalOpen,
  } = usePulse();

  // Proposals submitted by this freelancer
  const myProposals = proposals.filter((p) => p.freelancerId === currentUser.id);

  const acceptedCount = myProposals.filter((p) => p.status === "ACCEPTED").length;
  const pendingCount = myProposals.filter((p) => p.status === "PENDING").length;

  const totalValue = myProposals
    .filter((p) => p.status === "ACCEPTED")
    .reduce((acc, p) => acc + p.bidAmount, 0);

  const handleViewProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsProjectModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-background-card to-background-secondary border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 font-semibold">
            Freelancer Workspace
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            {currentUser.headline} •{" "}
            <span className="text-accent-cyan font-mono">${currentUser.hourlyRate}/hr rate</span>
          </p>
        </div>

        <button
          onClick={() => setActiveView("marketplace")}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-accent-cyan hover:bg-accent-cyan/90 text-background font-bold shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse Available Jobs</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Submitted Proposals</span>
            <FileText className="w-4 h-4 text-accent-indigo" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{myProposals.length}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Total applications</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Accepted Contracts</span>
            <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
          </div>
          <p className="text-2xl font-bold font-mono text-accent-emerald">{acceptedCount}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Awarded opportunities</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Under Review</span>
            <Clock className="w-4 h-4 text-accent-amber" />
          </div>
          <p className="text-2xl font-bold font-mono text-accent-amber">{pendingCount}</p>
          <p className="text-[11px] text-foreground-muted mt-1">Awaiting client decision</p>
        </div>

        <div className="p-4 rounded-xl bg-background-card border border-border-subtle">
          <div className="flex items-center justify-between text-foreground-subtle mb-1">
            <span className="text-xs font-mono uppercase">Total Career Earnings</span>
            <DollarSign className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            ${currentUser.totalEarned?.toLocaleString() || "0"}
          </p>
          <p className="text-[11px] text-foreground-muted mt-1">{currentUser.completedProjects} contracts completed</p>
        </div>
      </div>

      {/* Proposals Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Submitted Proposals</h2>
          <span className="text-xs font-mono text-foreground-muted">
            {myProposals.length} Proposals
          </span>
        </div>

        {myProposals.length === 0 ? (
          <div className="text-center py-12 px-4 bg-background-card/40 border border-border-subtle rounded-2xl">
            <FileText className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-foreground">No proposals submitted yet</h3>
            <p className="text-xs text-foreground-muted mt-1 mb-4">
              Explore the marketplace and submit your first bid on high-impact projects.
            </p>
            <button
              onClick={() => setActiveView("marketplace")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-accent-cyan text-background shadow-glow-cyan"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myProposals.map((prop) => {
              const project = projects.find((p) => p.id === prop.projectId) || prop.project;

              return (
                <div
                  key={prop.id}
                  className="p-5 rounded-xl bg-background-card border border-border-subtle hover:border-border-hover transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-foreground-muted">
                          {project?.category || "General"}
                        </span>
                        <span className="text-xs text-foreground-subtle font-mono">
                          Submitted {formatRelativeTime(prop.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {project?.title || "Target Project"}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-foreground-subtle block">
                          Your Bid
                        </span>
                        <span className="text-base font-bold font-mono text-accent-cyan">
                          {formatCurrency(prop.bidAmount)}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold ${
                          prop.status === "ACCEPTED"
                            ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/40"
                            : prop.status === "REJECTED"
                            ? "bg-accent-rose/20 text-accent-rose border border-accent-rose/40"
                            : "bg-accent-amber/20 text-accent-amber border border-accent-amber/40"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background-tertiary/70 border border-border-subtle text-xs text-foreground-muted leading-relaxed">
                    <span className="font-mono text-foreground-subtle block mb-1">Your Cover Note:</span>
                    {prop.coverLetter}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-foreground-subtle pt-1">
                    <span>Estimated Completion: {prop.estimatedDays} days</span>
                    {project && (
                      <button
                        onClick={() => handleViewProject(project.id)}
                        className="flex items-center space-x-1 text-accent-indigo hover:text-white transition-colors"
                      >
                        <span>View Project Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
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
