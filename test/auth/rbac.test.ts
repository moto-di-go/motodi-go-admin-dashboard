import { describe, expect, it } from "vitest";

import {
  canAccessPath,
  firstAccessiblePath,
  getVisibleNavItems,
  resolvePostLoginPath,
  sanitizeNextPath
} from "../../src/lib/auth/rbac";
import { agencyProfile, makeSession, passengerProfile, supportProfile } from "./fixtures";

describe("admin RBAC", () => {
  it("shows all admin menus for a platform admin with all admin read permissions", () => {
    const session = makeSession();

    expect(getVisibleNavItems(session).map((item) => item.href)).toEqual([
      "/",
      "/users",
      "/profiles",
      "/announcements",
      "/bookings",
      "/payments",
      "/reconciliation",
      "/kyc",
      "/moderation",
      "/pricing",
      "/kpi"
    ]);
    expect(firstAccessiblePath(session)).toBe("/");
    expect(canAccessPath("/users", session)).toBe(true);
    expect(canAccessPath("/profiles", session)).toBe(true);
    expect(canAccessPath("/announcements", session)).toBe(true);
    expect(canAccessPath("/bookings", session)).toBe(true);
    expect(canAccessPath("/payments", session)).toBe(true);
    expect(canAccessPath("/reconciliation", session)).toBe(true);
  });

  it("limits support users to menus backed by their permissions", () => {
    const session = makeSession({
      profiles: [supportProfile],
      activeProfileId: supportProfile.id,
      permissions: ["MODERATION_READ"]
    });

    expect(getVisibleNavItems(session).map((item) => item.href)).toEqual(["/moderation"]);
    expect(canAccessPath("/kyc", session)).toBe(false);
    expect(canAccessPath("/moderation", session)).toBe(true);
    expect(canAccessPath("/users", session)).toBe(false);
  });

  it("keeps validated agency users in the agency space only", () => {
    const session = makeSession({
      roles: ["AGENCY"],
      profiles: [agencyProfile],
      activeProfileId: agencyProfile.id,
      activeProfileType: "AGENCY",
      permissions: ["AGENCY_STATS_READ"]
    });

    expect(getVisibleNavItems(session).map((item) => item.href)).toEqual(["/agency"]);
    expect(canAccessPath("/", session)).toBe(false);
    expect(canAccessPath("/agency", session)).toBe(true);
  });

  it("rejects non back-office profiles", () => {
    const session = makeSession({
      roles: ["PASSENGER"],
      profiles: [passengerProfile],
      activeProfileId: passengerProfile.id,
      activeProfileType: "PASSENGER",
      permissions: ["PASSENGER_PAY"]
    });

    expect(getVisibleNavItems(session)).toEqual([]);
    expect(canAccessPath("/", session)).toBe(false);
  });

  it("sanitizes post-login next paths and falls back to the first allowed route", () => {
    const session = makeSession({
      permissions: ["KYC_REVIEW_READ"]
    });

    expect(sanitizeNextPath("https://example.com/kyc")).toBeNull();
    expect(sanitizeNextPath("//example.com/kyc")).toBeNull();
    expect(resolvePostLoginPath("/pricing", session)).toBe("/kyc");
    expect(resolvePostLoginPath("/kyc?status=pending", session)).toBe("/kyc?status=pending");
  });
});
