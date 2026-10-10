import { NextResponse, type NextRequest } from "next/server";
import { CALLBACK_PATH, OAUTH_COOKIE, createAuthorizationRequest } from "@/lib/server/googleOAuth";

// Starts the Google sign-in: remembers state/nonce/PKCE verifier in a short-lived cookie, then redirects to Google.
export async function GET(request: NextRequest) {
  const redirectUri = new URL(CALLBACK_PATH, request.nextUrl.origin).toString();
  const { url, oauthState } = await createAuthorizationRequest(redirectUri);

  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_COOKIE, JSON.stringify(oauthState), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: CALLBACK_PATH,
    maxAge: 60 * 10,
  });
  return response;
}
