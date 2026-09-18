"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Project, Proposal, FilterState, Role, ProposalStatus } from "@/types";
import { SEED_USERS, SEED_PROJECTS, SEED_PROPOSALS } from "./data";
import confetti from "canvas-confetti";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

interface PulseContextType {
  currentUser: User;
  currentRole: Role;
  allUsers: User[];
  projects: Project[];
  proposals: Proposal[];
  filters: FilterState;
  selectedProject: Project | null;
  selectedProjectForReview: Project | null;
  isProjectModalOpen: boolean;
  isProposalDrawerOpen: boolean;
  isPostWizardOpen: boolean;
  isReviewModalOpen: boolean;
  activeView: "marketplace" | "proposals" | "my-projects" | "freelancer-bids";
  toasts: ToastMessage[];

  // Setters & Actions
  switchRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setSelectedProject: (p: Project | null) => void;
  setSelectedProjectForReview: (p: Project | null) => void;
  setIsProjectModalOpen: (open: boolean) => void;
  setIsProposalDrawerOpen: (open: boolean) => void;
  setIsPostWizardOpen: (open: boolean) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setActiveView: (view: "marketplace" | "proposals" | "my-projects" | "freelancer-bids") => void;

  // Domain Actions
  createProject: (data: Omit<Project, "id" | "clientId" | "status" | "createdAt" | "updatedAt" | "proposalsCount">) => Promise<Project>;
  submitProposal: (data: { projectId: string; bidAmount: number; coverLetter: string; estimatedDays: number }) => Promise<Proposal>;
  updateProposalStatus: (proposalId: string, status: ProposalStatus) => Promise<void>;
  addToast: (type: "success" | "error" | "info", title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  search: "",
  category: "All Categories",
  budgetType: "ALL",
  minBudget: 0,
  maxBudget: 25000,
  experienceLevel: "All",
  duration: "All",
  sortBy: "newest",
};

const PulseContext = createContext<PulseContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: "pulse_projects_v1",
  PROPOSALS: "pulse_proposals_v1",
  USER_ID: "pulse_current_user_id_v1",
};

export function PulseProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(SEED_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>("client-elena");
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [proposals, setProposals] = useState<Proposal[]>(SEED_PROPOSALS);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Modals & Navigation
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectForReview, setSelectedProjectForReview] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProposalDrawerOpen, setIsProposalDrawerOpen] = useState(false);
  const [isPostWizardOpen, setIsPostWizardOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"marketplace" | "proposals" | "my-projects" | "freelancer-bids">("marketplace");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
      if (savedProposals) setProposals(JSON.parse(savedProposals));

      const savedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (savedUserId && users.some((u) => u.id === savedUserId)) {
        setCurrentUserId(savedUserId);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
  }, [users]);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [proposals]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: Role) => {
    // Find default user of that role
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      localStorage.setItem(STORAGE_KEYS.USER_ID, targetUser.id);
      addToast(
        "info",
        `Switched to ${role === "CLIENT" ? "Client" : "Freelancer"} Mode`,
        `Operating as ${targetUser.name} (${targetUser.headline || targetUser.role})`
      );
    }
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      localStorage.setItem(STORAGE_KEYS.USER_ID, target.id);
      addToast(
        "info",
        `Logged in as ${target.name}`,
        `${target.role} • ${target.company || target.headline || ""}`
      );
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Domain Actions
  const createProject = async (
    data: Omit<Project, "id" | "clientId" | "status" | "createdAt" | "updatedAt" | "proposalsCount">
  ): Promise<Project> => {
    if (currentRole !== "CLIENT") {
      addToast("error", "Access Denied", "Only clients can publish new projects.");
      throw new Error("Client role required");
    }

    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      clientId: currentUser.id,
      client: currentUser,
      status: "OPEN",
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Also sync with backend API
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clientId: currentUser.id }),
      });
    } catch {
      // Offline/demo fallback works seamlessly
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366F1", "#06B6D4", "#10B981"],
      });
    } catch {}

    addToast(
      "success",
      "Project Listing Published!",
      `"${newProject.title}" is now visible to top freelancers.`
    );

    return newProject;
  };

  const submitProposal = async (data: {
    projectId: string;
    bidAmount: number;
    coverLetter: string;
    estimatedDays: number;
  }): Promise<Proposal> => {
    if (currentRole !== "FREELANCER") {
      addToast("error", "Access Denied", "Only freelancers can submit proposals.");
      throw new Error("Freelancer role required");
    }

    // Check if already applied
    const alreadyApplied = proposals.some(
      (p) => p.projectId === data.projectId && p.freelancerId === currentUser.id
    );
    if (alreadyApplied) {
      addToast("error", "Duplicate Proposal", "You have already submitted a proposal for this project.");
      throw new Error("Already submitted");
    }

    const project = projects.find((p) => p.id === data.projectId);

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      projectId: data.projectId,
      freelancerId: currentUser.id,
      freelancer: currentUser,
      project: project,
      bidAmount: data.bidAmount,
      coverLetter: data.coverLetter,
      estimatedDays: data.estimatedDays,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProposals((prev) => [newProposal, ...prev]);

    // Increment proposalsCount on the project
    setProjects((prev) =>
      prev.map((p) =>
        p.id === data.projectId ? { ...p, proposalsCount: (p.proposalsCount || 0) + 1 } : p
      )
    );

    // Call backend API
    try {
      await fetch(`/api/projects/${data.projectId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: currentUser.id,
          bidAmount: data.bidAmount,
          coverLetter: data.coverLetter,
          estimatedDays: data.estimatedDays,
        }),
      });
    } catch {}

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#6366F1", "#06B6D4"],
      });
    } catch {}

    addToast(
      "success",
      "Proposal Submitted Successfully",
      `Your bid of $${data.bidAmount} has been sent to the client.`
    );

    return newProposal;
  };

  const updateProposalStatus = async (proposalId: string, status: ProposalStatus) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );

    // If accepted, update corresponding project to IN_PROGRESS
    if (status === "ACCEPTED") {
      const prop = proposals.find((p) => p.id === proposalId);
      if (prop) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === prop.projectId ? { ...proj, status: "IN_PROGRESS" } : proj
          )
        );

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#10B981", "#6366F1", "#06B6D4"],
          });
        } catch {}
      }
    }

    try {
      await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {}

    addToast(
      status === "ACCEPTED" ? "success" : "info",
      `Proposal ${status === "ACCEPTED" ? "Accepted!" : "Declined"}`,
      status === "ACCEPTED"
        ? "The contract has started and the freelancer has been notified."
        : "The proposal has been updated."
    );
  };

  return (
    <PulseContext.Provider
      value={{
        currentUser,
        currentRole,
        allUsers: users,
        projects,
        proposals,
        filters,
        selectedProject,
        selectedProjectForReview,
        isProjectModalOpen,
        isProposalDrawerOpen,
        isPostWizardOpen,
        isReviewModalOpen,
        activeView,
        toasts,
        switchRole,
        switchUser,
        setFilters,
        resetFilters,
        setSelectedProject,
        setSelectedProjectForReview,
        setIsProjectModalOpen,
        setIsProposalDrawerOpen,
        setIsPostWizardOpen,
        setIsReviewModalOpen,
        setActiveView,
        createProject,
        submitProposal,
        updateProposalStatus,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error("usePulse must be used within a PulseProvider");
  }
  return context;
}
