const processEnv = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

const rawTimeoutMs = Number(processEnv.API_TIMEOUT_MS ?? import.meta.env.API_TIMEOUT_MS ?? "30000");

export const config = {
  appEnv: import.meta.env.PUBLIC_APP_ENV ?? "local",
  apiBaseUrl: (
    processEnv.API_BASE_URL ??
    import.meta.env.API_BASE_URL ??
    import.meta.env.PUBLIC_API_BASE_URL ??
    "http://localhost:8080/api/v1"
  ).replace(/\/+$/, ""),
  apiTimeoutMs: Number.isFinite(rawTimeoutMs) && rawTimeoutMs > 0 ? rawTimeoutMs : 30000,
  sessionCookieName:
    processEnv.ADMIN_SESSION_COOKIE_NAME ??
    import.meta.env.ADMIN_SESSION_COOKIE_NAME ??
    "motodi_admin_session"
};
