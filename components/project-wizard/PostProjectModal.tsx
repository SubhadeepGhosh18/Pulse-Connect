"use client";

import React, { useState } from "react";
import { usePulse } from "@/lib/pulse-context";
import { CATEGORIES, POPULAR_SKILLS } from "@/lib/data";
import { BudgetType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Sparkles,
  Layers,
  DollarSign,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Eye,
  ShieldCheck,
} from "lucide-react";

export function PostProjectModal() {
  const { isPostWizardOpen, setIsPostWizardOpen, createProject, currentUser } = usePulse();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI & Machine Learning");
  const [description, setDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"Entry" | "Intermediate" | "Expert">("Expert");
  const [skillsRequired, setSkillsRequired] = useState<string[]>(["Python", "LangChain"]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [budgetType, setBudgetType] = useState<BudgetType>("FIXED");
  const [budgetMin, setBudgetMin] = useState(6000);
  const [budgetMax, setBudgetMax] = useState(12000);
  const [duration, setDuration] = useState("1-3 months");

  if (!isPostWizardOpen) return null;

  const toggleSkill = (skill: string) => {
    if (skillsRequired.includes(skill)) {
      setSkillsRequired(skillsRequired.filter((s) => s !== skill));
    } else {
      setSkillsRequired([...skillsRequired, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !skillsRequired.includes(customSkillInput.trim())) {
      setSkillsRequired([...skillsRequired, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || title.length < 10) {
      setError("Please provide a descriptive project title (at least 10 characters).");
      return;
    }
    if (!description.trim() || description.length < 30) {
      setError("Please provide an overview with deliverables (at least 30 characters).");
      return;
    }
    if (skillsRequired.length === 0) {
      setError("Please select or add at least one required skill.");
      return;
    }
    if (budgetMin <= 0 || budgetMax < budgetMin) {
      setError("Please enter valid minimum and maximum budget values.");
      return;
    }

    try {
      setIsPublishing(true);
      setError(null);
      await createProject({
        title,
        category,
        description,
        skillsRequired,
        budgetType,
        budgetMin,
        budgetMax,
        duration,
        experienceLevel,
      });

      // Reset and close
      setIsPostWizardOpen(false);
      setStep(1);
      setTitle("");
      setDescription("");
      setSkillsRequired(["Python", "LangChain"]);
    } catch (err: any) {
      setError(err.message || "Failed to publish project");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-background-card border border-border-hover rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Wizard Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background-card/90 backdrop-blur-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-accent-indigo/15 text-accent-indigo shadow-glow-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Post a New Project Listing</h2>
              <p className="text-xs text-foreground-muted">
                Reach the top 1% verified freelancers in AI, Engineering, and Design.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPostWizardOpen(false)}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-border-subtle bg-background-secondary/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center space-x-2 transition-colors ${
                step === 1 ? "text-accent-indigo font-bold" : "text-foreground-subtle hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? "bg-accent-indigo text-white" : "bg-white/10"
              }`}>1</span>
              <span>Project Scope</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center space-x-2 transition-colors ${
                step === 2 ? "text-accent-indigo font-bold" : "text-foreground-subtle hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? "bg-accent-indigo text-white" : "bg-white/10"
              }`}>2</span>
              <span>Tech Stack & Skills</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center space-x-2 transition-colors ${
                step === 3 ? "text-accent-indigo font-bold" : "text-foreground-subtle hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? "bg-accent-indigo text-white" : "bg-white/10"
              }`}>3</span>
              <span>Budget & Timeline</span>
            </button>
          </div>

          <span className="text-[11px] text-foreground-muted hidden sm:inline">
            Step {step} of 3
          </span>
        </div>

        {/* Main Body: Form on Left, Live Preview on Right */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 custom-scrollbar">
          {/* Form Step Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs">
                {error}
              </div>
            )}

            {/* STEP 1: Project Scope */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Autonomous Multi-Agent Reasoning Engine for SEC Filings"
                    className="w-full px-3.5 py-2.5 bg-background-tertiary border border-border-subtle rounded-xl text-sm text-white placeholder-foreground-subtle focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                      Primary Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-white focus:outline-none focus:border-accent-indigo"
                    >
                      {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                      Required Experience Level
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-white focus:outline-none focus:border-accent-indigo"
                    >
                      <option value="Entry">Entry Level</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert Level</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                    Detailed Scope & Deliverables *
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the architectural goals, key features, performance metrics, and deliverables you expect..."
                    className="w-full p-3.5 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-white placeholder-foreground-subtle focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Tech Stack & Skills */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                    Popular Tech Skills (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SKILLS.map((skill) => {
                      const isSelected = skillsRequired.includes(skill);
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            isSelected
                              ? "bg-accent-indigo text-white font-bold border border-accent-indigo shadow-glow-indigo"
                              : "bg-background-tertiary border border-border-subtle text-foreground-muted hover:text-white"
                          }`}
                        >
                          {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle">
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                    Add Custom Skill or Tool
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomSkill())}
                      placeholder="e.g. WebGPU, ClickHouse, Turborepo..."
                      className="flex-1 px-3 py-2 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-white focus:outline-none focus:border-accent-indigo"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-border-subtle transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Badges Preview */}
                <div>
                  <span className="text-xs text-foreground-subtle block mb-1 font-mono">
                    Currently Selected ({skillsRequired.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsRequired.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-accent-indigo/15 text-accent-indigo border border-accent-indigo/30 flex items-center space-x-1"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className="hover:text-white ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Budget & Timeline */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                {/* Budget Type Toggle */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                    Compensation Model
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBudgetType("FIXED")}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        budgetType === "FIXED"
                          ? "bg-accent-indigo/15 border-accent-indigo text-white shadow-glow-indigo"
                          : "bg-background-tertiary border-border-subtle text-foreground-muted hover:text-white"
                      }`}
                    >
                      <p className="text-sm font-bold">Fixed Price Project</p>
                      <p className="text-xs text-foreground-subtle mt-0.5">
                        Set a predetermined milestone-based budget.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBudgetType("HOURLY")}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        budgetType === "HOURLY"
                          ? "bg-accent-cyan/15 border-accent-cyan text-white shadow-glow-cyan"
                          : "bg-background-tertiary border-border-subtle text-foreground-muted hover:text-white"
                      }`}
                    >
                      <p className="text-sm font-bold">Hourly Rate Contract</p>
                      <p className="text-xs text-foreground-subtle mt-0.5">
                        Pay for tracked billable development hours.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Min & Max Budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                      {budgetType === "FIXED" ? "Min Budget ($ USD)" : "Min Rate ($ / hr)"}
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-background-tertiary border border-border-subtle rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-accent-indigo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                      {budgetType === "FIXED" ? "Max Budget ($ USD)" : "Max Rate ($ / hr)"}
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-background-tertiary border border-border-subtle rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-accent-indigo"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-1.5">
                    Estimated Project Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background-tertiary border border-border-subtle rounded-xl text-xs text-white focus:outline-none focus:border-accent-indigo"
                  >
                    <option value="Less than 1 month">Less than 1 month</option>
                    <option value="1-3 months">1 to 3 months</option>
                    <option value="3-6 months">3 to 6 months</option>
                    <option value="More than 6 months">More than 6 months</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Real-Time Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 bg-background-secondary/60 border border-border-subtle rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-accent-cyan uppercase mb-3">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Marketplace Preview</span>
              </div>

              {/* Preview Project Card */}
              <div className="p-4 rounded-xl bg-background-card border border-border-hover shadow-glow-indigo">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-foreground-muted">
                    {category}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 font-semibold">
                    Accepting Bids
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 mb-1.5">
                  {title || "Your Project Title Will Appear Here"}
                </h3>

                <p className="text-xs text-foreground-muted line-clamp-3 mb-3">
                  {description || "Provide deliverables description in Step 1 to see how freelancers will view your listing in the feed..."}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {skillsRequired.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-background-tertiary text-foreground-muted border border-border-subtle"
                    >
                      {s}
                    </span>
                  ))}
                  {skillsRequired.length > 4 && (
                    <span className="text-[9px] font-mono text-foreground-subtle">
                      +{skillsRequired.length - 4}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-foreground-subtle block">
                      {budgetType === "FIXED" ? "Fixed Budget" : "Hourly"}
                    </span>
                    <span className="text-xs font-bold font-mono text-accent-cyan">
                      {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
                      {budgetType === "HOURLY" && "/hr"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-foreground-muted truncate max-w-[80px]">
                      {currentUser.company || currentUser.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-foreground-subtle font-mono mt-4 pt-3 border-t border-border-subtle/60">
              Verified clients receive priority placement on the talent feed.
            </div>
          </div>
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 border-t border-border-subtle bg-background-card/90 backdrop-blur-lg flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && (!title.trim() || !description.trim())) {
                  setError("Please fill in project title and description before proceeding.");
                  return;
                }
                setError(null);
                setStep((step + 1) as any);
              }}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-accent-indigo hover:bg-accent-indigo/90 text-white shadow-glow-indigo transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-accent-indigo to-accent-cyan hover:opacity-95 text-white shadow-glow-indigo transition-all transform active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isPublishing ? "Publishing..." : "Publish Project Listing"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
