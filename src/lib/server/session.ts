import "server-only";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";
import { serverEnv } from "./env";
import type { User } from "./users";

export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day, matches setToken's default

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(serverEnv.authSecret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, serverEnv.authSecret, { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { sub: payload.sub, email: String(payload.email), name: String(payload.name) };
  } catch {
    return null;
  }
}

/** Signs a session for the user and stores it in the httpOnly session cookie on the response. */
export async function startSession(request: NextRequest, response: NextResponse, user: User): Promise<void> {
  const token = await signSession({ sub: user._id.toHexString(), email: user.email, name: user.name });
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** The user shape returned to the browser — never includes googleId or passwordHash. */
export function publicUser({ _id, email, name, picture, createdAt }: User) {
  return { id: _id.toHexString(), email, name, picture, createdAt };
}
