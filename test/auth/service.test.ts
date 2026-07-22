import { describe, expect, it, vi } from "vitest";

import { authenticateAdmin, logoutAdmin, refreshAdminSession } from "../../src/lib/auth/service";
import type { AdminAuthGateway } from "../../src/lib/auth/types";
import {
  activeProfile,
  agencyProfile,
  adminProfile,
  inactiveProfile,
  makeSession,
  makeTokenResponse,
  passengerProfile
} from "./fixtures";

describe("admin auth service", () => {
  it("activates an admin profile before creating the dashboard session", async () => {
    const loginResponse = makeTokenResponse({
      roles: ["PASSENGER", "ADMIN"],
      profiles: [passengerProfile, inactiveProfile(adminProfile)],
      activeProfileId: passengerProfile.id,
      activeProfileType: "PASSENGER",
      permissions: ["PROFILE_SWITCH"]
    });
    const refreshResponse = makeTokenResponse({
      roles: ["PASSENGER", "ADMIN"],
      profiles: [inactiveProfile(passengerProfile), adminProfile],
      activeProfileId: adminProfile.id,
      activeProfileType: "ADMIN",
      permissions: ["KYC_REVIEW_READ"]
    });
    const gateway = gatewayMock({ loginResponse, refreshResponse });

    const session = await authenticateAdmin(
      { phoneNumber: "699001122", password: "Secret1234" },
      gateway,
      "device-test"
    );

    expect(gateway.activateProfile).toHaveBeenCalledWith(adminProfile.id, "access-token");
    expect(gateway.refresh).toHaveBeenCalledWith({ refreshToken: "refresh-token", deviceId: "device-test" });
    expect(session.activeProfileType).toBe("ADMIN");
    expect(session.permissions).toContain("KYC_REVIEW_READ");
  });

  it("accepts a validated agency profile only when agency stats permission is present", async () => {
    const gateway = gatewayMock({
      loginResponse: activeProfile("AGENCY", ["AGENCY_STATS_READ"], agencyProfile.id)
    });

    const session = await authenticateAdmin(
      { phoneNumber: "699001122", password: "Secret1234" },
      gateway,
      "device-test"
    );

    expect(session.activeProfileType).toBe("AGENCY");
  });

  it("rejects passenger-only accounts", async () => {
    const gateway = gatewayMock({
      loginResponse: activeProfile("PASSENGER", ["PASSENGER_PAY"], passengerProfile.id)
    });

    await expect(
      authenticateAdmin({ phoneNumber: "699001122", password: "Secret1234" }, gateway, "device-test")
    ).rejects.toMatchObject({
      code: "NOT_ALLOWED"
    });
  });

  it("refreshes sessions and preserves the original creation timestamp", async () => {
    const existingSession = makeSession({ createdAt: new Date(10).toISOString() });
    const gateway = gatewayMock({
      refreshResponse: makeTokenResponse({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        permissions: ["OPERATIONS_READ"]
      })
    });

    const refreshed = await refreshAdminSession(existingSession, gateway);

    expect(refreshed.accessToken).toBe("new-access-token");
    expect(refreshed.refreshToken).toBe("new-refresh-token");
    expect(refreshed.createdAt).toBe(existingSession.createdAt);
  });

  it("cleans up locally even when gateway logout fails", async () => {
    const gateway = gatewayMock();
    vi.mocked(gateway.logout).mockRejectedValueOnce(new Error("expired"));

    await expect(logoutAdmin(makeSession(), gateway)).resolves.toBeUndefined();
  });
});

function gatewayMock({
  loginResponse = makeTokenResponse(),
  refreshResponse = makeTokenResponse()
}: {
  loginResponse?: ReturnType<typeof makeTokenResponse>;
  refreshResponse?: ReturnType<typeof makeTokenResponse>;
} = {}): AdminAuthGateway {
  return {
    login: vi.fn().mockResolvedValue(loginResponse),
    refresh: vi.fn().mockResolvedValue(refreshResponse),
    activateProfile: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined)
  };
}
