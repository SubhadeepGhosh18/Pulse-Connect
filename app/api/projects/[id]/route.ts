import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";

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

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve project" },
      { status: 500 }
    );
  }
}
