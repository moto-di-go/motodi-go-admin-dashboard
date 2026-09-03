import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getAgencyOverview,
  listAgencyAnnouncements,
  listAgencyBookings
} from "../../src/lib/server/agency-service";

describe("Agency server service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads overview with period filters and bearer token under /agency", async () => {
    const fetchMock = mockJsonResponse({
      activeAnnouncements: 3,
      reservationCount: 12,
      averageFillRate: 0.75,
      billingPlan: "STANDARD",
      billingPlanPriceFcfa: 10000,
      displayPriority: 0,
      legalName: "Agence Littoral",
      reservationsByStatus: { PAID: 12 },
      periodStart: "2026-09-01",
      periodEnd: "2026-09-30"
    });

    await getAgencyOverview("access-token", { from: "2026-09-01", to: "2026-09-30" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "http://localhost:8080/api/v1/agency/overview?from=2026-09-01&to=2026-09-30"
    );
    expect(url).not.toContain("/admin/");
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer access-token");
  });

  it("lists announcements and bookings scoped to agency endpoints", async () => {
    const fetchMock = mockJsonResponse({
      announcements: [],
      bookings: [],
      page: 0,
      size: 10,
      hasMore: false
    });

    await listAgencyAnnouncements("token", { status: "PUBLISHED", page: 1, size: 10 });
    await listAgencyBookings("token", { status: "PAID", page: 0, size: 10 });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8080/api/v1/agency/announcements?status=PUBLISHED&page=1&size=10"
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "http://localhost:8080/api/v1/agency/bookings?status=PAID&page=0&size=10"
    );
  });
});

function mockJsonResponse(payload: unknown) {
  const fetchMock = vi.fn().mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      })
    )
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
