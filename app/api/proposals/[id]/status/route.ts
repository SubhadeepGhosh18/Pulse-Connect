import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["ACCEPTED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be ACCEPTED, REJECTED, or PENDING." },
        { status: 400 }
      );
    }

    const updatedProposal = db.updateProposalStatus(params.id, status);

    return NextResponse.json({
      success: true,
      message: `Proposal has been marked as ${status.toLowerCase()}`,
      proposal: updatedProposal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update proposal status" },
      { status: 500 }
    );
  }
}
