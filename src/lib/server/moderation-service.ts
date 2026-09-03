import { apiRequest } from "./api-client";
import type {
  AdminSupportTicketUpdateRequest,
  ModerationActionRequest,
  ModerationActionResponse,
  ModerationQueueFilters,
  ModerationQueuePage,
  SupportTicketDetail,
  SupportTicketFilters,
  SupportTicketPage
} from "../moderation/types";

export function listModerationQueue(
  accessToken: string,
  params: ModerationQueueFilters = {}
): Promise<ModerationQueuePage> {
  return apiRequest<ModerationQueuePage>(`/admin/moderation/queue?${toQuery(params)}`, {
    accessToken
  });
}

export function applyModerationAction(
  accessToken: string,
  request: ModerationActionRequest
): Promise<ModerationActionResponse> {
  return apiRequest<ModerationActionResponse>("/admin/moderation/actions", {
    method: "POST",
    body: request,
    accessToken
  });
}

export function listSupportTickets(
  accessToken: string,
  params: SupportTicketFilters = {}
): Promise<SupportTicketPage> {
  return apiRequest<SupportTicketPage>(`/admin/support/tickets?${toQuery(params)}`, {
    accessToken
  });
}

export function getSupportTicket(ticketId: string, accessToken: string): Promise<SupportTicketDetail> {
  return apiRequest<SupportTicketDetail>(`/admin/support/tickets/${encodeURIComponent(ticketId)}`, {
    accessToken
  });
}

export function updateSupportTicket(
  ticketId: string,
  request: AdminSupportTicketUpdateRequest,
  accessToken: string
): Promise<SupportTicketDetail> {
  return apiRequest<SupportTicketDetail>(`/admin/support/tickets/${encodeURIComponent(ticketId)}`, {
    method: "PATCH",
    body: request,
    accessToken
  });
}

function toQuery(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    search.set(key, String(value));
  }
  return search.toString();
}
