import type { AdminSession, AuthTokenResponse, Permission, ProfileTokenSummary, ProfileType } from "../../src/lib/auth/types";

export const adminProfile: ProfileTokenSummary = {
  id: "profile-admin",
  type: "ADMIN",
  validationStatus: "VALIDATED",
  active: true
};

export const supportProfile: ProfileTokenSummary = {
  id: "profile-support",
  type: "ADMIN",
  validationStatus: "VALIDATED",
  active: true
};

export const agencyProfile: ProfileTokenSummary = {
  id: "profile-agency",
  type: "AGENCY",
  validationStatus: "VALIDATED",
  active: true
};

export const passengerProfile: ProfileTokenSummary = {
  id: "profile-passenger",
  type: "PASSENGER",
  validationStatus: "VALIDATED",
  active: true
};

export function makeSession(overrides: Partial<AdminSession> = {}): AdminSession {
  return {
    tokenType: "Bearer",
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 300_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    sessionId: "session-id",
    userId: "user-id",
    phoneNumber: "699001122",
    roles: ["ADMIN"],
    profiles: [adminProfile],
    activeProfileId: adminProfile.id,
    activeProfileType: "ADMIN",
    permissions: [
      "OPERATIONS_READ",
      "PAYMENT_RECONCILE_READ",
      "KYC_REVIEW_READ",
      "MODERATION_READ",
      "PRICING_READ",
      "GIS_READ",
      "KPI_READ"
    ],
    deviceId: "admin-dashboard:test",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    ...overrides
  };
}

export function makeTokenResponse(overrides: Partial<AuthTokenResponse> = {}): AuthTokenResponse {
  return {
    tokenType: "Bearer",
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 300_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    sessionId: "session-id",
    userId: "user-id",
    phoneNumber: "699001122",
    roles: ["ADMIN"],
    profiles: [adminProfile],
    activeProfileId: adminProfile.id,
    activeProfileType: "ADMIN",
    permissions: ["OPERATIONS_READ"],
    ...overrides
  };
}

export function inactiveProfile(profile: ProfileTokenSummary): ProfileTokenSummary {
  return { ...profile, active: false };
}

export function activeProfile(
  type: ProfileType,
  permissions: Permission[] = [],
  id = `profile-${type.toLowerCase()}`
): AuthTokenResponse {
  const profile: ProfileTokenSummary = {
    id,
    type,
    validationStatus: "VALIDATED",
    active: true
  };
  return makeTokenResponse({
    roles: [type],
    profiles: [profile],
    activeProfileId: id,
    activeProfileType: type,
    permissions
  });
}
