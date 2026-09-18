"use client";

import React, { useState } from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ProposalStatus } from "@/types";
import {
  X,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function ClientProposalReviewModal() {
  const {
    selectedProjectForReview,
    isReviewModalOpen,
    setIsReviewModalOpen,
    proposals,
    updateProposalStatus,
  } = usePulse();

  const [filterStatus, setFilterStatus] = useState<"ALL" | ProposalStatus>("ALL");

  if (!isReviewModalOpen || !selectedProjectForReview) return null;

  // Incoming proposals for this project
  const projectProposals = proposals.filter(
    (p) => p.projectId === selectedProjectForReview.id
  );

  const displayedProposals = projectProposals.filter((p) => {
    if (filterStatus === "ALL") return true;
    return p.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background-card border border-border-hover rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background-card/90 backdrop-blur-lg">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 font-semibold">
                Client Proposal Evaluation Board
              </span>
              <span className="text-xs text-foreground-subtle font-mono">
                {projectProposals.length} Total Applicants
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 truncate max-w-xl">
              {selectedProjectForReview.title}
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-6 py-3 border-b border-border-subtle bg-background-secondary/40 flex items-center space-x-2 overflow-x-auto">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => {
            const count = tab === "ALL"
              ? projectProposals.length
              : projectProposals.filter((p) => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  filterStatus === tab
                    ? "bg-white/10 text-white font-bold border border-white/20"
                    : "text-foreground-muted hover:text-white"
                }`}
              >
                <span>{tab === "ALL" ? "All Proposals" : tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Proposals List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {displayedProposals.length === 0 ? (
            <div className="text-center py-12 px-4 bg-background-tertiary/40 border border-border-subtle rounded-xl">
              <Layers className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No proposals match this status</p>
              <p className="text-xs text-foreground-muted mt-1">
                Proposals will appear here as elite freelancers apply.
              </p>
            </div>
          ) : (
            displayedProposals.map((prop) => {
              const freelancer = prop.freelancer;

              return (
                <div
                  key={prop.id}
                  className="p-5 rounded-xl bg-background-card/90 border border-border-subtle hover:border-border-hover transition-all space-y-4"
                >
                  {/* Freelancer Header & Bid Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={freelancer?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                        alt={freelancer?.name || "Candidate"}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-white">
                            {freelancer?.name || "Freelancer"}
                          </h4>
                          {freelancer?.verified && (
                            <span className="inline-flex items-center text-xs text-accent-cyan font-mono">
                              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {freelancer?.headline}
                        </p>

                        <div className="flex items-center space-x-4 mt-2 text-xs font-mono text-foreground-subtle">
                          <div className="flex items-center space-x-1 text-accent-amber font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{freelancer?.rating ? freelancer.rating.toFixed(1) : "5.0"}</span>
                          </div>
                          <span>•</span>
                          <span>{freelancer?.completedProjects || 0} contracts completed</span>
                          <span>•</span>
                          <span className="text-accent-cyan font-semibold">
                            ${freelancer?.hourlyRate || 100}/hr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bid Highlight Badge & Action */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-foreground-subtle block">
                          Proposed Bid
                        </span>
                        <span className="text-xl font-bold font-mono text-accent-cyan">
                          {formatCurrency(prop.bidAmount)}
                        </span>
                        <span className="text-[11px] font-mono text-foreground-subtle block">
                          Delivery: {prop.estimatedDays} days
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
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

                  {/* Cover Letter Content */}
                  <div className="p-3.5 rounded-xl bg-background-tertiary/70 border border-border-subtle text-xs text-foreground-muted leading-relaxed whitespace-pre-line">
                    {prop.coverLetter}
                  </div>

                  {/* Freelancer Skill Badges */}
                  {freelancer?.skills && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-foreground-subtle mr-1">Skills:</span>
                      {freelancer.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-background-secondary border border-border-subtle text-foreground-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions (Accept / Decline) */}
                  {prop.status === "PENDING" && (
                    <div className="pt-2 flex items-center justify-end space-x-3 border-t border-border-subtle/60">
                      <button
                        onClick={() => updateProposalStatus(prop.id, "REJECTED")}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent-rose hover:bg-accent-rose/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Bid</span>
                      </button>

                      <button
                        onClick={() => updateProposalStatus(prop.id, "ACCEPTED")}
                        className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent-emerald hover:bg-accent-emerald/90 text-background font-bold shadow-sm transition-all transform hover:scale-105"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept & Award Contract</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border-subtle bg-background-card/90 flex justify-end">
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="px-4 py-2 text-xs font-medium rounded-lg text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            Close Evaluation Board
          </button>
        </div>
      </div>
    </div>
  );
}
