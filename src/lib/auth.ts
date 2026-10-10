export const TOKEN_COOKIE = "access_token";

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string, days = 1): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearToken(): void {
  document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function logout(): void {
  localStorage.clear();
  clearToken();
  // Full reload on purpose: drops all in-memory client state after the session ends.
  // The server route also clears the httpOnly cookie set by Google sign-in, then redirects to /auth/signin.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/api/auth/logout";
}
