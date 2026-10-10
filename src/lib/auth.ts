export const TOKEN_COOKIE = "access_token";

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function logout() {
  localStorage.clear();
  clearToken();
  window.location.href = "/auth/signin";
}
