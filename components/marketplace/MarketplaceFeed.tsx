"use client";

import React, { useMemo } from "react";
import { usePulse } from "@/lib/pulse-context";
import { CATEGORIES } from "@/lib/data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Project } from "@/types";
import {
  Search,
  SlidersHorizontal,
  DollarSign,
  Clock,
  Briefcase,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Users,
} from "lucide-react";

export function MarketplaceFeed() {
  const {
    projects,
    filters,
    setFilters,
    resetFilters,
    setSelectedProject,
    setIsProjectModalOpen,
    currentRole,
    currentUser,
    setSelectedProjectForReview,
    setIsReviewModalOpen,
  } = usePulse();

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search term match across title, description, skills
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchDesc = project.description.toLowerCase().includes(q);
        const matchSkills = project.skillsRequired.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
      }

      // Category match
      if (filters.category !== "All Categories" && project.category !== filters.category) {
        return false;
      }

      // Budget Type match
      if (filters.budgetType !== "ALL" && project.budgetType !== filters.budgetType) {
        return false;
      }

      // Experience Level match
      if (filters.experienceLevel !== "All" && project.experienceLevel !== filters.experienceLevel) {
        return false;
      }

      // Duration match
      if (filters.duration !== "All" && project.duration !== filters.duration) {
        return false;
      }

      // Budget Range match
      if (project.budgetMax < filters.minBudget) {
        return false;
      }
      if (filters.maxBudget > 0 && project.budgetMin > filters.maxBudget) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "highest_budget") {
        return b.budgetMax - a.budgetMax;
      }
      if (filters.sortBy === "lowest_budget") {
        return a.budgetMin - b.budgetMin;
      }
      if (filters.sortBy === "most_bids") {
        return (b.proposalsCount || 0) - (a.proposalsCount || 0);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [projects, filters]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  return (
    <section id="project-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Pills Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent-indigo text-white shadow-glow-indigo font-semibold"
                  : "bg-background-card border border-border-subtle text-foreground-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Filter and Search Bar */}
      <div className="bg-background-card/70 border border-border-subtle rounded-2xl p-4 my-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search by keywords, deliverables, or skills (e.g. Next.js, LangChain, PyTorch)..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 bg-background-tertiary border border-border-subtle rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Budget Type Toggle */}
            <div className="flex items-center bg-background-tertiary p-1 rounded-xl border border-border-subtle">
              {(["ALL", "FIXED", "HOURLY"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters((prev) => ({ ...prev, budgetType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.budgetType === type
                      ? "bg-white/15 text-white font-semibold shadow-sm"
                      : "text-foreground-muted hover:text-white"
                  }`}
                >
                  {type === "ALL" ? "All Rates" : type === "FIXED" ? "Fixed Price" : "Hourly"}
                </button>
              ))}
            </div>

            {/* Experience Level Dropdown */}
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters((prev) => ({ ...prev, experienceLevel: e.target.value }))}
              className="px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-indigo"
            >
              <option value="All">All Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert Level</option>
            </select>

            {/* Duration Dropdown */}
            <select
              value={filters.duration}
              onChange={(e) => setFilters((prev) => ({ ...prev, duration: e.target.value }))}
              className="px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-indigo"
            >
              <option value="All">Any Duration</option>
              <option value="Less than 1 month">&lt; 1 month</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-foreground focus:outline-none focus:border-accent-indigo"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="highest_budget">Highest Budget</option>
              <option value="lowest_budget">Lowest Budget</option>
              <option value="most_bids">Most Proposals</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2 rounded-xl bg-background-tertiary border border-border-subtle text-foreground-muted hover:text-white hover:border-border-hover transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Budget Range Bar & Small Right-Side Notification Bar */}
        <div className="mt-3 pt-3 border-t border-border-subtle/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-foreground-muted">
          <div className="flex items-center space-x-2">
            <span>Budget Ceiling:</span>
            <span className="font-mono text-accent-cyan font-semibold">
              ${filters.maxBudget.toLocaleString()}
            </span>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={filters.maxBudget}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxBudget: Number(e.target.value) }))}
              className="w-28 sm:w-40 accent-accent-cyan cursor-pointer"
            />
            <span className="text-foreground-subtle ml-1 font-mono">({filteredProjects.length} active)</span>
          </div>

          <div>
            Showing <span className="font-mono text-white font-semibold">{filteredProjects.length}</span> active{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-background-card/30 border border-border-subtle rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-foreground-muted mb-3">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No matching projects found</h3>
          <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to discover available opportunities.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-accent-indigo text-white shadow-glow-indigo hover:bg-accent-indigo/90"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isClientOwner = project.clientId === currentUser.id;

            return (
              <div
                key={project.id}
                onClick={() => handleCardClick(project)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-background-card/80 border border-border-subtle hover:border-border-glow hover:bg-background-cardHover hover:shadow-glow-indigo transition-all duration-200 cursor-pointer"
              >
                {/* Card Top: Category & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-foreground-muted group-hover:text-foreground">
                      {project.category}
                    </span>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                        project.status === "OPEN"
                          ? "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30"
                          : project.status === "IN_PROGRESS"
                          ? "bg-accent-amber/15 text-accent-amber border border-accent-amber/30"
                          : "bg-white/10 text-foreground-muted"
                      }`}
                    >
                      {project.status === "OPEN" ? "Accepting Bids" : project.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-foreground group-hover:text-white line-clamp-2 leading-snug tracking-tight mb-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-foreground-muted line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.skillsRequired.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-background-tertiary text-foreground-muted border border-border-subtle"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skillsRequired.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-foreground-subtle">
                        +{project.skillsRequired.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Client Info, Budget, Action */}
                <div className="pt-4 border-t border-border-subtle/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    {/* Budget Badge */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
                        {project.budgetType === "FIXED" ? "Fixed Budget" : "Hourly Rate"}
                      </span>
                      <span className="text-sm font-bold font-mono text-accent-cyan">
                        {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                        {project.budgetType === "HOURLY" && <span className="text-xs font-normal">/hr</span>}
                      </span>
                    </div>

                    {/* Proposals & Duration */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1 text-xs text-foreground-muted">
                        <Users className="w-3.5 h-3.5 text-accent-indigo" />
                        <span className="font-mono">{project.proposalsCount || 0} bids</span>
                      </div>
                      <span className="text-[10px] text-foreground-subtle">{project.duration}</span>
                    </div>
                  </div>

                  {/* Client Snapshot */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={project.client?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={project.client?.name || "Client"}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-foreground-muted truncate max-w-[120px]">
                        {project.client?.company || project.client?.name}
                      </span>
                      {project.client?.verified && (
                        <span title="Verified Client">
                          <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-semibold text-accent-indigo group-hover:translate-x-0.5 transition-transform">
                      <span>{isClientOwner ? "Manage" : "Details"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
