import { User, Role } from "@/types";
import { db } from "./server-db";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  exp: number;
}

export function createToken(user: User): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const encode = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const headerEncoded = encode(header);
  const payloadEncoded = encode(payload);
  const fakeSig = Buffer.from(`${headerEncoded}.${payloadEncoded}.pulse_secret_key`).toString("base64url").slice(0, 32);

  return `${headerEncoded}.${payloadEncoded}.${fakeSig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): User | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  return db.getUserById(payload.userId) || null;
}
