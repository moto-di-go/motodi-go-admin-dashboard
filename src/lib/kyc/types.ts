import type { ProfileType, ValidationStatus } from "../auth/types";

export type KycReviewProfileType = Extract<ProfileType, "MOTOTAXI" | "TRANSPORTER">;
export type KycDecision = "VALIDATE" | "REJECT";
export type KycDocumentStatus =
  | "UPLOADED"
  | "ENCRYPTED"
  | "PENDING_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";
export type KycDocumentType =
  | "CNI"
  | "DRIVER_LICENSE"
  | "VEHICLE_REGISTRATION"
  | "INSURANCE"
  | "PROFILE_PHOTO"
  | "AGENCY_DOCUMENT";

export interface KycReviewFilters {
  profileType?: KycReviewProfileType;
  status?: ValidationStatus;
}

export interface AdminKycQueueItem {
  profileId: string;
  profileType: KycReviewProfileType;
  profileValidationStatus: ValidationStatus;
  displayName: string;
  documentsCount: number;
  pendingDocumentsCount: number;
  oldestPendingDocumentAt: string | null;
}

export interface AdminKycDocument {
  id: string;
  profileId: string;
  vehicleId: string | null;
  type: KycDocumentType;
  status: KycDocumentStatus;
  fileName: string | null;
  mimeType: string;
  sizeBytes: number;
  rejectionReason: string | null;
  uploadedAt: string;
  updatedAt: string;
}

export interface AdminKycDecisionRecord {
  id: string;
  profileId: string;
  adminProfileId: string | null;
  decision: KycDecision | "SUSPEND";
  reason: string | null;
  decidedAt: string;
}

export interface AdminKycDocumentBundle {
  profileId: string;
  profileType: KycReviewProfileType;
  profileValidationStatus: ValidationStatus;
  displayName: string;
  documents: AdminKycDocument[];
  decisions: AdminKycDecisionRecord[];
}

export interface AdminKycDecisionRequest {
  decision: KycDecision;
  reason?: string | null;
}

export interface AdminKycDecisionResponse {
  profileId: string;
  profileValidationStatus: ValidationStatus;
  decision: KycDecision;
  decisionRecord: AdminKycDecisionRecord;
}

export interface DownloadedKycDocumentContent {
  content: ArrayBuffer;
  contentType: string;
  contentDisposition: string | null;
}
