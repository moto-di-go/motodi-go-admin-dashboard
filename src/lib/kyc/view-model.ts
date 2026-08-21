import type { AdminSession, ValidationStatus } from "../auth/types";
import type { AdminKycDocument, KycDecision, KycReviewFilters, KycReviewProfileType } from "./types";

export const kycProfileTypeOptions: KycReviewProfileType[] = ["PASSENGER", "MOTOTAXI", "TRANSPORTER"];
export const kycStatusOptions: ValidationStatus[] = ["PENDING", "VALIDATED", "REJECTED", "SUSPENDED", "DRAFT"];

export function normalizeKycProfileFilter(value: string | null | undefined): KycReviewProfileType | undefined {
  return kycProfileTypeOptions.includes(value as KycReviewProfileType)
    ? (value as KycReviewProfileType)
    : undefined;
}

export function normalizeKycStatusFilter(value: string | null | undefined): ValidationStatus {
  return kycStatusOptions.includes(value as ValidationStatus) ? (value as ValidationStatus) : "PENDING";
}

export function canDecideKyc(session: Pick<AdminSession, "permissions"> | null | undefined): boolean {
  return Boolean(session?.permissions.includes("KYC_DECIDE"));
}

export function canDecideKycDocument({
  session,
  profileStatus,
  document
}: {
  session: Pick<AdminSession, "permissions"> | null | undefined;
  profileStatus: ValidationStatus | null | undefined;
  document: Pick<AdminKycDocument, "status"> | null | undefined;
}): boolean {
  return canDecideKyc(session) && profileStatus === "PENDING" && document?.status === "PENDING_REVIEW";
}

export function validateKycDecisionForm({
  decision,
  reason,
  allowed
}: {
  decision: string | null | undefined;
  reason: string | null | undefined;
  allowed: boolean;
}): { ok: true; decision: KycDecision; reason: string | null } | { ok: false; message: string } {
  if (!allowed) {
    return { ok: false, message: "Vous n'avez pas la permission de prendre une decision KYC." };
  }
  if (decision !== "VALIDATE" && decision !== "REJECT") {
    return { ok: false, message: "Decision KYC invalide." };
  }
  const normalizedReason = reason?.trim() || null;
  if (decision === "REJECT" && !normalizedReason) {
    return { ok: false, message: "Un motif est obligatoire pour rejeter un profil KYC." };
  }
  return { ok: true, decision, reason: decision === "REJECT" ? normalizedReason : null };
}

export function kycReviewQuery(filters: KycReviewFilters): string {
  const params = new URLSearchParams();
  if (filters.profileType) {
    params.set("profileType", filters.profileType);
  }
  params.set("status", filters.status ?? "PENDING");
  return params.toString();
}

export function selectedKycUrl(filters: KycReviewFilters, profileId?: string | null): string {
  const params = new URLSearchParams(kycReviewQuery(filters));
  if (profileId) {
    params.set("profileId", profileId);
  }
  return `/kyc?${params.toString()}`;
}

export function formatKycAge(value: string | null | undefined, now: Date = new Date()): string {
  if (!value) {
    return "Aucune attente";
  }
  const uploadedAt = Date.parse(value);
  if (!Number.isFinite(uploadedAt)) {
    return "Date inconnue";
  }
  const minutes = Math.max(0, Math.floor((now.getTime() - uploadedAt) / 60_000));
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} h`;
  }
  return `${Math.floor(hours / 24)} j`;
}

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} o`;
  }
  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} Ko`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} Mo`;
}
