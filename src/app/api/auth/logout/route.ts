import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

// Server-side logout so the httpOnly session cookie set by Google sign-in can be cleared too.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/auth/signin", request.url));
  response.cookies.delete({ name: TOKEN_COOKIE, path: "/" });
  return response;
}
