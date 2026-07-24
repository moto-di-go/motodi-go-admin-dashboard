import { afterEach, describe, expect, it, vi } from "vitest";

import { decideKycProfile, listKycReviews } from "../../src/lib/server/kyc-service";

describe("KYC server service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads review queue with filters and bearer token", async () => {
    const fetchMock = mockJsonResponse([]);

    await listKycReviews({ profileType: "MOTOTAXI", status: "REJECTED" }, "access-token");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/admin/kyc/reviews?profileType=MOTOTAXI&status=REJECTED");
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer access-token");
  });

  it("posts KYC decisions with the expected payload", async () => {
    const fetchMock = mockJsonResponse({
      profileId: "profile-1",
      profileValidationStatus: "REJECTED",
      decision: "REJECT",
      decisionRecord: {
        id: "decision-1",
        profileId: "profile-1",
        adminProfileId: "admin-1",
        decision: "REJECT",
        reason: "Photo illisible",
        decidedAt: new Date(0).toISOString()
      }
    });

    await decideKycProfile("profile-1", { decision: "REJECT", reason: "Photo illisible" }, "access-token");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/admin/kyc/profile-1/decision");
    expect(init?.method).toBe("POST");
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer access-token");
    expect(init?.body).toBe(JSON.stringify({ decision: "REJECT", reason: "Photo illisible" }));
  });
});

function mockJsonResponse(payload: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
