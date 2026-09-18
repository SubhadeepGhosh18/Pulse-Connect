"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { Navbar } from "@/components/navbar/Navbar";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { MarketplaceFeed } from "@/components/marketplace/MarketplaceFeed";
import { ClientDashboardView } from "@/components/dashboard/ClientDashboardView";
import { FreelancerDashboardView } from "@/components/dashboard/FreelancerDashboardView";
import { ProjectDetailModal } from "@/components/marketplace/ProjectDetailModal";
import { ProposalDrawer } from "@/components/proposals/ProposalDrawer";
import { PostProjectModal } from "@/components/project-wizard/PostProjectModal";
import { ClientProposalReviewModal } from "@/components/proposals/ClientProposalReviewModal";
import { Sparkles, Shield, Github, Twitter, Heart } from "lucide-react";

export default function Home() {
  const { activeView } = usePulse();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent-indigo selection:text-white">
      {/* Sticky Blur Navbar */}
      <Navbar />

      {/* Main Body View Switching */}
      <main className="flex-1">
        {activeView === "marketplace" && (
          <>
            <HeroBanner />
            <MarketplaceFeed />
          </>
        )}

        {activeView === "my-projects" && <ClientDashboardView />}

        {activeView === "freelancer-bids" && <FreelancerDashboardView />}
      </main>

      {/* Interactive Modals & Drawers */}
      <ProjectDetailModal />
      <ProposalDrawer />
      <PostProjectModal />
      <ClientProposalReviewModal />

      {/* Sleek Vercel/Linear Style Footer */}
      <footer className="border-t border-blue-500/15 bg-background-secondary/90 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-foreground-muted">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
              <span className="font-mono text-white font-semibold">PulseConnect v2.4</span>
            </div>
            <span>•</span>
            <span>Enterprise Talent Protocol</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Escrow Protection
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Dispute Mediation
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              API Docs
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Enterprise Invoicing
            </span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px] text-foreground-subtle">
            <span>Built with Next.js 14, Tailwind & Prisma</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
