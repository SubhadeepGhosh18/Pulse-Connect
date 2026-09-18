import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, headline, skills } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required." },
        { status: 400 }
      );
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const user = db.createUser({
      email,
      name,
      role: role || "FREELANCER",
      headline: headline || (role === "CLIENT" ? "Hiring Manager / Founder" : "Full-Stack Engineer"),
      skills: Array.isArray(skills) ? skills : ["TypeScript", "Next.js"],
    });

    const token = createToken(user);

    return NextResponse.json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to register" },
      { status: 500 }
    );
  }
}
