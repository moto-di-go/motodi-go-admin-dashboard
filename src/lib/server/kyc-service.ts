import { config } from "../config";
import { AdminApiError, apiRequest } from "./api-client";
import { kycReviewQuery } from "../kyc/view-model";
import type {
  AdminKycDecisionRequest,
  AdminKycDecisionResponse,
  AdminKycDocumentDecisionResponse,
  AdminKycDocumentBundle,
  AdminKycQueueItem,
  DownloadedKycDocumentContent,
  KycReviewFilters
} from "../kyc/types";

export function listKycReviews(
  filters: KycReviewFilters,
  accessToken: string
): Promise<AdminKycQueueItem[]> {
  return apiRequest<AdminKycQueueItem[]>(`/admin/kyc/reviews?${kycReviewQuery(filters)}`, {
    accessToken
  });
}

export function getKycReviewDocuments(
  profileId: string,
  accessToken: string
): Promise<AdminKycDocumentBundle> {
  return apiRequest<AdminKycDocumentBundle>(`/admin/kyc/${encodeURIComponent(profileId)}/documents`, {
    accessToken
  });
}

export function decideKycProfile(
  profileId: string,
  request: AdminKycDecisionRequest,
  accessToken: string
): Promise<AdminKycDecisionResponse> {
  return apiRequest<AdminKycDecisionResponse>(`/admin/kyc/${encodeURIComponent(profileId)}/decision`, {
    method: "POST",
    body: request,
    accessToken
  });
}

export function decideKycDocument(
  documentId: string,
  request: AdminKycDecisionRequest,
  accessToken: string
): Promise<AdminKycDocumentDecisionResponse> {
  return apiRequest<AdminKycDocumentDecisionResponse>(
    `/admin/kyc/documents/${encodeURIComponent(documentId)}/decision`,
    {
      method: "POST",
      body: request,
      accessToken
    }
  );
}

export async function downloadKycDocumentContent(
  documentId: string,
  accessToken: string
): Promise<DownloadedKycDocumentContent> {
  const response = await fetch(`${config.apiBaseUrl}/admin/kyc/documents/${encodeURIComponent(documentId)}/content`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "fr",
      Authorization: `Bearer ${accessToken}`,
      "X-Correlation-Id": crypto.randomUUID()
    }
  });

  if (!response.ok) {
    throw new AdminApiError({
      status: response.status,
      errorCode: response.status === 403 ? "ACCESS_DENIED" : "API_ERROR",
      message: response.status === 403 ? "Acces refuse pour ce compte." : "Document KYC indisponible."
    });
  }

  return {
    content: await response.arrayBuffer(),
    contentType: response.headers.get("Content-Type") ?? "application/octet-stream",
    contentDisposition: response.headers.get("Content-Disposition")
  };
}
