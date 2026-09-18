import { SEED_USERS, SEED_PROJECTS, SEED_PROPOSALS } from "./data";
import { User, Project, Proposal, Review } from "@/types";

// Global singleton to preserve memory across Next.js dev server hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __pulseDb: {
    users: User[];
    projects: Project[];
    proposals: Proposal[];
    reviews: Review[];
  } | undefined;
}

if (!global.__pulseDb) {
  global.__pulseDb = {
    users: JSON.parse(JSON.stringify(SEED_USERS)),
    projects: JSON.parse(JSON.stringify(SEED_PROJECTS)),
    proposals: JSON.parse(JSON.stringify(SEED_PROPOSALS)),
    reviews: [],
  };
}

export const db = {
  // Users
  getUsers: () => global.__pulseDb!.users,
  getUserById: (id: string) => global.__pulseDb!.users.find((u) => u.id === id),
  getUserByEmail: (email: string) =>
    global.__pulseDb!.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (userData: Partial<User> & { email: string; name: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role || "FREELANCER",
      headline: userData.headline || "Talented Professional on PulseConnect",
      bio: userData.bio || "Passionate about building cutting-edge software and design solutions.",
      skills: userData.skills || ["Full-Stack", "TypeScript"],
      avatarUrl: userData.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      hourlyRate: userData.hourlyRate || 85,
      location: userData.location || "Remote",
      totalEarned: 0,
      totalSpent: 0,
      completedProjects: 0,
      createdAt: new Date().toISOString(),
    };
    global.__pulseDb!.users.push(newUser);
    return newUser;
  },

  // Projects
  getProjects: (filters?: {
    search?: string;
    category?: string;
    budgetType?: string;
    minBudget?: number;
    maxBudget?: number;
    status?: string;
    clientId?: string;
    sortBy?: string;
  }) => {
    let list = [...global.__pulseDb!.projects];

    if (filters) {
      if (filters.clientId) {
        list = list.filter((p) => p.clientId === filters.clientId);
      }
      if (filters.category && filters.category !== "All Categories") {
        list = list.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.budgetType && filters.budgetType !== "ALL") {
        list = list.filter((p) => p.budgetType === filters.budgetType);
      }
      if (filters.status) {
        list = list.filter((p) => p.status === filters.status);
      }
      if (filters.minBudget !== undefined) {
        list = list.filter((p) => p.budgetMax >= filters.minBudget!);
      }
      if (filters.maxBudget !== undefined && filters.maxBudget > 0) {
        list = list.filter((p) => p.budgetMin <= filters.maxBudget!);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.skillsRequired.some((s) => s.toLowerCase().includes(q))
        );
      }
      if (filters.sortBy === "highest_budget") {
        list.sort((a, b) => b.budgetMax - a.budgetMax);
      } else if (filters.sortBy === "lowest_budget") {
        list.sort((a, b) => a.budgetMin - b.budgetMin);
      } else if (filters.sortBy === "most_bids") {
        list.sort((a, b) => (b.proposalsCount || 0) - (a.proposalsCount || 0));
      } else {
        // default newest
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    // Attach client profile and current proposals count
    return list.map((p) => ({
      ...p,
      client: global.__pulseDb!.users.find((u) => u.id === p.clientId),
      proposalsCount: global.__pulseDb!.proposals.filter((prop) => prop.projectId === p.id).length,
    }));
  },

  getProjectById: (id: string) => {
    const project = global.__pulseDb!.projects.find((p) => p.id === id);
    if (!project) return null;
    return {
      ...project,
      client: global.__pulseDb!.users.find((u) => u.id === project.clientId),
      proposalsCount: global.__pulseDb!.proposals.filter((prop) => prop.projectId === project.id).length,
    };
  },

  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt" | "proposalsCount">) => {
    const newProj: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      status: "OPEN",
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    global.__pulseDb!.projects.unshift(newProj);
    return {
      ...newProj,
      client: global.__pulseDb!.users.find((u) => u.id === newProj.clientId),
    };
  },

  // Proposals
  getProposalsByProjectId: (projectId: string) => {
    const list = global.__pulseDb!.proposals.filter((p) => p.projectId === projectId);
    return list.map((p) => ({
      ...p,
      freelancer: global.__pulseDb!.users.find((u) => u.id === p.freelancerId),
    }));
  },

  getProposalsByFreelancerId: (freelancerId: string) => {
    const list = global.__pulseDb!.proposals.filter((p) => p.freelancerId === freelancerId);
    return list.map((p) => ({
      ...p,
      project: global.__pulseDb!.projects.find((proj) => proj.id === p.projectId),
      freelancer: global.__pulseDb!.users.find((u) => u.id === p.freelancerId),
    }));
  },

  createProposal: (data: {
    projectId: string;
    freelancerId: string;
    bidAmount: number;
    coverLetter: string;
    estimatedDays: number;
  }) => {
    // Check if proposal already exists
    const existing = global.__pulseDb!.proposals.find(
      (p) => p.projectId === data.projectId && p.freelancerId === data.freelancerId
    );
    if (existing) {
      throw new Error("You have already submitted a proposal for this project.");
    }

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      projectId: data.projectId,
      freelancerId: data.freelancerId,
      bidAmount: data.bidAmount,
      coverLetter: data.coverLetter,
      estimatedDays: data.estimatedDays,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    global.__pulseDb!.proposals.unshift(newProposal);

    // Update proposals count on project
    const proj = global.__pulseDb!.projects.find((p) => p.id === data.projectId);
    if (proj) {
      proj.proposalsCount = (proj.proposalsCount || 0) + 1;
    }

    return {
      ...newProposal,
      freelancer: global.__pulseDb!.users.find((u) => u.id === newProposal.freelancerId),
    };
  },

  updateProposalStatus: (proposalId: string, status: "ACCEPTED" | "REJECTED" | "PENDING") => {
    const proposal = global.__pulseDb!.proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      throw new Error("Proposal not found");
    }

    proposal.status = status;
    proposal.updatedAt = new Date().toISOString();

    // If accepted, set project status to IN_PROGRESS
    if (status === "ACCEPTED") {
      const proj = global.__pulseDb!.projects.find((p) => p.id === proposal.projectId);
      if (proj) {
        proj.status = "IN_PROGRESS";
        proj.updatedAt = new Date().toISOString();
      }
    }

    return {
      ...proposal,
      freelancer: global.__pulseDb!.users.find((u) => u.id === proposal.freelancerId),
      project: global.__pulseDb!.projects.find((p) => p.id === proposal.projectId),
    };
  },
};
