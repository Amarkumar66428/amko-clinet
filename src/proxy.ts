import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

// Redirect unauthenticated visitors away from the signed-in area.
export function proxy(request: NextRequest) {
  if (request.cookies.has(TOKEN_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

export const config = {
  matcher: "/user/:path*",
};
