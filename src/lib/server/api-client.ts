import { config } from "../config";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string;
  timeoutMs?: number;
}

interface ApiErrorPayload {
  errorCode?: unknown;
  message?: unknown;
  correlationId?: unknown;
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly errorCode: string;
  readonly correlationId?: string;

  constructor({
    status,
    errorCode,
    message,
    correlationId
  }: {
    status: number;
    errorCode: string;
    message: string;
    correlationId?: string;
  }) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.correlationId = correlationId;
  }
}

export async function apiRequest<TResponse = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? config.apiTimeoutMs);
  const headers = new Headers({
    Accept: "application/json",
    "Accept-Language": "fr",
    "X-Correlation-Id": crypto.randomUUID()
  });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  try {
    const response = await fetch(endpointUrl(path), {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal
    });
    const payload = await parsePayload(response);

    if (!response.ok) {
      throw toAdminApiError(response.status, payload);
    }

    return payload as TResponse;
  }
  catch (error) {
    if (error instanceof AdminApiError) {
      throw error;
    }
    if ((error as { name?: string }).name === "AbortError") {
      throw new AdminApiError({
        status: 0,
        errorCode: "REQUEST_TIMEOUT",
        message: "Le service met trop de temps a repondre. Veuillez reessayer."
      });
    }
    throw new AdminApiError({
      status: 0,
      errorCode: "NETWORK_ERROR",
      message: "Service momentanement indisponible. Veuillez reessayer."
    });
  }
  finally {
    clearTimeout(timeoutId);
  }
}

function endpointUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${config.apiBaseUrl}${normalizedPath}`;
}

async function parsePayload(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  }
  catch {
    return undefined;
  }
}

function toAdminApiError(status: number, payload: unknown): AdminApiError {
  const errorPayload = isErrorPayload(payload) ? payload : {};
  const errorCode =
    typeof errorPayload.errorCode === "string" ? errorPayload.errorCode : statusToErrorCode(status);
  const correlationId =
    typeof errorPayload.correlationId === "string" ? errorPayload.correlationId : undefined;

  return new AdminApiError({
    status,
    errorCode,
    correlationId,
    message: displayMessage(status, errorCode)
  });
}

function isErrorPayload(payload: unknown): payload is ApiErrorPayload {
  return typeof payload === "object" && payload !== null;
}

function statusToErrorCode(status: number): string {
  if (status === 401) {
    return "AUTH_INVALID";
  }
  if (status === 403) {
    return "ACCESS_DENIED";
  }
  if (status === 429) {
    return "RATE_LIMITED";
  }
  return status >= 500 ? "API_UNAVAILABLE" : "API_ERROR";
}

function displayMessage(status: number, errorCode: string): string {
  if (status === 401 || errorCode === "AUTH_INVALID" || errorCode === "SESSION_EXPIRED") {
    return "Identifiants invalides ou session expiree.";
  }
  if (status === 403 || errorCode === "ACCESS_DENIED" || errorCode === "PROFILE_NOT_ALLOWED") {
    return "Acces refuse pour ce compte.";
  }
  if (status === 429 || errorCode === "RATE_LIMITED" || errorCode === "OTP_RATE_LIMITED") {
    return "Trop de tentatives. Veuillez reessayer plus tard.";
  }
  if (status === 409 || errorCode === "PHOTON_UPDATE_IN_PROGRESS") {
    return "Une mise a jour Photon est deja en cours.";
  }
  if (errorCode === "PHOTON_DISABLED") {
    return "Photon n'est pas active sur cet environnement.";
  }
  if (errorCode === "PHOTON_UPDATE_UNAVAILABLE") {
    return "Le controleur Photon n'est pas disponible.";
  }
  if (status >= 500 || errorCode === "API_UNAVAILABLE") {
    return "Service momentanement indisponible. Veuillez reessayer.";
  }
  return "La demande n'a pas pu etre traitee.";
}
