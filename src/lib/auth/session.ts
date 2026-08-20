import type { AstroSession } from "astro";

import type { AdminSession, AuthTokenResponse } from "./types";

export const ADMIN_SESSION_KEY = "adminSession";
export const ACCESS_REFRESH_SKEW_MS = 60_000;

export function buildAdminSession(
  response: AuthTokenResponse,
  deviceId: string,
  now: Date = new Date()
): AdminSession {
  const timestamp = now.toISOString();
  return {
    tokenType: response.tokenType,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresAt: response.accessTokenExpiresAt,
    refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    sessionId: response.sessionId,
    userId: response.userId,
    phoneNumber: response.phoneNumber,
    roles: response.roles,
    profiles: response.profiles,
    activeProfileId: response.activeProfileId,
    activeProfileType: response.activeProfileType,
    permissions: response.permissions,
    deviceId,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export async function getStoredAdminSession(session: AstroSession | undefined): Promise<AdminSession | null> {
  return (await session?.get<AdminSession>(ADMIN_SESSION_KEY)) ?? null;
}

export function saveStoredAdminSession(session: AstroSession | undefined, adminSession: AdminSession): void {
  if (!session) {
    return;
  }
  session.set(ADMIN_SESSION_KEY, adminSession, {
    ttl: sessionTtlSeconds(adminSession)
  });
}

export function destroyStoredAdminSession(session: AstroSession | undefined): void {
  session?.destroy();
}

export function isAccessTokenStale(
  session: AdminSession,
  nowMs: number = Date.now(),
  skewMs: number = ACCESS_REFRESH_SKEW_MS
): boolean {
  return Date.parse(session.accessTokenExpiresAt) - skewMs <= nowMs;
}

export function isRefreshTokenExpired(session: AdminSession, nowMs: number = Date.now()): boolean {
  return Date.parse(session.refreshTokenExpiresAt) <= nowMs;
}

export function sessionTtlSeconds(session: AdminSession, nowMs: number = Date.now()): number {
  const ttlSeconds = Math.floor((Date.parse(session.refreshTokenExpiresAt) - nowMs) / 1000);
  return Math.max(ttlSeconds, 1);
}

