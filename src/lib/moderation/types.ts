export type ModerationQueueType = "RATING" | "TICKET";

export type ModerationTargetType = "RATING" | "SUPPORT_TICKET" | "USER" | "PROFILE" | "ANNOUNCEMENT";

export type ModerationAction = "HIDE" | "RESTORE" | "ESCALATE" | "CLOSE" | "SUSPEND";

export type SupportTicketCategory = "TRANSPORT" | "PAYMENT" | "ACCOUNT" | "SECURITY" | "EMERGENCY";

export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";

export type ModerationTab = "ratings" | "tickets";

export interface ModerationQueueItem {
  targetType: ModerationTargetType | string;
  targetId: string;
  priority: SupportTicketPriority | string;
  reason: string | null;
  preview: string | null;
  createdAt: string;
}

export interface ModerationQueuePage {
  items: ModerationQueueItem[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface ModerationActionRequest {
  targetType: ModerationTargetType | string;
  targetId: string;
  action: ModerationAction | string;
  reason?: string | null;
}

export interface ModerationActionResponse {
  id: string;
  targetType: string;
  targetId: string;
  action: string;
  reason: string | null;
  actedAt: string;
}

export interface SupportTicketSummary {
  id: string;
  ticketNumber: string;
  category: SupportTicketCategory | string;
  priority: SupportTicketPriority | string;
  status: SupportTicketStatus | string;
  subject: string;
  message: string;
  tripId: string | null;
  bookingId: string | null;
  paymentTransactionId: string | null;
  offlineOperationId: string | null;
  createdAt: string;
  closedAt: string | null;
}

export interface SupportTicketPage {
  tickets: SupportTicketSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface SupportTicketMessage {
  id: string;
  body: string;
  authorUserId: string | null;
  authorAdminProfileId: string | null;
  createdAt: string;
}

export interface SupportTicketDetail extends SupportTicketSummary {
  messages: SupportTicketMessage[];
}

export interface AdminSupportTicketUpdateRequest {
  status?: SupportTicketStatus | string | null;
  reply?: string | null;
}

export interface SupportTicketFilters {
  category?: SupportTicketCategory | "";
  priority?: SupportTicketPriority | "";
  status?: SupportTicketStatus | "";
  page?: number;
  size?: number;
}

export interface ModerationQueueFilters {
  type?: ModerationQueueType;
  page?: number;
  size?: number;
}
