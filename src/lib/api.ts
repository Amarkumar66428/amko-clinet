import { clearToken, getToken } from "./auth";
import { notify, serverErrorStore } from "./notify";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2`;

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface RequestOptions {
  responseType?: "json" | "blob";
  timeout?: number;
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  { responseType = "json", timeout = 10000 }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const token = getToken();
  let response: Response;

  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });
  } catch (error) {
    const err = error as Error | undefined;
    throw { message: err?.message || "Network error", status: 0, code: err?.name } satisfies ApiError;
  }

  if (response.ok) {
    return { data: (responseType === "blob" ? await response.blob() : await response.json()) as T };
  }

  const payload: { message?: string; code?: string } = await response.json().catch(() => ({}));
  const status = response.status;
  const message = payload?.message || response.statusText || "Something went wrong";

  if ([401, 403, 500, 502].includes(status)) {
    clearToken();
    if (status === 401) {
      notify("Session expired, please login again", "error");
      // Full reload on purpose: drops all in-memory client state after the session ends.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/auth/signin";
    } else {
      serverErrorStore.set({ code: status, message });
    }
  }

  throw { message, status, code: payload?.code } satisfies ApiError;
}

const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>("POST", path, body, options),
};

export default api;
