import type { ApiError } from "./api";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
}

interface AuthResponse {
  data: AuthUser;
}

// Shared by the signup form and POST /api/auth/register.
export const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Same-origin route handlers in src/app/api/auth. They set the httpOnly session cookie themselves, so there is
// no token to store. Plain fetch on purpose: the shared api client treats any 401 as an expired session.
async function post(path: string, body: unknown): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    const err = error as Error | undefined;
    throw { message: err?.message || "Network error", status: 0, code: err?.name } satisfies ApiError;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message || response.statusText || "Something went wrong";
    throw { message, status: response.status } satisfies ApiError;
  }
  return payload as AuthResponse;
}

const authService = {
  signUp: (payload: SignUpPayload) => post("/api/auth/register", payload),
  signIn: (payload: SignInPayload) => post("/api/auth/login", payload),
};

export default authService;
