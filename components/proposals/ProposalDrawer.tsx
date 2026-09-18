"use client";

import React, { useState, useEffect } from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

const TEMPLATES = [
  {
    label: "Fast-Ship Prototype",
    text: "Hi there! I reviewed the technical requirements carefully and have directly relevant production experience. I can build and deliver this milestone quickly with clean TypeScript, robust tests, and complete documentation.",
  },
  {
    label: "AI / LLM Specialist",
    text: "Hello! I specialize in modern LLM orchestrations, RAG pipelines, and vector database indexing. I have worked on similar production workloads and can ensure low latency, deterministic fallbacks, and reliable observability.",
  },
  {
    label: "Frontend & Micro-Interactions",
    text: "Hi! Delivering sleek, obsidian-dark UI with 60fps micro-interactions and strict design token fidelity is my core specialty. I can take your product specifications and implement a high-converting, silky smooth user experience.",
  },
];

export function ProposalDrawer() {
  const {
    selectedProject,
    isProposalDrawerOpen,
    setIsProposalDrawerOpen,
    submitProposal,
    currentUser,
    addToast,
  } = usePulse();

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(14);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default bid when project opens
  useEffect(() => {
    if (selectedProject) {
      setBidAmount(selectedProject.budgetMin || 5000);
      setError(null);
    }
  }, [selectedProject]);

  if (!isProposalDrawerOpen || !selectedProject) return null;

  // Real-time Fee Calculation
  const platformFeeRate = 0.1; // 10% standard platform fee
  const platformFee = Math.round(bidAmount * platformFeeRate);
  const netEarnings = Math.max(0, bidAmount - platformFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }
    if (!coverLetter.trim() || coverLetter.length < 30) {
      setError("Please provide a detailed cover note (at least 30 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitProposal({
        projectId: selectedProject.id,
        bidAmount,
        coverLetter,
        estimatedDays,
      });
      setIsProposalDrawerOpen(false);
      setCoverLetter("");
    } catch (err: any) {
      setError(err.message || "Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="relative w-full max-w-xl bg-background-card border-l border-border-hover shadow-glass h-full flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background-card/90 backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-accent-cyan/15 text-accent-cyan">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submit Proposal</h3>
              <p className="text-xs text-foreground-muted font-mono truncate max-w-[280px]">
                {selectedProject.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProposalDrawerOpen(false)}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Project Budget Context */}
          <div className="p-3.5 rounded-xl bg-background-tertiary border border-border-subtle flex items-center justify-between text-xs font-mono">
            <span className="text-foreground-muted">Client Budget Range:</span>
            <span className="text-accent-cyan font-bold">
              {formatCurrency(selectedProject.budgetMin)} - {formatCurrency(selectedProject.budgetMax)}
              {selectedProject.budgetType === "HOURLY" ? "/hr" : ""}
            </span>
          </div>

          {/* Bid Amount & Fee Calculation */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted">
              Your Proposed Bid Amount ($ USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-cyan" />
              <input
                type="number"
                min="100"
                step="50"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 bg-background-tertiary border border-border-subtle rounded-xl text-lg font-bold font-mono text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
              />
            </div>

            {/* Fee Breakdown Box */}
            <div className="p-3 rounded-xl bg-background-secondary/80 border border-border-subtle space-y-2 text-xs font-mono">
              <div className="flex justify-between text-foreground-muted">
                <span>Platform Service Fee (10%):</span>
                <span className="text-foreground-subtle">-${platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border-subtle pt-2 text-sm font-bold">
                <span className="text-white">Net Freelancer Payout:</span>
                <span className="text-accent-emerald">${netEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery Time */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted">
              Estimated Delivery Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 21, 30].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setEstimatedDays(days)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-all ${
                    estimatedDays === days
                      ? "bg-accent-indigo text-white font-bold border border-accent-indigo shadow-glow-indigo"
                      : "bg-background-tertiary border border-border-subtle text-foreground-muted hover:text-white"
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Cover Note & Quick Templates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted">
                Cover Note & Value Proposition
              </label>
              <span className="text-[10px] text-foreground-subtle font-mono">
                {coverLetter.length} chars
              </span>
            </div>

            {/* Quick Template Chips */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span className="text-[10px] text-foreground-subtle self-center mr-1">Templates:</span>
              {TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  onClick={() => setCoverLetter(tmpl.text)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 hover:bg-white/10 text-foreground-muted hover:text-white border border-border-subtle transition-colors"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            <textarea
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Outline your technical approach, relevant past projects, and why you are the ideal fit..."
              className="w-full p-3.5 bg-background-tertiary border border-border-subtle rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo leading-relaxed"
            />
          </div>

          {/* Submitting Profile Context */}
          <div className="p-3 rounded-xl bg-background-tertiary/60 border border-border-subtle flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Submitting as {currentUser.name}
              </p>
              <p className="text-[10px] text-foreground-muted font-mono truncate">
                {currentUser.headline}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-accent-cyan font-semibold">
                ${currentUser.hourlyRate}/hr
              </span>
            </div>
          </div>
        </form>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-border-subtle bg-background-card/90 backdrop-blur-lg flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsProposalDrawerOpen(false)}
            className="px-4 py-2.5 text-xs font-medium rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-indigo hover:opacity-95 text-background shadow-glow-cyan transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Bid...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Proposal (${bidAmount.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
