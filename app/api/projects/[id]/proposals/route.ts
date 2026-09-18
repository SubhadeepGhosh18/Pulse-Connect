import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = db.getProjectById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const proposals = db.getProposalsByProjectId(params.id);

    return NextResponse.json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve proposals" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    const freelancerId = user ? user.id : body.freelancerId;
    if (!freelancerId) {
      return NextResponse.json(
        { error: "Freelancer identification required." },
        { status: 401 }
      );
    }

    const freelancer = db.getUserById(freelancerId);
    if (freelancer && freelancer.role !== "FREELANCER") {
      return NextResponse.json(
        { error: "Only accounts with FREELANCER role may submit proposals." },
        { status: 403 }
      );
    }

    const project = db.getProjectById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (project.status !== "OPEN") {
      return NextResponse.json(
        { error: "This project is no longer accepting new proposals." },
        { status: 400 }
      );
    }

    const { bidAmount, coverLetter, estimatedDays } = body;

    if (!bidAmount || !coverLetter || !estimatedDays) {
      return NextResponse.json(
        { error: "Bid amount, cover letter, and estimated delivery days are required." },
        { status: 400 }
      );
    }

    const proposal = db.createProposal({
      projectId: params.id,
      freelancerId,
      bidAmount: Number(bidAmount),
      coverLetter,
      estimatedDays: Number(estimatedDays),
    });

    return NextResponse.json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit proposal" },
      { status: 400 }
    );
  }
}
