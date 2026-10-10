import { NextResponse, type NextRequest } from "next/server";
import { CALLBACK_PATH, OAUTH_COOKIE, exchangeCodeForProfile, type OAuthState } from "@/lib/server/googleOAuth";
import { startSession } from "@/lib/server/session";
import { upsertGoogleUser } from "@/lib/server/users";

function fail(request: NextRequest, error: string) {
  const response = NextResponse.redirect(new URL(`/auth/signin?error=${error}`, request.url));
  response.cookies.delete({ name: OAUTH_COOKIE, path: CALLBACK_PATH });
  return response;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.get("error")) return fail(request, "google_cancelled");

  let oauthState: OAuthState;
  try {
    oauthState = JSON.parse(request.cookies.get(OAUTH_COOKIE)?.value ?? "");
  } catch {
    return fail(request, "google_state");
  }

  const code = params.get("code");
  if (!code || params.get("state") !== oauthState.state) return fail(request, "google_state");

  try {
    const redirectUri = new URL(CALLBACK_PATH, request.nextUrl.origin).toString();
    const profile = await exchangeCodeForProfile(code, redirectUri, oauthState);
    const user = await upsertGoogleUser(profile);

    const response = NextResponse.redirect(new URL("/user/dashboard", request.url));
    response.cookies.delete({ name: OAUTH_COOKIE, path: CALLBACK_PATH });
    await startSession(request, response, user);
    return response;
  } catch (error) {
    console.error("Google sign-in failed", error);
    return fail(request, "google_failed");
  }
}
