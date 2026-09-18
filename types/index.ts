export type Role = "CLIENT" | "FREELANCER";

export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type BudgetType = "FIXED" | "HOURLY";

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  headline?: string;
  bio?: string;
  skills: string[];
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  verified: boolean;
  location?: string;
  company?: string;
  totalEarned?: number;
  totalSpent?: number;
  completedProjects: number;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  client?: User;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  budgetType: BudgetType;
  budgetMin: number;
  budgetMax: number;
  duration?: string;
  experienceLevel?: "Entry" | "Intermediate" | "Expert";
  status: ProjectStatus;
  proposalsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  project?: Project;
  freelancerId: string;
  freelancer?: User;
  bidAmount: number;
  coverLetter: string;
  estimatedDays: number;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer?: User;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  budgetType: "ALL" | BudgetType;
  minBudget: number;
  maxBudget: number;
  experienceLevel: string;
  duration: string;
  sortBy: "newest" | "highest_budget" | "lowest_budget" | "most_bids";
}
