import { AdminApiError, apiRequest } from "../server/api-client";
import { firstAccessiblePath, isBackOfficeProfileAllowed } from "./rbac";
import { buildAdminSession } from "./session";
import type { AdminAuthGateway, AdminSession, AuthTokenResponse, LoginCredentials } from "./types";

export class AdminAuthError extends Error {
  readonly code: "VALIDATION" | "NOT_ALLOWED" | "API";
  readonly correlationId?: string;

  constructor(code: AdminAuthError["code"], message: string, correlationId?: string) {
    super(message);
    this.name = "AdminAuthError";
    this.code = code;
    this.correlationId = correlationId;
  }
}

export const authGateway: AdminAuthGateway = {
  login: (request) =>
    apiRequest<AuthTokenResponse>("/auth/login", {
      method: "POST",
      body: request
    }),
  refresh: (request) =>
    apiRequest<AuthTokenResponse>("/auth/refresh", {
      method: "POST",
      body: request
    }),
  activateProfile: async (profileId, accessToken) => {
    await apiRequest(`/profiles/active/${profileId}`, {
      method: "PATCH",
      accessToken
    });
  },
  logout: async (accessToken) => {
    await apiRequest<void>("/auth/logout", {
      method: "POST",
      accessToken
    });
  }
};

export async function authenticateAdmin(
  credentials: LoginCredentials,
  gateway: AdminAuthGateway = authGateway,
  deviceId: string = createAdminDeviceId()
): Promise<AdminSession> {
  const phoneNumber = credentials.phoneNumber.trim();
  const password = credentials.password;
  if (!phoneNumber || !password) {
    throw new AdminAuthError("VALIDATION", "Renseignez le telephone et le mot de passe.");
  }

  try {
    let tokenResponse = await gateway.login({ phoneNumber, password, deviceId });
    tokenResponse = await ensureBackOfficeProfile(tokenResponse, gateway, deviceId);

    const session = buildAdminSession(tokenResponse, deviceId);
    if (!isBackOfficeProfileAllowed(session)) {
      throw notAllowed();
    }

    return session;
  }
  catch (error) {
    throw toAdminAuthError(error);
  }
}

export async function refreshAdminSession(
  session: AdminSession,
  gateway: AdminAuthGateway = authGateway
): Promise<AdminSession> {
  try {
    const response = await gateway.refresh({
      refreshToken: session.refreshToken,
      deviceId: session.deviceId
    });
    const refreshed = buildAdminSession(response, session.deviceId);
    if (!isBackOfficeProfileAllowed(refreshed)) {
      throw notAllowed();
    }
    return {
      ...refreshed,
      createdAt: session.createdAt
    };
  }
  catch (error) {
    throw toAdminAuthError(error);
  }
}

export async function logoutAdmin(session: AdminSession | null, gateway: AdminAuthGateway = authGateway): Promise<void> {
  if (!session?.accessToken) {
    return;
  }
  try {
    await gateway.logout(session.accessToken);
  }
  catch {
    // Local session cleanup must still happen if the gateway token is already expired.
  }
}

export function hasUsableDashboardRoute(session: AdminSession): boolean {
  return firstAccessiblePath(session) !== null;
}

async function ensureBackOfficeProfile(
  tokenResponse: AuthTokenResponse,
  gateway: AdminAuthGateway,
  deviceId: string
): Promise<AuthTokenResponse> {
  const initialSession = buildAdminSession(tokenResponse, deviceId);
  if (isBackOfficeProfileAllowed(initialSession)) {
    return tokenResponse;
  }

  const candidate =
    tokenResponse.profiles.find((profile) => profile.type === "ADMIN") ??
    tokenResponse.profiles.find(
      (profile) => profile.type === "AGENCY" && profile.validationStatus === "VALIDATED"
    );

  if (!candidate) {
    throw notAllowed();
  }

  if (candidate.id !== tokenResponse.activeProfileId) {
    await gateway.activateProfile(candidate.id, tokenResponse.accessToken);
    return gateway.refresh({ refreshToken: tokenResponse.refreshToken, deviceId });
  }

  return tokenResponse;
}

function createAdminDeviceId(): string {
  return `admin-dashboard:${crypto.randomUUID()}`;
}

function notAllowed(): AdminAuthError {
  return new AdminAuthError(
    "NOT_ALLOWED",
    "Ce compte ne dispose pas d'un profil back-office autorise."
  );
}

function toAdminAuthError(error: unknown): AdminAuthError {
  if (error instanceof AdminAuthError) {
    return error;
  }
  if (error instanceof AdminApiError) {
    if (error.status === 401) {
      return new AdminAuthError("API", "Identifiants invalides ou session expiree.", error.correlationId);
    }
    if (error.status === 403) {
      return new AdminAuthError("API", "Acces refuse pour ce compte.", error.correlationId);
    }
    return new AdminAuthError("API", error.message, error.correlationId);
  }
  return new AdminAuthError("API", "Connexion impossible pour le moment.");
}
