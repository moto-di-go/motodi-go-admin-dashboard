import { describe, expect, it } from "vitest";

import { groupNavItems } from "../../src/lib/ui/nav";
import { statusBadgeClass, statusTone } from "../../src/lib/ui/status";
import type { ProtectedRoute } from "../../src/lib/auth/types";

describe("status tones", () => {
  it("maps operational statuses to semantic tones", () => {
    expect(statusTone("PAID")).toBe("ok");
    expect(statusTone("PENDING")).toBe("warn");
    expect(statusTone("FAILED")).toBe("danger");
    expect(statusTone("DRAFT")).toBe("neutral");
    expect(statusTone(null)).toBe("neutral");
  });

  it("builds badge class names", () => {
    expect(statusBadgeClass("CONFIRMED")).toBe("status-badge status-ok");
    expect(statusBadgeClass("CANCELLED")).toBe("status-badge status-danger");
  });
});

describe("nav grouping", () => {
  it("groups routes by eyebrow order of appearance", () => {
    const items: ProtectedRoute[] = [
      { href: "/", label: "Operations", eyebrow: "Pilotage" },
      { href: "/users", label: "Utilisateurs", eyebrow: "Pilotage" },
      { href: "/kyc", label: "KYC", eyebrow: "Confiance" },
      { href: "/kpi", label: "KPI", eyebrow: "Analytics" }
    ];

    expect(groupNavItems(items).map((group) => group.label)).toEqual([
      "Pilotage",
      "Confiance",
      "Analytics"
    ]);
    expect(groupNavItems(items)[0]?.items.map((item) => item.href)).toEqual(["/", "/users"]);
  });
});
