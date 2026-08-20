import { afterEach, describe, expect, it, vi } from "vitest";

import { apiRequest } from "../../src/lib/server/api-client";

describe("admin API client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps 401 responses to a safe user-facing message", async () => {
    mockFetchResponse(401, {
      errorCode: "AUTH_INVALID",
      message: "stacktrace should not leak",
      correlationId: "cid-401"
    });

    await expect(apiRequest("/auth/login")).rejects.toMatchObject({
      status: 401,
      errorCode: "AUTH_INVALID",
      message: "Identifiants invalides ou session expiree.",
      correlationId: "cid-401"
    });
  });

  it("maps 403 and 429 responses without leaking technical payloads", async () => {
    mockFetchResponse(403, {
      errorCode: "ACCESS_DENIED",
      message: "org.springframework.security.AccessDeniedException",
      correlationId: "cid-403"
    });

    await expect(apiRequest("/admin/kyc/pending")).rejects.toMatchObject({
      status: 403,
      message: "Acces refuse pour ce compte.",
      correlationId: "cid-403"
    });

    mockFetchResponse(429, {
      errorCode: "RATE_LIMITED",
      message: "bucket key auth:699001122"
    });

    await expect(apiRequest("/auth/login")).rejects.toMatchObject({
      status: 429,
      message: "Trop de tentatives. Veuillez reessayer plus tard."
    });

    mockFetchResponse(409, {
      errorCode: "PHOTON_UPDATE_IN_PROGRESS",
      message: "internal"
    });

    await expect(apiRequest("/admin/gis/photon/update", { method: "POST" })).rejects.toMatchObject({
      status: 409,
      message: "Une mise a jour Photon est deja en cours."
    });
  });

  it("normalizes network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED http://localhost/token")));

    await expect(apiRequest("/auth/login")).rejects.toMatchObject({
      status: 0,
      errorCode: "NETWORK_ERROR",
      message: "Service momentanement indisponible. Veuillez reessayer."
    });
  });
});

function mockFetchResponse(status: number, payload: Record<string, unknown>): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status,
        headers: {
          "Content-Type": "application/json"
        }
      })
    )
  );
}
