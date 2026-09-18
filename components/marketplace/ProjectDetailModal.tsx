"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  X,
  ShieldCheck,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Layers,
  Users,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export function ProjectDetailModal() {
  const {
    selectedProject,
    isProjectModalOpen,
    setIsProjectModalOpen,
    setIsProposalDrawerOpen,
    setSelectedProjectForReview,
    setIsReviewModalOpen,
    currentRole,
    currentUser,
  } = usePulse();

  if (!isProjectModalOpen || !selectedProject) return null;

  const isClientOwner = selectedProject.clientId === currentUser.id;

  const handleApplyClick = () => {
    setIsProjectModalOpen(false);
    setIsProposalDrawerOpen(true);
  };

  const handleReviewBidsClick = () => {
    setSelectedProjectForReview(selectedProject);
    setIsProjectModalOpen(false);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background-card border border-border-hover rounded-2xl shadow-glass flex flex-col custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background-card/90 backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-foreground-muted">
              {selectedProject.category}
            </span>
            <span
              className={`text-xs font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                selectedProject.status === "OPEN"
                  ? "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30"
                  : "bg-accent-amber/15 text-accent-amber border border-accent-amber/30"
              }`}
            >
              {selectedProject.status === "OPEN" ? "Accepting Bids" : selectedProject.status.replace("_", " ")}
            </span>
          </div>

          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              {selectedProject.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted font-mono">
              <span>Posted {formatRelativeTime(selectedProject.createdAt)}</span>
              <span>•</span>
              <span>Timeline: {selectedProject.duration || "Flexible"}</span>
              <span>•</span>
              <span>Experience: {selectedProject.experienceLevel || "Expert"}</span>
            </div>
          </div>

          {/* Budget Metric Box */}
          <div className="p-4 rounded-xl bg-background-tertiary border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase text-foreground-subtle tracking-wider">
                {selectedProject.budgetType === "FIXED" ? "Fixed Price Project Budget" : "Hourly Compensation"}
              </p>
              <p className="text-2xl font-bold font-mono text-accent-cyan mt-0.5">
                {formatCurrency(selectedProject.budgetMin)} - {formatCurrency(selectedProject.budgetMax)}
                {selectedProject.budgetType === "HOURLY" && <span className="text-sm font-normal"> / hour</span>}
              </p>
            </div>

            <div className="flex items-center space-x-6 sm:border-l sm:border-border-subtle sm:pl-6">
              <div>
                <p className="text-xs text-foreground-subtle">Proposals</p>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {selectedProject.proposalsCount || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-subtle">Delivery Window</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {selectedProject.duration || "1-3 months"}
                </p>
              </div>
            </div>
          </div>

          {/* Description / Scope of Work */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-2 font-mono">
              Project Overview & Deliverables
            </h4>
            <div className="p-4 rounded-xl bg-background-secondary/60 border border-border-subtle text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
              {selectedProject.description}
            </div>
          </div>

          {/* Required Skills Badges */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-2.5 font-mono">
              Required Technical Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedProject.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-accent-indigo/10 border border-accent-indigo/30 text-accent-indigo font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Client Profile & Trust Metrics */}
          {selectedProject.client && (
            <div className="p-4 rounded-xl bg-background-tertiary/70 border border-border-subtle">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-3 font-mono">
                About the Client
              </h4>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={selectedProject.client.avatarUrl}
                    alt={selectedProject.client.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">
                        {selectedProject.client.name}
                      </span>
                      {selectedProject.client.verified && (
                        <span className="inline-flex items-center text-xs text-accent-cyan font-mono">
                          <ShieldCheck className="w-4 h-4 mr-0.5" /> Verified Client
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {selectedProject.client.headline || selectedProject.client.company}
                    </p>
                    {selectedProject.client.location && (
                      <p className="text-xs text-foreground-subtle flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {selectedProject.client.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end space-x-1 text-sm font-bold text-white">
                    <Star className="w-4 h-4 fill-accent-amber text-accent-amber" />
                    <span>{selectedProject.client.rating.toFixed(1)}</span>
                    <span className="text-foreground-subtle font-normal text-xs">
                      ({selectedProject.client.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-xs font-mono text-accent-emerald mt-1 font-semibold">
                    ${selectedProject.client.totalSpent?.toLocaleString()} spent
                  </p>
                  <p className="text-[10px] text-foreground-subtle">
                    {selectedProject.client.completedProjects} contracts completed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-background-card/90 backdrop-blur-lg">
          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="px-4 py-2 text-xs font-medium rounded-lg text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>

          {isClientOwner ? (
            <button
              onClick={handleReviewBidsClick}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-accent-indigo hover:bg-accent-indigo/90 text-white shadow-glow-indigo transition-all"
            >
              <span>Review Proposals ({selectedProject.proposalsCount || 0})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : currentRole === "FREELANCER" ? (
            <button
              onClick={handleApplyClick}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-indigo hover:opacity-95 text-background shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <span>Submit Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-foreground-subtle italic">
              Switch to Freelancer mode to submit a proposal
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
