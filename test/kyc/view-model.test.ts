import { describe, expect, it } from "vitest";

import {
  canDecideKyc,
  kycReviewQuery,
  normalizeKycProfileFilter,
  normalizeKycStatusFilter,
  selectedKycUrl,
  validateKycDecisionForm
} from "../../src/lib/kyc/view-model";
import { makeSession } from "../auth/fixtures";

describe("KYC view model", () => {
  it("normalizes profile and status filters with pending as default", () => {
    expect(normalizeKycProfileFilter("MOTOTAXI")).toBe("MOTOTAXI");
    expect(normalizeKycProfileFilter("AGENCY")).toBeUndefined();
    expect(normalizeKycStatusFilter("REJECTED")).toBe("REJECTED");
    expect(normalizeKycStatusFilter("UNKNOWN")).toBe("PENDING");
  });

  it("builds stable KYC review URLs", () => {
    expect(kycReviewQuery({ profileType: "TRANSPORTER", status: "VALIDATED" })).toBe(
      "profileType=TRANSPORTER&status=VALIDATED"
    );
    expect(selectedKycUrl({ status: "PENDING" }, "profile-1")).toBe("/kyc?status=PENDING&profileId=profile-1");
  });

  it("allows decisions only with KYC_DECIDE", () => {
    expect(canDecideKyc(makeSession({ permissions: ["KYC_REVIEW_READ", "KYC_DECIDE"] }))).toBe(true);
    expect(canDecideKyc(makeSession({ permissions: ["KYC_REVIEW_READ"] }))).toBe(false);
  });

  it("requires a rejection reason before calling the backend", () => {
    expect(
      validateKycDecisionForm({ decision: "REJECT", reason: " ", allowed: true })
    ).toMatchObject({ ok: false });
    expect(
      validateKycDecisionForm({ decision: "REJECT", reason: " Document illisible ", allowed: true })
    ).toEqual({ ok: true, decision: "REJECT", reason: "Document illisible" });
    expect(validateKycDecisionForm({ decision: "VALIDATE", reason: "ignore", allowed: true })).toEqual({
      ok: true,
      decision: "VALIDATE",
      reason: null
    });
  });
});
