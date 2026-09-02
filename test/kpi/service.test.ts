import { afterEach, describe, expect, it, vi } from "vitest";

import { formatAiUsageRate, progressTowardTarget } from "../../src/lib/kpi/types";
import { getKpiSnapshot, kpiExportPath, toKpiQuery } from "../../src/lib/server/kpi-service";

describe("KPI helpers", () => {
  it("caps progress toward BMC targets at 100%", () => {
    expect(progressTowardTarget(50, 100)).toBe(50);
    expect(progressTowardTarget(150, 100)).toBe(100);
    expect(progressTowardTarget(10, 0)).toBe(0);
    expect(progressTowardTarget(Number.NaN, 100)).toBe(0);
  });

  it("maps null AI usage rate to Non disponible", () => {
    expect(formatAiUsageRate(null)).toBe("Non disponible");
    expect(formatAiUsageRate(undefined)).toBe("Non disponible");
    expect(formatAiUsageRate(31)).toBe("31%");
    expect(formatAiUsageRate(12.345)).toMatch(/%$/);
  });
});

describe("KPI query building", () => {
  it("builds query strings without empty values", () => {
    expect(toKpiQuery({ from: "2026-09-01", to: "2026-09-30" })).toBe(
      "from=2026-09-01&to=2026-09-30"
    );
    expect(toKpiQuery({ period: "month" })).toBe("period=month");
    expect(toKpiQuery({ from: "", to: undefined, period: "7d" })).toBe("period=7d");
  });

  it("builds BFF export path with filters", () => {
    expect(kpiExportPath({ from: "2026-09-01", to: "2026-09-02" })).toBe(
      "/api/kpi/export.csv?from=2026-09-01&to=2026-09-02"
    );
    expect(kpiExportPath({ period: "30d" })).toBe("/api/kpi/export.csv?period=30d");
    expect(kpiExportPath({})).toBe("/api/kpi/export.csv");
  });
});

describe("KPI server service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads KPI snapshot with filters and bearer token", async () => {
    const payload = {
      id: "11111111-1111-1111-1111-111111111111",
      periodStart: "2026-09-01",
      periodEnd: "2026-09-30",
      monthlyActiveUsers: 120,
      activeVerifiedDrivers: 45,
      reservationCount: 80,
      reservationsByStatus: { CONFIRMED: 50 },
      walletVolumeFcfa: 150000,
      mtnMomoVolumeFcfa: 90000,
      orangeMoneyVolumeFcfa: 60000,
      slaAvailability: 99,
      avgSigSyncSeconds: 12.35,
      aiUsageRate: null,
      bmcTargetsM6: {
        monthlyActiveUsers: 10000,
        activeVerifiedDrivers: 2000,
        slaAvailabilityPercent: 99.9
      },
      bmcTargetsM12: {
        monthlyActiveUsers: 10000,
        activeVerifiedDrivers: 2000,
        slaAvailabilityPercent: 99.9
      },
      createdAt: "2026-09-02T10:00:00Z"
    };
    const fetchMock = mockJsonResponse(payload);

    const result = await getKpiSnapshot("access-token", {
      from: "2026-09-01",
      to: "2026-09-30",
      period: "month"
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "http://localhost:8080/api/v1/admin/kpi?from=2026-09-01&to=2026-09-30&period=month"
    );
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer access-token");
    expect(result.monthlyActiveUsers).toBe(120);
    expect(result.aiUsageRate).toBeNull();
  });

  it("calls /admin/kpi without query when params are empty", async () => {
    const fetchMock = mockJsonResponse({
      id: "",
      periodStart: "2026-09-01",
      periodEnd: "2026-09-02",
      monthlyActiveUsers: 0,
      activeVerifiedDrivers: 0,
      reservationCount: 0,
      reservationsByStatus: {},
      walletVolumeFcfa: 0,
      mtnMomoVolumeFcfa: 0,
      orangeMoneyVolumeFcfa: 0,
      slaAvailability: 0,
      avgSigSyncSeconds: 0,
      aiUsageRate: null,
      bmcTargetsM6: {
        monthlyActiveUsers: 0,
        activeVerifiedDrivers: 0,
        slaAvailabilityPercent: 0
      },
      bmcTargetsM12: {
        monthlyActiveUsers: 0,
        activeVerifiedDrivers: 0,
        slaAvailabilityPercent: 0
      },
      createdAt: "2026-09-02T10:00:00Z"
    });

    await getKpiSnapshot("access-token", {});

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/admin/kpi");
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
