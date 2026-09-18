import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const budgetType = searchParams.get("budgetType") || undefined;
    const minBudget = searchParams.get("minBudget") ? parseFloat(searchParams.get("minBudget")!) : undefined;
    const maxBudget = searchParams.get("maxBudget") ? parseFloat(searchParams.get("maxBudget")!) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const status = searchParams.get("status") || undefined;
    const clientId = searchParams.get("clientId") || undefined;

    const projects = db.getProjects({
      category,
      search,
      budgetType,
      minBudget,
      maxBudget,
      sortBy,
      status,
      clientId,
    });

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    const clientId = user ? user.id : body.clientId;
    if (!clientId) {
      return NextResponse.json(
        { error: "Client authentication or clientId required to post a project" },
        { status: 401 }
      );
    }

    const client = db.getUserById(clientId);
    if (client && client.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only accounts with CLIENT role are permitted to post projects." },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      category,
      skillsRequired,
      budgetType,
      budgetMin,
      budgetMax,
      duration,
      experienceLevel,
    } = body;

    if (!title || !description || !category || !skillsRequired) {
      return NextResponse.json(
        { error: "Title, description, category, and skillsRequired are required." },
        { status: 400 }
      );
    }

    const newProject = db.createProject({
      clientId,
      title,
      description,
      category,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired],
      budgetType: budgetType || "FIXED",
      budgetMin: Number(budgetMin) || 1000,
      budgetMax: Number(budgetMax) || 5000,
      duration: duration || "1-3 months",
      experienceLevel: experienceLevel || "Expert",
      status: "OPEN",
    });

    return NextResponse.json({
      success: true,
      message: "Project listing published successfully",
      project: newProject,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
