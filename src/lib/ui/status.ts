export type StatusTone = "ok" | "warn" | "danger" | "info" | "neutral";

const STATUS_TONES: Record<string, StatusTone> = {
  ACTIVE: "ok",
  AVAILABLE: "ok",
  VALIDATED: "ok",
  CONFIRMED: "ok",
  PAID: "ok",
  PUBLISHED: "ok",
  SYNCED: "ok",
  SUCCESS: "ok",
  FULL: "info",
  PENDING: "warn",
  PENDING_PAYMENT: "warn",
  PENDING_CALLBACK: "warn",
  PENDING_KYC: "warn",
  DRAFT: "neutral",
  INITIATED: "info",
  OCCUPIED: "info",
  CLOSED: "neutral",
  EXPIRED: "neutral",
  OFFLINE: "neutral",
  CANCELLED: "danger",
  FAILED: "danger",
  REJECTED: "danger",
  SUSPENDED: "danger",
  CONFLICT: "danger",
  REFUNDED: "warn",
  STANDARD: "neutral",
  PREMIUM: "ok"
};

export function statusTone(status: string | null | undefined): StatusTone {
  if (!status) {
    return "neutral";
  }
  return STATUS_TONES[status.trim().toUpperCase()] ?? "neutral";
}

export function statusBadgeClass(status: string | null | undefined): string {
  const tone = statusTone(status);
  return `status-badge status-${tone}`;
}
