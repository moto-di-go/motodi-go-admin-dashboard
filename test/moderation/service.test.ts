import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyModerationAction,
  listModerationQueue,
  listSupportTickets,
  updateSupportTicket
} from "../../src/lib/server/moderation-service";

describe("moderation server service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads moderation queue with type filter", async () => {
    const fetchMock = mockJsonResponse({ items: [], page: 0, size: 20, hasMore: false }, 200);

    await listModerationQueue("access-token", { type: "RATING", page: 1, size: 20 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/admin/moderation/queue?type=RATING&page=1&size=20");
    expect((init?.headers as Headers).get("Authorization")).toBe("Bearer access-token");
  });

  it("posts moderation actions", async () => {
    const fetchMock = mockJsonResponse(
      {
        id: "action-1",
        targetType: "RATING",
        targetId: "rating-1",
        action: "HIDE",
        reason: null,
        actedAt: new Date(0).toISOString()
      },
      201
    );

    await applyModerationAction("access-token", {
      targetType: "RATING",
      targetId: "rating-1",
      action: "HIDE",
      reason: null
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/admin/moderation/actions");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(
      JSON.stringify({ targetType: "RATING", targetId: "rating-1", action: "HIDE", reason: null })
    );
  });

  it("lists and patches support tickets", async () => {
    const listMock = mockJsonResponse({ tickets: [], page: 0, size: 20, hasMore: false }, 200);
    await listSupportTickets("access-token", { category: "PAYMENT", priority: "HIGH", status: "OPEN" });
    expect(listMock.mock.calls[0][0]).toBe(
      "http://localhost:8080/api/v1/admin/support/tickets?category=PAYMENT&priority=HIGH&status=OPEN"
    );

    const patchMock = mockJsonResponse(
      {
        id: "ticket-1",
        ticketNumber: "MDG-SUP-1",
        category: "PAYMENT",
        priority: "HIGH",
        status: "IN_PROGRESS",
        subject: "Paiement",
        message: "Aide",
        tripId: null,
        bookingId: null,
        paymentTransactionId: null,
        offlineOperationId: null,
        createdAt: new Date(0).toISOString(),
        closedAt: null,
        messages: []
      },
      200
    );
    await updateSupportTicket("ticket-1", { status: "IN_PROGRESS", reply: "Bonjour" }, "access-token");
    const [url, init] = patchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/admin/support/tickets/ticket-1");
    expect(init?.method).toBe("PATCH");
    expect(init?.body).toBe(JSON.stringify({ status: "IN_PROGRESS", reply: "Bonjour" }));
  });
});

function mockJsonResponse(payload: unknown, status: number) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
