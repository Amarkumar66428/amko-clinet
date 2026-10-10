import { clearToken, getToken } from "./auth";
import { notify, serverErrorStore } from "./notify";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2`;

async function request(method, path, body, { responseType = "json", timeout = 10000 } = {}) {
  const token = getToken();
  let response;

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
    throw { message: error?.message || "Network error", status: 0, code: error?.name };
  }

  if (response.ok) {
    return { data: responseType === "blob" ? await response.blob() : await response.json() };
  }

  const payload = await response.json().catch(() => ({}));
  const status = response.status;
  const message = payload?.message || response.statusText || "Something went wrong";

  if ([401, 403, 500, 502].includes(status)) {
    clearToken();
    if (status === 401) {
      notify("Session expired, please login again", "error");
      window.location.href = "/auth/signin";
    } else {
      serverErrorStore.set({ code: status, message });
    }
  }

  throw { message, status, code: payload?.code };
}

const api = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, body, options) => request("POST", path, body, options),
};

export default api;
