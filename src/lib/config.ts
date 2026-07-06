export const config = {
  appEnv: import.meta.env.PUBLIC_APP_ENV ?? "local",
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1"
};

