import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { serverEnv } from "./env";
import type { GoogleProfile } from "./users";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export const OAUTH_COOKIE = "google_oauth";
export const CALLBACK_PATH = "/api/auth/google/callback";

export interface OAuthState {
  state: string;
  nonce: string;
  verifier: string;
}

function base64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function randomToken(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function createAuthorizationRequest(redirectUri: string): Promise<{ url: string; oauthState: OAuthState }> {
  const oauthState: OAuthState = { state: randomToken(), nonce: randomToken(), verifier: randomToken() };
  const challenge = base64url(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(oauthState.verifier))),
  );

  const url = new URL(AUTH_URL);
  url.search = new URLSearchParams({
    client_id: serverEnv.googleClientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: oauthState.state,
    nonce: oauthState.nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  return { url: url.toString(), oauthState };
}

export async function exchangeCodeForProfile(
  code: string,
  redirectUri: string,
  oauthState: OAuthState,
): Promise<GoogleProfile> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: serverEnv.googleClientId,
      client_secret: serverEnv.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: oauthState.verifier,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Google token exchange failed: ${response.status} ${await response.text()}`);

  const { id_token: idToken } = (await response.json()) as { id_token?: string };
  if (!idToken) throw new Error("Google response did not include an id_token");

  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: serverEnv.googleClientId,
  });
  if (payload.nonce !== oauthState.nonce) throw new Error("Google id_token nonce mismatch");
  if (!payload.sub || typeof payload.email !== "string") throw new Error("Google id_token is missing sub or email");

  return payload as unknown as GoogleProfile;
}
